import React, {PropTypes} from "react";
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, Button} from "react-bootstrap";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    static isAuthenticated() {
        return !!localStorage.getItem('token');
    }

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
                        <NavItem href="/registration" className={App.isAuthenticated() ? 'hidden' : ''}>Регистрация</NavItem>
                        <NavItem href="/login" className={App.isAuthenticated() ? 'hidden' : ''}>Вход</NavItem>
                        <NavItem href="/" onClick={this.logout.bind(this)} className={App.isAuthenticated() ? '' : 'hidden'}>Выход</NavItem>
                    </Nav>
                </Navbar>

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

export default App;

