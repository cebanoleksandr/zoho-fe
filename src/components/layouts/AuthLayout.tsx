import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f9fafb',
      }}
    >
      <Paper elevation={0} sx={{ width: 400, p: 4, border: '1px solid #e5e7eb', borderRadius: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#dc2626' }}>
          Zoho CRM
        </Typography>
        <Outlet />
      </Paper>
    </Box>
  );
}

export default AuthLayout;
