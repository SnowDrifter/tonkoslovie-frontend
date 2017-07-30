import React from "react";
import ReactDOM from 'react-dom';
import client from "../util/client";
import {browserHistory} from 'react-router'
import {
    Panel,
    FormGroup,
    Row,
    Col,
    ControlLabel,
    FormControl,
    Button,
    Modal,
    OverlayTrigger,
    Overlay,
    Tooltip,
    Popover
} from "react-bootstrap";
import style from './Registration.less'

class Registration extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            disableSubmit: false,
            showSuccessModal: false,
            showErrorModal: false,
            modalErrorText: null,

            usernameValidationState: null,
            showUsernameValidationPopover: false,
            usernameValidationMessage: null,

            passwordValidationState: null,
            showPasswordValidationPopover: false,
            passwordValidationMessage: null,

            confirmPasswordValidationState: null,
            showConfirmPasswordValidationPopover: false,
            confirmPasswordValidationMessage: null,

            emailValidationState: null,
            showEmailValidationPopover: false,
            emailValidationMessage: null
        };
    }

    validateForm() {
        let success = true;

        const username = ReactDOM.findDOMNode(this.username).value;

        if (username == '') {
            this.setState({
                usernameValidationState: "error",
                showUsernameValidationPopover: true,
                usernameValidationMessage: "Поле должно быть заполнено"
            });
            success = false;
        } else {
            this.setState({
                usernameValidationState: "success",
                showUsernameValidationPopover: false
            });
        }

        const password = ReactDOM.findDOMNode(this.password).value;

        const confirmPassword = ReactDOM.findDOMNode(this.confirmPassword).value;

        if (password == '') {
            this.setState({
                passwordValidationState: "error",
                showPasswordValidationPopover: true,
                passwordValidationMessage: "Поле должно быть заполнено",
            });
            success = false;
        } else if (confirmPassword != '' && password !== confirmPassword) {
            this.setState({
                passwordValidationState: "error",
                showPasswordValidationPopover: true,
                passwordValidationMessage: "Пароли должны совпадать",
            });
            success = false;
        } else {
            this.setState({
                passwordValidationState: "success",
                showPasswordValidationPopover: false
            });
        }

        if (confirmPassword == '') {
            this.setState({
                confirmPasswordValidationState: "error",
                showConfirmPasswordValidationPopover: true,
                confirmPasswordValidationMessage: "Поле должно быть заполнено"
            });
            success = false;
        } else if (password != '' && password !== confirmPassword) {
            this.setState({
                confirmPasswordValidationState: "error",
                showConfirmPasswordValidationPopover: true,
                confirmPasswordValidationMessage: "Пароли должны совпадать",
            });
            success = false;
        } else {
            this.setState({
                confirmPasswordValidationState: "success",
                showConfirmPasswordValidationPopover: false
            });
        }

        const email = ReactDOM.findDOMNode(this.email).value;
        const emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        if (email == '') {
            this.setState({
                emailValidationState: "error",
                showEmailValidationPopover: true,
                emailValidationMessage: "Поле должно быть заполнено"
            });
            success = false;
        } else if (!emailPattern.test(email)) {
            this.setState({
                emailValidationState: "error",
                showEmailValidationPopover: true,
                emailValidationMessage: "Неправильный формат электронной почты"
            });
            success = false;
        } else {
            this.setState({
                emailValidationState: "success",
                showEmailValidationPopover: false
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
            const firstName = ReactDOM.findDOMNode(this.firstName).value;
            const lastName = ReactDOM.findDOMNode(this.lastName).value;

            client.post('/registration', {
                username: username,
                password: password,
                email: email,
                firstName: firstName,
                lastName: lastName
            }).then((response) => {
                console.log(response);
                this.setState({disableSubmit: false, showSuccessModal: true, modalTitle: "Успех!"});
            }).catch((error) => {
                let errorMessage = error.response.data.errorMessage;
                this.setState({
                    disableSubmit: false,
                    showErrorModal: true,
                    modalErrorText: errorMessage ? errorMessage : "Во время регистрации произошла ошибка!"
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
            <Panel header={title}>
                <form>
                    <FormGroup onSubmit={this.sendRegistration.bind(this)}>
                        <Row>
                            <Col md={12}>
                                <FormGroup validationState={this.state.usernameValidationState}>
                                    <ControlLabel>Никнейм</ControlLabel>
                                    <Overlay show={this.state.showUsernameValidationPopover}
                                             target={() => ReactDOM.findDOMNode(this.username)} placement="left">
                                        <Popover style={{width: 200}}>{this.state.usernameValidationMessage}</Popover>
                                    </Overlay>

                                    <FormControl ref={username => {
                                        this.username = username
                                    }} type="text" autoFocus/>

                                </FormGroup>

                            </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
                                <FormGroup validationState={this.state.passwordValidationState}>
                                    <ControlLabel>Пароль</ControlLabel>
                                    <Overlay show={this.state.showPasswordValidationPopover}
                                             target={() => ReactDOM.findDOMNode(this.password)} placement="left">
                                        <Popover style={{width: 200}}>{this.state.passwordValidationMessage}</Popover>
                                    </Overlay>

                                    <FormControl ref={password => {
                                        this.password = password
                                    }} type="password"/>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
                                <FormGroup validationState={this.state.confirmPasswordValidationState}>
                                    <ControlLabel>Повторите пароль</ControlLabel>
                                    <Overlay show={this.state.showConfirmPasswordValidationPopover}
                                             target={() => ReactDOM.findDOMNode(this.confirmPassword)} placement="left">
                                        <Popover
                                            style={{width: 200}}>{this.state.confirmPasswordValidationMessage}</Popover>
                                    </Overlay>

                                    <FormControl ref={confirmPassword => {
                                        this.confirmPassword = confirmPassword
                                    }} type="password"/>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
                                <FormGroup validationState={this.state.emailValidationState}>
                                    <ControlLabel>Email</ControlLabel>
                                    <Overlay show={this.state.showEmailValidationPopover}
                                             target={() => ReactDOM.findDOMNode(this.email)} placement="left">
                                        <Popover style={{width: 200}}>{this.state.emailValidationMessage}</Popover>
                                    </Overlay>

                                    <FormControl ref={email => {
                                        this.email = email
                                    }} type="email"/>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
                                <FormGroup controlId="formControlsSelect">
                                    <ControlLabel>Имя</ControlLabel>
                                    <FormControl ref={firstName => {
                                        this.firstName = firstName
                                    }} type="text"/>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
                                <FormGroup controlId="formControlsSelect">
                                    <ControlLabel>Фамилия</ControlLabel>
                                    <FormControl ref={lastName => {
                                        this.lastName = lastName
                                    }} type="text"/>
                                </FormGroup>
                            </Col>
                        </Row>
                    </FormGroup>
                    <Button disabled={this.state.disableSubmit} type="submit" className="pull-right" bsStyle="success"
                            onClick={this.sendRegistration.bind(this)}>Сохранить</Button>
                </form>
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

            <Modal show={this.state.showSuccessModal} onHide={this.hideSuccessModal.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className="text-center">Регистрация прошла успешно!</div>
                    <div className="text-center">Для завершения необходимо подтвердить электронную почту.</div>
                    <br/>
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