import React from "react";
import {withRouter} from "react-router-dom";
import * as QueryString from "query-string"
import {connect} from "react-redux";
import {LinkContainer} from "react-router-bootstrap";
import {Nav, Navbar} from "react-bootstrap";
import {bindActionCreators} from "redux";
import * as UserActions from "../action/Auth";
import "./Navigation.less";


class Navigation extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            expandNavbar: false,
            isAuthenticated: props.isAuthenticated
        };

        this.checkToken();
    }

    static getDerivedStateFromProps(props, state) {
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

    logout() {
        this.props.actions.logout();
    }

    toggleExpandNavbar() {
        this.setState({expandNavbar: !this.state.expandNavbar});
    }

    render() {
        const isAuthenticated = this.state.isAuthenticated;

        return (
            <Navbar bg="light"
                    expand="lg"
                    expanded={this.state.expandNavbar}>
                <Navbar.Brand>
                    <LinkContainer to="/">
                        <Nav>
                            <Nav.Link>Главная</Nav.Link>
                        </Nav>
                    </LinkContainer>
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
                        <LinkContainer to="/lessons">
                            <Nav.Link>Уроки</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/themes">
                            <Nav.Link>Упражнения</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/about">
                            <Nav.Link>О проекте</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/contacts">
                            <Nav.Link>Контакты</Nav.Link>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>

                <Navbar.Collapse className="justify-content-end">
                    <Nav>
                        <Nav.Item>
                            <LinkContainer to="/registration">
                                <Nav.Link className={isAuthenticated ? "hidden" : ""}>Регистрация</Nav.Link>
                            </LinkContainer>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={this.props.actions.showLogin}
                                      className={isAuthenticated ? "hidden" : ""}>Вход</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={this.logout.bind(this)}
                                      className={isAuthenticated ? "" : "hidden"}>Выход</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
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