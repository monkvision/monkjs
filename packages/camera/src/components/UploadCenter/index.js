import React, { useCallback, useMemo } from 'react';
import { ScrollView, Text, View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import { utils } from '@monkvision/toolkit';

import UploadCard from './UploadCard';
import Actions from '../../actions';

const { spacing } = utils.styles;

const ROW_HEIGHT = 150;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    zIndex: 0,
  },
  title: {
    marginLeft: spacing(3),
    marginBottom: spacing(0.3),
    marginTop: spacing(2),
    fontWeight: '500',
    fontSize: 20,
  },
  subtitle: {
    marginLeft: spacing(3),
    marginBottom: spacing(2),
    marginTop: spacing(0.6),
    color: 'gray',
    fontWeight: '500',
    fontSize: 12,
  },
  content: {
    marginHorizontal: spacing(2),
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  button: {
    width: '100%',
    borderRadius: 4,
    padding: spacing(1.4),
    marginVertical: spacing(3),
  },
  labelStyle: {
    color: '#FFF',
    fontSize: 15,
    textAlign: 'center',
  },
});

const getComplianceById = (id, list) => list.find((item) => item.sightId === id);

export default function UploadCenter({ uploads, sights, compliance, onSubmit }) {
  /**
   * @type {{
    * compliancesList:[{
      * status: string,
      * error,
      * requestCount:
      * number,
      * result: {
        * binary_size: number,
        * compliances: {
          * iqa_compliance: {
          * is_compliant: boolean,
          * parameters: {}
          * reasons: [string],
          * status: string,
          * },
        * },
      * id: string,
      * image_height: number,
      * image_width: number,
      * name: string,
      * path: string,
    * }}],
    * },
    * hasPending: boolean,
    * uploadsList: [{picture, status: string, error: null, uploadCount: number}]
  * }
  */
  const states = useMemo(() => {
    const compliancesList = Object.values(compliance.state).filter((upload) => upload.status === 'fulfilled');
    const uploadsList = Object.values(uploads.state).filter((upload) => {
      const iqaCompliance = compliancesList.find(({ sightId }) => sightId === upload.id);
      if (!iqaCompliance) { return true; }

      const isPending = upload.status === 'pending' || ['pending', 'idle'].includes(iqaCompliance.status);

      if (isPending) { return true; }

      const isCompliant = iqaCompliance.result.data.compliances.iqa_compliance.is_compliant;
      const hasAlreadyRetook = upload.uploadCount > 1;

      return !(isCompliant || hasAlreadyRetook);
    });

    const hasPending = uploadsList.some((upload) => upload.status === 'pending');
    return { uploadsList, compliancesList, hasPending };
  }, [compliance.state, uploads.state]);

  const { uploadsList, compliancesList, hasPending } = states;

  const handleRetake = useCallback((id, complianceId) => {
    // reset the current compliance
    compliance.dispatch({ type: Actions.compliance.UPDATE_COMPLIANCE, payload: { id: complianceId, status: 'idle', error: null, result: null } });
    // empty the old picture
    uploads.dispatch({ type: Actions.uploads.UPDATE_UPLOAD, payload: { id, status: 'idle', picture: null } });
    // remove the picture from the sight and focus on the current sight
    sights.dispatch({ type: Actions.sights.REMOVE_PICTURE, payload: { id } });
    sights.dispatch({ type: Actions.sights.SET_CURRENT_SIGHT, payload: { id } });
  }, [compliance, sights, uploads]);

  console.log(sights);

  return (
    <SafeAreaView style={{ position: 'relative' }}>
      <View style={styles.card}>
        <Text style={styles.title}>
          All uploads
        </Text>
        <Text style={[styles.subtitle, { marginBottom: 0 }]}>
          Use high image quality, for an accurate result.
        </Text>
        <Text style={styles.subtitle}>
          NOTE: Image compliance will help you take the best image quality.
        </Text>
        <View style={styles.content}>
          <ScrollView style={{ height: 'auto' }} contentContainerStyle={{ height: uploadsList.length * ROW_HEIGHT }}>
            {uploadsList.map((upload) => (
              <UploadCard
                key={upload.id}
                upload={upload}
                onRetake={handleRetake}
                iqaCompliance={getComplianceById(upload.id, compliancesList)
                  ?.result?.data?.compliances?.iqa_compliance}
                iqaComplianceId={getComplianceById(upload.id, compliancesList)?.id}
                sightLabel={sights.state.tour[upload.id].label}
              />
            ))}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: hasPending ? '#a9a9a9' : '#274b9f' }]}
              onPress={onSubmit}
              disabled={hasPending}
            >
              <Text style={styles.labelStyle}>START INSPECTION</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

UploadCenter.propTypes = {
  compliance: PropTypes.objectOf(PropTypes.any),
  onSubmit: PropTypes.func,
  sights: PropTypes.objectOf(PropTypes.any),
  uploads: PropTypes.objectOf(PropTypes.any),
};

UploadCenter.defaultProps = {
  compliance: {},
  onSubmit: () => {},
  sights: {},
  uploads: {},
};
