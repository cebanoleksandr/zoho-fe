import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './api/queryClient.ts'
import './i18n'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </Provider>
    </Suspense>
  </StrictMode>,
)
