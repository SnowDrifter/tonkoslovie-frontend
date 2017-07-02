import App from './container/App.js';
import Registration from "./component/Registration.js";
import Err404 from "./component/Err404.js";
import Err403 from "./component/Err403.js";
import Admin from "./container/admin/Admin.js";
import Words from "./container/admin/Words.js";
import Text from "./container/admin/Text.js";
import React from 'react'
import {render} from 'react-dom'
import {Router, Route, Link, browserHistory} from 'react-router'
import {Provider} from 'react-redux'
import configureStore from './store/configureStore'
import RestrictedContainer from './container/RestrictedContainer'

import LessonText from "./container/lesson/LessonText";


const store = configureStore();

render((
    <div>
        <Provider store={store}>
            <Router history={browserHistory}>
                <Route path="/" component={App}>
                    <Route path="/registration" component={Registration}/>
                    <Route path="/text" component={LessonText}/>
                    <Route authorize={['ROLE_ADMIN']} component={RestrictedContainer}>
                        <Route path="/admin" component={Admin}/>
                        <Route path="/admin/words" component={Words}/>
                        <Route path="/admin/text" component={Text}/> {/*TODO: remove it*/}
                    </Route>
                    <Route path="/accessDenied" component={Err403} status={403}/>
                    <Route path="*" component={Err404} status={404}/>
                </Route>
            </Router>
        </Provider>
    </div>
), document.getElementById('main'));