import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import LanguageIcon from '@mui/icons-material/LanguageOutlined';
import { supportedLanguages } from '../../i18n';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const current =
    supportedLanguages.find((l) => l.code === i18n.resolvedLanguage) ?? supportedLanguages[0];

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        color="inherit"
        size="small"
        startIcon={<LanguageIcon fontSize="small" />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ textTransform: 'none', mr: 1 }}
      >
        {current.label}
      </Button>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
        {supportedLanguages.map((lang) => (
          <MenuItem key={lang.code} selected={lang.code === current.code} onClick={() => handleSelect(lang.code)}>
            <ListItemText>{lang.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default LanguageSwitcher;
