import Divider from '@mui/material/Divider';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

export default function ResponsiveAppBar() {
  const { user, logout } = useAuth0();

  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = React.useCallback((callback) => () => {
    setAnchorElNav(null);
    if (typeof callback === 'function') {
      callback();
    }
  }, []);

  const handleCloseUserMenu = React.useCallback((callback) => () => {
    setAnchorElUser(null);
    if (typeof callback === 'function') {
      callback();
    }
  }, []);

  const navigateToInspections = () => {
    handleCloseNavMenu();
    navigate('/inspections');
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            {process.env.REACT_APP_BRAND}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu()}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem onClick={navigateToInspections}>
                <Typography textAlign="center">Inspections</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu()}>
                <Typography textAlign="center">Vehicles</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu()}>
                <Typography textAlign="center">Customers</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            {process.env.REACT_APP_BRAND}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button onClick={navigateToInspections} sx={{ my: 2, color: 'white', display: 'block' }}>
              Inspections
            </Button>
            <Button onClick={handleCloseNavMenu()} sx={{ my: 2, color: 'white', display: 'block' }}>
              Vehicles
            </Button>
            <Button onClick={handleCloseNavMenu()} sx={{ my: 2, color: 'white', display: 'block' }}>
              Customers
            </Button>
            {/* NOTE(Ilyass): this link should be removed, it is used only for dev */}
            <Button onClick={() => navigate('/wheelAnalysis/72722c13-4c3e-df26-72a1-711845d0cc64/3fa85f64-5717-4562-b3fc-2c963f66afa2')} sx={{ my: 2, color: 'white', display: 'block' }}>
              Wheel analysis
            </Button>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open user menu">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={user.name} src={user.picture} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu()}
            >
              <MenuItem onClick={handleCloseUserMenu()}>
                <Typography textAlign="center">User info</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu()}>
                <Typography textAlign="center">Settings</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleCloseUserMenu(logout)}>
                <Typography textAlign="center">Sign Out</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
