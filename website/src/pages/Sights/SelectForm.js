import React from 'react';
import propTypes from 'prop-types';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import noop from '@docusaurus/core/lib/client/exports/Noop';

export default function SelectForm({
  name,
  items,
  value,
  setter,
  onChange,
}) {
  return (
    <FormControl style={{ width: 150 }}>
      <InputLabel id={name}>{name}</InputLabel>
      <Select
        labelId={name}
        label={name}
        value={value}
        onChange={(e) => onChange(e, setter)}
      >
        {items
          .filter((sort) => sort !== 'overlay')
          .map((sort) => <MenuItem key={sort} value={sort}>{sort}</MenuItem>)}
      </Select>
    </FormControl>
  );
}

SelectForm.propTypes = {
  items: propTypes.arrayOf(propTypes.string),
  name: propTypes.string,
  onChange: propTypes.func,
  setter: propTypes.func,
  value: propTypes.string,
};

SelectForm.defaultProps = {
  name: '',
  value: '',
  items: [],
  onChange: noop,
  setter: noop,
};
