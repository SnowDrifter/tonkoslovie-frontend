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


class AdminThemes extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            themes: [],
            currentPage: 0,
            maxPage: 0,
            loading: true
        };
    }

    componentDidMount() {
        this.updateThemes();
    }

    updateThemes() {
        Client.get("/api/content/themes", {
            params: {
                page: this.state.currentPage,
                sortField: "id",
                direction: "desc",
                unpublished: true
            }
        })
            .then(response => {
                this.setState({
                    loading: false,
                    themes: response.data.content,
                    currentPage: response.data.number,
                    maxPage: response.data.totalPages
                })
            })
            .catch(e => {
                this.setState({loading: false});
                toast.error(`Ошибка загрузки! Код: ${e.response.status}`);
            });
    }

    deleteTheme = (themeId) => {
        if (confirm(`Удалить тему №${themeId}?`)) {
            Client.delete("/api/content/theme", {params: {id: themeId}})
                .then(() => this.updateThemes())
                .catch(e => toast.error(`Ошибка удаления! Код: ${e.response.status}`));
        }
    }

    handleChangePage = (newPage) => this.setState({currentPage: newPage}, this.updateThemes)

    addNewTheme = () => this.props.navigate("/admin/theme")

    editTheme = (themeId) => this.props.navigate(`/admin/theme/${themeId}`);

    render() {
        if (this.state.loading) {
            return <Loader/>;
        }

        const themes = this.state.themes;

        return <Card>
            <Card.Body>
                <Breadcrumb>
                    <LinkContainer to="/admin"><Breadcrumb.Item>Главная</Breadcrumb.Item></LinkContainer>
                    <Breadcrumb.Item active>Темы упражнений</Breadcrumb.Item>
                </Breadcrumb>

                <Table rowHeight={45}
                       rowsCount={themes.length}
                       width={1262}
                       height={487}
                       headerHeight={35}>

                    <Column header={<Cell>№</Cell>}
                            cell={({rowIndex}) => <Cell>{themes[rowIndex].id}</Cell>}
                            width={80} fixed/>

                    <Column header={<Cell>Название</Cell>}
                            cell={({rowIndex}) => <Cell>{themes[rowIndex].title}</Cell>}
                            flexGrow={1}
                            width={100}/>

                    <Column width={100} cell={({rowIndex}) =>
                        <Cell>
                            <EditRemoveButtons edit={() => this.editTheme(themes[rowIndex].id)}
                                               remove={() => this.deleteTheme(themes[rowIndex].id)}/>
                        </Cell>}/>
                </Table>

                <PaginationContainer style={{marginTop: "15px"}}
                                     currentPage={this.state.currentPage}
                                     maxPage={this.state.maxPage}
                                     handleChangePage={this.handleChangePage}/>

                <Button onClick={this.addNewTheme}>Добавить новую тему</Button>
            </Card.Body>
        </Card>;
    }
}

export default AdminThemes;