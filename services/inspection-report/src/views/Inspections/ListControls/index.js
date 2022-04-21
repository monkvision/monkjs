import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import './styles.css';
import { FormControlLabel, FormGroup, Switch } from '@mui/material';

export default function ListControls({ onShowDeletedChange }) {
  const handleShowDeletedChange = (event) => onShowDeletedChange(event.target.checked);
  return (
    <Paper elevation={1} className="container">
      <FormGroup>
        <FormControlLabel
          control={
            <Switch onChange={handleShowDeletedChange} />
          }
          label="Include deleted inspections"
        />
      </FormGroup>
    </Paper>
  );
}

ListControls.propTypes = {
  onShowDeletedChange: PropTypes.func.isRequired,
};
