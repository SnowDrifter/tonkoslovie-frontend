import React from "react";
import client from "../../util/client";
import {browserHistory} from 'react-router'
import {Table, Column, Cell} from "fixed-data-table-2";
import {
    Button,
    Glyphicon,
    ButtonGroup,
    ButtonToolbar
} from "react-bootstrap";


class AdminExercises extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            exercises: []
        };

        this.deleteLExercise = this.deleteLExercise.bind(this);
        this.editExercise = this.editExercise.bind(this);
        this.updateExercises = this.updateExercises.bind(this);
    }

    componentDidMount() {
        this.updateExercises();
    }

    updateExercises() {
        client.get('/api/content/exercises')
            .then(response => {
                const exercises = response.data;
                this.setState({exercises: exercises})
            });
    }

    deleteLExercise(exerciseId) {
        if (confirm("Удалить упражнение №" + exerciseId + "?")) {
            client.delete('/api/content/exercise', {
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


        return (<div>
                <Table
                    rowHeight={50}
                    rowsCount={exercises.length}
                    width={1140}
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
                        header={<Cell>Оригинал</Cell>}
                        cell={({rowIndex}) => (
                            <Cell>
                                {exercises[rowIndex].original.replace(/<\/?[^>]+(>|$)/g, "").replace("&nbsp;", " ")}
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
                                        <Button onClick={() => this.editExercise(exercises[rowIndex])} bsSize="small"><Glyphicon glyph="pencil"/></Button>
                                        <Button bsSize="small" onClick={() => this.deleteLExercise(exercises[rowIndex].id)} className="pull-right" bsStyle="danger"> <Glyphicon glyph="remove"/></Button>
                                    </ButtonGroup>
                                </ButtonToolbar>
                            </Cell>
                        )}
                        width={100}
                    />
                </Table>
                <br/>
                <Button onClick={this.addNewExercise.bind(this)}>Добавить новое упражнение</Button>

            </div>
        );
    }
}

export default AdminExercises;