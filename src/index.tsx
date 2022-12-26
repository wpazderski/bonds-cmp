import "./index.scss";

import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { init as initI18n } from "./app/i18n/init";
import { store } from "./app/store/Store";
import App from "./components/main/app/App";





initI18n();

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);
