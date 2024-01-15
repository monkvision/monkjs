import { Button } from '@monkvision/common-ui-web';
import { Severity } from '@monkvision/types';
import { styles } from './SeveritySelection.styles';
import { Title } from '../components';
import { useTranslation } from 'react-i18next';
import { Damage, DamageMode, DisplayMode, severitiesWithIcons } from '../hook';

interface SeverityButtonProps {
  hasDamage?: boolean;
  editedDamageSeverity: Severity | undefined;
  severity: Severity;
  children: string;
  onSeverityChange: (severity: Severity) => void;
}

function SeverityButton({
  hasDamage,
  editedDamageSeverity,
  severity,
  children,
  onSeverityChange,
}: SeverityButtonProps) {
  const borderColor = editedDamageSeverity === severity ? '#ffffff' : '#5D5E67';
  return (
    <Button
      style={{ ...styles['severityButton'], borderColor }}
      variant='outline'
      primaryColor='text-white'
      disabled={!hasDamage}
      onClick={() => onSeverityChange(severity)}
    >
      {children}
    </Button>
  );
}

interface SeveritySelectionProps {
  damage?: Damage;
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
  if (displayMode === DisplayMode.MINIMAL ?? damageMode === DamageMode.PRICING) {
    return null;
  }
  const { t } = useTranslation();
  console.log(damage);
  return (
    <div
      style={{
        ...styles['content'],
        ...styles['columnContent'],
        ...(!hasDamage && styles['disable']),
      }}
    >
      <Title>{t('damageManipulator.severity')}</Title>
      <div style={styles['severityContent']}>
        {severitiesWithIcons.map((severity) => (
          <SeverityButton
            hasDamage={hasDamage}
            editedDamageSeverity={damage?.severity}
            severity={severity.key}
            onSeverityChange={onSeverityChange}
          >
            {severity.buttonName}
          </SeverityButton>
        ))}
      </div>
    </div>
  );
}
