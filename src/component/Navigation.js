import React from "react";
import {withRouter} from "react-router-dom";
import * as QueryString from "query-string"
import {connect} from "react-redux";
import {Nav, Navbar} from "react-bootstrap";
import {bindActionCreators} from "redux";
import * as UserActions from "/action/Auth";
import "./Navigation.less";
import RoutedLinkContainer from "./RoutedLinkContainer";


class Navigation extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            expandNavbar: false,
            isAuthenticated: props.isAuthenticated
        };

        this.checkToken();
    }

    static getDerivedStateFromProps(props) {
        return {
            isAuthenticated: props.isAuthenticated
        };
    }

    checkToken() {
        const token = QueryString.parse(this.props.location.search).token;

        if (token) {
            this.props.actions.saveToken(token);
        }
    }

    toggleExpandNavbar() {
        this.setState({expandNavbar: !this.state.expandNavbar});
    }

    render() {
        const isAuthenticated = this.state.isAuthenticated;

        return <Navbar bg="light" expand="lg" expanded={this.state.expandNavbar}>
            <Navbar.Brand>
                <Nav>
                    <RoutedLinkContainer to="/" text="Главная"/>
                </Nav>
            </Navbar.Brand>

            <button type="button"
                    className={`navbar-toggler ${this.state.expandNavbar ? "" : "collapsed"}`}
                    onClick={this.toggleExpandNavbar.bind(this)}>
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
                </Nav>
            </Navbar.Collapse>

            <Navbar.Collapse className="justify-content-end">
                <Nav>
                    <RoutedLinkContainer to="/registration" text="Регистрация"
                                         className={isAuthenticated ? "hidden" : ""}/>
                    <Nav.Link onClick={this.props.actions.showLogin}
                              className={isAuthenticated ? "hidden" : ""}>Вход</Nav.Link>
                    <Nav.Link onClick={this.props.actions.logout}
                              className={isAuthenticated ? "" : "hidden"}>Выход</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>;
    }
}

function mapStateToProps(state) {
    return {
        isAuthenticated: state.AuthReducer.isAuthenticated
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(UserActions, dispatch)
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navigation))