import React from "react";
import Client from "/util/Client";
import {LinkContainer} from "react-router-bootstrap";
import {Cell, Column, Table} from "fixed-data-table-2";
import "fixed-data-table-2/dist/fixed-data-table.css";
import Loader from "/component/Loader";
import {Breadcrumb, Button, Card} from "react-bootstrap";
import EditRemoveButtons from "/component/button/EditRemoveButtons";
import {toast} from "react-toastify";


class AdminLessons extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            lessons: [],
            loading: true
        };

        this.deleteLesson = this.deleteLesson.bind(this);
        this.editLesson = this.editLesson.bind(this);
        this.updateLessons = this.updateLessons.bind(this);
    }

    componentDidMount() {
        this.updateLessons();
    }

    updateLessons() {
        Client.get("/api/content/lessons?unpublished=true")
            .then(response => {
                const lessons = response.data;
                this.setState({
                    lessons: lessons,
                    loading: false
                })
            });
    }

    deleteLesson(lessonId) {
        if (confirm(`Удалить урок №${lessonId}?`)) {
            Client.delete("/api/content/lesson", {
                params: {
                    id: lessonId
                }
            }).then(() => {
                this.updateLessons();
            }).catch((e) => {
                toast.error(`Ошибка удаления! Код: ${e.response.status}`);
            });
        }
    }

    addNewLesson() {
        this.props.history.push("/admin/lesson")
    }

    editLesson(lesson) {
        this.props.history.push(`/admin/lesson/${lesson.id}`);
    }

    render() {
        if (this.state.loading) {
            return <Loader/>;
        }

        const lessons = this.state.lessons;

        return <Card>
            <Card.Body>
                <Breadcrumb>
                    <LinkContainer exact to="/admin"><Breadcrumb.Item>Главная</Breadcrumb.Item></LinkContainer>
                    <Breadcrumb.Item active>Уроки</Breadcrumb.Item>
                </Breadcrumb>

                <Table rowHeight={45}
                       rowsCount={lessons.length}
                       width={1068}
                       height={600}
                       headerHeight={35}>

                    <Column header={<Cell>№</Cell>}
                            cell={({rowIndex}) => <Cell>{lessons[rowIndex].id}</Cell>}
                            fixed={true}
                            width={80}/>

                    <Column header={<Cell>Название</Cell>}
                            cell={({rowIndex}) => <Cell>{lessons[rowIndex].title}</Cell>}
                            flexGrow={1}
                            width={100}/>

                    <Column header={<Cell>Опубликован</Cell>}
                            cell={({rowIndex}) => <Cell>{lessons[rowIndex].published ? "Да" : "Нет"}</Cell>}
                            width={100}/>

                    <Column cell={({rowIndex}) =>
                        <Cell>
                            <EditRemoveButtons edit={() => this.editLesson(lessons[rowIndex])}
                                               remove={() => this.deleteLesson(lessons[rowIndex].id)}/>
                        </Cell>}
                            width={100}/>
                </Table>

                <br/>
                <Button onClick={this.addNewLesson.bind(this)}>Добавить новый урок</Button>
            </Card.Body>
        </Card>;
    }
}

export default AdminLessons;