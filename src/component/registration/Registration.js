import React, {createRef, Fragment} from "react";
import Client from "../../util/Client";
import {Button, Card, Col, Form, Modal, Row} from "react-bootstrap";
import "./Registration.less"
import Oauth from "../Oauth";

class Registration extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            validated: false,
            disableSubmit: false,
            showModal: false,
            modalText: "",
            errorModal: false,

            password: {
                valid: false,
                showPopover: false,
                message: null
            },

            confirmPassword: {
                valid: false,
                message: null
            },

            email: {
                valid: false,
                message: null
            }
        };

        this.usernameInput = createRef();
        this.emailInput = createRef();
        this.passwordInput = createRef();
        this.confirmPasswordInput = createRef();
    }

    validateForm() {
        let success = true;

        const email = this.emailInput.current.value;
        const emailPattern = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

        if (email === "") {
            this.setState({
                email: {
                    valid: false,
                    message: "Поле должно быть заполнено"
                }
            });
            success = false;
        } else if (!emailPattern.test(email)) {
            this.setState({
                email: {
                    valid: false,
                    message: "Неправильный формат электронной почты"
                }
            });
            success = false;
        } else {
            this.setState({
                email: {
                    valid: true
                }
            });
        }

        const password = this.passwordInput.current.value;
        const confirmPassword = this.confirmPasswordInput.current.value;

        if (password === "") {
            this.setState({
                password: {
                    valid: false,
                    message: "Поле должно быть заполнено"
                }
            });
            success = false;
        } else if (confirmPassword !== "" && password !== confirmPassword) {
            this.setState({
                password: {
                    valid: false,
                    message: "Пароли должны совпадать"
                }
            });
            success = false;
        } else {
            this.setState({
                password: {
                    valid: true
                }
            });
        }

        if (confirmPassword === "") {
            this.setState({
                confirmPassword: {
                    valid: false,
                    message: "Поле должно быть заполнено"
                }
            });
            success = false;
        } else if (password !== "" && password !== confirmPassword) {
            this.setState({
                confirmPassword: {
                    valid: false,
                    message: "Пароли должны совпадать"
                }
            });
            success = false;
        } else {
            this.setState({
                confirmPassword: {
                    valid: true
                }
            });
        }

        this.setState({checked: true});
        return success;
    }

    sendRegistration(event) {
        event.preventDefault();

        if (this.validateForm()) {
            this.setState({disableSubmit: true});

            Client.post("/api/user/registration", {
                username: this.usernameInput.current.value,
                password: this.passwordInput.current.value,
                email: this.emailInput.current.value
            }).then(() => {
                this.setState({
                    disableSubmit: false,
                    showModal: true,
                    errorModal: false,
                    modalText: "Регистрация прошла успешно!\nДля завершения необходимо подтвердить электронную почту."
                });
            }).catch((error) => {
                const response = error.response.data;
                if (response.validationErrors) {
                    response.validationErrors.forEach(error => {
                        if (error.field === "email") {
                            this.setState({
                                email: {
                                    valid: false,
                                    message: error.message,
                                    showPopover: true
                                }
                            });
                        }
                    });
                } else {
                    this.setState({
                        showModal: true,
                        errorModal: true,
                        modalText: response.message ? response.message : "Неизвестная ошибка \n ¯\\_(ツ)_/¯"
                    });
                }

                this.setState({disableSubmit: false});
            });
        }
    }

    hideModal() {
        this.setState({showModal: false});

        // Complete successful registration
        if (!this.state.errorModal) {
            this.props.history.replace("/");
        }
    }

    splitTextLines(text) {
        if (text) {
            return text.split("\n").map((text, index) => (
                <Fragment key={`${text}-${index}`}>
                    {text}
                    <br/>
                </Fragment>)
            )
        }
    }

    render() {
        return <div className="registration-body">
            <Card>
                <Card.Header>Регистрация</Card.Header>
                <Card.Body>
                    <Form>
                        <Row>
                            <Col md={2}/>
                            <Col md={8}>
                                <ValidatedForm label="Email"
                                               inputRef={this.emailInput}
                                               checked={this.state.checked}
                                               valid={this.state.email.valid}
                                               message={this.state.email.message}/>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={2}/>
                            <Col md={8}>
                                <ValidatedForm label="Пароль"
                                               inputRef={this.passwordInput}
                                               checked={this.state.checked}
                                               valid={this.state.password.valid}
                                               message={this.state.password.message}/>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={2}/>
                            <Col md={8}>
                                <ValidatedForm label="Повторите пароль"
                                               inputRef={this.confirmPasswordInput}
                                               checked={this.state.checked}
                                               valid={this.state.confirmPassword.valid}
                                               message={this.state.confirmPassword.message}/>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={2}/>
                            <Col md={8}>
                                <Form.Group>
                                    <Form.Label>Никнейм</Form.Label>
                                    <Form.Control ref={this.usernameInput} type="text"/>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Button disabled={this.state.disableSubmit} type="submit" variant="success"
                                    onClick={this.sendRegistration.bind(this)}>Отправить</Button>
                        </Row>
                    </Form>

                    <hr/>

                    <Oauth/>
                </Card.Body>
            </Card>

            <Modal show={this.state.showModal} onHide={this.hideModal.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.errorModal ? "Ошибка!" : "Успех!"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">{this.splitTextLines(this.state.modalText)}</div>
                    <br/>
                    <Row className="justify-content-center">
                        <Button variant={this.state.errorModal ? "danger" : "success"}
                                onClick={this.hideModal.bind(this)}>ОК</Button>
                    </Row>
                </Modal.Body>
            </Modal>
        </div>
    }
}

class ValidatedForm extends React.Component {

    render() {
        const {label, inputRef, checked, valid, message} = this.props;
        const className = checked ? (valid ? "is-valid" : "is-invalid") : undefined;

        return <>
            <Form.Group>
                <Form.Label>{label}<span style={{color: "red"}}> *</span></Form.Label>
                <Form.Control ref={inputRef} className={className}/>
                <Form.Control.Feedback type="invalid">{message}</Form.Control.Feedback>
            </Form.Group>
        </>
    }
}

export default Registration;