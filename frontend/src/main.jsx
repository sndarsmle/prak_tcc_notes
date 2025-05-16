import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./auth/AuthProvider";
import AxiosInterceptor from "./api/axiosInterceptor";
import "./css/index.css"; // gunakan style Bulma + custom style kamu

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <AxiosInterceptor />
      <Router>
        <App />
      </Router>
    </AuthProvider>
  </StrictMode>
);
