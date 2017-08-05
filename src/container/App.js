import React, {PropTypes} from "react";
import Login from "../component/Login.js";
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, Button} from "react-bootstrap";
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as UserActions from '../action/Auth'
import {LinkContainer} from 'react-router-bootstrap';
import {Link} from 'react-router'

class App extends React.Component {
    constructor(props) {
        super(props);
    };

    logout() {
        this.props.actions.logout();
    }

    render() {
        const isAuthenticated = this.props.user.isAuthenticated;

        return (
            <div>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link to="/"> Главная</Link>
                        </Navbar.Brand>
                    </Navbar.Header>

                    <Nav>
                        <LinkContainer to="/lessons">
                            <NavItem>Уроки</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/about">
                            <NavItem>О проекте</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/contacts">
                            <NavItem>Контакты</NavItem>
                        </LinkContainer>
                    </Nav>
                    <Nav pullRight>
                        <LinkContainer to="/registration">
                            <NavItem className={isAuthenticated ? 'hidden' : ''}>Регистрация</NavItem>
                        </LinkContainer>
                        <NavItem onClick={this.props.actions.showLogin}
                                 className={isAuthenticated ? 'hidden' : ''}>Вход</NavItem>

                            <NavItem onClick={this.logout.bind(this)}
                                     className={isAuthenticated ? '' : 'hidden'}>Выход</NavItem>
                    </Nav>
                </Navbar>

                <Login/>

                <div className="container">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

App.contextTypes = {
    router: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(UserActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

