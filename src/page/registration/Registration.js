import React from "react";
import Client from "/util/Client";
import {Button, Card, Form, Col, Row} from "react-bootstrap";
import Oauth from "/component/Oauth";
import ValidationForm from "/component/ValidationForm";
import {Formik} from "formik";
import * as Yup from "yup";
import RegistrationResultModal from "./RegistrationResultModal";
import "./Registration.less"

const schema = Yup.object().shape({
    password: Yup.string()
        .min(6, "Пароль должен быть длиннее 5 символов")
        .required("Поле должно быть заполнено"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Пароли должны совпадать")
        .required("Поле должно быть заполнено"),
    email: Yup.string()
        .email("Неправильный формат электронной почты")
        .required("Поле должно быть заполнено"),
});

class Registration extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            errorMessage: null
        };
    }

    sendRegistration = (userData, setSubmitting, setFieldError) => {
        Client.post("/api/user/registration", userData)
            .then(() => this.setState({ showModal: true }))
            .catch(e => {
                const response = e.response.data;

                if (response?.validationErrors) {
                    response.validationErrors.forEach(error => {
                        if (error.field === "email") {
                            setFieldError("email", error.message)
                        }
                    });
                } else {
                    this.setState({
                        showModal: true,
                        errorMessage: response.message ? response.message : "Неизвестная ошибка \n ¯\\_(ツ)_/¯"
                    });
                }

                setSubmitting(false);
            });
    }

    hideModal = () => {
        this.setState({showModal: false});

        // Complete successful registration
        if (!this.state.errorMessage) {
            this.props.navigate("/", {replace: true});
        }
    }

    render() {
        return <div className="registration-body">
            <Card>
                <Card.Header>Регистрация</Card.Header>
                <Card.Body>
                    <Formik initialValues={{password: "", confirmPassword: "", email: "", nickname: ""}}
                            validationSchema={schema} style={{justifyContent: "center", display: "flex"}}
                            onSubmit={(values, {setSubmitting, setFieldError}) =>
                                this.sendRegistration(values, setSubmitting, setFieldError)}>
                        {({handleSubmit, handleChange, isSubmitting}) => (
                            <Form onSubmit={handleSubmit}>
                                <Row className="justify-content-md-center">
                                    <ValidationForm label="Email"
                                                    type="email"
                                                    controlId="email"
                                                    name="email"
                                                    as={Col} md={8}/>
                                </Row>

                                <Row className="justify-content-md-center">
                                    <ValidationForm label="Пароль"
                                                    type="password"
                                                    controlId="password"
                                                    name="password"
                                                    as={Col} md={8}/>
                                </Row>

                                <Row className="justify-content-md-center">
                                    <ValidationForm label="Повторите пароль"
                                                    type="password"
                                                    controlId="confirmPassword"
                                                    name="confirmPassword"
                                                    as={Col} md={8}/>
                                </Row>

                                <Row className="justify-content-md-center">
                                    <Form.Group as={Col} md={8}>
                                        <Form.Label>Никнейм</Form.Label>
                                        <Form.Control onChange={handleChange} id="nickname" type="text"/>
                                    </Form.Group>
                                </Row>

                                <div className="text-center my-3">
                                    <Button disabled={isSubmitting} type="submit" variant="success">
                                        Отправить
                                    </Button>
                                </div>
                            </Form>)}
                    </Formik>

                    <hr/>

                    <Oauth/>
                </Card.Body>
            </Card>

            <RegistrationResultModal showModal={this.state.showModal}
                                     hideModal={this.hideModal}
                                     errorMessage={this.state.errorMessage}/>
        </div>
    }
}

export default Registration;