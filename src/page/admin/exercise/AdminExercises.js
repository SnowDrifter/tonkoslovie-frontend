import React from "react";
import Client from "/util/Client";
import {LinkContainer} from "react-router-bootstrap";
import {Cell, Column, Table} from "fixed-data-table-2";
import Loader from "/component/Loader";
import {Breadcrumb, Button, Card} from "react-bootstrap";
import EditRemoveButtons from "/component/button/EditRemoveButtons";
import {toast} from "react-toastify";


class AdminExercises extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            exercises: [],
            loading: true
        };

        this.deleteExercise = this.deleteExercise.bind(this);
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
                    loading: false
                })
            });
    }

    deleteExercise(exerciseId) {
        if (confirm(`Удалить упражнение №${exerciseId}?`)) {
            Client.delete("/api/content/exercise", {
                params: {
                    id: exerciseId
                }
            }).then(() => {
                this.updateExercises();
            }).catch((e) => {
                toast.error(`Ошибка удаления! Код: ${e.response.status}`);
            });
        }
    }

    addNewExercise() {
        this.props.history.push("/admin/exercise")
    }

    editExercise(exercise) {
        this.props.history.push(`/admin/exercise/${exercise.id}`);
    }

    render() {
        if (this.state.loading) {
            return <Loader/>;
        }

        const exercises = this.state.exercises;

        return <Card>
            <Card.Body>
                <Breadcrumb>
                    <LinkContainer exact to="/admin"><Breadcrumb.Item>Главная</Breadcrumb.Item></LinkContainer>
                    <Breadcrumb.Item active>Упражнения</Breadcrumb.Item>
                </Breadcrumb>

                <Table rowHeight={45}
                       rowsCount={exercises.length}
                       width={1068}
                       height={600}
                       headerHeight={35}>

                    <Column header={<Cell>№</Cell>}
                            cell={({rowIndex}) => <Cell>{exercises[rowIndex].id}</Cell>}
                            fixed={true}
                            width={80}/>

                    <Column header={<Cell>Заголовок</Cell>}
                            cell={({rowIndex}) => <Cell>{exercises[rowIndex].title}</Cell>}
                            flexGrow={1}
                            width={100}/>

                    <Column cell={({rowIndex}) =>
                        <Cell>
                            <EditRemoveButtons edit={() => this.editExercise(exercises[rowIndex])}
                                               remove={() => this.deleteExercise(exercises[rowIndex].id)}/>
                        </Cell>}
                            width={100}/>
                </Table>

                <br/>
                <Button onClick={this.addNewExercise.bind(this)}>Добавить новое упражнение</Button>
            </Card.Body>
        </Card>;
    }
}

export default AdminExercises;