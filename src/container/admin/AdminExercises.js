import React from "react";
import Client from "../../util/Client";
import {browserHistory, Link} from "react-router";
import {Cell, Column, Table} from "fixed-data-table-2";
import Loader from "../../component/Loader";
import {Button, ButtonGroup, ButtonToolbar, Glyphicon, Panel} from "react-bootstrap";


class AdminExercises extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            exercises: [],
            loaded: false
        };

        this.deleteLExercise = this.deleteLExercise.bind(this);
        this.editExercise = this.editExercise.bind(this);
        this.updateExercises = this.updateExercises.bind(this);
    }

    componentDidMount() {
        this.updateExercises();
    }

    updateExercises() {
        Client.get("/api/content/exercises")
            .then(response => {
                const exercises = response.data;
                this.setState({
                    exercises: exercises,
                    loaded: true
                })
            });
    }

    deleteLExercise(exerciseId) {
        if (confirm("Удалить упражнение №" + exerciseId + "?")) {
            Client.delete("/api/content/exercise", {
                params: {
                    id: exerciseId
                }
            }).then(() => {
                this.updateExercises();
            });
        }
    }

    addNewExercise() {
        browserHistory.push("/admin/exercise")
    }

    editExercise(exercise) {
        browserHistory.push("/admin/exercise/" + exercise.id);
    }

    render() {
        let exercises = this.state.exercises;

        const body = <Panel>
            <Panel.Body>
                <ul className="breadcrumb" style={{width: 1100}}>
                    <li><Link to="/admin">Главная</Link></li>
                    <li>Упражнения</li>
                </ul>

                <div style={{overflow: "auto"}}>
                    <Table
                        rowHeight={50}
                        rowsCount={exercises.length}
                        width={900}
                        height={600}
                        headerHeight={30}>

                        <Column
                            header={<Cell>№</Cell>}
                            cell={({rowIndex}) => (
                                <Cell>{exercises[rowIndex].id}</Cell>
                            )}
                            fixed={true}
                            width={80}
                        />

                        <Column
                            header={<Cell>Заголовок</Cell>}
                            cell={({rowIndex}) => (
                                <Cell>
                                    {exercises[rowIndex].title}
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
                                            <Button bsSize="small"
                                                    onClick={() => this.editExercise(exercises[rowIndex])}>
                                                <Glyphicon glyph="pencil"/>
                                            </Button>
                                            <Button bsSize="small" bsStyle="danger" className="pull-right"
                                                    onClick={() => this.deleteLExercise(exercises[rowIndex].id)}>
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
                <Button onClick={this.addNewExercise.bind(this)}>Добавить новое упражнение</Button>
            </Panel.Body>
        </Panel>;

        if (this.state.loaded) {
            return body;
        } else {
            return <Loader/>;
        }
    }
}

export default AdminExercises;