import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { View } from 'components';
import { useParams } from 'react-router';

export default function InspectionDetails() {
  const { id } = useParams();
  return (
    <View viewName="inspection-details" title="Inspection Details">
      <CssBaseline />
      <div>
        The details of the inspection with id :
        {` ${id} `}
        will be displayed here
      </div>
    </View>
  );
}
