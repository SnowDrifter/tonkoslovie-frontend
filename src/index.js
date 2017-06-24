import App from './container/App.js';
import Registration from "./component/Registration.js";
import Err404 from "./component/Err404.js";
import Admin from "./component/Admin.js";
import React from 'react'
import {render} from 'react-dom'
import {Router, Route, Link, browserHistory} from 'react-router'
import {Provider} from 'react-redux'
import configureStore from './store/configureStore'
import RestrictedContainer from './container/RestrictedContainer'


const store = configureStore();

render((
    <div>
        <Provider store={store}>
            <Router history={browserHistory}>
                <Route path="/" component={App}>
                    <Route path="/registration" component={Registration}/>
                    <Route authorize={['ROLE_ADMIN']} component={RestrictedContainer}>
                        <Route path="/admin" component={Admin}/>
                    </Route>
                    <Route path="*" component={Err404} status={404}/>
                </Route>
            </Router>
        </Provider>
    </div>
), document.getElementById('main'));