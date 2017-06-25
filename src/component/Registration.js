import React from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';
import {browserHistory} from 'react-router'
import {Panel, FormGroup, Row, Col, ControlLabel, FormControl, Button, Modal} from "react-bootstrap";


class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disableSubmit: false,
            showSuccessModal: false,
            showErrorModal: false,
            modalErrorText: null
        };
    }

    sendRegistration(event) {
        event.preventDefault();
        this.setState({disableSubmit: true});

        const username = ReactDOM.findDOMNode(this.username).value;
        const password = ReactDOM.findDOMNode(this.password).value;
        const email = ReactDOM.findDOMNode(this.email).value;
        const firstName = ReactDOM.findDOMNode(this.firstName).value;
        const lastName = ReactDOM.findDOMNode(this.lastName).value;

        axios.post('http://localhost:8080/registration', {
            username: username,
            password: password,
            email: email,
            firstName: firstName,
            lastName: lastName
        })
            .then((response) => {
                console.log(response);
                this.setState({disableSubmit: false, showSuccessModal: true, modalTitle: "Успех!"});
            })
            .catch((error) => {
                let errorMessage = error.response.data.errorMessage;
                this.setState({
                    disableSubmit: false,
                    showErrorModal: true,
                    modalErrorText: errorMessage ? errorMessage : "Во время регистрации произошла ошибка!"
                });
            });
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

        return <div>
            <Panel header={title}>
                <form>
                    <FormGroup onSubmit={this.sendRegistration.bind(this)}>
                        <Row>
                            <Col md={12}>
                                <FormGroup controlId="formControlsSelect">
                                    <ControlLabel>Никнейм</ControlLabel>
                                    <FormControl ref={username => {
                                        this.username = username
                                    }} type="text" autoFocus/>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
                                <FormGroup controlId="formControlsSelect">
                                    <ControlLabel>Пароль</ControlLabel>
                                    <FormControl ref={password => {
                                        this.password = password
                                    }} type="password"/>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
                                <FormGroup controlId="formControlsSelect">
                                    <ControlLabel>Email</ControlLabel>
                                    <FormControl ref={email => {
                                        this.email = email
                                    }} type="text"/>
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