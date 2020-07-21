import React, {createRef} from "react";
import Client from "../../util/Client";
import {Card, Jumbotron, Form, Button} from "react-bootstrap";
import DOMPurify from "dompurify";
import Helmet from "react-helmet";
import * as  exerciseTypes from "./ExerciseTypes";
import SimpleConfirmModal from "../SimpleConfirmModal";
import SimpleTextModal from "../SimpleTextModal";
import Loader from "../Loader";
import "./Exercise.less"

class Exercise extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: null,
            type: null,
            original: null,
            dictionary: null,
            answersCount: 0,
            answers: [],
            loaded: false,
            failed: false,
            showAnswer: false,
            validationClass: null,
            suggestShowAnswer: false,
            showConfirmModal: false,
            showDictionaryModal: false
        };

        this.answerInput = createRef();

        this.loadExercise(props.match.params.exerciseId);

        this.loadNextExercise = this.loadNextExercise.bind(this);
        this.hideModals = this.hideModals.bind(this);
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
                type: exercise.type,
                original: exercise.original,
                dictionary: exercise.dictionary,
                answersCount: answersCount,
                answers: exercise.answers || [],
                loaded: true
            });

        }).catch(() => {
            this.setState({
                failed: true
            });
        })
    }

    checkAnswer() {
        const currentAnswer = this.answerInput.current.value.trim().toLowerCase();
        let answerIsCorrect = false;
        this.state.answers.map((answer) => {
            if (answer.toLowerCase() === currentAnswer) {
                this.setState({validationClass: "is-valid", suggestShowAnswer: true});
                answerIsCorrect = true;
            }
        });

        if (!answerIsCorrect) {
            this.setState({validationClass: "is-invalid", suggestShowAnswer: true});
        }
    }

    loadNextExercise(newCycle) {
        let excludeExercises = [];

        if (!newCycle) {
            excludeExercises = [this.props.match.params.exerciseId];
            if (window.sessionStorage.getItem("loadedExercises")) {
                let oldExercises = JSON.parse(window.sessionStorage.getItem("loadedExercises"));
                excludeExercises = excludeExercises.concat(oldExercises);
            }
            window.sessionStorage.setItem("loadedExercises", JSON.stringify(excludeExercises));
        } else {
            window.sessionStorage.removeItem("loadedExercises");
        }

        Client.get("/api/content/exercise/random_id", {
            params: {
                excludeIds: excludeExercises.join(",")
            }
        }).then(response => {
            const nextExerciseId = response.data.id;

            if (nextExerciseId) {
                this.props.history.push("/exercise/" + nextExerciseId);
                window.location.reload();
            } else {
                this.setState({showConfirmModal: true});
            }
        })
    }

    hideModals() {
        this.setState({showConfirmModal: false, showDictionaryModal: false});
    }

    showDictionaryModal() {
        this.setState({showDictionaryModal: true});
    }

    createShowAnswerComponent() {
        if (this.state.suggestShowAnswer) {
            const collapseClass = this.state.showAnswer ? "collapse.show" : "collapse";

            return <div className="exercise-show-answer-component">
                <Button onClick={() => this.setState({showAnswer: !this.state.showAnswer})}>
                    Посмотреть возможный вариант ответа
                </Button>
                <Card className={"exercise-show-answer-panel " + collapseClass}>
                    {this.state.answers[0]}
                </Card>
            </div>
        }
    }

    render() {
        let title = "Упражнение | Тонкословие";

        let pageHeader;
        let taskText;
        switch (this.state.type) {
            case exerciseTypes.RUSSIAN_TO_POLISH: {
                pageHeader = "Перевод с русского на польский";
                taskText = "Переведите на польский фразу: ";
                break;
            }
            case exerciseTypes.POLISH_TO_RUSSIAN: {
                pageHeader = "Перевод с польского на русский";
                taskText = "Переведите на русский фразу: ";
                break;
            }
        }

        const showAnswerComponent = this.createShowAnswerComponent();

        const body = <Card>
            <Helmet title={title}/>
            <Card.Header style={{textAlign: "center"}}>{pageHeader}</Card.Header>
            <Card.Body>
                <h3>{taskText}</h3>
                <h4>
                    <div className="content"
                         dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.state.original)}}/>
                </h4>

                <Form.Group>
                    <Form.Control className={"exercise-answer-form " + this.state.validationClass}
                                  as="textarea"
                                  ref={this.answerInput}
                                  placeholder="Введите ответ"
                                  rows={4}/>
                </Form.Group>

                <Button size="lg" onClick={this.checkAnswer.bind(this)}
                        variant="success" style={{marginRight: "5px", marginBottom: "5px"}}>
                    Проверить
                </Button>
                <Button size="lg" onClick={() => this.loadNextExercise(false)} className="float-right">
                    Следующее упражнение
                </Button>
                <br className="exercise-button-separator"/>
                <Button size="lg" onClick={this.showDictionaryModal.bind(this)}>
                    Показать словарь
                </Button>

                {showAnswerComponent}
            </Card.Body>

            <SimpleConfirmModal showModal={this.state.showConfirmModal}
                                hideModal={this.hideModals}
                                confirmFunction={this.loadNextExercise}
                                modalTitle="Новые упражнения закончились, начать заново?"/>

            <SimpleTextModal showModal={this.state.showDictionaryModal}
                             hideModal={this.hideModals}
                             title="Словарь"
                             text={this.state.dictionary}/>
        </Card>;

        if (this.state.loaded) {
            return body;
        } else if (this.state.failed) {
            return <Jumbotron><h2 style={{color: "red", textAlign: "center"}}>Упражнение не найдено</h2></Jumbotron>;
        } else {
            return <Loader/>;
        }
    }
}

export default Exercise;