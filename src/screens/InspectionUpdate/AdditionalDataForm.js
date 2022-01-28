import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Button, Card, TextInput, useTheme } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { Formik } from 'formik';

import { updateOneInspectionAdditionalData } from '@monkvision/corejs';

import { spacing } from 'config/theme';
import useRequest from 'hooks/useRequest';

import noop from 'lodash.noop';

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing(2),
    marginTop: spacing(2),
  },
  textInput: {
    width: '100%',
    marginBottom: spacing(2),
  },
});

const additionalInfoInitialValues = {
  agent_first_name: '',
  agent_last_name: '',
  agent_company: '',
  agent_company_city: '',
  vehicle_owner_first_name: '',
  vehicle_owner_last_name: '',
  vehicle_owner_address: '',
  vehicle_owner_phone: '',
  vehicle_owner_email: '',
  date_of_start: '',
  date_of_validation: '',
  comment: '',
};

export default function AdditionalDataForm({ inspection, refresh, inspectionId }) {
  const { colors } = useTheme();

  const { isLoading: isSubmittingAdditionalData,
    request: submitAdditionalData } = useRequest(null, {}, false);

  const additionalData = inspection?.additionalData?.pdf_data;

  const handleSubmitAdditionalData = useCallback(
    (data) => submitAdditionalData(updateOneInspectionAdditionalData({
      inspectionId, data }),
    { onSuccess: refresh }),
    [inspectionId, refresh, submitAdditionalData],
  );

  return (

    <Card style={[styles.card, { marginBottom: spacing(2) }]}>
      <Formik
        enableReinitialize
        initialValues={additionalData || additionalInfoInitialValues}
        onSubmit={(values) => handleSubmitAdditionalData(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, dirty }) => (
          <View style={styles.form}>
            <Card.Title
              title="Additional info"
              left={(props) => <Avatar.Icon {...props} icon="card-account-details" />}
            />
            <Card.Content>

              <TextInput
                mode="outlined"
                label="ID"
                multiline
                value={inspectionId}
                style={styles.textInput}
                editable={false}
              />

              <TextInput
                mode="outlined"
                label="Agent first name"
                onChangeText={handleChange('agent_first_name')}
                onBlur={handleBlur('agent_first_name')}
                value={values.agent_first_name}
                style={styles.textInput}
              />

              <TextInput
                mode="outlined"
                label="Agent last name"
                onChangeText={handleChange('agent_last_name')}
                onBlur={handleBlur('agent_last_name')}
                value={values.agent_last_name}
                style={styles.textInput}
              />

              <TextInput
                mode="outlined"
                label="Agent company"
                onChangeText={handleChange('agent_company')}
                onBlur={handleBlur('agent_company')}
                value={values.agent_company}
                style={styles.textInput}
              />

              <TextInput
                mode="outlined"
                label="Agent city"
                onChangeText={handleChange('agent_company_city')}
                onBlur={handleBlur('agent_company_city')}
                value={values.agent_company_city}
                style={styles.textInput}
              />

              <TextInput
                mode="outlined"
                label="Vehicle owner first name"
                onChangeText={handleChange('vehicle_owner_first_name')}
                onBlur={handleBlur('vehicle_owner_first_name')}
                value={values.vehicle_owner_first_name}
                style={styles.textInput}
              />

              <TextInput
                mode="outlined"
                label="Vehicle owner last name"
                onChangeText={handleChange('vehicle_owner_last_name')}
                onBlur={handleBlur('vehicle_owner_last_name')}
                value={values.vehicle_owner_last_name}
                style={styles.textInput}
              />

              <TextInput
                mode="outlined"
                label="Vehicle owner address"
                onChangeText={handleChange('vehicle_owner_address')}
                onBlur={handleBlur('vehicle_owner_address')}
                value={values.vehicle_owner_address}
                style={styles.textInput}
              />

              <TextInput
                mode="outlined"
                label="Vehicle owner phone"
                onChangeText={handleChange('vehicle_owner_phone')}
                onBlur={handleBlur('vehicle_owner_phone')}
                value={values.vehicle_owner_phone}
                style={styles.textInput}
                render={(props) => (
                  <TextInputMask
                    type="cel-phone"
                    options={{
                      maskType: 'INTERNATIONAL',
                      withDDD: true,
                      dddMask: '(33) ',
                    }}
                    {...props}
                  />
                )}
              />

              <TextInput
                mode="outlined"
                type="email"
                label="Vehicle owner email"
                onChangeText={handleChange('vehicle_owner_email')}
                onBlur={handleBlur('vehicle_owner_email')}
                value={values.vehicle_owner_email}
                style={styles.textInput}
              />

              <TextInput
                mode="outlined"
                label="License date of start"
                onChangeText={handleChange('date_of_start')}
                onBlur={handleBlur('date_of_start')}
                value={values.date_of_start}
                style={styles.textInput}
                render={(props) => (
                  <TextInputMask
                    type="datetime"
                    options={{ format: 'YYYY/MM/DD' }}
                    {...props}
                  />
                )}
              />

              <TextInput
                mode="outlined"
                label="License date of validation"
                onChangeText={handleChange('date_of_validation')}
                onBlur={handleBlur('date_of_validation')}
                value={values.date_of_validation}
                style={styles.textInput}
                render={(props) => (
                  <TextInputMask
                    type="datetime"
                    options={{ format: 'YYYY/MM/DD' }}
                    {...props}
                  />
                )}
              />

            </Card.Content>
            <Card.Actions style={{ justifyContent: 'flex-end' }}>
              <Button
                onPress={handleSubmit}
                icon="send"
                color={colors.success}
                loading={isSubmittingAdditionalData}
                disabled={isSubmittingAdditionalData || !dirty}
              >
                Submit
              </Button>
            </Card.Actions>
          </View>
        )}
      </Formik>
    </Card>
  );
}

AdditionalDataForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  inspection: PropTypes.any,
  inspectionId: PropTypes.string,
  refresh: PropTypes.func,
};
AdditionalDataForm.defaultProps = {
  inspection: {},
  refresh: noop,
  inspectionId: PropTypes.string,
};
