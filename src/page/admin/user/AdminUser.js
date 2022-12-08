import React from "react";
import {Breadcrumb, Button, Form, Card} from "react-bootstrap";
import Loader from "/component/Loader";
import {LinkContainer} from "react-router-bootstrap";
import Client from "/util/Client";
import {toast} from "react-toastify";
import RoleUtil from "/util/RoleUtil";

class AdminUser extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: {},
            admin: false,
            loading: true
        };
    }

    componentDidMount() {
        this.loadUser(this.props.params.userId);
    }

    loadUser(userId) {
        Client.get("/api/user/", {params: {id: userId}})
            .then(response => {
                this.setState({
                    user: response.data,
                    admin: RoleUtil.isAdmin(response.data.roles),
                    loading: false
                });
            })
    }

    saveUser = () => {
        Client.post("/api/user/update", {
            ...this.state.user,
            roles: this.createRoles()
        })
            .then(() => toast.success("Сохранено"))
            .catch(e => toast.error(`Ошибка сохранения! Код: ${e.response.status}`))
    }

    createRoles() {
        const roles = ["ROLE_USER"];

        if (this.state.admin) {
            roles.push("ROLE_ADMIN");
        }

        return roles;
    }

    setAdmin = (value) => this.setState({admin: value});

    updateUser = (field, value) => this.setState({user: {...this.state.user, [field]: value}});

    render() {
        if (this.state.loading) {
            return <Loader/>;
        }

        const {user} = this.state;

        return <Card>
            <Card.Body>
                <Breadcrumb>
                    <LinkContainer to="/admin"><Breadcrumb.Item>Главная</Breadcrumb.Item></LinkContainer>
                    <LinkContainer to="/admin/users"><Breadcrumb.Item>Пользователи</Breadcrumb.Item></LinkContainer>
                    <Breadcrumb.Item active>{`Пользователь №${user.id}`}</Breadcrumb.Item>
                </Breadcrumb>

                <Card className="jumbotron">
                    <h4>Имя</h4>
                    <Form.Control defaultValue={user.firstName}
                                  onChange={e => this.updateUser("firstName", e.target.value)}/>

                    <h4 className="mt-3">Фамилия</h4>
                    <Form.Control defaultValue={user.lastName}
                                  onChange={e => this.updateUser("lastName", e.target.value)}/>

                    <h4 className="mt-3">Никнейм</h4>
                    <Form.Control defaultValue={user.username}
                                  onChange={e => this.updateUser("username", e.target.value)}/>

                    <h4 className="mt-3">Почта</h4>
                    <Form.Control defaultValue={user.email}
                                  onChange={e => this.updateUser("email", e.target.value)}/>

                    <Form.Check className="mt-3" label="Администратор" type="checkbox" checked={RoleUtil.isAdmin(user.roles)}
                                onChange={e => this.setAdmin(e.target.checked)}/>

                    <Form.Check label="Активный" type="checkbox" checked={user.enabled}
                                onChange={e => this.updateUser("enabled", e.target.checked)}/>
                </Card>

                <Button onClick={this.saveUser} className="float-end" variant="success">Сохранить</Button>
            </Card.Body>
        </Card>;
    }
}

export default AdminUser;