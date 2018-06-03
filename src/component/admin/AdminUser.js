import React from "react";
import ReactDOM from "react-dom";
import {Button, Checkbox, ControlLabel, FormControl, FormGroup, Jumbotron, Panel} from "react-bootstrap";
import Loader from "../../component/Loader";
import {Link} from "react-router";
import Client from "../../util/Client";
import {toast} from "react-toastify";
import RoleUtil from "../../util/RoleUtil";

class AdminUser extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: this.props.params.userId,
            enabled: false,
            admin: false,
            loaded: false
        };

        this.loadUser(this.props.params.userId);
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

            ReactDOM.findDOMNode(this.firstName).value = user.firstName || "";
            ReactDOM.findDOMNode(this.lastName).value = user.lastName || "";
            ReactDOM.findDOMNode(this.username).value = user.username || "";
            ReactDOM.findDOMNode(this.email).value = user.email;
        })
    }

    saveUser() {
        Client.post("/api/user/update", {
            id: this.state.id,
            firstName: ReactDOM.findDOMNode(this.firstName).value,
            lastName: ReactDOM.findDOMNode(this.lastName).value,
            username: ReactDOM.findDOMNode(this.username).value,
            email: ReactDOM.findDOMNode(this.email).value,
            roles: this.createRoles(),
            enabled: this.state.enabled
        }).then(() => {
            toast.success("Сохранено");
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
        const body = <Panel>
            <Panel.Body>
                <ul className="breadcrumb">
                    <li><Link to="/admin">Главная</Link></li>
                    <li><Link to="/admin/users">Пользователи</Link></li>
                    <li>{"Пользователь № " + (this.state.id)}</li>
                </ul>

                <Jumbotron>
                    <FormGroup>
                        <ControlLabel><h4>Имя</h4></ControlLabel>
                        <FormControl
                            inputRef={firstName => {
                                this.firstName = firstName
                            }}
                        />
                    </FormGroup>

                    <FormGroup>
                        <ControlLabel><h4>Фамилия</h4></ControlLabel>
                        <FormControl
                            inputRef={lastName => {
                                this.lastName = lastName
                            }}
                        />
                    </FormGroup>

                    <FormGroup>
                        <ControlLabel><h4>Никнейм</h4></ControlLabel>
                        <FormControl
                            inputRef={username => {
                                this.username = username
                            }}
                        />
                    </FormGroup>

                    <FormGroup>
                        <ControlLabel><h4>Почта</h4></ControlLabel>
                        <FormControl
                            inputRef={email => {
                                this.email = email
                            }}
                        />
                    </FormGroup>

                    <Checkbox checked={this.state.admin} onChange={this.toggleAdmin.bind(this)}>
                        Администратор
                    </Checkbox>

                    <Checkbox checked={this.state.enabled} onChange={this.toggleEnabled.bind(this)}>
                        Активный
                    </Checkbox>
                </Jumbotron>

                <Button onClick={this.saveUser.bind(this)} className="pull-right" bsStyle="success">Сохранить</Button>
            </Panel.Body>
        </Panel>;

        if (this.state.loaded) {
            return body;
        } else {
            return <Loader/>;
        }
    }
}


export default AdminUser;
