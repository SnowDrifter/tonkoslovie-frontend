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


class AdminLessons extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            lessons: [],
            currentPage: 0,
            maxPage: 0,
            loading: true
        };
    }

    componentDidMount() {
        this.updateLessons();
    }

    updateLessons() {
        Client.get("/api/content/lessons", {
            params: {
                unpublished: true,
                page: this.state.currentPage,
                sortField: "id",
                direction: "desc"
            }
        })
            .then(response => {
                this.setState({
                    loading: false,
                    lessons: response.data.content,
                    currentPage: response.data.number,
                    maxPage: response.data.totalPages
                })
            })
            .catch(e => {
                this.setState({loading: false});
                toast.error(`Ошибка загрузки! Код: ${e.response.status}`);
            });
    }

    deleteLesson = (lessonId) => {
        if (confirm(`Удалить урок №${lessonId}?`)) {
            Client.delete("/api/content/lesson", {params: {id: lessonId}})
                .then(() => this.updateLessons())
                .catch(e => toast.error(`Ошибка удаления! Код: ${e.response.status}`));
        }
    }

    handleChangePage = (newPage) => this.setState({currentPage: newPage}, this.updateLessons)

    addNewLesson = () => this.props.navigate("/admin/lesson")

    editLesson = (lessonId) => this.props.navigate(`/admin/lesson/${lessonId}`)

    render() {
        if (this.state.loading) {
            return <Loader/>;
        }

        const {lessons} = this.state;

        return <Card>
            <Card.Body>
                <Breadcrumb>
                    <LinkContainer to="/admin"><Breadcrumb.Item>Главная</Breadcrumb.Item></LinkContainer>
                    <Breadcrumb.Item active>Уроки</Breadcrumb.Item>
                </Breadcrumb>

                <Table rowHeight={45}
                       rowsCount={lessons.length}
                       width={1262}
                       height={487}
                       headerHeight={35}>

                    <Column header={<Cell>№</Cell>}
                            cell={({rowIndex}) => <Cell>{lessons[rowIndex].id}</Cell>}
                            width={80} fixed/>

                    <Column header={<Cell>Название</Cell>}
                            cell={({rowIndex}) => <Cell>{lessons[rowIndex].title}</Cell>}
                            flexGrow={1}
                            width={100}/>

                    <Column header={<Cell>Опубликован</Cell>}
                            cell={({rowIndex}) => <Cell>{lessons[rowIndex].published ? "Да" : "Нет"}</Cell>}
                            width={115}/>

                    <Column cell={({rowIndex}) =>
                        <Cell>
                            <EditRemoveButtons edit={() => this.editLesson(lessons[rowIndex].id)}
                                               remove={() => this.deleteLesson(lessons[rowIndex].id)}/>
                        </Cell>}
                            width={100}/>
                </Table>

                <PaginationContainer style={{marginTop: "15px"}}
                                     currentPage={this.state.currentPage}
                                     maxPage={this.state.maxPage}
                                     handleChangePage={this.handleChangePage}/>

                <Button onClick={this.addNewLesson}>Добавить новый урок</Button>
            </Card.Body>
        </Card>;
    }
}

export default AdminLessons;