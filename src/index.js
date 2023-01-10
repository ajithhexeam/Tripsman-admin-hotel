import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import "./i18n";
import App from "./App";
// import { I18nextProvider } from "react-i18next";
import axios from "axios";
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

// axios.interceptors.request.use(
//   (config) => {
//     const accessToken = localStorage.getItem("admin_tkn");

//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },

//   (error) => {
//     Promise.reject(error);
//   }
// );

axios.interceptors.response.use(
  (response) => {
    console.log(response);
    return response;
  },
  async (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.clear();
      }
    }
    return Promise.reject(error);
  }
);

root.render(
  // <StrictMode>
  <App />
  // </StrictMode>
);