import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Button, Form, Modal} from "react-bootstrap";
import * as AuthActions from "/action/AuthActions";
import Oauth from "/component/Oauth";
import "./Login.less";

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userData: {
                email: "",
                password: "",
            },
            showLogin: false,
            errorMessage: undefined
        };
    }

    static getDerivedStateFromProps(props) {
        return {
            showLogin: props.showLogin,
            errorMessage: props.errorMessage
        };
    }

    sendLogin = (event) => {
        event.preventDefault();

        this.props.actions.login(this.state.userData);
    }

    updateUserData = (field, value) => this.setState({userData: {...this.state.userData, [field]: value}});

    render() {
        return <Modal centered show={this.state.showLogin}
                      onHide={this.props.actions.hideLogin} dialogClassName="login-modal">
            <Modal.Header closeButton>
                <Modal.Title>Вход</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Group controlId="emailForm">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" autoFocus
                                          onChange={e => this.updateUserData("email", e.target.value)}/>
                        </Form.Group>

                        <Form.Group controlId="passwordForm">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control ref={this.passwordInput} type="password"
                                          onChange={e => this.updateUserData("password", e.target.value)}/>
                        </Form.Group>
                    </Form.Group>

                    <div className="login-error-message text-center">{this.props.errorMessage}</div>

                    <div className="text-center my-3">
                        <Button type="submit" variant="success" onClick={this.sendLogin}>Войти</Button>
                    </div>
                </Form>

                <hr/>

                <Oauth/>
            </Modal.Body>
        </Modal>
    }
}

function mapStateToProps(state) {
    return {
        showLogin: state.auth.showLogin,
        errorMessage: state.auth.errorMessage,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(AuthActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)