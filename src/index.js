import App from "./container/App.js";
import Registration from "./component/registration/Registration.js";
import RegistrationSuccess from "./component/registration/RegistrationSuccess.js";
import RegistrationError from "./component/registration/RegistrationError.js";
import Err500 from "./component/Err500.js";
import Err404 from "./component/Err404.js";
import Err403 from "./component/Err403.js";
import Lessons from "./container/content/Lessons.js";
import Lesson from "./component/content/Lesson.js";
import Text from "./component/content/Text.js";
import Themes from "./container/content/Themes.js";
import Theme from "./component/content/Theme.js";
import Exercise from "./component/content/Exercise.js";
import Home from "./container/Home.js";
import Contacts from "./container/Contacts.js";
import About from "./container/About.js";
import Admin from "./container/admin/Admin.js";
import AdminWords from "./container/admin/AdminWords.js";
import AdminTexts from "./container/admin/AdminTexts.js";
import AdminText from "./component/admin/AdminText.js";
import AdminLessons from "./container/admin/AdminLessons.js";
import AdminLesson from "./component/admin/AdminLesson.js";
import AdminExercises from "./container/admin/AdminExercises.js";
import AdminExercise from "./component/admin/AdminExercise.js";
import AdminThemes from "./container/admin/AdminThemes.js";
import AdminTheme from "./component/admin/AdminTheme.js";
import AdminUsers from "./container/admin/AdminUsers.js";
import AdminUser from "./component/admin/AdminUser.js";
import React from "react"
import {render} from "react-dom"
import {Router, IndexRoute, Route, browserHistory} from "react-router"
import {Provider} from "react-redux"
import ConfigureStore from "./store/ConfigureStore"
import RestrictedContainer from "./container/RestrictedContainer"


const store = ConfigureStore();

render((
    <div>
        <Provider store={store}>
            <Router history={browserHistory}>
                <Route path="/" component={App}>
                    <IndexRoute component={Home}/>
                    <Route path="/registration" component={Registration}/>
                    <Route path="/registration/success" component={RegistrationSuccess}/>
                    <Route path="/registration/error" component={RegistrationError}/>
                    <Route authorize={["ROLE_ADMIN"]} component={RestrictedContainer}>
                        <Route path="/admin" component={Admin}/>
                        <Route path="/admin/words" component={AdminWords}/>
                        <Route path="/admin/text(/:textId)" component={AdminText}/>
                        <Route path="/admin/texts" component={AdminTexts}/>
                        <Route path="/admin/lessons" component={AdminLessons}/>
                        <Route path="/admin/lesson(/:lessonId)" component={AdminLesson}/>
                        <Route path="/admin/exercises" component={AdminExercises}/>
                        <Route path="/admin/exercise(/:exerciseId)" component={AdminExercise}/>
                        <Route path="/admin/themes" component={AdminThemes}/>
                        <Route path="/admin/theme(/:themeId)" component={AdminTheme}/>
                        <Route path="/admin/users" component={AdminUsers}/>
                        <Route path="/admin/user/:userId" component={AdminUser}/>
                    </Route>
                    <Route path="/lessons" component={Lessons}/>
                    <Route path="/lesson(/:lessonId)" component={Lesson}/>
                    <Route path="/text(/:textId)" component={Text}/>
                    <Route path="/themes" component={Themes}/>
                    <Route path="/theme(/:themeId)" component={Theme}/>
                    <Route path="/exercise(/:exerciseId)" component={Exercise}/>
                    <Route path="/contacts" component={Contacts}/>
                    <Route path="/about" component={About}/>
                    <Route path="/accessDenied" component={Err403}/>
                    <Route path="/500" component={Err500}/>
                    <Route path="*" component={Err404} status={404}/>
                </Route>
            </Router>
        </Provider>
    </div>
), document.getElementById("main"));