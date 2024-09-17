import { MonkApiConfig } from '@monkvision/network';
import {
  CurrencyCode,
  MonkEntityType,
  SeverityResultTargetType,
  VehiclePart,
  VehicleType,
} from '@monkvision/types';
import { useEffect, useMemo, useState } from 'react';
import { DynamicSVG, InspectionGallery, Spinner } from '@monkvision/common-ui-web';
import { useLoadingState, useMonkState } from '@monkvision/common';
import { DamageManipulator } from './DamageManipulator';
import { styles } from './InspectionReport.styles';
import { useInspectionReport } from './useInspectionReport';
import { Vehicle360 } from '../Vehicle360';
import { useInspectionReportStyles } from './useInspectionReportStyle';
import { DamageInfo } from './DamageManipulator/hooks';
import { InteriorDamageTable } from '../InteriorDamageTable';
import { TabMode, TabsComponent } from './Tabs';

const teslaLogo =
  '<svg width="300px" height="74x" viewBox="0 -21.2 278.7 78.7" id="Layer_1" xmlns="http://www.w3.org/2000/svg"> <style>.st0{fill:#5e5e5e}</style> <g id="TESLA"> <path class="st0" d="M238.1 14.4v21.9h7V21.7h25.6v14.6h7V14.4h-39.6M244.3 7.3h27c3.8-.7 6.5-4.1 7.3-7.3H237c.8 3.2 3.6 6.5 7.3 7.3M216.8 36.3c3.5-1.5 5.4-4.1 6.2-7.1h-31.5V.1h-7.1v36.2h32.4M131.9 7.2h25c3.8-1.1 6.9-4 7.7-7.1H125v21.4h32.4V29H132c-4 1.1-7.4 3.8-9.1 7.3h41.5V14.4H132l-.1-7.2M70.3 7.3h27c3.8-.7 6.6-4.1 7.3-7.3H62.9c.8 3.2 3.6 6.5 7.4 7.3M70.3 21.6h27c3.8-.7 6.6-4.1 7.3-7.3H62.9c.8 3.2 3.6 6.5 7.4 7.3M70.3 36.3h27c3.8-.7 6.6-4.1 7.3-7.3H62.9c.8 3.2 3.6 6.6 7.4 7.3"/> <g> <path class="st0" d="M0 .1c.8 3.2 3.6 6.4 7.3 7.2h11.4l.6.2v28.7h7.1V7.5l.6-.2h11.4c3.8-1 6.5-4 7.3-7.2V0L0 .1"/> </g> </g> </svg>';

export interface InspectionReportProps {
  inspectionId: string;
  apiConfig: MonkApiConfig;
  currency?: CurrencyCode;
}

interface AdditionalDataTesla {
  additionalData: {
    country: 'USA';
    other_damages: [
      {
        area: 'seats';
        damage_type: 'scratch';
        repair_cost: 544;
      },
    ];
  };
}

interface InteriorDamage {
  area: string;
  damage_type: string;
  repair_cost: number | null;
}

export function InspectionReport({
  inspectionId,
  apiConfig,
  currency = CurrencyCode.USD,
}: InspectionReportProps) {
  const [selectedPart, setSelectedPart] = useState<VehiclePart | undefined>();
  const loading = useLoadingState(true);
  const { state } = useMonkState();
  const style = useInspectionReportStyles();
  useInspectionReport({
    inspectionId,
    apiConfig,
    loading,
  });
  const [copyState, setCopyState] = useState(state);
  const [showInterior, setShowInterior] = useState(false);
  const [interiorDamage, setInteriorDamage] = useState<InteriorDamage[]>([]);
  const [selectedInteriorDamageIndex, setSelectedInteriorDamageIndex] = useState<number | null>();

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

  const handleCancel = () => setSelectedPart(undefined);

  const handleEditDamage = (index: number) => {
    setSelectedInteriorDamageIndex(index);
    setSelectedPart(VehiclePart.IGNORE);
  };

  const handleDeleteDamage = (index: number) => {
    const newInteriorDamage = [...interiorDamage];
    newInteriorDamage.splice(index, 1);
    setInteriorDamage(newInteriorDamage);
    setSelectedInteriorDamageIndex(null);
    setSelectedPart(undefined);
  };

  const handleOnConfirm = (editedDamage: DamageInfo) => {
    const newState = { ...copyState };
    if (showInterior && editedDamage.interiorDamage) {
      let newInteriorDamage = interiorDamage;
      if (typeof selectedInteriorDamageIndex === 'number') {
        newInteriorDamage[selectedInteriorDamageIndex] = editedDamage.interiorDamage;
      } else {
        newInteriorDamage = [
          ...interiorDamage,
          {
            area: editedDamage.interiorDamage.area,
            damage_type: editedDamage.interiorDamage.damage_type,
            repair_cost: editedDamage.interiorDamage.repair_cost,
          },
        ];
      }
      console.log(newInteriorDamage);
      setInteriorDamage(newInteriorDamage);
      setSelectedPart(undefined);
      setSelectedInteriorDamageIndex(null);
      return;
    }
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
      // TODO: remove below
      console.log(copyState.damages, newState.damages);
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
      // TODO: remove below
      console.log(severiyAlreadyCreated);
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
        backgroundColor: 'white',
      }}
    >
      {loading.isLoading && <Spinner primaryColor='gray' size={80} />}
      {loading.error && <div>{loading.error}</div>}
      {!loading.isLoading && !loading.error && (
        <div style={styles['container']}>
          <div style={style.vehicle360Style}>
            <div style={styles['header']}>
              {/* <div style={styles['title']}>{t('damage.report')}</div> */}
              <div style={styles['title']}>
                <DynamicSVG svg={teslaLogo} />
              </div>
              <TabsComponent
                mode={showInterior ? TabMode.INTERIOR : TabMode.EXTERIOR}
                onClick={(mode) => setShowInterior(mode === TabMode.INTERIOR)}
              />
              {/* <div style={styles['switchButton']}> */}
              {/*   <SwitchButton */}
              {/*     checked={showInterior} */}
              {/*     onSwitch={() => setShowInterior(!showInterior)} */}
              {/*   /> */}
              {/*   <div>Show Interior</div> */}
              {/* </div> */}
            </div>
            {!showInterior && !selectedPart && (
              <Vehicle360
                partSelected={selectedPart}
                priceByPart={mappingPartSeverity}
                vehicleType={VehicleType.SEDAN}
                enableMultiplePartSelection={false}
                onPartsSelected={(selectedParts: VehiclePart[]) => {
                  setSelectedPart(selectedParts.at(0));
                }}
              />
            )}
            {showInterior && !selectedPart && (
              <InteriorDamageTable
                damages={interiorDamage}
                onAddDamage={() => setSelectedPart(VehiclePart.IGNORE)}
                onEdit={handleEditDamage}
                onDelete={handleDeleteDamage}
              />
            )}
            <DamageManipulator
              show={!!selectedPart}
              partName={selectedPart}
              currency={currency}
              isInterior={showInterior}
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
              onCancel={handleCancel}
              interiorDamage={interiorDamage[selectedInteriorDamageIndex ?? -1]}
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
              filterInterior={showInterior}
            />
          </div>
        </div>
      )}
    </div>
  );
}
