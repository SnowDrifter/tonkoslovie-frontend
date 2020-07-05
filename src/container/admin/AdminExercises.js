import React from "react";
import Client from "../../util/Client";
import {LinkContainer} from "react-router-bootstrap";
import {Cell, Column, Table} from "fixed-data-table-2";
import Loader from "../../component/Loader";
import {Breadcrumb, Button, ButtonGroup, ButtonToolbar, Card} from "react-bootstrap";
import {BsPencil, BsX} from "react-icons/bs";


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
        this.props.history.push("/admin/exercise")
    }

    editExercise(exercise) {
        this.props.history.push("/admin/exercise/" + exercise.id);
    }

    render() {
        let exercises = this.state.exercises;

        const body = <Card>
            <Card.Body>
                <Breadcrumb>
                    <LinkContainer exact to="/admin"><Breadcrumb.Item>Главная</Breadcrumb.Item></LinkContainer>
                    <Breadcrumb.Item active>Упражнения</Breadcrumb.Item>
                </Breadcrumb>

                <div style={{overflow: "auto"}}>
                    <Table
                        rowHeight={50}
                        rowsCount={exercises.length}
                        width={1068}
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
                                            <Button size="small" variant="secondary"
                                                    onClick={() => this.editExercise(exercises[rowIndex])}>
                                                <BsPencil/>
                                            </Button>
                                            <Button size="small" variant="danger" className="pull-right"
                                                    onClick={() => this.deleteLExercise(exercises[rowIndex].id)}>
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
                <Button onClick={this.addNewExercise.bind(this)}>Добавить новое упражнение</Button>
            </Card.Body>
        </Card>;

        if (this.state.loaded) {
            return body;
        } else {
            return <Loader/>;
        }
    }
}

export default AdminExercises;