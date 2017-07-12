import App from './container/App.js';
import Registration from "./component/Registration.js";
import Err404 from "./component/Err404.js";
import Err403 from "./component/Err403.js";
import Lessons from "./container/Lessons.js";
import Contacts from "./container/Contacts.js";
import About from "./container/About.js";
import Admin from "./container/admin/Admin.js";
import AdminWords from "./container/admin/AdminWords.js";
import AdminTexts from "./container/admin/AdminTexts.js";
import AdminText from "./component/admin/AdminText.js";
import AdminLessons from "./container/admin/AdminLessons.js";
import AdminLesson from "./component/admin/AdminLesson.js";
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
                        <Route path="/admin/words" component={AdminWords}/>
                        <Route path="/admin/text(/:textId)" component={AdminText}/>
                        <Route path="/admin/texts" component={AdminTexts}/>
                        <Route path="/admin/lessons" component={AdminLessons}/>
                        <Route path="/admin/lesson(/:lessonId)" component={AdminLesson}/>
                    </Route>
                    <Route path="/lessons" component={Lessons}/>
                    <Route path="/contacts" component={Contacts}/>
                    <Route path="/about" component={About}/>
                    <Route path="/accessDenied" component={Err403}/>
                    <Route path="*" component={Err404} status={404}/>
                </Route>
            </Router>
        </Provider>
    </div>
), document.getElementById('main'));