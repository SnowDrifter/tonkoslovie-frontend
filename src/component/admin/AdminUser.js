import React from "react";
import ReactDOM from "react-dom";
import {
    Panel,
    FormGroup,
    ControlLabel,
    FormControl,
    Button,
    Jumbotron,
    Checkbox
} from "react-bootstrap";
import Loader from "../../component/Loader";
import {Link} from "react-router";
import client from "../../util/client";
import {toast} from "react-toastify";

class AdminUser extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: this.props.params.userId,
            roles: [],
            enabled: false,
            loaded: false
        };

        this.loadUser(this.props.params.userId);
    }

    loadUser(userId) {
        client.get("/api/user/", {
            params: {
                id: userId
            }
        }).then(response => {
            const user = response.data;

            this.setState({
                roles: user.roles,
                enabled: user.enabled,
                loaded: true
            });

            ReactDOM.findDOMNode(this.firstName).value = user.firstName;
            ReactDOM.findDOMNode(this.lastName).value = user.lastName;
            ReactDOM.findDOMNode(this.username).value = user.username;
            ReactDOM.findDOMNode(this.email).value = user.email;
        })
    }

    saveUser() {
        client.post("/api/user/update", {
            id: this.state.id,
            firstName: ReactDOM.findDOMNode(this.firstName).value,
            lastName: ReactDOM.findDOMNode(this.lastName).value,
            username: ReactDOM.findDOMNode(this.username).value,
            email: ReactDOM.findDOMNode(this.email).value,
            roles: this.state.roles,
            enabled: this.state.enabled
        }).then(() => {
            toast.success("Сохранено");
        })
    }

    toggleEnabled() {
        this.setState({enabled: !this.state.enabled});
    }

    render() {
        const body = <Panel>
            <h4><Link to="/admin">Главная</Link> / <Link to="/admin/users">Пользователи </Link>
                / {"Пользователь № " + (this.state.id)}</h4>
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

                <Checkbox checked={this.state.enabled} onChange={this.toggleEnabled.bind(this)}>
                    Активный
                </Checkbox>
            </Jumbotron>

            <Button onClick={this.saveUser.bind(this)} className="pull-right" bsStyle="success">Сохранить</Button>
        </Panel>;

        if (this.state.loaded) {
            return body;
        } else {
            return <Loader/>;
        }
    }
}


export default AdminUser;