import React, {createRef} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Button, Form, Modal, Row} from "react-bootstrap";
import * as UserActions from "/action/Auth";
import "./Login.less";
import Oauth from "/component/Oauth";


class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showLogin: false,
            errorMessage: undefined
        };

        this.emailInput = createRef();
        this.passwordInput = createRef();
    }

    static getDerivedStateFromProps(props) {
        return {
            showLogin: props.showLogin,
            errorMessage: props.errorMessage
        };
    }

    sendLogin(event) {
        event.preventDefault();

        const email = this.emailInput.current.value;
        const password = this.passwordInput.current.value;

        this.props.actions.login({email: email, password: password});
    }

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
                            <Form.Control ref={this.emailInput} type="text" autoFocus/>
                        </Form.Group>

                        <Form.Group controlId="passwordForm">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control ref={this.passwordInput} type="password"/>
                        </Form.Group>
                    </Form.Group>

                    <div className="login-error-message text-center">{this.state.errorMessage}</div>

                    <Row className="justify-content-center">
                        <Button type="submit" variant="success" onClick={this.sendLogin.bind(this)}>Войти</Button>
                    </Row>
                </Form>

                <hr/>

                <Oauth/>
            </Modal.Body>
        </Modal>
    }
}

function mapStateToProps(state) {
    return {
        showLogin: state.AuthReducer.showLogin,
        errorMessage: state.AuthReducer.errorMessage,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(UserActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)