import React from "react";
import Client from "/util/Client";
import {LinkContainer} from "react-router-bootstrap";
import {Cell, Column, Table} from "fixed-data-table-2";
import "fixed-data-table-2/dist/fixed-data-table.css";
import Loader from "/component/Loader";
import {Breadcrumb, Button, Card} from "react-bootstrap";
import EditRemoveButtons from "/component/button/EditRemoveButtons";
import {toast} from "react-toastify";
import PaginationContainer from "/component/PaginationContainer";


class AdminTexts extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            texts: [],
            currentPage: 0,
            maxPage: 0,
            loading: true
        };
    }

    componentDidMount() {
        this.updateTexts();
    }

    updateTexts() {
        Client.get("/api/content/texts", {
            params: {
                page: this.state.currentPage,
                sortField: "id",
                direction: "desc"
            }
        })
            .then(response => {
                this.setState({
                    loading: false,
                    texts: response.data.content,
                    currentPage: response.data.number,
                    maxPage: response.data.totalPages
                })
            })
            .catch(e => {
                this.setState({loading: false});
                toast.error(`Ошибка загрузки! Код: ${e.response.status}`);
            });
    }

    deleteText = (textId) => {
        if (confirm(`Удалить текст №${textId}?`)) {
            Client.delete("/api/content/text", {
                params: {
                    id: textId
                }
            })
                .then(this.updateTexts)
                .catch(e => toast.error(`Ошибка сохранения! Код: ${e.response.status}`));
        }
    }

    handleChangePage = (newPage) => this.setState({currentPage: newPage}, this.updateTexts)

    addNewText = () => this.props.navigate("/admin/text")

    editText = (textId) => this.props.navigate(`/admin/text/${textId}`)

    render() {
        if (this.state.loading) {
            return <Loader/>;
        }

        const {texts} = this.state;

        return <Card>
            <Card.Body>
                <Breadcrumb>
                    <LinkContainer to="/admin"><Breadcrumb.Item>Главная</Breadcrumb.Item></LinkContainer>
                    <Breadcrumb.Item active>Тексты</Breadcrumb.Item>
                </Breadcrumb>

                <Table rowHeight={45}
                       rowsCount={texts.length}
                       width={1262}
                       height={487}
                       headerHeight={35}>

                    <Column header={<Cell>№</Cell>}
                            cell={({rowIndex}) => <Cell>{texts[rowIndex].id}</Cell>}
                            width={80} fixed/>

                    <Column header={<Cell>Название</Cell>}
                            cell={({rowIndex}) => <Cell>{texts[rowIndex].title}</Cell>}
                            flexGrow={1}
                            width={100}/>

                    <Column cell={({rowIndex}) =>
                        <Cell>
                            <EditRemoveButtons edit={() => this.editText(texts[rowIndex].id)}
                                               remove={() => this.deleteText(texts[rowIndex].id)}/>
                        </Cell>}
                            width={100}/>
                </Table>

                <PaginationContainer style={{marginTop: "15px"}}
                                     currentPage={this.state.currentPage}
                                     maxPage={this.state.maxPage}
                                     handleChangePage={this.handleChangePage}/>

                <Button onClick={this.addNewText}>Добавить новый текст</Button>
            </Card.Body>
        </Card>;
    }
}

export default AdminTexts;