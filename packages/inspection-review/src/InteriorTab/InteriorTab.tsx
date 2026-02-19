import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@monkvision/common-ui-web';
import { InteriorViews } from '../types';
import { AddInteriorDamage } from './AddInteriorDamage/AddInteriorDamage';
import { useInteriorTab } from './hooks/useInteriorTab';
import { useInteriorTabStyles } from './useInteriorTabStyles';
import { useInspectionReviewState } from '../hooks/InspectionReviewProvider';

/**
 * The InteriorTab component that displays content based on the currently active tab.
 */
export function InteriorTab() {
  const { t } = useTranslation();
  const { currency } = useInspectionReviewState();
  const {
    interiorDamages,
    currentView,
    selectedDamage,
    setCurrentView,
    handleSave,
    editDamage,
    handleDeleteInteriorDamage,
    resetToListView,
  } = useInteriorTab();
  const {
    containerStyle,
    tableStyle,
    thContentStyle,
    tbodyStyle,
    trStyle,
    tdStyle,
    tdContentStyle,
    tdCurrencyLeftStyle,
    actionIconsContainerStyle,
    editIconStyle,
    deleteIconStyle,
    addDamageContainerStyle,
  } = useInteriorTabStyles();
  const isLeftCurrency = currency === '$';

  if (currentView === InteriorViews.AddDamage) {
    return (
      <AddInteriorDamage
        damageData={selectedDamage}
        onCancel={resetToListView}
        onSave={handleSave}
      />
    );
  }

  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th>
              <div style={thContentStyle}>{t('tabs.interior.area')}</div>
            </th>
            <th>
              <div style={thContentStyle}>{t('tabs.interior.damageTypes')}</div>
            </th>
            <th>
              <div style={thContentStyle}>
                <div>{t('tabs.interior.deduction')}</div>
              </div>
            </th>
            <th>
              <div style={thContentStyle} />
            </th>
          </tr>
        </thead>
        <tbody style={tbodyStyle}>
          {interiorDamages.map((damage, index) => (
            <tr key={index} style={trStyle}>
              <td style={tdStyle}>{damage.area}</td>
              <td style={tdStyle}>{damage.damage_type}</td>
              <td style={tdStyle}>
                <div
                  style={{
                    ...tdContentStyle,
                    ...(isLeftCurrency ? tdCurrencyLeftStyle : {}),
                  }}
                >
                  <div>{damage.repair_cost}</div>
                  <div>{currency}</div>
                </div>
              </td>
              <td style={tdStyle}>
                <div style={actionIconsContainerStyle}>
                  <Icon
                    icon='edit'
                    primaryColor={editIconStyle.color}
                    style={editIconStyle}
                    onClick={() => editDamage(index, damage)}
                  />
                  <Icon
                    icon='delete'
                    primaryColor={deleteIconStyle.color}
                    style={deleteIconStyle}
                    onClick={() => handleDeleteInteriorDamage(index)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={addDamageContainerStyle}>
        <Button variant='outline' onClick={() => setCurrentView(InteriorViews.AddDamage)}>
          {t('tabs.interior.addDamageButton')}
        </Button>
      </div>
    </div>
  );
}
