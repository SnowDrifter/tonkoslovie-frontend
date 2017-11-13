import React from "react";
import Login from "../component/Login.js";
import {Navbar, Nav, NavItem} from "react-bootstrap";
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import * as UserActions from "../action/Auth"
import {LinkContainer} from "react-router-bootstrap";
import {Link} from "react-router"

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            expandNavbar: false
        };
    }

    logout() {
        this.props.actions.logout();
    }

    toggleExpandNavbar(){
        this.setState({expandNavbar: !this.state.expandNavbar});
    }

    render() {
        const isAuthenticated = this.props.user.isAuthenticated;

        return (
            <div>
                <Navbar onToggle={this.toggleExpandNavbar.bind(this)}
                        expanded={this.state.expandNavbar}>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link to="/"> Главная</Link>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>

                    <Navbar.Collapse>
                        <Nav>
                            <LinkContainer to="/lessons">
                                <NavItem>Уроки</NavItem>
                            </LinkContainer>
                            <LinkContainer to="/themes">
                                <NavItem>Упражнения</NavItem>
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
                                <NavItem className={isAuthenticated ? "hidden" : ""}>Регистрация</NavItem>
                            </LinkContainer>
                            <NavItem onClick={this.props.actions.showLogin}
                                     className={isAuthenticated ? "hidden" : ""}>Вход</NavItem>

                                <NavItem onClick={this.logout.bind(this)}
                                         className={isAuthenticated ? "" : "hidden"}>Выход</NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <Login/>

                <div className="container">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

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

