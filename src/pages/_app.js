// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/app.css'
import { Provider } from 'jotai';
//import { selectedLanguageAtom, recentlyViewedAtom } from '../atom/atoms';

function MyApp({ Component, pageProps }) {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
