import React from "react";
import ReactDOM from "react-dom";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {FormGroup, Row, Col, ControlLabel, FormControl, Button, Modal} from "react-bootstrap";
import * as UserActions from "../action/Auth";
import "./Login.less";
const apiEndpoint = process.env.API_ENDPOINT || "";

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

        const username = ReactDOM.findDOMNode(this.username).value;
        const password = ReactDOM.findDOMNode(this.password).value;

        this.props.actions.login({username: username, password: password});
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
                                    <FormGroup controlId="usernameForm">
                                        <ControlLabel>Никнейм</ControlLabel>
                                        <FormControl ref={username => {
                                            this.username = username
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

                        <span style={{color: "red"}}>{this.props.user.errorMessage}</span>

                        <Button type="submit" className="pull-right" bsStyle="success"
                                onClick={this.sendLogin.bind(this)}>Войти</Button>
                    </form>

                    <hr/>

                    <div className="login-oauth-panel">
                        <div className="text-center">Войти с помощью</div>
                        <div className="login-social-links-wrapper">
                        <div className="login-social-links">
                            <a href={apiEndpoint + "/login/google"}>
                                <img className="login-social-icon-image" src="/assets/social/google.svg"/>
                            </a>
                            <a href={apiEndpoint + "/login/facebook"}>
                                <img className="login-social-icon-image" src="/assets/social/facebook.svg"/>
                            </a>
                        </div>
                        </div>
                    </div>
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