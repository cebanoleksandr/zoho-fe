import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import DashboardIcon from '@mui/icons-material/DashboardOutlined';
import LeadsIcon from '@mui/icons-material/PersonSearchOutlined';
import ContactsIcon from '@mui/icons-material/ContactsOutlined';
import AccountsIcon from '@mui/icons-material/ApartmentOutlined';
import DealsIcon from '@mui/icons-material/HandshakeOutlined';
import ActivitiesIcon from '@mui/icons-material/EventNoteOutlined';
import PipelinesIcon from '@mui/icons-material/FilterAltOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import { useLogout } from '../../hooks/queries';
import { tokenStorage } from '../../api/client';

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { to: '/app', label: 'Dashboard', icon: <DashboardIcon />, end: true },
  { to: '/app/leads', label: 'Leads', icon: <LeadsIcon /> },
  { to: '/app/contacts', label: 'Contacts', icon: <ContactsIcon /> },
  { to: '/app/accounts', label: 'Accounts', icon: <AccountsIcon /> },
  { to: '/app/deals', label: 'Deals', icon: <DealsIcon /> },
  { to: '/app/activities', label: 'Activities', icon: <ActivitiesIcon /> },
  { to: '/app/pipelines', label: 'Pipelines', icon: <PipelinesIcon /> },
  { to: '/app/settings', label: 'Settings', icon: <SettingsIcon /> },
];

function MainLayout() {
  const navigate = useNavigate();
  const logout = useLogout();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleLogout = async () => {
    setAnchorEl(null);
    try {
      await logout.mutateAsync();
    } finally {
      tokenStorage.clearTokens();
      navigate('/auth/login', { replace: true });
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, borderBottom: '1px solid #e5e7eb' }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 700, color: '#dc2626' }}>
            Zoho CRM
          </Typography>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#dc2626', fontSize: 14 }}>U</Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <List sx={{ px: 1 }}>
          {NAV_ITEMS.map((item) => (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              end={item.end}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&.active': { bgcolor: 'rgba(220,38,38,0.08)', color: '#dc2626' },
                '&.active .MuiListItemIcon-root': { color: '#dc2626' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f9fafb', minHeight: '100vh' }}>
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default MainLayout;
