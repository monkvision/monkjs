import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { IconButton, TabButton, TabGroup } from './common';
import Gallery from './../Gallery';
import { pictureList } from './../..mock';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
    minHeight: '100vh',
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

  const onTabHandler = useCallback((index) => setTabIndex(index), []);

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
            {tabIndex === 0 ? 'Overview' : <Gallery pictures={pictureList} />}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default DamageReport;
