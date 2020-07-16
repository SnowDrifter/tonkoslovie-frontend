import React from "react";
import Login from "../component/Login.js";
import {toast, ToastContainer} from "react-toastify";
import Err403 from "../component/Err403";
import Err500 from "../component/Err500";
import Theme from "../component/content/Theme";
import AdminTexts from "./admin/AdminTexts";
import Admin from "./admin/Admin";
import AdminExercise from "../component/admin/AdminExercise";
import AdminTheme from "../component/admin/AdminTheme";
import Contacts from "./Contacts";
import RegistrationSuccess from "../component/registration/RegistrationSuccess";
import RegistrationError from "../component/registration/RegistrationError";
import AdminThemes from "./admin/AdminThemes";
import About from "./About";
import Err404 from "../component/Err404";
import AdminWords from "./admin/AdminWords";
import AdminUser from "../component/admin/AdminUser";
import Lessons from "./content/Lessons";
import AdminText from "../component/admin/AdminText";
import AdminLessons from "./admin/AdminLessons";
import AdminExercises from "./admin/AdminExercises";
import AdminUsers from "./admin/AdminUsers";
import Lesson from "../component/content/Lesson";
import Exercise from "../component/content/Exercise";
import Themes from "./content/Themes";
import Registration from "../component/registration/Registration";
import Home from "./Home";
import AdminLesson from "../component/admin/AdminLesson";
import Text from "../component/content/text/Text";
import {Route, Switch} from "react-router-dom"
import {Container} from "react-bootstrap"
import Navigation from "../component/Navigation";
import AdminRoute from "./AdminRoute";

import "react-toastify/dist/ReactToastify.css";
import "../../static/css/lumen.bootstrap.theme.min.css";
import "./App.less";

class App extends React.Component {
    render() {
        return (
            <Container>
                <Navigation/>

                <Login/>

                <ToastContainer autoClose={3000}
                                position={toast.POSITION.BOTTOM_LEFT}
                                hideProgressBar={true}/>

                <Switch>
                    <Route path="/" component={Home} exact/>
                    <Route path="/lessons" component={Lessons}/>
                    <Route path="/lesson/:lessonId" component={Lesson}/>
                    <Route path="/text/:textId" component={Text}/>
                    <Route path="/themes" component={Themes}/>
                    <Route path="/theme/:themeId" component={Theme}/>
                    <Route path="/exercise/:exerciseId" component={Exercise}/>
                    <Route path="/contacts" component={Contacts}/>
                    <Route path="/about" component={About}/>

                    <Route path="/registration" component={Registration}/>
                    <Route path="/registration/success" component={RegistrationSuccess}/>
                    <Route path="/registration/error" component={RegistrationError}/>

                    <AdminRoute path="/admin" component={Admin} exact/>
                    <AdminRoute path="/admin/words" component={AdminWords}/>
                    <AdminRoute path="/admin/texts" component={AdminTexts}/>
                    <AdminRoute path="/admin/text/:textId" component={AdminText}/>
                    <AdminRoute path="/admin/text" component={AdminText}/>
                    <AdminRoute path="/admin/lessons" component={AdminLessons}/>
                    <AdminRoute path="/admin/lesson/:lessonId" component={AdminLesson}/>
                    <AdminRoute path="/admin/lesson" component={AdminLesson}/>
                    <AdminRoute path="/admin/exercises" component={AdminExercises}/>
                    <AdminRoute path="/admin/exercise/:exerciseId" component={AdminExercise}/>
                    <AdminRoute path="/admin/exercise" component={AdminExercise}/>
                    <AdminRoute path="/admin/themes" component={AdminThemes}/>
                    <AdminRoute path="/admin/theme/:themeId" component={AdminTheme}/>
                    <AdminRoute path="/admin/theme" component={AdminTheme}/>
                    <AdminRoute path="/admin/users" component={AdminUsers}/>
                    <AdminRoute path="/admin/user/:userId" component={AdminUser}/>

                    <Route path="/access_denied" component={Err403} status={403}/>
                    <Route path="/not_available" component={Err500}/>
                    <Route path="*" component={Err404} status={404}/>
                </Switch>
            </Container>
        )
    }
}

export default App

