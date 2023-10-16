import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ConfigProvider } from 'antd';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import 'antd/dist/reset.css';
import App from './App';
import store from './stores';
import './themes/_global.scss';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Provider store={store}>
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Poppins-400',
          colorPrimary: '#48ABE2',
          colorText: '#292D32',
          colorError: '#FF7777',
        },
      }}
    >
      <Elements stripe={loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '')}>
        <App />
      </Elements>
    </ConfigProvider>
  </Provider>,
);
