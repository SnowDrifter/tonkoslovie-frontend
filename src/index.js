import App from './container/App.js';
import Registration from "./component/Registration.js";
import Err404 from "./component/Err404.js";
import Err403 from "./component/Err403.js";
import Admin from "./container/admin/Admin.js";
import Lessons from "./container/Lessons.js";
import Contacts from "./container/Contacts.js";
import About from "./container/About.js";
import Words from "./container/admin/Words.js";
import Texts from "./container/admin/Texts.js";
import Text from "./component/admin/Text.js";
import AdminLessons from "./container/admin/Lessons.js";
import Lesson from "./component/admin/Lesson.js";
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
                        <Route path="/admin/words" component={Words}/>
                        <Route path="/admin/text(/:textId)" component={Text}/> {/*TODO: tmp */}
                        <Route path="/admin/texts" component={Texts}/>
                        <Route path="/admin/lessons" component={AdminLessons}/>
                        <Route path="/admin/lesson(/:lessonId)" component={Lesson}/>
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