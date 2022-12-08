import React, {useState} from "react";
import {useLocation} from "react-router-dom";
import * as QueryString from "query-string"
import {connect} from "react-redux";
import {Container, Nav, Navbar} from "react-bootstrap";
import {bindActionCreators} from "redux";
import * as AuthActions from "/action/AuthActions";
import RoutedLinkContainer from "./RoutedLinkContainer";
import RoleUtil from "/util/RoleUtil";
import "./Navigation.less";

function Navigation({user, isAuthenticated, actions}) {

    const [expandNavbar, setExpandNavbar] = useState(false);
    const location = useLocation();

    const token = QueryString.parse(location.search).token;

    if (token) {
        actions.saveToken(token);
    }

    return <Navbar bg="light" expand="lg" expanded={expandNavbar}>
        <Container>
        <Navbar.Brand>
            <Nav>
                <RoutedLinkContainer to="/" text="Главная"/>
            </Nav>
        </Navbar.Brand>

        <button type="button"
                className={`navbar-toggler ${expandNavbar ? "" : "collapsed"}`}
                onClick={() => setExpandNavbar(!expandNavbar)}>
            <span className="icon-bar"/>
            <span className="icon-bar"/>
            <span className="icon-bar"/>
        </button>

        <Navbar.Collapse>
            <Nav>
                <RoutedLinkContainer to="/lessons" text="Уроки"/>
                <RoutedLinkContainer to="/themes" text="Упражнения"/>
                <RoutedLinkContainer to="/about" text="О проекте"/>
                <RoutedLinkContainer to="/contacts" text="Контакты"/>
                {RoleUtil.isAdmin(user.roles) && <RoutedLinkContainer to="/admin" text="Администрирование"/>}
            </Nav>
        </Navbar.Collapse>

        <Navbar.Collapse className="justify-content-end">
            <Nav>
                <RoutedLinkContainer to="/registration" text="Регистрация" className={isAuthenticated ? "hidden" : ""}/>
                <Nav.Link onClick={actions.showLogin} className={isAuthenticated ? "hidden" : ""}>Вход</Nav.Link>
                <Nav.Link onClick={actions.logout} className={isAuthenticated ? "" : "hidden"}>Выход</Nav.Link>
            </Nav>
        </Navbar.Collapse>
        </Container>
    </Navbar>;
}

function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        user: state.auth.user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(AuthActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)