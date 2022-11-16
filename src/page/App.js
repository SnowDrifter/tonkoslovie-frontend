import React from "react";
import Login from "./login/Login.js";
import {toast, ToastContainer} from "react-toastify";
import Err403 from "./error/Err403";
import Err500 from "./error/Err500";
import Theme from "./content/theme/Theme";
import AdminTexts from "./admin/text/AdminTexts";
import Admin from "./admin/Admin";
import AdminExercise from "./admin/exercise/AdminExercise";
import AdminTheme from "./admin/theme/AdminTheme";
import Contacts from "./Contacts";
import RegistrationSuccess from "./registration/RegistrationSuccess";
import RegistrationError from "./registration/RegistrationError";
import AdminThemes from "./admin/theme/AdminThemes";
import About from "./About";
import Err404 from "./error/Err404";
import AdminWords from "./admin/word/AdminWords";
import AdminUser from "./admin/user/AdminUser";
import Lessons from "./content/lesson/Lessons";
import AdminText from "./admin/text/AdminText";
import AdminLessons from "./admin/lesson/AdminLessons";
import AdminExercises from "./admin/exercise/AdminExercises";
import AdminAudits from "./admin/audit/AdminAudits";
import AdminUsers from "./admin/user/AdminUsers";
import Lesson from "./content/lesson/Lesson";
import Exercise from "./content/exercise/Exercise";
import Themes from "./content/theme/Themes";
import Registration from "./registration/Registration";
import Home from "./Home";
import AdminLesson from "./admin/lesson/AdminLesson";
import Text from "./content/text/Text";
import {Route, Switch} from "react-router-dom"
import {Container} from "react-bootstrap"
import Navigation from "/component/Navigation";
import AdminRoute from "./AdminRoute";
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
                    <AdminRoute path="/admin/audits" component={AdminAudits}/>
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

