import React from 'react';
import PropTypes from 'prop-types';
import MUIMenu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

export default function Menu({ options, open, onClose, anchorEl, children, ...props }) {
  return (
    <MUIMenu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      {...props}
    >
      {options.map(({ label, icon = null, ...rest }) => (
        <MenuItem {...rest} key={label}>
          {icon && <ListItemIcon>{icon}</ListItemIcon>}
          <ListItemText>
            {label}
          </ListItemText>
        </MenuItem>
      ))}
    </MUIMenu>
  );
}

Menu.propTypes = {
  anchorEl: PropTypes.oneOfType([PropTypes.element, PropTypes.object]),
  children: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.any),
};

Menu.defaultProps = {
  anchorEl: null,
  options: [],
  open: false,
  onClose: () => {},
  children: () => {},
};
