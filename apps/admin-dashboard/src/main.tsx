import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { QueryProvider } from './modules/shared/providers/query-provider';
import { ToastProvider } from './modules/shared/providers/toast-provider';
import { ToastContainer } from './modules/shared/components/ui/toast/toast-container';
import App from './app/app';
import './styles/globals.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <QueryProvider>
      <ToastProvider>
        <BrowserRouter basename="/app">
          <App />
        </BrowserRouter>
        <ToastContainer />
      </ToastProvider>
    </QueryProvider>
  </StrictMode>
);
