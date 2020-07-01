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
import Text from "../component/content/Text";
import {Redirect, Route, Switch} from "react-router-dom"
import {Container} from "react-bootstrap"
import Navigation from "../component/Navigation";
import RestrictedContainer from "../container/RestrictedContainer";

import "react-toastify/dist/ReactToastify.css";
import "../../static/css/lumen.bootstrap.theme.min.css";
import "./App.less";

class App extends React.Component {
    render() {
        return (
            <div>
                <Container>
                    <Navigation/>

                    <Login/>

                    <ToastContainer autoClose={3000}
                                    position={toast.POSITION.BOTTOM_LEFT}
                                    hideProgressBar={true}/>

                    <Switch>
                        <Route path="/" component={Home} exact/>
                        <Route path="/registration" component={Registration}/>
                        <Route path="/registration/success" component={RegistrationSuccess}/>
                        <Route path="/registration/error" component={RegistrationError}/>
                        {/*<Route authorize={["ROLE_ADMIN"]} component={RestrictedContainer}>*/}
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
                            <Route path="/404" component={Err404} status={404}/>
                            <Redirect to="/404"/>
                        {/*</Route>*/}
                    </Switch>
                </Container>
            </div>
        )
    }
}

export default App

