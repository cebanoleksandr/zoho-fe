import { createTheme } from '@mui/material/styles';

const transitionDuration = { enter: 225, exit: 175 };

export const theme = createTheme({
  components: {
    MuiDialog: {
      defaultProps: {
        transitionDuration,
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
