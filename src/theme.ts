import { createTheme } from '@mui/material/styles';

const transitionDuration = { enter: 225, exit: 175 };

const baseTheme = createTheme();

export const theme = createTheme({
  components: {
    MuiDialog: {
      defaultProps: {
        transitionDuration,
      },
      styleOverrides: {
        paper: {
          [baseTheme.breakpoints.down('sm')]: {
            margin: baseTheme.spacing(2),
            width: `calc(100% - ${baseTheme.spacing(4)})`,
            maxWidth: `calc(100% - ${baseTheme.spacing(4)})`,
            maxHeight: `calc(100% - ${baseTheme.spacing(4)})`,
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          [baseTheme.breakpoints.down('sm')]: {
            paddingLeft: baseTheme.spacing(2),
            paddingRight: baseTheme.spacing(2),
            fontSize: '1.1rem',
          },
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          [baseTheme.breakpoints.down('sm')]: {
            paddingLeft: baseTheme.spacing(2),
            paddingRight: baseTheme.spacing(2),
          },
        },
      },
    },
    MuiTabs: {
      defaultProps: {
        variant: 'scrollable',
        scrollButtons: 'auto',
      },
    },
    MuiPopover: {
      defaultProps: {
        transitionDuration,
      },
    },
    MuiMenu: {
      defaultProps: {
        transitionDuration,
      },
    },
    MuiSnackbar: {
      defaultProps: {
        transitionDuration,
      },
    },
  },
});
