import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';

interface NewApiKeyDialogProps {
  apiKey: string | null;
  onClose: () => void;
}

function NewApiKeyDialog({ apiKey, onClose }: NewApiKeyDialogProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!apiKey) return;
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setCopied(false);
    onClose();
  };

  return (
    <Dialog open={!!apiKey} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('settings.apiKeys.newKeyTitle')}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>{t('settings.apiKeys.newKeyCreated')}</DialogContentText>
        <Paper
          variant="outlined"
          sx={{
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: '#f9fafb',
            borderRadius: 1,
          }}
        >
          <Box
            component="code"
            sx={{
              flex: 1,
              fontFamily: 'monospace',
              fontSize: 13,
              wordBreak: 'break-all',
            }}
          >
            {apiKey}
          </Box>
          <Tooltip title={copied ? t('common.copied') : t('common.copy')}>
            <IconButton size="small" onClick={handleCopy} color={copied ? 'success' : 'default'}>
              {copied ? <CheckOutlinedIcon fontSize="small" /> : <ContentCopyOutlinedIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained">
          {t('common.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewApiKeyDialog;
