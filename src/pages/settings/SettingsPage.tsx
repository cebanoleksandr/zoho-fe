import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PageHeader from '../../components/common/PageHeader';
import ApiKeysPanel from './ApiKeysPanel';
import WebhooksPanel from './WebhooksPanel';

type TabValue = 'api-keys' | 'webhooks';

function SettingsPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabValue>('api-keys');

  return (
    <Box>
      <PageHeader title={t('settings.title')} subtitle={t('settings.subtitle')} />

      <Tabs value={tab} onChange={(_e, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label={t('settings.tabs.apiKeys')} value="api-keys" />
        <Tab label={t('settings.tabs.webhooks')} value="webhooks" />
      </Tabs>

      {tab === 'api-keys' && <ApiKeysPanel />}
      {tab === 'webhooks' && <WebhooksPanel />}
    </Box>
  );
}

export default SettingsPage;
