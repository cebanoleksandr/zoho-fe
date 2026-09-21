import { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PageHeader from '../../components/common/PageHeader';
import ApiKeysPanel from './ApiKeysPanel';
import WebhooksPanel from './WebhooksPanel';

type TabValue = 'api-keys' | 'webhooks';

function SettingsPage() {
  const [tab, setTab] = useState<TabValue>('api-keys');

  return (
    <Box>
      <PageHeader title="Settings" subtitle="Manage API access and integrations" />

      <Tabs value={tab} onChange={(_e, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="API Keys" value="api-keys" />
        <Tab label="Webhooks" value="webhooks" />
      </Tabs>

      {tab === 'api-keys' && <ApiKeysPanel />}
      {tab === 'webhooks' && <WebhooksPanel />}
    </Box>
  );
}

export default SettingsPage;
