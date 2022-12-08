import React from "react";
import {Button, Card, Form} from "react-bootstrap";
import DOMPurify from "dompurify";
import {RUSSIAN_TO_POLISH, POLISH_TO_RUSSIAN} from "./ExerciseTypes";
import SimpleTextModal from "/component/SimpleTextModal";
import sample from "lodash/sample";
import {WRONG_ANSWER, CORRECT_ANSWER} from "/constant/AnswerStatus";
import "./ExerciseComponent.less"

class ExerciseComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            exercise: props.exercise,
            userAnswer: null,
            answerStatus: undefined,
            showPossibleAnswer: false,
            showDictionaryModal: false
        };
    }

    static getDerivedStateFromProps(props) {
        return {
            exercise: props.exercise
        }
    }

    checkAnswer = () => {
        const userAnswer = this.state.userAnswer.trim().toLowerCase();

        let answerStatus = WRONG_ANSWER;

        // Try check regexp
        if (this.props.exercise.answerRegex) {
            if (new RegExp(this.props.exercise.answerRegex, "gi").test(userAnswer)) {
                answerStatus = CORRECT_ANSWER;
            }
        }

        // Try check all simple answers
        this.state.exercise.answers.forEach(answer => {
            if (answer.toLowerCase() === userAnswer) {
                answerStatus = CORRECT_ANSWER;
            }
        });

        this.setState({answerStatus})

        if (answerStatus === CORRECT_ANSWER) {
            this.props.markExerciseAsSolved();
        }
    }

    hideModals = () => this.setState({showDictionaryModal: false})

    showDictionaryModal= () => this.setState({showDictionaryModal: true});

    getTaskText = () => {
        switch (this.state.type) {
            case RUSSIAN_TO_POLISH:
                return "Переведите на польский фразу:";
            case POLISH_TO_RUSSIAN:
                return "Переведите на русский фразу:";
        }
    }

    createPossibleAnswerComponent() {
        if (this.state.answerStatus === WRONG_ANSWER) {
            const answerVariant = sample(this.state.exercise.answers);
            const collapseClass = this.state.showPossibleAnswer ? "show" : "collapse";

            return <div className="exercise-show-answer-component">
                <Button onClick={() => this.setState({showPossibleAnswer: !this.state.showPossibleAnswer})}>
                    Посмотреть возможный вариант ответа
                </Button>
                <Card className={`mt-3 exercise-show-answer-panel ${collapseClass}`}>
                    {answerVariant}
                </Card>
            </div>
        }
    }

    onChangeUserAnswer = (answer) => this.setState({userAnswer: answer})

    render() {
        const {exercise, userAnswer, answerStatus, showDictionaryModal} = this.state;

        return <>
            <h3>{this.getTaskText()}</h3>
            <h4>
                <div className="content" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(exercise.original)}}/>
            </h4>

            <Form.Group className="exercise-answer-form">
                <Form.Control className={answerStatus?.validationClass}
                              as="textarea"
                              defaultValue={userAnswer}
                              onChange={e => this.onChangeUserAnswer(e.target.value)}
                              placeholder="Введите ответ"
                              rows={4}/>
            </Form.Group>

            <div className="mt-2">
                <Button onClick={this.checkAnswer}
                        className="exercise-check-answer-button"
                        size="lg" variant="success">
                    Проверить
                </Button>

                <Button onClick={this.showDictionaryModal} size="lg">Показать словарь</Button>

                <Button onClick={this.props.nextExercise}
                        size="lg" className="float-end" disabled={answerStatus !== CORRECT_ANSWER}>
                    Следующее упражнение
                </Button>
            </div>

            {this.createPossibleAnswerComponent()}

            <SimpleTextModal showModal={showDictionaryModal}
                             onHide={this.hideModals}
                             title="Словарь"
                             text={exercise.dictionary}/>
        </>;
    }
}

export default ExerciseComponent;
