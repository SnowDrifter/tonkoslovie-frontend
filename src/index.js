import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import {Router} from "react-router-dom"
import ConfigureStore from "./store/ConfigureStore"

import history from "./util/History";
import App from "./page/App";

const store = ConfigureStore();

render((
    <Provider store={store}>
        <Router history={history}>
            <App/>
        </Router>
    </Provider>
), document.getElementById("main"));