import React from "react";
import {connect} from "react-redux";
import {LinkContainer} from "react-router-bootstrap";
import {Nav, Navbar} from "react-bootstrap";
import {bindActionCreators} from "redux";
import * as UserActions from "../action/Auth";


class Navigation extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            expandNavbar: false
        };

        this.checkToken();
    }

    checkToken() {
        // if (this.props.location.query.token) {
        //     this.props.actions.saveToken(this.props.location.query.token);
        // }
    }

    logout() {
        this.props.actions.logout();
    }

    toggleExpandNavbar() {
        this.setState({expandNavbar: !this.state.expandNavbar});
    }

    render() {
        // const isAuthenticated = this.props.user.isAuthenticated;
        const isAuthenticated = false;

        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand>
                    <LinkContainer to="/lessons">
                        <Nav.Link>Главная</Nav.Link>
                    </LinkContainer>
                </Navbar.Brand>

                <button type="button"
                        className={`navbar-toggle ${this.state.expandNavbar ? "" : "collapsed"}`}
                        onClick={this.toggleExpandNavbar.bind(this)}>
                    <span className="icon-bar"/>
                    <span className="icon-bar"/>
                    <span className="icon-bar"/>
                </button>

                <Navbar.Collapse id={"kek"}>
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

                <Nav className="justify-content-end">
                    <Nav.Item>
                        <LinkContainer to="/registration">
                            <Nav.Link className={isAuthenticated ? "hidden" : ""}>Регистрация</Nav.Link>
                        </LinkContainer>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link
                            className={isAuthenticated ? "hidden" : ""}>Вход</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link onClick={this.logout.bind(this)}
                                  className={isAuthenticated ? "" : "hidden"}>Выход</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Navbar>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)