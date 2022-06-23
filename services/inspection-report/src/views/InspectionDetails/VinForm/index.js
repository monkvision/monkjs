import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Stack } from '@mui/material';
import Field from '../Field';
import useUpdateInspectionVehicle from '../useUpdateInspectionVehicle';
import useGetInspection from '../useGetInspection';

export default function VinForm({ inspectionId, vin: initialVinValue }) {
  const [vin, setVin] = useState(initialVinValue);

  const getInspection = useGetInspection(inspectionId);
  const updateInspectionVehicle = useUpdateInspectionVehicle(
    inspectionId,
    vin,
    getInspection.start,
  );

  const { loading, error } = updateInspectionVehicle.state;
  const { error: getInspectionError } = getInspection.state;

  const handleChange = (e) => setVin(e.target.value);

  const handleUpdate = useCallback(async (e) => {
    e.preventDefault();
    if (vin !== initialVinValue) { await updateInspectionVehicle.start(); }
  }, [updateInspectionVehicle.start]);

  return (
    <Stack spacing={2}>
      <Stack spacing={0.6}>
        {error && <Alert severity="error">An error occurd while update the inspection, please try again in a few minutes</Alert>}
        {getInspectionError && <Alert severity="warning">An error occurd while refreshing the inspection, please refresh the page in a few minutes</Alert>}
      </Stack>
      <Stack spacing={0.6}>
        <Field
          value={vin}
          label="Vehicle identification number"
          loading={loading}
          onChange={handleChange}
          mask="*** ****** ********"
          placeholder="VFX XXXXX XXXXXXXX"
          onBlur={handleUpdate}
        />
      </Stack>
    </Stack>

  );
}

VinForm.propTypes = {
  inspectionId: PropTypes.string.isRequired,
  vin: PropTypes.string,
};
VinForm.defaultProps = {
  vin: '',
};
