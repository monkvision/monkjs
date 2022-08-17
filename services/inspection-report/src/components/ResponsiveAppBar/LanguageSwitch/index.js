import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitch() {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getButtonContent = React.useCallback(() => {
    if (false) {
      return 'loading...';
    }
    return true === 'fr' ? '🇫🇷 ▼' : '🇬🇧 ▼';
  }, []);

  return (
    <div>
      {t('inspection.vehicle.type.suv')}
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        color="info"
      >
        {getButtonContent()}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>🇬🇧 English</MenuItem>
        <MenuItem onClick={handleClose}>🇫🇷 Français</MenuItem>
      </Menu>
    </div>
  );
}
