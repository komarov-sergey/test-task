import React from "react";
import ReactDOM from "react-dom/client";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { CurrentUserProvider } from "./contexts/currentUser";
import CurrentUserChecker from "./components/currentUserChecker";
import App from "./components/App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <CurrentUserProvider>
    <CurrentUserChecker>
      <App />
    </CurrentUserChecker>
  </CurrentUserProvider>
);
