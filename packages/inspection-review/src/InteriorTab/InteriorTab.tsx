import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@monkvision/common-ui-web';
import { InteriorViews } from '../types';
import { AddInteriorDamage } from './AddInteriorDamage/AddInteriorDamage';
import { useInteriorTab } from './hooks/useInteriorTab';
import { styles, useInteriorTabStyles } from './InteriorTab.styles';
import { useInspectionReviewProvider } from '../hooks/useInspectionReviewProvider';

/**
 * The InteriorTab component that displays content based on the currently active tab.
 */
export function InteriorTab() {
  const { t } = useTranslation();
  const { currency, isLeftSideCurrency } = useInspectionReviewProvider();
  const {
    interiorDamages,
    currentView,
    selectedDamage,
    setCurrentView,
    onSave,
    onEditDamage,
    onDeleteInteriorDamage,
    onCancelDamage,
  } = useInteriorTab();
  const { editIconStyle, deleteIconStyle, addDamageStyle } = useInteriorTabStyles();

  if (currentView === InteriorViews.AddDamage) {
    return (
      <AddInteriorDamage
        selectedDamage={selectedDamage}
        onCancelDamage={onCancelDamage}
        onSave={onSave}
      />
    );
  }

  return (
    <div style={styles['container']}>
      <table style={styles['table']}>
        <thead>
          <tr>
            <th>
              <div style={styles['thContent']}>{t('tabs.interior.area')}</div>
            </th>
            <th>
              <div style={styles['thContent']}>{t('tabs.interior.damageTypes')}</div>
            </th>
            <th>
              <div style={styles['thContent']}>
                <div>{t('tabs.interior.deduction')}</div>
              </div>
            </th>
            <th>
              <div style={styles['thContent']} />
            </th>
          </tr>
        </thead>
        <tbody style={styles['tbody']}>
          {interiorDamages.map((damage, index) => (
            <tr key={index} style={styles['tr']}>
              <td style={styles['td']}>{damage.area}</td>
              <td style={styles['td']}>{damage.damage_type}</td>
              <td style={styles['td']}>
                <div
                  style={{
                    ...styles['tdContent'],
                    ...(isLeftSideCurrency ? styles['tdCurrencyLeft'] : {}),
                  }}
                >
                  <div>{damage.repair_cost}</div>
                  <div>{currency}</div>
                </div>
              </td>
              <td style={styles['td']}>
                <div style={styles['actionIcons']}>
                  <Icon
                    icon='edit'
                    primaryColor={editIconStyle.color}
                    style={editIconStyle}
                    onClick={() => onEditDamage(index, damage)}
                  />
                  <Icon
                    icon='delete'
                    primaryColor={deleteIconStyle.color}
                    style={deleteIconStyle}
                    onClick={() => onDeleteInteriorDamage(index)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={styles['addDamageContainer']}>
        <Button
          variant='outline'
          primaryColor={addDamageStyle.color}
          secondaryColor={addDamageStyle.backgroundColor}
          onClick={() => setCurrentView(InteriorViews.AddDamage)}
        >
          {t('tabs.interior.addDamageButton')}
        </Button>
      </div>
    </div>
  );
}
