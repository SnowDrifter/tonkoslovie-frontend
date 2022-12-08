import React from "react";
import {LinkContainer} from "react-router-bootstrap";
import {Breadcrumb, Button, Card, Form, ListGroup} from "react-bootstrap";
import Loader from "/component/Loader";
import Client from "/util/Client";
import {toast} from "react-toastify";
import RemoveButton from "/component/button/RemoveButton";

class AdminTheme extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            theme: {},
            exerciseVariants: [],
            loading: props.params.themeId !== undefined
        };

        if (props.params.themeId) {
            this.loadTheme(props.params.themeId)
        }
    }

    loadTheme(themeId) {
        Client.get("/api/content/theme", {params: {id: themeId}})
            .then(response => {
                this.setState({
                    theme: response.data,
                    loading: false
                });
            })
    }

    saveTheme = () => {
        Client.post("/api/content/theme", this.state.theme)
            .then(response => {
                this.updateTheme("id", response.data.id)

                if (!this.props.params.themeId) {
                    this.props.navigate(`/admin/theme/${response.data.id}`);
                }

                toast.success("Сохранено");
            })
            .catch(e => toast.error(`Ошибка сохранения! Код: ${e.response.status}`))
    }

    searchExercise = (searchTitle) => {
        Client.get("/api/content/exercises/find", {params: {title: searchTitle}})
            .then(response => {
                this.setState({
                    exerciseVariants: response.data
                });
            })
            .catch(e => toast.error(`Ошибка поиска! Код: ${e.response.status}`))
    }

    addExercise = (index) => {
        const {exerciseVariants} = this.state;
        const exercise = exerciseVariants[index];
        exerciseVariants.splice(index, 1);

        this.setState({exerciseVariants});
        this.updateTheme("exercises", [...this.state.theme.exercises || [], exercise])
    }

    removeExercise = (exerciseId) => {
        const {exercises} = this.state.theme
        exercises.splice(exerciseId, 1);
        this.updateTheme("exercises", exercises)
    }

    createExercises = () => {
        return this.state.theme.exercises?.map((exercise, index) =>
            <ListGroup.Item variant="info" key={index}>
                <span>{exercise.title}</span>
                <RemoveButton className="float-end" action={() => this.removeExercise(index)}/>
            </ListGroup.Item>
        );
    }

    canShowExerciseVariant = (exerciseVariant) => !this.state.theme.exercises?.some(e => e.id === exerciseVariant.id)

    createExerciseVariants = () => {
        return this.state.exerciseVariants
            .filter(this.canShowExerciseVariant)
            .map((exercise, index) =>
                <ListGroup.Item key={index} onClick={() => this.addExercise(index)}>
                    {exercise.title}
                </ListGroup.Item>
            );
    }

    updateTheme = (field, value) => this.setState({theme: {...this.state.theme, [field]: value}});

    render() {
        if (this.state.loading) {
            return <Loader/>;
        }

        const {theme} = this.state;
        const exerciseVariants = this.createExerciseVariants();

        return <Card>
            <Card.Body>
                <Breadcrumb>
                    <LinkContainer to="/admin"><Breadcrumb.Item>Главная</Breadcrumb.Item></LinkContainer>
                    <LinkContainer to="/admin/themes"><Breadcrumb.Item>Темы упражнений</Breadcrumb.Item></LinkContainer>
                    <Breadcrumb.Item active>{(theme.id) ? `Тема №${theme.id}` : "Новая тема"}</Breadcrumb.Item>
                </Breadcrumb>

                <Card className="jumbotron">
                    <Form>
                        <h3>Заголовок</h3>
                        <Form.Control defaultValue={theme.title}
                                      onChange={e => this.updateTheme("title", e.target.value)}/>

                        <h3 className="mt-3">Добавленные упражнения</h3>
                        <ListGroup>
                            {this.createExercises()}
                        </ListGroup>

                        <Card>
                            <Card.Body>
                                <Form.Group className="mb-2">
                                    <Form.Label>Поиск упражнения</Form.Label>
                                    <Form.Control placeholder="Начните вводить данные для выбора"
                                                  onChange={e => this.searchExercise(e.target.value)}/>
                                </Form.Group>

                                Варианты:
                                <ListGroup>
                                    {exerciseVariants.length ? exerciseVariants :
                                        <span key={0}>Ничего не найдено</span>}
                                </ListGroup>
                            </Card.Body>
                        </Card>

                        <Form.Check className="mt-3" label="Опубликовать тему" checked={theme.published}
                                    onChange={e => this.updateTheme("published", e.target.checked)}/>
                        <Button onClick={this.saveTheme}
                                className="float-end" variant="success">Сохранить</Button>
                    </Form>
                </Card>
            </Card.Body>
        </Card>;
    }
}

export default AdminTheme;