import React from "react";
import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom"

import ConfigureStore from "./store/ConfigureStore"

import App from "./page/App";

const store = ConfigureStore();

const container = document.getElementById("main");
const root = createRoot(container);

root.render(
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
);