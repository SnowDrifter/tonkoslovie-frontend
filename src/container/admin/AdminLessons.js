import React from "react";
import Client from "../../util/Client";
import {browserHistory, Link} from "react-router";
import {Cell, Column, Table} from "fixed-data-table-2";
import "fixed-data-table-2/dist/fixed-data-table.css";
import Loader from "../../component/Loader";
import {Button, ButtonGroup, ButtonToolbar, Glyphicon, Panel} from "react-bootstrap";


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
        browserHistory.push("/admin/lesson")
    }

    editLesson(lesson) {
        browserHistory.push("/admin/lesson/" + lesson.id);
    }

    render() {
        let lessons = this.state.lessons;

        const body = <Panel>
            <Panel.Body>
                <ul className="breadcrumb" style={{width: 1100}}>
                    <li><Link to="/admin">Главная</Link></li>
                    <li>Уроки</li>
                </ul>

                <div style={{overflow: "auto"}}>
                    <Table
                        rowHeight={50}
                        rowsCount={lessons.length}
                        width={1100}
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
                            width={120}
                        />

                        <Column
                            cell={({rowIndex}) => (
                                <Cell>
                                    <ButtonToolbar>
                                        <ButtonGroup>
                                            <Button bsSize="small"
                                                    onClick={() => this.editLesson(lessons[rowIndex])}>
                                                <Glyphicon glyph="pencil"/>
                                            </Button>
                                            <Button bsSize="small" bsStyle="danger" className="pull-right"
                                                    onClick={() => this.deleteLesson(lessons[rowIndex].id)}>
                                                <Glyphicon glyph="remove"/>
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
            </Panel.Body>
        </Panel>;

        if (this.state.loaded) {
            return body;
        } else {
            return <Loader/>;
        }
    }
}

export default AdminLessons;