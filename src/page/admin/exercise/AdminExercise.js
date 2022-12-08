import React from "react";
import {Breadcrumb, Button, Card, InputGroup, Form} from "react-bootstrap";
import Client from "/util/Client";
import {LinkContainer} from "react-router-bootstrap";
import {RUSSIAN_TO_POLISH, POLISH_TO_RUSSIAN} from "/page/content/theme/ExerciseTypes";
import JoditEditor from "jodit-react";
import Loader from "/component/Loader";
import RemoveButton from "/component/button/RemoveButton";
import {toast} from "react-toastify";
import "./AdminExercise.less";


class AdminExercise extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            exercise: {},
            loading: props.params.exerciseId !== undefined
        };

        if (props.params.exerciseId) {
            this.loadExercise(props.params.exerciseId)
        }
    }

    loadExercise = (exerciseId) => {
        Client.get("/api/content/exercise", {params: {id: exerciseId}})
            .then(response => {
                this.setState({
                    exercise: response.data,
                    loading: false
                });
            })
    }

    saveExercise = () => {
        Client.post("/api/content/exercise", this.state.exercise)
            .then(response => {
                this.updateExercise("id", response.data.id)

                if (!this.props.params.lessonId) {
                    this.props.navigate(`/admin/exercise/${response.data.id}`)
                }

                toast.success("Сохранено");
            })
            .catch(e => toast.error(`Ошибка сохранения! Код: ${e.response.status}`))
    }

    handleAnswerChange = (e, index) => {
        const {answers} = this.state.exercise;
        answers.splice(index, 1, e.target.value);
        this.updateExercise("answers", answers)
    }

    addAnswer = () => {
        this.updateExercise("answers", [...this.state.exercise.answers || [], ""])
    }

    removeAnswer = (key) => {
        const answers = this.state.exercise.answers.filter((value, index) => index !== key)
        this.updateExercise("answers", answers)
    }

    createAnswerForms = () => {
        return this.state.exercise.answers?.map((answer, index) =>
            <InputGroup key={index} className="admin-exercise-answer-form">
                <Form.Control defaultValue={answer} onChange={e => this.handleAnswerChange(e, index)}/>
                <RemoveButton action={() => this.removeAnswer(index)}/>
            </InputGroup>
        );
    }

    updateExercise = (field, value) => this.setState({exercise: {...this.state.exercise, [field]: value}});

    render() {
        if (this.state.loading) {
            return <Loader/>;
        }

        const {exercise} = this.state;

        return <Card>
            <Card.Body>
                <Breadcrumb>
                    <LinkContainer to="/admin"><Breadcrumb.Item>Главная</Breadcrumb.Item></LinkContainer>
                    <LinkContainer to="/admin/exercises"><Breadcrumb.Item>Упражнения</Breadcrumb.Item></LinkContainer>
                    <Breadcrumb.Item active>
                        {(exercise.id) ? `Уражнение №${exercise.id}` : "Новое упражнение"}
                    </Breadcrumb.Item>
                </Breadcrumb>

                <Card className="jumbotron">
                    <h3>Заголовок</h3>
                    <Form.Control defaultValue={exercise.title}
                                  onChange={e => this.updateExercise("title", e.target.value)}/>

                    <h3 className="mt-3">Оригинал</h3>
                    <JoditEditor value={exercise.original}
                                 onBlur={value => this.updateExercise("original", value)}/>

                    <h3 className="mt-3">Словарь</h3>
                    <JoditEditor value={exercise.dictionary}
                                 onBlur={value => this.updateExercise("dictionary", value)}/>

                    <h3 className="mt-3">Вариант перевода</h3>
                    <Form.Control defaultValue={exercise.type} as="select"
                                  onChange={e => this.updateExercise("type", e.target.value)}>
                        <option value={RUSSIAN_TO_POLISH}>С русского на польский</option>
                        <option value={POLISH_TO_RUSSIAN}>Z polskiego na rosyjski</option>
                    </Form.Control>

                    <h3 className="mt-3">Регулярное выражение для проверки ответов</h3>
                    <Form.Control defaultValue={exercise.answerRegex} as="textarea"
                                  onChange={e => this.updateExercise("answerRegex", e.target.value)}/>

                    <div className="mt-3 admin-exercise-answer-panel">
                        <h3>Варианты ответов</h3>
                        {this.createAnswerForms()}
                        <Button onClick={this.addAnswer}>Добавить ответ</Button>
                    </div>
                </Card>

                <Button variant="success" className="float-end"
                        onClick={this.saveExercise}>Сохранить</Button>
            </Card.Body>
        </Card>;
    }
}

export default AdminExercise;