import React from "react";
import ReactDOM from "react-dom";
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Panel, FormGroup, Row, Col, ControlLabel, FormControl, Button, Modal} from "react-bootstrap";
import * as UserActions from '../action/Auth'
import style from './login.less'

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showLogin: false
        };
    }

    componentWillReceiveProps(props) {
        this.setState({ showLogin: props.user.user.showLogin });
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
                    <form>
                        <FormGroup>
                            <Row>
                                <Col md={12}>
                                    <FormGroup controlId="formInlineName">
                                        <ControlLabel>Никнейм</ControlLabel>
                                        <FormControl ref={username => {
                                            this.username = username
                                        }} type="text" autoFocus/>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={12}>
                                    <FormGroup controlId="formInlineName">
                                        <ControlLabel>Пароль</ControlLabel>
                                        <FormControl ref={password => {
                                            this.password = password
                                        }} type="password"/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </FormGroup>

                        <span style={{color: 'red'}}>{this.props.user.user.errorMessage}</span>

                        <Button type="submit" className="pull-right" bsStyle="success"
                                onClick={this.sendLogin.bind(this)}>Войти</Button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    }
}

function mapStateToProps(state) {
    return {
        user: state
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(UserActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)