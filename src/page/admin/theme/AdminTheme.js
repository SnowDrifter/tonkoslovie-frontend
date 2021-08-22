import React, {createRef} from "react";
import {withRouter} from "react-router-dom";
import {LinkContainer} from "react-router-bootstrap";
import {Breadcrumb, Button, Card, Form, Jumbotron, ListGroup} from "react-bootstrap";
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
            exerciseVariants: [],
            loading: props.computedMatch.params.themeId !== undefined,
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
        this.getExercises = this.getExercises.bind(this);
        this.getExerciseVariants = this.getExerciseVariants.bind(this);
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
                loading: false
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
        }).catch((e) => {
            toast.error(`Ошибка сохранения! Код: ${e.response.status}`);
        })
    }

    searchExercise() {
        const searchTitle = this.exerciseTitleInput.current.value;

        Client.get("/api/content/exercises/find", {
            params: {
                title: searchTitle
            }
        }).then(response => {
            const exerciseVariants = response.data;
            this.setState({
                exerciseVariants: exerciseVariants
            });
        }).catch((e) => {
            toast.error(`Ошибка поиска! Код: ${e.response.status}`);
        })
    }

    isExerciseAlreadyAdded(exerciseVariant) {
        return this.state.exercises.some(e => e.id === exerciseVariant.id)
    }

    addExercise(index) {
        const exercise = this.state.exerciseVariants[index];
        const exerciseVariants = this.state.exerciseVariants;
        exerciseVariants.splice(index, 1);

        this.setState({
            exerciseVariants: exerciseVariants,
            exercises: this.state.exercises.concat(exercise)
        });
    }

    removeExercise(exerciseId) {
        const exercises = this.state.exercises;
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

    getExercises() {
        return this.state.exercises.map((exercise, index) =>
            <ListGroup.Item variant="info" key={index}>
                <span>{exercise.title}</span>
                <RemoveButton className="float-right" action={() => this.removeExercise(index)}/>
            </ListGroup.Item>
        );
    }

    getExerciseVariants() {
        const exerciseVariants = this.state.exerciseVariants
            .filter(e => !this.isExerciseAlreadyAdded(e))
            .map((exercise, index) =>
                <ListGroup.Item onClick={() => this.addExercise(index)} key={index}>
                    {exercise.title}
                </ListGroup.Item>
            );

        return exerciseVariants.length > 0 ? exerciseVariants : <span key={0}>Ничего не найдено</span>
    }

    render() {
        if (this.state.loading) {
            return <Loader/>;
        }

        const exercises = this.getExercises();
        const exerciseVariants = this.getExerciseVariants();

        return <Card>
            <Card.Body>
                <Breadcrumb>
                    <LinkContainer exact to="/admin">
                        <Breadcrumb.Item>Главная</Breadcrumb.Item>
                    </LinkContainer>
                    <LinkContainer exact to="/admin/themes">
                        <Breadcrumb.Item>Темы упражнений</Breadcrumb.Item>
                    </LinkContainer>
                    <Breadcrumb.Item active>
                        {(this.state.id) ? `Тема №${this.state.id}` : "Новая тема"}
                    </Breadcrumb.Item>
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
                                    <Form.Control type="text"
                                                  ref={this.exerciseTitleInput}
                                                  placeholder="Начните вводить данные для выбора"
                                                  onChange={this.searchExercise.bind(this)}/>
                                </Form.Group>

                                Варианты:
                                <ListGroup>
                                    {exerciseVariants}
                                </ListGroup>
                            </Card.Body>
                        </Card>

                        <Form.Group>
                            <Form.Check label="Опубликовать тему"
                                        checked={this.state.published}
                                        onChange={this.togglePublished.bind(this)}/>
                        </Form.Group>
                        <Button onClick={this.saveTheme.bind(this)}
                                className="float-right" variant="success">Сохранить</Button>
                    </Form>
                </Jumbotron>
            </Card.Body>
        </Card>;
    }
}

export default withRouter(AdminTheme);