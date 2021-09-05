import React, {createRef} from "react";
import {Breadcrumb, Button, Form, Jumbotron, Card} from "react-bootstrap";
import Loader from "/component/Loader";
import {LinkContainer} from "react-router-bootstrap";
import Client from "/util/Client";
import {toast} from "react-toastify";
import RoleUtil from "/util/RoleUtil";

class AdminUser extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: props.computedMatch.params.userId,
            enabled: false,
            admin: false,
            loaded: false
        };

        this.firstNameInput = createRef();
        this.lastNameInput = createRef();
        this.usernameInput = createRef();
        this.emailInput = createRef();

        this.loadUser(props.computedMatch.params.userId);
    }

    loadUser(userId) {
        Client.get("/api/user/", {
            params: {
                id: userId
            }
        }).then(response => {
            const user = response.data;

            this.setState({
                enabled: user.enabled,
                admin: RoleUtil.isAdmin(user.roles),
                loaded: true
            });

            this.firstNameInput.current.value = user.firstName || "";
            this.lastNameInput.current.value = user.lastName || "";
            this.usernameInput.current.value = user.username || "";
            this.emailInput.current.value = user.email;
        })
    }

    saveUser() {
        Client.post("/api/user/update", {
            id: this.state.id,
            firstName: this.firstNameInput.current.value,
            lastName: this.lastNameInput.current.value,
            username: this.usernameInput.current.value,
            email: this.emailInput.current.value,
            roles: this.createRoles(),
            enabled: this.state.enabled
        }).then(() => {
            toast.success("Сохранено");
        }).catch((e) => {
            toast.error(`Ошибка сохранения! Код: ${e.response.status}`);
        })
    }

    createRoles() {
        const roles = ["ROLE_USER"];

        if (this.state.admin) {
            roles.push("ROLE_ADMIN");
        }

        return roles;
    }

    toggleAdmin() {
        this.setState({admin: !this.state.admin});
    }

    toggleEnabled() {
        this.setState({enabled: !this.state.enabled});
    }

    render() {
        const body = <Card>
            <Card.Body>
                <Breadcrumb>
                    <LinkContainer exact to="/admin">
                        <Breadcrumb.Item>Главная</Breadcrumb.Item>
                    </LinkContainer>
                    <LinkContainer exactm to="/admin/users">
                        <Breadcrumb.Item>Пользователи</Breadcrumb.Item>
                    </LinkContainer>
                    <Breadcrumb.Item active>
                        {`Пользователь №${this.state.id}`}
                    </Breadcrumb.Item>
                </Breadcrumb>

                <Jumbotron>
                    <Form.Group>
                        <Form.Label><h4>Имя</h4></Form.Label>
                        <Form.Control ref={this.firstNameInput}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label><h4>Фамилия</h4></Form.Label>
                        <Form.Control ref={this.lastNameInput}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label><h4>Никнейм</h4></Form.Label>
                        <Form.Control ref={this.usernameInput}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label><h4>Почта</h4></Form.Label>
                        <Form.Control ref={this.emailInput}/>
                    </Form.Group>

                    <Form.Check type="checkbox" checked={this.state.admin}
                                onChange={this.toggleAdmin.bind(this)} label="Администратор"/>

                    <Form.Check type="checkbox" checked={this.state.enabled}
                                onChange={this.toggleEnabled.bind(this)} label="Активный"/>
                </Jumbotron>

                <Button onClick={this.saveUser.bind(this)} className="float-right" variant="success">Сохранить</Button>
            </Card.Body>
        </Card>;

        if (this.state.loaded) {
            return body;
        } else {
            return <Loader/>;
        }
    }
}

export default AdminUser;