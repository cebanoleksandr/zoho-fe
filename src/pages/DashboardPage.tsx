import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LeadsIcon from '@mui/icons-material/PersonSearchOutlined';
import DealsIcon from '@mui/icons-material/HandshakeOutlined';
import AccountsIcon from '@mui/icons-material/ApartmentOutlined';
import ActivitiesIcon from '@mui/icons-material/EventNoteOutlined';
import PageHeader from '../components/common/PageHeader';
import { useLeads, useDeals, useAccounts, useActivities } from '../hooks/queries';

const STAT_CARDS = [
  { key: 'leads', label: 'Open Leads', icon: <LeadsIcon />, color: '#dc2626' },
  { key: 'deals', label: 'Active Deals', icon: <DealsIcon />, color: '#2563eb' },
  { key: 'accounts', label: 'Accounts', icon: <AccountsIcon />, color: '#16a34a' },
  { key: 'activities', label: 'Pending Activities', icon: <ActivitiesIcon />, color: '#d97706' },
] as const;

function DashboardPage() {
  const leads = useLeads({ limit: 1 });
  const deals = useDeals({ limit: 1 });
  const accounts = useAccounts({ limit: 1 });
  const activities = useActivities({ status: 'PENDING', limit: 1 });

  const totals: Record<(typeof STAT_CARDS)[number]['key'], number | undefined> = {
    leads: leads.data?.total,
    deals: deals.data?.total,
    accounts: accounts.data?.total,
    activities: activities.data?.total,
  };

  return (
    <Box>
      <PageHeader title="Dashboard" subtitle="Overview of your CRM activity" />

      <Grid container spacing={2}>
        {STAT_CARDS.map((card) => (
          <Grid key={card.key} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{ p: 2.5, border: '1px solid #e5e7eb', borderRadius: 2, display: 'flex', gap: 2, alignItems: 'center' }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: `${card.color}1a`,
                  color: card.color,
                }}
              >
                {card.icon}
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {totals[card.key] ?? '—'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.label}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default DashboardPage;
