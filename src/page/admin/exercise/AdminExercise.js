import React, {createRef} from "react";
import {Breadcrumb, Button, ButtonToolbar, Card, Form, Jumbotron} from "react-bootstrap";
import Client from "/util/Client";
import {LinkContainer} from "react-router-bootstrap";
import * as  exerciseTypes from "/page/content/theme/ExerciseTypes";
import JoditEditor from "jodit-react";
import Loader from "/component/Loader";
import "./AdminExercise.less";
import {toast} from "react-toastify";


class AdminExercise extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: null,
            type: null,
            original: "",
            dictionary: "",
            // Fix empty default value in first answer input
            answersCount: this.props.computedMatch.params.exerciseId ? 0 : 1,
            answers: [],
            loaded: !this.props.computedMatch.params.exerciseId
        };

        if (this.props.computedMatch.params.exerciseId) {
            this.loadExercise(this.props.computedMatch.params.exerciseId)
        }

        this.typeInput = createRef();
        this.titleInput = createRef();
        this.answerRegexInput = createRef();

        this.handleOriginalChange = this.handleOriginalChange.bind(this);
        this.handleDictionaryChange = this.handleDictionaryChange.bind(this);
    }

    loadExercise(exerciseId) {
        Client.get("/api/content/exercise", {
            params: {
                id: exerciseId
            }
        }).then(response => {
            const exercise = response.data;

            const answersCount = exercise.answers ? exercise.answers.length : 1;

            this.setState({
                id: exercise.id,
                answersCount: answersCount,
                answers: exercise.answers || [],
                original: exercise.original,
                dictionary: exercise.dictionary,
                loaded: true
            });

            this.typeInput.current.value = exercise.type;
            this.titleInput.current.value = exercise.title;
            this.answerRegexInput.current.value = exercise.answerRegex;
        })
    }

    saveExercise() {
        const answers = [];

        for (let i = 0; i < this.state.answersCount; i++) {
            answers.push(this[`answer-${i}`].current.value);
        }

        Client.post("/api/content/exercise", {
            id: this.state.id,
            title: this.titleInput.current.value,
            original: this.state.original,
            dictionary: this.state.dictionary,
            answers: answers,
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
        })
    }

    handleOriginalChange(original) {
        this.setState({
            original: original
        });
    }

    handleDictionaryChange(dictionary) {
        this.setState({
            dictionary: dictionary
        });
    }

    increaseAnswersCount() {
        let answersCount = this.state.answersCount;
        answersCount++;
        this.setState({answersCount: answersCount})
    }

    decreaseAnswersCount() {
        if (this.state.answersCount > 1) {
            let answersCount = this.state.answersCount;
            answersCount--;
            this.setState({answersCount: answersCount});
        }
    }

    render() {
        const answerForms = [];
        const answersCount = this.state.answersCount;

        for (let i = 0; i < answersCount; i++) {
            this[`answer-${i}`] = createRef();

            answerForms.push(<Form.Control className="admin-exercise-answer-form" key={i} ref={this[`answer-${i}`]}
                                           defaultValue={this.state.answers[i] || ""}/>
            );
        }

        const body = <Card>
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
                    <Card>
                        <JoditEditor value={this.state.original} onBlur={this.handleOriginalChange.bind(this)}/>
                    </Card>

                    <h3>Словарь</h3>
                    <Card>
                        <JoditEditor value={this.state.dictionary} onBlur={this.handleDictionaryChange.bind(this)}/>
                    </Card>

                    <Form.Group>
                        <Form.Label><h3>Вариант перевода</h3></Form.Label>
                        <Form.Control as="select" ref={this["typeInput"]}>
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
                            <Form.Label><h3>Ответы</h3></Form.Label>
                            {answerForms}
                        </Form.Group>
                        <ButtonToolbar>
                            <Button onClick={this.increaseAnswersCount.bind(this)}>Добавить ответ</Button>
                            <Button onClick={this.decreaseAnswersCount.bind(this)}>Удалить ответ</Button>
                        </ButtonToolbar>
                    </div>
                </Jumbotron>

                <Button variant="success" className="float-right"
                        onClick={this.saveExercise.bind(this)}>Сохранить</Button>
            </Card.Body>
        </Card>;

        if (this.state.loaded) {
            return body;
        } else {
            return <Loader/>;
        }
    }
}

export default AdminExercise;