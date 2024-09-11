import React from 'react';
import ReactDOM from 'react-dom/client';
import 'react-dropdown/style.css';
import ReactGA from "react-ga4";
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from "./Redux/store";
import ThemeContext from "./context/ThemeContext";
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
ReactGA.initialize("G-5H88T54K1Q");
root.render(
  <React.StrictMode>
    <Provider store = {store}>
      <BrowserRouter >
        <ThemeContext>
          <App />
        </ThemeContext>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

const SendAnalytics = ()=> {
  ReactGA.send({
    hitType: "pageview",
    page: window.location.pathname,
  });
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(SendAnalytics);