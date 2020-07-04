import React from "react";
import ReactDOM from "react-dom";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Button, FormControl, FormGroup, FormLabel, Modal} from "react-bootstrap";
import * as UserActions from "../action/Auth";
import "./Login.less";
import Oauth from "./Oauth";


class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showLogin: false
        };
    }

    static getDerivedStateFromProps(props, state) {
        return {
            showLogin: props.showLogin
        };
    }

    sendLogin(event) {
        event.preventDefault();

        const email = ReactDOM.findDOMNode(this.email).value;
        const password = ReactDOM.findDOMNode(this.password).value;

        this.props.actions.login({email: email, password: password});
    }

    render() {
        let title = "Вход";

        return <div>
            <Modal show={this.state.showLogin} onHide={this.props.actions.hideLogin} dialogClassName="login-modal" centered>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="login-modal-body">
                    <form className="login-form">
                        <FormGroup>
                            <FormGroup controlId="emailForm">
                                <FormLabel>Email</FormLabel>
                                <FormControl ref={email => {
                                    this.email = email
                                }} type="text" autoFocus/>
                            </FormGroup>

                            <FormGroup controlId="passwordForm">
                                <FormLabel>Пароль</FormLabel>
                                <FormControl ref={password => {
                                    this.password = password
                                }} type="password"/>
                            </FormGroup>
                        </FormGroup>

                        <div className="login-error-message text-center">{this.props.user ? this.props.user.errorMessage : undefined}</div>

                        <Button type="submit" className="center-block" variant="success"
                                onClick={this.sendLogin.bind(this)}>Войти</Button>
                    </form>

                    <hr/>

                    <Oauth/>
                </Modal.Body>
            </Modal>
        </div>
    }
}

function mapStateToProps(state) {
    return {
        showLogin: state.AuthReducer.showLogin
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(UserActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)