import { MonkApiConfig } from '@monkvision/network';
import {
  CurrencyCode,
  MonkEntityType,
  SeverityResultTargetType,
  VehiclePart,
  VehicleType,
} from '@monkvision/types';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InspectionGallery, Spinner } from '@monkvision/common-ui-web';
import { useLoadingState, useMonkState } from '@monkvision/common';
import { DamageManipulator } from './DamageManipulator';
import { styles } from './InspectionReport.styles';
import { useInspectionReport } from './useInspectionReport';
import { Vehicle360 } from '../Vehicle360';
import { useInspectionReportStyles } from './useInspectionReportStyle';
import { DamageInfo } from './DamageManipulator/hooks';

export interface InspectionReportProps {
  inspectionId: string;
  apiConfig: MonkApiConfig;
  currency?: CurrencyCode;
}

export function InspectionReport({
  inspectionId,
  apiConfig,
  currency = CurrencyCode.USD,
}: InspectionReportProps) {
  const [selectedPart, setSelectedPart] = useState<VehiclePart | undefined>();
  const loading = useLoadingState(true);
  const { t } = useTranslation();
  const { state } = useMonkState();
  const style = useInspectionReportStyles();
  const { images } = useInspectionReport({
    inspectionId,
    apiConfig,
    loading,
  });
  const [copyState, setCopyState] = useState(state);

  const isDamage = useMemo(() => {
    const damage = copyState.parts.find((part) => part.type === selectedPart);
    if (damage && damage.damages.length !== 0) {
      return true;
    }
    return false;
  }, [copyState, state, selectedPart]);

  const damageArray = useMemo(() => {
    const damage = copyState.parts.find((part) => part.type === selectedPart);
    if (damage) {
      return damage.damages.flatMap((dam) => {
        const partFoundInDamage = copyState.damages.find((d) => d.id === dam)?.type;
        return partFoundInDamage ? [partFoundInDamage] : [];
      });
    }
    return [];
  }, [state, selectedPart, copyState]);

  const mappingPartSeverity = useMemo(() => {
    return copyState.severityResults.map((s) => ({
      vehiclePart: s.label,
      price: s.value?.pricing ?? 0,
      replacement: s.value?.repairOperation?.replace ?? false,
    }));
  }, [state, copyState, selectedPart]);

  const handleOnConfirm = (editedDamage: DamageInfo) => {
    const newState = { ...copyState };
    const partState = newState.parts.find((part) => part.type === selectedPart);
    if (!editedDamage.isDamaged) {
      newState.damages = newState.damages.filter((d) => !partState?.damages.includes(d.id));
      if (partState) {
        partState.damages = [];
      }
      newState.severityResults = newState.severityResults.filter((s) => s.label !== selectedPart);
    }
    if (editedDamage.isDamaged && partState !== undefined) {
      newState.damages = newState.damages.filter(
        (d) => !(partState.damages.includes(d.id) && !editedDamage.damagesType.includes(d.type)),
      );
      editedDamage.damagesType.forEach((d) => {
        const damageAlreadyCreated = newState.damages.find((dam) => {
          return partState.damages.includes(dam.id) && dam.type === d;
        });
        const newDamageId = crypto.randomUUID();
        if (!damageAlreadyCreated) {
          partState.damages.push(newDamageId);
          newState.damages.push({
            id: newDamageId,
            inspectionId,
            entityType: MonkEntityType.DAMAGE,
            type: d,
            parts: selectedPart ? [selectedPart] : [],
            relatedImages: [],
          });
        }
      });
      const severiyAlreadyCreated = newState.severityResults.find((s) => s.label === selectedPart);
      if (severiyAlreadyCreated) {
        newState.severityResults = newState.severityResults.filter((s) => s.label !== selectedPart);
      }
      newState.severityResults.push({
        id: crypto.randomUUID(),
        entityType: MonkEntityType.SEVERITY_RESULT,
        inspectionId,
        value: {
          pricing: editedDamage.pricing,
          repairOperation: { replace: editedDamage.needsReplacement },
        },
        isUserModified: true,
        relatedItemId: partState.id,
        relatedItemType: SeverityResultTargetType.PART,
        label: selectedPart,
      });
    }
    setCopyState(newState);
    setSelectedPart(undefined);
  };

  useEffect(() => setCopyState(state), [state]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {loading.isLoading && <Spinner size={80} />}
      {loading.error && <div>{loading.error}</div>}
      {!loading.isLoading && !loading.error && (
        <div style={styles['container']}>
          <div style={style.vehicle360Style}>
            {!selectedPart && <div style={styles['title']}>{t('damage.report')}</div>}
            <Vehicle360
              partSelected={selectedPart}
              priceByPart={mappingPartSeverity}
              vehicleType={VehicleType.SEDAN}
              enableMultiplePartSelection={false}
              onPartsSelected={(selectedParts: VehiclePart[]) => {
                setSelectedPart(selectedParts.at(0));
              }}
            />
            <DamageManipulator
              show={!!selectedPart}
              partName={selectedPart}
              currency={currency}
              damage={{
                isDamaged: isDamage,
                needsReplacement:
                  mappingPartSeverity.find((p) => p.vehiclePart === selectedPart)?.replacement ??
                  false,
                damagesType: damageArray,
                pricing:
                  mappingPartSeverity.find((p) => p.vehiclePart === selectedPart)?.price ?? 0,
              }}
              onConfirm={handleOnConfirm}
            />
          </div>
          <div style={style.galleryStyle}>
            <InspectionGallery
              inspectionId={inspectionId}
              apiConfig={apiConfig}
              captureMode={false}
              enableAddDamage={false}
              showBackButton={true}
              reportMode={true}
              filterByPart={selectedPart}
            />
          </div>
        </div>
      )}
    </div>
  );
}
