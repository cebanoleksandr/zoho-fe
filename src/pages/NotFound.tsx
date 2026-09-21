import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function NotFound() {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <Typography variant="h3" sx={{ fontWeight: 700 }}>
        {t('notFound.title')}
      </Typography>
      <Typography color="text.secondary">{t('notFound.subtitle')}</Typography>
      <Button component={RouterLink} to="/app" variant="contained">
        {t('notFound.backToDashboard')}
      </Button>
    </Box>
  );
}

export default NotFound;
