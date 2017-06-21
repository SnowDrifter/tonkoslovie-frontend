import React from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';
import {Panel, FormGroup, Row, Col, ControlLabel, FormControl, Button} from "react-bootstrap";


class Registration extends React.Component {

    sendRegistration(event) {
        event.preventDefault();

        const username = ReactDOM.findDOMNode(this.username).value;
        const password = ReactDOM.findDOMNode(this.password).value;
        const email = ReactDOM.findDOMNode(this.email).value;

        axios.post('http://localhost:8080/registration', {
            username: username,
            password: password,
            email: email
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                alert("Something wrong"); // TODO
            });
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
                    </FormGroup>
                    <Button type="submit" className="pull-right" bsStyle="success"
                            onClick={this.sendRegistration.bind(this)}>Сохранить</Button>
                </form>
            </Panel>
        </div>
    }
}

export default Registration;