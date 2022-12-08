import React from "react";
import Client from "/util/Client";
import {LinkContainer} from "react-router-bootstrap";
import {Cell, Column, Table} from "fixed-data-table-2";
import Loader from "/component/Loader";
import {Breadcrumb, Button, Card} from "react-bootstrap";
import {toast} from "react-toastify";
import PaginationContainer from "/component/PaginationContainer";
import AdminAudit from "/page/admin/audit/AdminAudit";
import AdminAuditFilter from "./AdminAuditFilter";
import {CREATE, UPDATE, DELETE, READ} from "/constant/AuditOperation";


const auditTableNames = new Map([
    ["exercise", "Упражнение"],
    ["lesson", "Урок"],
    ["text", "Текст"],
    ["theme", "Тема"],
    ["word", "Слово"]
])

class AdminAudits extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            audits: [],
            currentPage: 0,
            maxPage: 0,
            searchParameters: {},
            loading: true,
            showModal: false,
            currentAudit: {}
        };
    }

    componentDidMount() {
        this.updateAudits();
    }

    updateAudits() {
        Client.get("/api/audits", {
            params: {
                page: this.state.currentPage,
                ...this.state.searchParameters
            }
        })
            .then(response => {
                this.setState({
                    loading: false,
                    audits: response.data.content,
                    currentPage: response.data.number,
                    maxPage: response.data.totalPages
                })
            })
            .catch(e => {
                this.setState({loading: false});
                toast.error(`Ошибка загрузки! Код: ${e.response.status}`);
            });
    }

    handleChangePage = (newPage) => this.setState({currentPage: newPage}, this.updateAudits)

    applyFilters = (searchParameters) => {
        this.setState({searchParameters: searchParameters, currentPage: 0}, this.updateAudits)
    }

    showAuditModal = (index) => this.setState({showModal: true, currentAudit: this.state.audits[index]})

    hideModal = () => this.setState({showModal: false, currentAudit: {}})

    formatDate = (rawDate) => {
        const timeMillis = Date.parse(rawDate);
        return new Date(timeMillis).toLocaleString()
    }

    createOperationElement = (operation) => {
        switch (operation) {
            case CREATE:
                return <span className="text-success">Создание</span>
            case UPDATE:
                return <span>Обновление</span>
            case DELETE:
                return <span className="text-danger">Удаление</span>
            case READ:
                return <span className="text-primary">Восстановление</span>
        }
    }

    getTableTitle = (table) => auditTableNames.get(table) || table;

    render() {
        if (this.state.loading) {
            return <Loader/>;
        }

        const {audits} = this.state;

        return <Card>
            <Card.Body>
                <Breadcrumb>
                    <LinkContainer to="/admin"><Breadcrumb.Item>Главная</Breadcrumb.Item></LinkContainer>
                    <Breadcrumb.Item active>Аудит</Breadcrumb.Item>
                </Breadcrumb>

                <AdminAuditFilter applyFilters={this.applyFilters}/>

                <Table rowHeight={45}
                       rowsCount={audits.length}
                       width={1262}
                       height={487}
                       headerHeight={35}>

                    <Column header={<Cell style={{backgroundColor: "#f0f0f0"}}>ID</Cell>}
                            cell={({rowIndex}) => <Cell>{audits[rowIndex].entityId}</Cell>}
                            width={60} fixed/>

                    <Column header={<Cell style={{backgroundColor: "#f0f0f0"}}>Таблица</Cell>}
                            cell={({rowIndex}) => <Cell>{this.getTableTitle(audits[rowIndex].table)}</Cell>}
                            flexGrow={1}
                            width={100}/>

                    <Column header={<Cell style={{backgroundColor: "#f0f0f0"}}>Операция</Cell>}
                            cell={({rowIndex}) =>
                                <Cell>{this.createOperationElement(audits[rowIndex].operation)}</Cell>}
                            flexGrow={1}
                            width={100}/>

                    <Column header={<Cell style={{backgroundColor: "#f0f0f0"}}>Время</Cell>}
                            cell={({rowIndex}) => <Cell>{this.formatDate(audits[rowIndex].createdAt)}</Cell>}
                            flexGrow={1}
                            width={100}/>

                    <Column header={<Cell style={{backgroundColor: "#f0f0f0"}}></Cell>}
                            cell={({rowIndex}) => <Cell>
                                <Button variant="light" onClick={() => this.showAuditModal(rowIndex)}>Подробнее</Button>
                            </Cell>}
                            width={150}/>
                </Table>

                <PaginationContainer style={{marginTop: "15px"}}
                                     currentPage={this.state.currentPage}
                                     maxPage={this.state.maxPage}
                                     handleChangePage={this.handleChangePage}/>

                <AdminAudit showModal={this.state.showModal}
                            hideModal={this.hideModal}
                            audit={this.state.currentAudit}/>
            </Card.Body>
        </Card>;
    }
}

export default AdminAudits;