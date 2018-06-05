import React from "react";
import ReactDOM from "react-dom";
import Client from "../../util/Client";
import {browserHistory} from "react-router"
import {Button, Col, ControlLabel, FormControl, FormGroup, Modal, Overlay, Panel, Popover, Row} from "react-bootstrap";
import "./Registration.less"
import Oauth from "../Oauth";

class Registration extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            disableSubmit: false,
            showSuccessModal: false,
            showErrorModal: false,
            modalErrorText: null,

            password: {
                validationState: null,
                showPopover: false,
                message: null
            },

            confirmPassword: {
                validationState: null,
                showPopover: false,
                message: null
            },

            email: {
                validationState: null,
                showPopover: false,
                message: null
            }
        };
    }

    validateForm() {
        let success = true;

        const email = ReactDOM.findDOMNode(this.email).value;
        const emailPattern = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

        if (email == "") {
            this.setState({
                email: {
                    validationState: "error",
                    showPopover: true,
                    message: "Поле должно быть заполнено"
                }
            });
            success = false;
        } else if (!emailPattern.test(email)) {
            this.setState({
                email: {
                    validationState: "error",
                    showPopover: true,
                    message: "Неправильный формат электронной почты"
                }
            });
            success = false;
        } else {
            this.setState({
                email: {
                    validationState: "success",
                    showPopover: false
                }
            });
        }

        const password = ReactDOM.findDOMNode(this.password).value;
        const confirmPassword = ReactDOM.findDOMNode(this.confirmPassword).value;

        if (password == "") {
            this.setState({
                password: {
                    validationState: "error",
                    showPopover: true,
                    message: "Поле должно быть заполнено"
                }
            });
            success = false;
        } else if (confirmPassword != "" && password !== confirmPassword) {
            this.setState({
                password: {
                    validationState: "error",
                    showPopover: true,
                    message: "Пароли должны совпадать"
                }
            });
            success = false;
        } else {
            this.setState({
                password: {
                    validationState: "success",
                    showPopover: false
                }
            });
        }

        if (confirmPassword == "") {
            this.setState({
                confirmPassword: {
                    validationState: "error",
                    showPopover: true,
                    message: "Поле должно быть заполнено"
                }
            });
            success = false;
        } else if (password != "" && password !== confirmPassword) {
            this.setState({
                confirmPassword: {
                    validationState: "error",
                    showPopover: true,
                    message: "Пароли должны совпадать"
                }
            });
            success = false;
        } else {
            this.setState({
                confirmPassword: {
                    validationState: "success",
                    showPopover: false
                }
            });
        }

        return success;
    }

    sendRegistration(event) {
        event.preventDefault();

        if (this.validateForm()) {
            this.setState({disableSubmit: true});

            const username = ReactDOM.findDOMNode(this.username).value;
            const password = ReactDOM.findDOMNode(this.password).value;
            const email = ReactDOM.findDOMNode(this.email).value;

            Client.post("/api/user/registration", {
                username: username,
                password: password,
                email: email
            }).then(() => {
                this.setState({disableSubmit: false, showSuccessModal: true, modalTitle: "Успех!"});
            }).catch((error) => {
                const response = error.response.data;
                if (response.validationErrors) {
                    response.validationErrors.forEach(error => {
                        if (error.field == "email") {
                            this.setState({
                                email: {
                                    validationState: "error",
                                    message: error.message,
                                    showPopover: true
                                }
                            });
                        }
                    });
                } else if (response.errorMessage) {
                    this.setState({
                        showErrorModal: true,
                        modalErrorText: response.errorMessage
                    });
                }

                this.setState({
                    disableSubmit: false
                });
            });
        }
    }

    hideSuccessModal() {
        this.setState({showSuccessModal: false});
        browserHistory["replace"]("/");
    }

    hideErrorModal() {
        this.setState({showErrorModal: false});
    }

    render() {
        let title = "Регистрация";

        return <div className="registration-body">
            <Panel>
                <Panel.Heading>{title}</Panel.Heading>
                <Panel.Body>
                    <form>
                        <FormGroup onSubmit={this.sendRegistration.bind(this)}>
                            <Row>
                                <Col md={2}/>
                                <Col md={8}>
                                    <FormGroup validationState={this.state.email.validationState}>
                                        <ControlLabel>Email <span style={{color: "red"}}>*</span></ControlLabel>
                                        <Overlay show={this.state.email.showPopover} target={this.email} placement="left">
                                            <Popover id="emailPopover" className="registration-popover">
                                                {this.state.email.message}
                                            </Popover>
                                        </Overlay>

                                        <FormControl ref={email => {
                                            this.email = email
                                        }} type="email"/>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={2}/>
                                <Col md={8}>
                                    <FormGroup validationState={this.state.password.validationState}>
                                        <ControlLabel>Пароль <span style={{color: "red"}}>*</span></ControlLabel>
                                        <Overlay show={this.state.password.showPopover} target={this.password} placement="left">
                                            <Popover id="passwordPopover" className="registration-popover">
                                                {this.state.password.message}
                                            </Popover>
                                        </Overlay>

                                        <FormControl ref={password => {
                                            this.password = password
                                        }} type="password"/>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={2}/>
                                <Col md={8}>
                                    <FormGroup validationState={this.state.confirmPassword.validationState}>
                                        <ControlLabel>Повторите пароль <span
                                            style={{color: "red"}}>*</span></ControlLabel>
                                        <Overlay show={this.state.confirmPassword.showPopover}
                                                 target={this.confirmPassword} placement="left">
                                            <Popover id="confirmPasswordPopover" className="registration-popover">
                                                {this.state.confirmPassword.message}
                                            </Popover>
                                        </Overlay>

                                        <FormControl ref={confirmPassword => {
                                            this.confirmPassword = confirmPassword
                                        }} type="password"/>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={2}/>
                                <Col md={8}>
                                    <FormGroup>
                                        <ControlLabel>Никнейм</ControlLabel>
                                        <FormControl ref={username => {
                                            this.username = username
                                        }} type="text" autoFocus/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </FormGroup>

                        <Button className="center-block" disabled={this.state.disableSubmit} type="submit" bsStyle="success"
                                onClick={this.sendRegistration.bind(this)}>Отправить</Button>
                    </form>

                    <hr/>

                    <Oauth/>
                </Panel.Body>
            </Panel>

            <Modal show={this.state.showSuccessModal} onHide={this.hideSuccessModal.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div className="text-center">Регистрация прошла успешно!</div>
                        <div className="text-center">Для завершения необходимо подтвердить электронную почту.</div>
                        <br/>
                    </div>
                    <Button type="submit" className="center-block"
                            onClick={this.hideSuccessModal.bind(this)}>ОК</Button>
                </Modal.Body>
            </Modal>

            <Modal show={this.state.showErrorModal} onHide={this.hideErrorModal.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>Ошибка!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">{this.state.modalErrorText}</div>
                    <br/>
                    <Button type="submit" bsStyle="warning" className="center-block"
                            onClick={this.hideErrorModal.bind(this)}>ОК</Button>
                </Modal.Body>
            </Modal>
        </div>
    }
}

export default Registration;