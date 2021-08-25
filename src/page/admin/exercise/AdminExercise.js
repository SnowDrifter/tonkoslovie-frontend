import React, {createRef} from "react";
import {Breadcrumb, Button, Card, InputGroup, Form, Jumbotron} from "react-bootstrap";
import Client from "/util/Client";
import {LinkContainer} from "react-router-bootstrap";
import * as  exerciseTypes from "/page/content/theme/ExerciseTypes";
import JoditEditor from "jodit-react";
import Loader from "/component/Loader";
import RemoveButton from "/component/button/RemoveButton";
import {toast} from "react-toastify";
import "./AdminExercise.less";


class AdminExercise extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: null,
            type: null,
            original: null,
            dictionary: null,
            answers: [""],
            loading: props.computedMatch.params.exerciseId !== undefined
        };

        if (props.computedMatch.params.exerciseId) {
            this.loadExercise(props.computedMatch.params.exerciseId)
        }

        this.typeInput = createRef();
        this.titleInput = createRef();
        this.answerRegexInput = createRef();

        this.handleAnswerChange = this.handleAnswerChange.bind(this);
        this.handleOriginalChange = this.handleOriginalChange.bind(this);
        this.handleDictionaryChange = this.handleDictionaryChange.bind(this);
        this.createAnswerForms = this.createAnswerForms.bind(this);
    }

    loadExercise(exerciseId) {
        Client.get("/api/content/exercise", {
            params: {
                id: exerciseId
            }
        }).then(response => {
            const exercise = response.data;

            this.setState({
                id: exercise.id,
                answers: exercise.answers || [""],
                original: exercise.original,
                dictionary: exercise.dictionary,
                loading: false
            });

            this.typeInput.current.value = exercise.type;
            this.titleInput.current.value = exercise.title;
            this.answerRegexInput.current.value = exercise.answerRegex;
        })
    }

    saveExercise() {
        Client.post("/api/content/exercise", {
            id: this.state.id,
            title: this.titleInput.current.value,
            original: this.state.original,
            dictionary: this.state.dictionary,
            answers: this.state.answers,
            type: this.typeInput.current.value,
            answerRegex: this.answerRegexInput.current.value
        }).then(response => {
            this.setState({
                id: response.data.id,
            });

            if (!this.props.computedMatch.params.lessonId) {
                this.props.history.push(`/admin/exercise/${response.data.id}`)
            }

            toast.success("Сохранено");
        }).catch((e) => {
            toast.error(`Ошибка сохранения! Код: ${e.response.status}`);
        })
    }

    handleOriginalChange(original) {
        this.setState({original});
    }

    handleDictionaryChange(dictionary) {
        this.setState({dictionary});
    }

    handleAnswerChange(e, index) {
        const answers = this.state.answers.splice(index, 1, e.target.value);
        this.setState(answers);
    }

    addAnswer() {
        this.setState({answers: this.state.answers.concat("")});
    }

    removeAnswer(key) {
        this.setState({
            answers: this.state.answers.filter((value, index) => index !== key)
        });
    }

    createAnswerForms() {
        return this.state.answers.map((answer, index) =>
            <InputGroup key={index} className="admin-exercise-answer-form">
                <Form.Control value={answer} onChange={e => this.handleAnswerChange(e, index)}/>
                <RemoveButton action={() => this.removeAnswer(index)}/>
            </InputGroup>
        );
    }

    render() {
        if (this.state.loading) {
            return <Loader/>;
        }

        const answerForms = this.createAnswerForms();

        return <Card>
            <Card.Body>
                <Breadcrumb>
                    <LinkContainer exact to="/admin">
                        <Breadcrumb.Item>Главная</Breadcrumb.Item>
                    </LinkContainer>
                    <LinkContainer exact to="/admin/exercises">
                        <Breadcrumb.Item>Упражнения</Breadcrumb.Item>
                    </LinkContainer>
                    <Breadcrumb.Item active>
                        {(this.state.id) ? `Уражнение №${this.state.id}` : "Новое упражнение"}
                    </Breadcrumb.Item>
                </Breadcrumb>

                <Jumbotron>
                    <Form.Group>
                        <Form.Label><h3>Заголовок</h3></Form.Label>
                        <Form.Control ref={this.titleInput}/>
                    </Form.Group>

                    <h3>Оригинал</h3>
                    <JoditEditor value={this.state.original} onBlur={this.handleOriginalChange.bind(this)}/>

                    <h3>Словарь</h3>
                    <JoditEditor value={this.state.dictionary} onBlur={this.handleDictionaryChange.bind(this)}/>

                    <Form.Group>
                        <Form.Label><h3>Вариант перевода</h3></Form.Label>
                        <Form.Control as="select" ref={this.typeInput}>
                            <option value={exerciseTypes.RUSSIAN_TO_POLISH}>С русского на польский</option>
                            <option value={exerciseTypes.POLISH_TO_RUSSIAN}>Z polskiego na rosyjski</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label><h3>Регулярное выражение для проверки ответов</h3></Form.Label>
                        <Form.Control as="textarea" ref={this.answerRegexInput}/>
                    </Form.Group>

                    <div className="admin-exercise-answer-panel">
                        <Form.Group>
                            <Form.Label><h3>Варианты ответов</h3></Form.Label>
                            {answerForms}
                        </Form.Group>
                        <Button onClick={this.addAnswer.bind(this)}>Добавить ответ</Button>
                    </div>
                </Jumbotron>

                <Button variant="success" className="float-right"
                        onClick={this.saveExercise.bind(this)}>Сохранить</Button>
            </Card.Body>
        </Card>;
    }
}

export default AdminExercise;