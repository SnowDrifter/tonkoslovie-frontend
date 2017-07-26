import React from "react";
import client from "../../util/client";
import {browserHistory} from 'react-router'
import {Table, Column, Cell} from "fixed-data-table-2";
import "fixed-data-table-2/dist/fixed-data-table.css";
import {
    Panel,
    FormGroup,
    Row,
    Col,
    ControlLabel,
    FormControl,
    Button,
    Modal,
    Form,
    Glyphicon,
    ButtonGroup,
    ButtonToolbar
} from "react-bootstrap";


class Lessons extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            lessons: []
        };

        this.deleteLesson = this.deleteLesson.bind(this);
        this.editLesson = this.editLesson.bind(this);
        this.updateLessons = this.updateLessons.bind(this);
    }

    componentDidMount(){
        this.updateLessons();
    }

    updateLessons() {
        client.get('/api/content/lessons')
            .then(response => {
                const lessons = response.data;
                this.setState({lessons: lessons})
            });
    }

    deleteLesson(lessonId) {
        if(confirm("Удалить урок №" + lessonId + "?")) {
            client.delete('/api/content/lesson', {
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

        return (
            <div>
                <Table
                    rowHeight={50}
                    rowsCount={lessons.length}
                    width={1140}
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
                        cell={({rowIndex}) => (
                            <Cell>
                                <ButtonToolbar>
                                    <ButtonGroup>
                                        <Button onClick={() => this.editLesson(lessons[rowIndex])} bsSize="small"><Glyphicon glyph="pencil"/></Button>
                                        <Button bsSize="small" onClick={() => this.deleteLesson(lessons[rowIndex].id)} className="pull-right" bsStyle="danger"> <Glyphicon glyph="remove"/></Button>
                                    </ButtonGroup>
                                </ButtonToolbar>
                            </Cell>
                        )}
                        width={100}
                    />
                </Table>
                <br/>
                <Button onClick={this.addNewLesson.bind(this)}>Добавить новый урок</Button>

            </div>
        );
    }
}

export default Lessons