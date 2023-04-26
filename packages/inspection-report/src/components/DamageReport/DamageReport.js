import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { pictureList } from '../../mock';
import { IconButton } from '../common';
import Gallery from '../Gallery';
import TabButton from './TabButton';
import TabGroup from './TabGroup';
import UpdateDamagePopUp from './UpdateDamagePopUp';
import TextButton from './UpdateDamagePopUp/TextButton';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
    minHeight: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  header: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 13,
    paddingBottom: 13,
    marginBottom: 16,
  },
  content: {
    flex: 1,
    display: 'flex',
    alignSelf: 'stretch',
    marginBottom: 16,
  },
  tabGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  text: {
    color: '#fafafa',
    fontSize: 18,
  },
  title: {
    fontSize: 20,
  },
  button: {
    marginLeft: 20,
    padding: 20,
  },
});

function DamageReport() {
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState(0);
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);

  const onTabHandler = useCallback((index) => setTabIndex(index), []);

  const onPopUpDismiss = useCallback(() => {
    console.log('Popup Dismiss...');
    setIsPopUpVisible(0);
  }, []);
  const onShowGallery = useCallback(() => {
    console.log('Show gallery...');
  }, []);

  return (
    <View style={[styles.container]}>
      <View style={[styles.header]}>
        <IconButton icon="keyboard-backspace" onPress={() => console.log('Back')} />
        <Text style={[styles.text, styles.title]}>{t('damageReport.title')}</Text>
        <IconButton icon="file-download" onPress={() => console.log('download')} />
      </View>

      <View style={[styles.content]}>
        <View style={[styles.tabGroup]}>
          <TabGroup>
            <TabButton
              icon="360"
              label={t('damageReport.tabs.overview_tab.label')}
              selected={tabIndex === 0}
              onPress={() => onTabHandler(0)}
            />
            <TabButton
              icon="photo-library"
              label={t('damageReport.tabs.photos_tab.label')}
              selected={tabIndex === 1}
              onPress={() => onTabHandler(1)}
            />
          </TabGroup>
        </View>
        <View>
          <Text style={[styles.text]}>
            {
              tabIndex === 0
                ? (
                  <View>
                    <Text style={[styles.text, { marginBottom: 20 }]}>[Overview]</Text>
                    <TextButton label="[Open Popup]" onPress={() => setIsPopUpVisible(true)} />
                  </View>
                )
                : <Gallery pictures={pictureList} />
            }
          </Text>
        </View>
      </View>
      {isPopUpVisible ? (
        <UpdateDamagePopUp
          part="wheel_front_right"
          damage={{}}
          damageMode="severity"
          imageCount={3}
          onDismiss={onPopUpDismiss}
          onShowGallery={onShowGallery}
        />
      ) : null}
    </View>
  );
}

export default DamageReport;
