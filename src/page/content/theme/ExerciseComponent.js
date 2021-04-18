import React, {createRef} from "react";
import {Button, Card, Form} from "react-bootstrap";
import DOMPurify from "dompurify";
import * as  exerciseTypes from "./ExerciseTypes";
import SimpleTextModal from "/component/SimpleTextModal";
import "../exercise/Exercise.less"

class ExerciseComponent extends React.Component {

    constructor(props) {
        super(props);

        const exercise = props.exercise;
        const answersCount = exercise.answers ? exercise.answers.length : 1;

        let answerVariant;
        if (exercise.answers) {
            answerVariant = exercise.answers[Math.floor(Math.random() * exercise.answers.length)];
        }

        this.state = {
            id: exercise.id,
            type: exercise.type,
            original: exercise.original,
            dictionary: exercise.dictionary,
            answersCount: answersCount,
            answers: exercise.answers,
            correctUserAnswer: exercise.correctUserAnswer,
            showAnswerPanel: false,
            answerVariant: answerVariant,
            validationState: null,
            suggestShowAnswer: false,
            showDictionaryModal: false
        };

        this.answerInput = createRef();

        this.hideModals = this.hideModals.bind(this);
    }

    componentDidMount() {
        this.updateExercise();
        this.answerInput.current.value = this.state.correctUserAnswer || "";
    }

    static getDerivedStateFromProps(props) {
        return {
            exercise: props.exercise
        }
    }

    updateExercise() {
        const exercise = this.state.exercise;
        const answersCount = exercise.answers ? exercise.answers.length : 1;

        let validationClass;

        if (exercise.solved !== undefined) {
            if (exercise.solved === true) {
                validationClass = "is-valid";
            } else {
                validationClass = "is-invalid";
            }
        }

        let answerVariant;
        if (exercise.answers) {
            answerVariant = exercise.answers[Math.floor(Math.random() * exercise.answers.length)];
        }

        this.setState({
            id: exercise.id,
            type: exercise.type,
            original: exercise.original,
            dictionary: exercise.dictionary,
            answersCount: answersCount,
            answers: exercise.answers,
            showAnswerPanel: false,
            answerVariant: answerVariant,
            validationClass: validationClass,
            suggestShowAnswer: false,
            showDictionaryModal: false
        });
    }

    checkAnswer() {
        const rawAnswer = this.answerInput.current.value;
        const currentAnswer = rawAnswer.trim().toLowerCase();

        let answerIsCorrect = false;

        // Try check regexp
        if (this.props.exercise.answerRegex) {
            if (new RegExp(this.props.exercise.answerRegex, "gi").test(currentAnswer)) {
                this.setState({validationClass: "is-valid"});
                answerIsCorrect = true;
                this.props.addSolvedExercise(rawAnswer);
            }
        }

        // Try check all hardcode answers
        this.state.answers.map((answer) => {
            if (answer.toLowerCase() === currentAnswer) {
                this.setState({validationClass: "is-valid"});
                answerIsCorrect = true;
                this.props.addSolvedExercise(rawAnswer);
            }
        });

        if (!answerIsCorrect) {
            this.setState({validationClass: "is-invalid", suggestShowAnswer: true});
        }
    }

    hideModals() {
        this.setState({showConfirmModal: false, showDictionaryModal: false});
    }

    showDictionaryModal() {
        this.setState({showDictionaryModal: true});
    }

    render() {
        let taskText;
        if (this.state.type) {
            switch (this.state.type) {
                case exerciseTypes.RUSSIAN_TO_POLISH: {
                    taskText = "Переведите на польский фразу:";
                    break;
                }
                case exerciseTypes.POLISH_TO_RUSSIAN: {
                    taskText = "Переведите на русский фразу:";
                    break;
                }
            }
        }

        const collapseClass = this.state.showAnswerPanel ? "collapse.show" : "collapse";

        let showAnswerComponent;
        if (this.state.suggestShowAnswer) {
            showAnswerComponent = <div className="exercise-show-answer-component">
                <Button onClick={() => this.setState({showAnswerPanel: !this.state.showAnswerPanel})}>
                    Посмотреть возможный вариант ответа
                </Button>
                <Card className={`exercise-show-answer-panel ${collapseClass}`}>
                    {this.state.answerVariant}
                </Card>
            </div>
        }

        return <>
            <h3>{taskText}</h3>
            <h4>
                <div className="content" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.state.original)}}/>
            </h4>

            <Form.Group className="exercise-answer-form">
                <Form.Control
                    className={this.state.validationClass}
                    as="textarea"
                    ref={this.answerInput}
                    placeholder="Введите ответ"
                    rows={4}/>
            </Form.Group>

            <Button size="lg" onClick={this.checkAnswer.bind(this)} className="exercise-check-answer-button"
                    variant="success">
                Проверить
            </Button>
            <Button size="lg" onClick={this.props.nextExercise.bind(this)} className="float-right">
                Следующее упражнение
            </Button>
            <br className="exercise-button-separator"/>
            <Button size="lg" onClick={this.showDictionaryModal.bind(this)}>
                Показать словарь
            </Button>

            {showAnswerComponent}

            <SimpleTextModal showModal={this.state.showDictionaryModal}
                             hideModal={this.hideModals}
                             title="Словарь"
                             text={this.state.dictionary}/>
        </>;
    }
}

export default ExerciseComponent;