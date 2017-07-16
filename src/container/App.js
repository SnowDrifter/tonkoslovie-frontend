import React, {PropTypes} from "react";
import Login from "../component/Login.js";
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, Button} from "react-bootstrap";
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'
import * as UserActions from '../action/Auth'

class App extends React.Component {
    constructor(props) {
        super(props);
    };

    logout() {
        localStorage.removeItem('token');
        this.context.router.push("/");
    }

    render() {
        return (
            <div>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="/">Главная</a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav>
                        <NavItem href="/lessons">Уроки</NavItem>
                        <NavItem href="/about">О проекте</NavItem>
                        <NavItem href="/contacts">Контакты</NavItem>
                    </Nav>
                    <Nav pullRight>
                        <NavItem href="/registration" className={this.props.user.isAuthenticated ? 'hidden' : ''}>Регистрация</NavItem>
                        <NavItem onClick={this.props.actions.showLogin} className={this.props.user.isAuthenticated ? 'hidden' : ''}>Вход</NavItem>
                        <NavItem href="/" onClick={this.logout.bind(this)} className={this.props.user.isAuthenticated ? '' : 'hidden'}>Выход</NavItem>
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

function mapStateToProps (state) {
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

