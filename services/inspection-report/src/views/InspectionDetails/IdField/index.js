import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { useTimeout } from '@monkvision/toolkit';

const DELAY_TO_RESET_COPY_STATE = 2000; // 2sec

export default function IdField({ label, id }) {
  const [copied, setCopy] = useState(false);

  const delay = copied ? DELAY_TO_RESET_COPY_STATE : null;
  useTimeout(() => setCopy(false), delay);

  const copyButton = useMemo(() => (
    <InputAdornment position="end">
      <IconButton
        aria-label="toggle clipboard"
        onClick={() => {
          if (copied) { return; }
          navigator.clipboard.writeText(id); setCopy(true);
        }}
        edge="end"
      >
        {copied ? <AssignmentTurnedInIcon /> : <ContentCopyIcon />}
      </IconButton>
    </InputAdornment>
  ), [copied]);

  return (
    <TextField
      label={label}
      defaultValue={id}
      type="text"
      variant="outlined"
      InputProps={{ endAdornment: copyButton, readOnly: true }}
      endAdornment={(
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle clipboard visibility"
            onClick={() => { navigator.clipboard.writeText(id); setCopy(true); }}
            edge="end"
          >
            {copied ? <AssignmentTurnedInIcon /> : <ContentCopyIcon />}
          </IconButton>
        </InputAdornment>
        )}
    />
  );
}

IdField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
