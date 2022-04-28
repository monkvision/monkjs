import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import { makeStyles} from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    padding: theme.spacing(2),
    borderRadius: 0,
    marginRottom: theme.spacing(1),
  },
}));

export default function ListControls({ onShowDeletedChange }) {
  const styles = useStyles();
  const handleShowDeletedChange = (event) => onShowDeletedChange(event.target.checked);

  return (
    <Paper elevation={1} className={styles.container}>
      <FormGroup>
        <FormControlLabel
          control={<Switch onChange={handleShowDeletedChange} />}
          label="Include deleted inspections"
        />
      </FormGroup>
    </Paper>
  );
}

ListControls.propTypes = {
  onShowDeletedChange: PropTypes.func.isRequired,
};
