import { Button, DynamicSVG } from '@monkvision/common-ui-web';
import { Severity } from '@monkvision/types';
import { useTranslation } from 'react-i18next';
import { useMonkTheme } from '@monkvision/common';
import { styles } from './SeveritySelection.styles';
import { Content, severitiesWithIcon, SeverityWithIcon, Title } from '../common';
import { DamageInfo, DamageMode, DisplayMode } from '../hooks';

interface SeverityButtonProps {
  hasDamage?: boolean;
  editedDamageSeverity?: Severity | undefined;
  severity: SeverityWithIcon;
  onSeverityChange: (severity: Severity) => void;
}

function SeverityButton({
  hasDamage,
  editedDamageSeverity,
  severity,
  onSeverityChange,
}: SeverityButtonProps) {
  const { t } = useTranslation();
  const { palette } = useMonkTheme();

  const borderColor =
    editedDamageSeverity === severity.key ? palette.border.base : palette.grey.dark;
  const svg = () =>
    editedDamageSeverity === severity.key || (severity.key === Severity.LOW && !hasDamage) ? (
      <DynamicSVG style={{ width: '20px', paddingRight: '8px' }} svg={severity.icon} />
    ) : null;

  return (
    <Button
      style={{ ...styles['severityButton'], borderColor }}
      variant='outline'
      primaryColor='text-white'
      disabled={!hasDamage}
      onClick={() => onSeverityChange(severity.key)}
    >
      {svg()}
      {t(severity.buttonName)}
    </Button>
  );
}

interface SeveritySelectionProps {
  damage?: DamageInfo;
  hasDamage?: boolean;
  displayMode?: DisplayMode;
  damageMode?: DamageMode;
  onSeverityChange: (key: Severity) => void;
}

export function SeveritySelection({
  damage,
  hasDamage = true,
  damageMode = DamageMode.ALL,
  displayMode = DisplayMode.MINIMAL,
  onSeverityChange,
}: SeveritySelectionProps) {
  if ((displayMode === DisplayMode.MINIMAL && !hasDamage) || damageMode === DamageMode.PRICING) {
    return null;
  }
  const { t } = useTranslation();

  return (
    <Content
      style={{
        ...styles['columnContent'],
        ...(!hasDamage && styles['disable']),
      }}
    >
      <Title>{t('damageManipulator.severitySelection.severity')}</Title>
      <div style={styles['severityContent']}>
        {severitiesWithIcon.map((severity) => (
          <SeverityButton
            key={severity.key}
            hasDamage={hasDamage}
            editedDamageSeverity={damage?.severity}
            severity={severity}
            onSeverityChange={onSeverityChange}
          />
        ))}
      </div>
    </Content>
  );
}
