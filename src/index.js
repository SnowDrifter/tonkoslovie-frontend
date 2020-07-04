import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import {Router} from "react-router-dom"
import ConfigureStore from "./store/ConfigureStore"

import history from "./util/History";
import App from "./container/App";

const store = ConfigureStore();

render((
    <div>
        <Provider store={store}>
            <Router history={history}>
                <App/>
            </Router>
        </Provider>
    </div>
), document.getElementById("main"));