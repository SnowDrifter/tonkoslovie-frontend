import React from "react";
import ReactDOM from "react-dom";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {FormGroup, Row, Col, ControlLabel, FormControl, Button, Modal} from "react-bootstrap";
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

    componentWillReceiveProps(props) {
        this.setState({showLogin: props.user.showLogin});
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
            <Modal show={this.state.showLogin} onHide={this.props.actions.hideLogin}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="login-modal-body">
                    <form className="login-form">
                        <FormGroup>
                            <Row>
                                <Col md={12}>
                                    <FormGroup controlId="emailForm">
                                        <ControlLabel>Email</ControlLabel>
                                        <FormControl ref={email => {
                                            this.email = email
                                        }} type="text" autoFocus/>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={12}>
                                    <FormGroup controlId="passwordForm">
                                        <ControlLabel>Пароль</ControlLabel>
                                        <FormControl ref={password => {
                                            this.password = password
                                        }} type="password"/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </FormGroup>

                        <div className="login-error-message">{this.props.user.errorMessage}</div>

                        <Button type="submit" className="pull-right" bsStyle="success"
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
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(UserActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)