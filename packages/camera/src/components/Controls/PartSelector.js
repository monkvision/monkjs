import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

const SECTIONS = [
  { key: 'bumpers', elements: ['bumper_back', 'bumper_front'] },
  { key: 'doors', elements: ['door_back_right', 'door_back_left', 'door_front_left', 'door_front_right'] },
  { key: 'mirrors', elements: ['mirror_left', 'mirror_right'] },
  { key: 'grills', elements: ['grill_radiator', 'grill_low'] },
  {
    key: 'fogLights',
    elements: ['fog_light_back_left', 'fog_light_back_right', 'fog_light_front_left', 'fog_light_front_right'],
  },
  { key: 'headLights', elements: ['head_light_left', 'head_light_right'] },
  { key: 'handles', elements: ['handle_back_left', 'handle_back_right', 'handle_front_left', 'handle_front_right'] },
  { key: 'spoilers', elements: ['front_spoiler', 'rear_spoiler'] },
  { key: 'fenders', elements: ['fender_back_left', 'fender_back_right', 'fender_front_left', 'fender_front_right'] },
  { key: 'rockerPanels', elements: ['rocker_panel_right', 'rocker_panel_left'] },
  { key: 'wheels', elements: ['wheel_back_left', 'wheel_back_right', 'wheel_front_left', 'wheel_front_right'] },
  { key: 'windshields', elements: ['windshield_back', 'windshield_front'] },
  {
    key: 'quarterWindows',
    elements: ['quarter_window_back_left', 'quarter_window_back_right', 'quarter_window_front_left', 'quarter_window_front_right'],
  },
  {
    key: 'windows',
    elements: [
      'window_back_left',
      'window_back_right',
      'window_corner_left',
      'window_corner_right',
      'window_front_left',
      'window_front_right',
    ],
  },
  {
    key: 'others',
    elements: [
      'hood',
      'petrol_door',
      'pillar',
      'roof',
      'trunk',
    ],
  },
];

const WIDTH = 350;
const HEIGHT = 250;

const styles = StyleSheet.create({
  expand: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  backdrop: {
    backgroundColor: '#000000',
    opacity: 0.5,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#15172d',
    borderRadius: 10,
    height: HEIGHT,
    width: WIDTH,
  },
  notification: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'fit-content',
    position: 'absolute',
    backgroundColor: '#15172d',
    borderRadius: 10,
    padding: 15,
    bottom: 20,
    left: 20,
    boxShadow: '0px 0px 20px 0px #0000009c',
  },
  text: {
    color: '#dddddd',
  },
  title: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
  },
  topBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: WIDTH,
    paddingHorizontal: 20,
  },
  topBarButton: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    border: 0,
    padding: 10,
    color: '#00ff00',
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    padding: 15,
    width: WIDTH,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#383a5b',
  },
  section: {
    justifyContent: 'space-between',
  },
  element: {
    justifyContent: 'start',
  },
});

export default function PartSelector({ onClose, onSelectPart }) {
  const [selectedSection, setSelectedSection] = useState(null);
  const [numberOfItems, setNumberOfItems] = useState(SECTIONS.length);
  const [showNotification, setShowNotification] = useState(true);
  const { t } = useTranslation();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { top, left } = useMemo(() => ({
    top: (windowHeight - HEIGHT) / 2,
    left: (windowWidth - WIDTH) / 2,
  }), [windowWidth, windowHeight]);
  const notificationDurationMs = 3000;

  useEffect(() => {
    setTimeout(() => setShowNotification(false), notificationDurationMs);
  }, []);

  const listData = useMemo(() => {
    if (!selectedSection) {
      return SECTIONS;
    }
    return SECTIONS.find((section) => section.key === selectedSection)?.elements ?? [];
  }, [selectedSection]);

  const selectSection = useCallback((key) => {
    setSelectedSection(key);
    setNumberOfItems(key
      ? SECTIONS.find((section) => section.key === key)?.elements?.length ?? []
      : SECTIONS.length);
  }, [setSelectedSection]);

  const renderSectionItem = useCallback(({ item, index }) => (
    <TouchableOpacity
      style={[styles.section, styles.item, index !== numberOfItems - 1 ? styles.itemBorder : {}]}
      onPress={() => selectSection(item.key)}
    >
      <Text style={[styles.text]}>
        {t(`partSelector.sections.${item.key}.name`)}
      </Text>
      <Text style={[styles.text]}>▶</Text>
    </TouchableOpacity>
  ), [selectSection, numberOfItems]);

  const renderElementItem = useCallback(({ item, index }) => (
    <TouchableOpacity
      style={[styles.element, styles.item, index !== numberOfItems - 1 ? styles.itemBorder : {}]}
      onPress={() => onSelectPart(item)}
    >
      <Text style={[styles.text]}>
        {t(`partSelector.sections.${selectedSection}.elements.${item}`)}
      </Text>
    </TouchableOpacity>
  ), [selectedSection, numberOfItems]);

  return (
    <View style={[styles.expand]}>
      <View style={[styles.expand, styles.backdrop]} />
      <View style={[styles.container, { top, left }]}>
        <View style={[styles.topBar, { justifyContent: selectedSection ? 'space-between' : 'end' }]}>
          <TouchableOpacity
            style={[styles.topBarButton, { opacity: selectedSection ? 1 : 0 }]}
            disabled={!selectedSection}
            onPress={() => selectSection(null)}
          >
            <Text style={[styles.text, styles.title]}>◀</Text>
          </TouchableOpacity>
          <Text style={[styles.text, styles.title]}>
            {selectedSection ? t(`partSelector.sections.${selectedSection}.name`) : t('partSelector.title')}
          </Text>
          <TouchableOpacity style={[styles.topBarButton]} onPress={onClose}>
            <Text style={[styles.text, styles.title]}>✖</Text>
          </TouchableOpacity>
        </View>
        <View style={[{ flex: 1, paddingBottom: 10 }]}>
          <FlatList
            data={listData}
            renderItem={selectedSection ? renderElementItem : renderSectionItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => (selectedSection ? item : item.key)}
          />
        </View>
      </View>
      {showNotification ? (
        <View style={[styles.notification]}>
          <Text style={[styles.text, { paddingRight: 10 }]}>
            {t('partSelector.notification')}
          </Text>
          <TouchableOpacity
            style={[styles.topBarButton]}
            onPress={() => setShowNotification(false)}
          >
            <Text style={[styles.text, styles.title]}>✖</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

PartSelector.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSelectPart: PropTypes.func.isRequired,
};
