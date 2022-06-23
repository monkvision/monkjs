import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { useTimeout } from '@monkvision/toolkit';
import CircularProgress from '@mui/material/CircularProgress';
import InputMask from 'react-input-mask';

const DELAY_TO_RESET_COPY_STATE = 2000; // 2sec

export default function Field({ label, value, readOnly, loading, mask, onChange, ...rest }) {
  const [copied, setCopy] = useState(false);

  const delay = copied ? DELAY_TO_RESET_COPY_STATE : null;
  useTimeout(() => setCopy(false), delay);

  const copyButton = useMemo(() => {
    const copy = () => { navigator.clipboard.writeText(value); setCopy(true); };
    return (
      <InputAdornment position="end">
        <IconButton
          aria-label="toggle clipboard"
          onClick={() => !copied && copy()}
          edge="end"
        >
          {copied ? <AssignmentTurnedInIcon /> : <ContentCopyIcon />}
        </IconButton>
      </InputAdornment>
    );
  }, [copied, value]);

  const commonFieldProps = useMemo(
    () => ({
      disabled: loading,
      onChange,
      defaultValue: value,
      label,
      type: 'text',
      variant: 'outlined',
      InputProps: {
        endAdornment: loading ? <CircularProgress size={24} /> : copyButton,
        readOnly: readOnly || loading,
      },
      ...rest }),
    [loading, onChange, value, label],
  );

  if (mask) {
    return (
      <InputMask
        mask={mask}
        maskChar=" "
        {...commonFieldProps}
      >
        {(inputProps) => (<TextField {...inputProps} />)}
      </InputMask>
    );
  }
  return (
    <TextField {...commonFieldProps} />
  );
}

Field.propTypes = {
  label: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  mask: PropTypes.string,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  value: PropTypes.string.isRequired,
};

Field.defaultProps = {
  loading: false,
  onChange: () => {},
  readOnly: false,
  mask: '',
};
