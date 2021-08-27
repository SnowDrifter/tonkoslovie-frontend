import React from "react";
import Client from "/util/Client";
import {LinkContainer} from "react-router-bootstrap";
import {Cell, Column, Table} from "fixed-data-table-2";
import "fixed-data-table-2/dist/fixed-data-table.css";
import Loader from "/component/Loader";
import RoleUtil from "/util/RoleUtil";
import {Breadcrumb, Card} from "react-bootstrap";
import EditButton from "/component/button/EditButton"


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
            loading: true
        };
    }

    componentDidMount() {
        this.updateUsers();
    }

    updateUsers() {
        Client.get("/api/user/users")
            .then(response => {
                const users = response.data;
                this.setState({
                    users: users,
                    loading: false
                })
            });
    }

    editUser(user) {
        this.props.history.push(`/admin/user/${user.id}`);
    }

    formatDate(time) {
        return time ? new Date(time).toLocaleString("ru", dateOptions) : "-";
    }

    render() {
        if (this.state.loading) {
            return <Loader/>;
        }

        const users = this.state.users;

        return <Card>
            <Card.Body>
                <Breadcrumb>
                    <LinkContainer exact to="/admin"><Breadcrumb.Item>Главная</Breadcrumb.Item></LinkContainer>
                    <Breadcrumb.Item active>Пользователи</Breadcrumb.Item>
                </Breadcrumb>

                <Table rowHeight={45}
                       rowsCount={users.length}
                       width={1068}
                       height={600}
                       headerHeight={35}>

                    <Column header={<Cell>№</Cell>}
                            cell={({rowIndex}) => <Cell>{users[rowIndex].id}</Cell>}
                            fixed={true}
                            width={80}/>

                    <Column header={<Cell>Никнейм</Cell>}
                            cell={({rowIndex}) => <Cell>{users[rowIndex].username || "-"}</Cell>}
                            flexGrow={1}
                            width={70}/>

                    <Column header={<Cell>Имя</Cell>}
                            cell={({rowIndex}) => <Cell>{users[rowIndex].firstName || "-"}</Cell>}
                            flexGrow={1}
                            width={70}/>

                    <Column header={<Cell>Фамилия</Cell>}
                            cell={({rowIndex}) => <Cell>{users[rowIndex].lastName || "-"}</Cell>}
                            flexGrow={1}
                            width={70}/>

                    <Column header={<Cell>Дата добавления</Cell>}
                            cell={({rowIndex}) => <Cell>{this.formatDate(users[rowIndex].creationDate)}</Cell>}
                            flexGrow={1}
                            width={100}/>

                    <Column header={<Cell>Администратор</Cell>}
                            cell={({rowIndex}) => <Cell>{RoleUtil.isAdmin(users[rowIndex].roles) ? "Да" : "Нет"}</Cell>}
                            width={120}/>

                    <Column header={<Cell>Активен</Cell>}
                            cell={({rowIndex}) => <Cell>{users[rowIndex].enabled ? "Да" : "Нет"}</Cell>}
                            width={80}/>

                    <Column cell={({rowIndex}) =>
                        <Cell>
                            <EditButton action={() => this.editUser(users[rowIndex])}/>
                        </Cell>}
                            width={50}/>
                </Table>
            </Card.Body>
        </Card>;
    }
}

export default AdminUsers;