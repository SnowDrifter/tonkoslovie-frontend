import React from "react";
import client from "../../util/client";
import {browserHistory, Link} from "react-router";
import {Cell, Column, Table} from "fixed-data-table-2";
import "fixed-data-table-2/dist/fixed-data-table.css";
import Loader from "../../component/Loader";
import RoleUtil from "../../util/RoleUtil";
import {Button, ButtonGroup, ButtonToolbar, Glyphicon, Panel} from "react-bootstrap";

const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
};

class AdminUsers extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            users: [],
            loaded: false
        };

    }

    componentDidMount() {
        this.updateUsers();
    }

    updateUsers() {
        client.get("/api/user/users")
            .then(response => {
                const users = response.data;
                this.setState({
                    users: users,
                    loaded: true
                })
            });
    }

    editUser(user) {
        browserHistory.push("/admin/user/" + user.id);
    }

    formatDate(time) {
        if (time != undefined) {
            const date = new Date(time);
            return date.toLocaleString("ru", dateOptions);
        } else {
            return "-"
        }
    }

    render() {
        let users = this.state.users;

        const body = <Panel>
            <Panel.Body>
                <h4><Link to="/admin">Главная</Link> / Пользователи</h4>

                <div style={{overflow: "auto"}}>
                    <Table
                        rowHeight={50}
                        rowsCount={users.length}
                        width={1100}
                        height={600}
                        headerHeight={30}>

                        <Column
                            header={<Cell>№</Cell>}
                            cell={({rowIndex}) => (
                                <Cell>{users[rowIndex].id}</Cell>
                            )}
                            fixed={true}
                            width={80}
                        />

                        <Column
                            header={<Cell>Никнейм</Cell>}
                            cell={({rowIndex}) => (
                                <Cell>
                                    {users[rowIndex].username || "-"}
                                </Cell>
                            )}
                            flexGrow={1}
                            width={70}
                        />

                        <Column
                            header={<Cell>Имя</Cell>}
                            cell={({rowIndex}) => (
                                <Cell>
                                    {users[rowIndex].firstName || "-"}
                                </Cell>
                            )}
                            flexGrow={1}
                            width={70}
                        />

                        <Column
                            header={<Cell>Фамилия</Cell>}
                            cell={({rowIndex}) => (
                                <Cell>
                                    {users[rowIndex].lastName || "-"}
                                </Cell>
                            )}
                            flexGrow={1}
                            width={70}
                        />

                        <Column
                            header={<Cell>Дата добавления</Cell>}
                            cell={({rowIndex}) => (
                                <Cell>
                                    {this.formatDate(users[rowIndex].creationDate)}
                                </Cell>
                            )}
                            flexGrow={1}
                            width={100}
                        />

                        <Column
                            header={<Cell>Администратор</Cell>}
                            cell={({rowIndex}) => (
                                <Cell>
                                    {RoleUtil.isAdmin(users[rowIndex].roles) ? "Да" : "Нет"}
                                </Cell>
                            )}
                            width={120}
                        />

                        <Column
                            header={<Cell>Активен</Cell>}
                            cell={({rowIndex}) => (
                                <Cell>
                                    {users[rowIndex].enabled ? "Да" : "Нет"}
                                </Cell>
                            )}
                            width={80}
                        />

                        <Column
                            cell={({rowIndex}) => (
                                <Cell>
                                    <ButtonToolbar>
                                        <ButtonGroup>
                                            <Button onClick={() => this.editUser(users[rowIndex])}
                                                    bsSize="small"><Glyphicon glyph="pencil"/>
                                            </Button>
                                        </ButtonGroup>
                                    </ButtonToolbar>
                                </Cell>
                            )}
                            width={50}
                        />
                    </Table>
                </div>
            </Panel.Body>
        </Panel>;

        if (this.state.loaded) {
            return body;
        } else {
            return <Loader/>;
        }
    }
}

export default AdminUsers;