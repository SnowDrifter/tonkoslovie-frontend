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
import Themes from "./content/theme/Themes";
import Registration from "./registration/Registration";
import Home from "./Home";
import AdminLesson from "./admin/lesson/AdminLesson";
import Text from "./content/text/Text";
import {Route, Routes} from "react-router-dom"
import {Container} from "react-bootstrap"
import Navigation from "/component/Navigation";
import AdminRoute from "./AdminRoute";
import RouterWrapper from "/component/router/RouterWrapper";
import "./App.less";

class App extends React.Component {
    render() {
        return (
            <Container>
                <Navigation/>

                <Login/>

                <ToastContainer autoClose={3000}
                                position={toast.POSITION.BOTTOM_LEFT}
                                hideProgressBar
                                theme="colored"/>

                <Routes>
                    <Route path="/" element={<Home/>} end/>
                    <Route path="lessons" element={<Lessons/>}/>
                    <Route path="lesson/:lessonId" element={<RouterWrapper element={Lesson}/>}/>
                    <Route path="text/:textId" element={<RouterWrapper element={Text}/>}/>
                    <Route path="themes" element={<Themes/>}/>
                    <Route path="theme/:themeId" element={<RouterWrapper element={Theme}/>}/>
                    <Route path="contacts" element={<Contacts/>}/>
                    <Route path="about" element={<About/>}/>

                    <Route path="registration" element={<RouterWrapper element={Registration}/>}/>
                    <Route path="registration/success" element={<RouterWrapper element={RegistrationSuccess}/>}/>
                    <Route path="registration/error" element={<RegistrationError/>}/>

                    <Route path="admin" element={<RouterWrapper element={AdminRoute}/>}>
                        <Route path="" element={<RouterWrapper element={Admin}/>}/>
                        <Route path="words" element={<RouterWrapper element={AdminWords}/>}/>
                        <Route path="texts" element={<RouterWrapper element={AdminTexts}/>}/>
                        <Route path="text/:textId" element={<RouterWrapper element={AdminText}/>}/>
                        <Route path="text" element={<RouterWrapper element={AdminText}/>}/>
                        <Route path="lessons" element={<RouterWrapper element={AdminLessons}/>}/>
                        <Route path="lesson/:lessonId" element={<RouterWrapper element={AdminLesson}/>}/>
                        <Route path="lesson" element={<RouterWrapper element={AdminLesson}/>}/>
                        <Route path="exercises" element={<RouterWrapper element={AdminExercises}/>}/>
                        <Route path="exercise/:exerciseId" element={<RouterWrapper element={AdminExercise}/>}/>
                        <Route path="exercise" element={<RouterWrapper element={AdminExercise}/>}/>
                        <Route path="themes" element={<RouterWrapper element={AdminThemes}/>}/>
                        <Route path="theme/:themeId" element={<RouterWrapper element={AdminTheme}/>}/>
                        <Route path="theme" element={<RouterWrapper element={AdminTheme}/>}/>
                        <Route path="audits" element={<RouterWrapper element={AdminAudits}/>}/>
                        <Route path="users" element={<RouterWrapper element={AdminUsers}/>}/>
                        <Route path="user/:userId" element={<RouterWrapper element={AdminUser}/>}/>
                    </Route>

                    <Route path="access_denied" element={<Err403/>} status={403}/>
                    <Route path="not_available" element={<Err500/>}/>
                    <Route path="*" element={<Err404/>} status={404}/>
                </Routes>
            </Container>
        )
    }
}

export default App

