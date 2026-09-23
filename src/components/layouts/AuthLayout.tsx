import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import LanguageSwitcher from '../common/LanguageSwitcher';

function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f9fafb',
        position: 'relative',
      }}
    >
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <LanguageSwitcher />
      </Box>
      <Paper elevation={0} sx={{ width: 400, p: 4, border: '1px solid #e5e7eb', borderRadius: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#4f46e5' }}>
          Orbit CRM
        </Typography>
        <Outlet />
      </Paper>
    </Box>
  );
}

export default AuthLayout;
