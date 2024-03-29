import React from "react";
import Client from "/util/Client";
import {LinkContainer} from "react-router-bootstrap";
import {Cell, Column, Table} from "fixed-data-table-2";
import "fixed-data-table-2/dist/fixed-data-table.css";
import Loader from "/component/Loader";
import RoleUtil from "/util/RoleUtil";
import {Breadcrumb, Card} from "react-bootstrap";
import EditButton from "/component/button/EditButton"
import PaginationContainer from "/component/PaginationContainer"
import AdminUserFilter from "/page/admin/user/AdminUserFilter"
import {toast} from "react-toastify";


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
            currentPage: 0,
            maxPage: 0,
            searchParameters: [],
            loading: true
        };
    }

    componentDidMount() {
        this.updateUsers();
    }

    updateUsers() {
        Client.get("/api/user/users", {
            params: {
                page: this.state.currentPage,
                search: this.createSearchQuery()
            }
        })
            .then(response => {
                this.setState({
                    loading: false,
                    users: response.data.content,
                    currentPage: response.data.number,
                    maxPage: response.data.totalPages
                })
            })
            .catch(e => {
                this.setState({loading: false});
                toast.error(`Ошибка загрузки! Код: ${e.response.status}`);
            })
    }

    applyFilters = (searchParameters) => {
        this.setState({searchParameters: searchParameters, currentPage: 0}, this.updateUsers);
    }

    createSearchQuery = () => {
        return this.state.searchParameters
            .map(p => `${p.field}${p.operation}${p.value}`)
            .join(";")
    }

    handleChangePage = (newPage) => this.setState({currentPage: newPage}, this.updateUsers)

    editUser = (userId) => this.props.navigate(`/admin/user/${userId}`);

    formatDate = (time) => time ? new Date(time).toLocaleString("ru", dateOptions) : "-";

    render() {
        if (this.state.loading) {
            return <Loader/>;
        }

        const {users} = this.state;

        return <Card>
            <Card.Body>
                <Breadcrumb>
                    <LinkContainer to="/admin"><Breadcrumb.Item>Главная</Breadcrumb.Item></LinkContainer>
                    <Breadcrumb.Item active>Пользователи</Breadcrumb.Item>
                </Breadcrumb>

                <AdminUserFilter applyFilters={this.applyFilters}/>

                <Table rowHeight={45}
                       rowsCount={users.length}
                       width={1262}
                       height={600}
                       headerHeight={35}>

                    <Column header={<Cell>№</Cell>}
                            cell={({rowIndex}) => <Cell>{users[rowIndex].id}</Cell>}
                            width={80} fixed/>

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
                            width={130}/>

                    <Column header={<Cell>Активен</Cell>}
                            cell={({rowIndex}) => <Cell>{users[rowIndex].enabled ? "Да" : "Нет"}</Cell>}
                            width={80}/>

                    <Column width={50} cell={({rowIndex}) =>
                        <Cell>
                            <EditButton action={() => this.editUser(users[rowIndex].id)}/>
                        </Cell>}/>
                </Table>

                <PaginationContainer style={{marginTop: "15px"}}
                                     currentPage={this.state.currentPage}
                                     maxPage={this.state.maxPage}
                                     handleChangePage={this.handleChangePage}/>
            </Card.Body>
        </Card>;
    }
}

export default AdminUsers;