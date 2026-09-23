import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import router from './router';
import { theme } from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
