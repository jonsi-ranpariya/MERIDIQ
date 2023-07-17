import ToastContainer from '@components/toast/ToastContainer';
import { AuthProvider } from '@provider/AuthProvider';
import { render } from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'react-image-lightbox/style.css';
import { SWRConfig } from 'swr';
import App from './App';
import './css/main.css';
import { commonFetch } from './helper';
import { TranslationProvider } from './hooks/useTranslation';
import ServiceWorkerWrapper from './partials/ServiceWorker/ServiceWorkerWrapper';
import { ConfirmationProvider } from './provider/ConfirmationProvider';
import { StripeProvider } from './provider/StripeProvider';
import { ThemeProvider } from './provider/ThemeProvider';
import reportWebVitals from './reportWebVitals';
import { StrictMode } from 'react';

function Index() {
  return (
    <BrowserRouter basename={`/${typeof process.env.REACT_APP_BASENAME !== 'undefined' ? process.env.REACT_APP_BASENAME : 'web'}`}>
      <ThemeProvider>
        <SWRConfig value={{ fetcher: commonFetch }}>
          <TranslationProvider>
            <AuthProvider>
              <StripeProvider>
                <ConfirmationProvider>
                  <>
                    <ServiceWorkerWrapper />
                    <ToastContainer />
                    <HelmetProvider>
                      <App />
                    </HelmetProvider>
                  </>
                </ConfirmationProvider>
              </StripeProvider>
            </AuthProvider>
          </TranslationProvider>
        </SWRConfig>
      </ThemeProvider>
    </BrowserRouter>
  );
}

// React 17
const container = document.getElementById('root');
// render(<Index />, container);
render(<StrictMode><Index /></StrictMode>, container);

// OLD - React 18
// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );

// root.render(<Index />);

// Strict mode
// root.render(
//   <React.StrictMode>
//     <Index />
//   </React.StrictMode>
// );
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
