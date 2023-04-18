import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { IconButton, TabButton, TabGroup } from './common';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
    height: '100vh',
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
  const [tabIndex, setTabIndex] = useState(0);

  const onTabHandler = useCallback((index) => setTabIndex(index), []);

  return (
    <View style={[styles.container]}>
      <View style={[styles.header]}>
        <IconButton icon="keyboard-backspace" onPress={() => console.log('Back')} />
        <Text style={[styles.text, styles.title]}>Damage Report</Text>
        <IconButton icon="file-download" onPress={() => console.log('download')} />
      </View>
      <View style={[styles.content]}>
        <View style={[styles.tabGroup]}>
          <TabGroup>
            <TabButton
              icon="360"
              label="Overview"
              selected={tabIndex === 0}
              onPress={() => onTabHandler(0)}
            />
            <TabButton
              icon="photo-library"
              label="Photos"
              selected={tabIndex === 1}
              onPress={() => onTabHandler(1)}
            />
          </TabGroup>
        </View>
        <View>
          <Text style={[styles.text]}>
            {tabIndex === 0 ? 'Overview' : 'Photos'}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default DamageReport;
