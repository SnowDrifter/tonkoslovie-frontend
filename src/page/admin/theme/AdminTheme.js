import React, {createRef} from "react";
import {withRouter} from "react-router-dom";
import {LinkContainer} from "react-router-bootstrap";
import {Breadcrumb, Button, Card, Form, Jumbotron, ListGroup, ListGroupItem} from "react-bootstrap";
import Loader from "/component/Loader";
import Client from "/util/Client";
import {toast} from "react-toastify";
import RemoveButton from "/component/button/RemoveButton";

class AdminTheme extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: null,
            published: false,
            exercises: [],
            foundExercises: [],
            loaded: !props.computedMatch.params.themeId,
            themeId: props.computedMatch.params.themeId,
            exerciseTitle: null
        };

        if (this.state.themeId) {
            this.loadTheme(this.state.themeId)
        }

        this.titleInput = createRef();
        this.exerciseTitleInput = createRef();

        this.removeExercise = this.removeExercise.bind(this);
        this.addExercise = this.addExercise.bind(this);
        this.handExerciseChange = this.handExerciseChange.bind(this);
    }

    loadTheme(themeId) {
        Client.get("/api/content/theme", {
            params: {
                id: themeId
            }
        }).then(response => {
            const theme = response.data;

            this.setState({
                id: theme.id,
                exercises: theme.exercises,
                published: theme.published,
                loaded: true
            });

            this.titleInput.current.value = theme.title;
        })
    }

    saveTheme() {
        Client.post("/api/content/theme", {
            id: this.state.id,
            title: this.titleInput.current.value,
            published: this.state.published,
            exercises: this.state.exercises || []
        }).then((response) => {
            this.setState({
                id: response.data.id
            });

            if (!this.state.themeId) {
                this.props.history.push(`/admin/theme/${response.data.id}`);
            }

            toast.success("Сохранено");
        })
    }

    searchExercise() {
        let searchTitle = this.exerciseTitleInput.current.value;

        Client.get("/api/content/exercises/find", {
            params: {
                title: searchTitle
            }
        }).then(response => {
            const exercises = response.data;
            this.setState({
                foundExercises: exercises
            });
        })
    }

    checkExerciseAlreadyAdded(exercise) {
        let alreadyAdded = false;
        this.state.exercises.forEach(function (oldExercise) {
            if (oldExercise.id === exercise.id) {
                alreadyAdded = true;
            }
        });

        return alreadyAdded;
    }

    addExercise(index) {
        let exercise = this.state.foundExercises[index];

        let foundExercises = this.state.foundExercises;
        foundExercises.splice(index, 1);
        this.setState({foundExercises: foundExercises});

        this.setState({exercises: this.state.exercises.concat(exercise)});
    }

    removeExercise(exerciseId) {
        let exercises = this.state.exercises;
        exercises.splice(exerciseId, 1);
        this.setState({exercises: exercises});
    }

    handExerciseChange(exercise) {
        this.setState({
            exercise: exercise
        });
    }

    togglePublished() {
        this.setState({published: !this.state.published});
    }

    render() {
        let exercises = [];

        this.state.exercises.map((exercise, index) => {
            exercises.push(<ListGroupItem variant="info" key={index}>
                {exercise.title}
                <RemoveButton className="float-right"
                              action={() => this.removeExercise(index)}/>
            </ListGroupItem>);
        });

        let foundExercises = [];

        if (this.state.foundExercises.length > 0) {
            this.state.foundExercises.map((exercise, index) => {
                if (!this.checkExerciseAlreadyAdded(exercise)) {
                    foundExercises.push(<ListGroupItem onClick={() => this.addExercise(index)} key={index}>
                        {exercise.title}
                    </ListGroupItem>);
                }
            });
        } else {
            foundExercises.push(<span key={0}>Ничего не найдено</span>);
        }

        const body = <Card>
            <Card.Body>
                <Breadcrumb>
                    <LinkContainer exact to="/admin"><Breadcrumb.Item>Главная</Breadcrumb.Item></LinkContainer>
                    <LinkContainer exact to="/admin/themes"><Breadcrumb.Item>Темы упражнений</Breadcrumb.Item></LinkContainer>
                    <Breadcrumb.Item
                        active>{(this.state.id) ? `Тема №${this.state.id}` : "Новая тема"}</Breadcrumb.Item>
                </Breadcrumb>

                <Jumbotron>
                    <Form>
                        <Form.Group>
                            <Form.Label><Card.Title>Заголовок</Card.Title></Form.Label>
                            <Form.Control ref={this.titleInput}/>
                        </Form.Group>

                        <Card.Title>Добавленные упражнения</Card.Title>
                        <ListGroup>
                            {exercises}
                        </ListGroup>

                        <Card>
                            <Card.Body>
                                <Form.Group>
                                    <Form.Label>Поиск упражнения</Form.Label>
                                    <Form.Control
                                        type="text"
                                        ref={this.exerciseTitleInput}
                                        placeholder="Начните вводить данные для выбора"
                                        onChange={this.searchExercise.bind(this)}
                                    />
                                </Form.Group>

                                Варианты:
                                <ListGroup>
                                    {foundExercises}
                                </ListGroup>
                            </Card.Body>
                        </Card>

                        <Form.Group>
                            <Form.Check type="checkbox" checked={this.state.published}
                                        onChange={this.togglePublished.bind(this)} label="Опубликовать тему"/>
                        </Form.Group>
                        <Button onClick={this.saveTheme.bind(this)} className="float-right"
                                variant="success">Сохранить</Button>
                    </Form>
                </Jumbotron>
            </Card.Body>
        </Card>;

        if (this.state.loaded) {
            return body;
        } else {
            return <Loader/>;
        }
    }
}

export default withRouter(AdminTheme);