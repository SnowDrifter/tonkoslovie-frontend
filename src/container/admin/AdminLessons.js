import React from "react";
import Client from "../../util/Client";
import {LinkContainer} from "react-router-bootstrap";
import {Cell, Column, Table} from "fixed-data-table-2";
import "fixed-data-table-2/dist/fixed-data-table.css";
import Loader from "../../component/Loader";
import {Breadcrumb, Button, ButtonGroup, ButtonToolbar, Card} from "react-bootstrap";
import {BsPencil, BsX} from "react-icons/bs";


class AdminLessons extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            lessons: [],
            loaded: false
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
                    loaded: true
                })
            });
    }

    deleteLesson(lessonId) {
        if (confirm("Удалить урок №" + lessonId + "?")) {
            Client.delete("/api/content/lesson", {
                params: {
                    id: lessonId
                }
            }).then(() => {
                this.updateLessons();
            });
        }
    }

    addNewLesson() {
        this.props.history.push("/admin/lesson")
    }

    editLesson(lesson) {
        this.props.history.push("/admin/lesson/" + lesson.id);
    }

    render() {
        let lessons = this.state.lessons;

        const body = <Card>
            <Card.Body>
                <Breadcrumb>
                    <LinkContainer exact to="/admin"><Breadcrumb.Item>Главная</Breadcrumb.Item></LinkContainer>
                    <Breadcrumb.Item active>Уроки</Breadcrumb.Item>
                </Breadcrumb>

                <div style={{overflow: "auto"}}>
                    <Table
                        rowHeight={50}
                        rowsCount={lessons.length}
                        width={1068}
                        height={600}
                        headerHeight={30}>

                        <Column
                            header={<Cell>№</Cell>}
                            cell={({rowIndex}) => (
                                <Cell>{lessons[rowIndex].id}</Cell>
                            )}
                            fixed={true}
                            width={80}
                        />

                        <Column
                            header={<Cell>Название</Cell>}
                            cell={({rowIndex}) => (
                                <Cell>
                                    {lessons[rowIndex].title}
                                </Cell>
                            )}
                            flexGrow={1}
                            width={100}
                        />

                        <Column
                            header={<Cell>Опубликован</Cell>}
                            cell={({rowIndex}) => (
                                <Cell>
                                    {lessons[rowIndex].published ? "Да" : "Нет"}
                                </Cell>
                            )}
                            width={100}
                        />

                        <Column
                            cell={({rowIndex}) => (
                                <Cell>
                                    <ButtonToolbar>
                                        <ButtonGroup>
                                            <Button size="small"
                                                    onClick={() => this.editLesson(lessons[rowIndex])}>
                                               <BsPencil/>
                                            </Button>
                                            <Button size="small" variant="danger" className="pull-right"
                                                    onClick={() => this.deleteLesson(lessons[rowIndex].id)}>
                                                <BsX/>
                                            </Button>
                                        </ButtonGroup>
                                    </ButtonToolbar>
                                </Cell>
                            )}
                            width={100}
                        />
                    </Table>
                </div>

                <br/>
                <Button onClick={this.addNewLesson.bind(this)}>Добавить новый урок</Button>
            </Card.Body>
        </Card>;

        if (this.state.loaded) {
            return body;
        } else {
            return <Loader/>;
        }
    }
}

export default AdminLessons;