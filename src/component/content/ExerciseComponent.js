import React from "react";
import ReactDOM from "react-dom";
import {Panel, PageHeader, Jumbotron, FormGroup, FormControl, Button} from "react-bootstrap";
import DOMPurify from "dompurify";
import * as  exerciseTypes from "./ExerciseTypes";
import SimpleTextModal from "../SimpleTextModal";

class ExerciseComponent extends React.Component {

    constructor(props) {
        super(props);

        const exercise = this.props.exercise;
        const answersCount = exercise.answers ? exercise.answers.length : 1;

        this.state = {
            id: exercise.id,
            type: exercise.type,
            original: exercise.original,
            dictionary: exercise.dictionary,
            answersCount: answersCount,
            answers: exercise.answers,
            showAnswerPanel: false,
            validationState: null,
            suggestShowAnswer: false,
            showDictionaryModal: false
        };

        this.hideModals = this.hideModals.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.updateExercise(nextProps.exercise);
        ReactDOM.findDOMNode(this.answer).value = nextProps.exercise.correctUserAnswer || "";
    }

    updateExercise(exercise) {
        const answersCount = exercise.answers ? exercise.answers.length : 1;

        let validationState;

        if(exercise.solved != undefined) {
            if(exercise.solved == true) {
                validationState = "success";
            } else {
                validationState = "error";
            }
        }

        let answerVariant;
        if(this.state.answers) {
            answerVariant = this.state.answers[Math.floor(Math.random() * this.state.answers.length)];
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
            validationState: validationState,
            suggestShowAnswer: exercise.solved,
            showDictionaryModal: false
        });
    }

    checkAnswer() {
        const rawAnswer = ReactDOM.findDOMNode(this.answer).value;
        const currentAnswer = rawAnswer.trim().toLowerCase();

        let answerIsCorrect = false;

        // Try check regexp
        if(this.props.exercise.answerRegex) {
            if(currentAnswer.match(new RegExp( this.props.exercise.answerRegex , 'gi'))) {
                this.setState({validationState: "success", suggestShowAnswer: true});
                answerIsCorrect = true;
                this.props.addSolvedExercise(rawAnswer);
            }
        }

        // Try check all answers
        this.state.answers.map((answer) => {
            if (answer.toLowerCase() == currentAnswer) {
                this.setState({validationState: "success", suggestShowAnswer: true});
                answerIsCorrect = true;
                this.props.addSolvedExercise(rawAnswer);
            }
        });

        if (!answerIsCorrect) {
            this.setState({validationState: "error", suggestShowAnswer: true});
        }
    }

    hideModals() {
        this.setState({showConfirmModal: false, showDictionaryModal: false});
    }

    showDictionaryModal() {
        this.setState({showDictionaryModal: true});
    }

    render() {
        let pageHeader;
        let taskText;
        if (this.state.type) {
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
        }

        let showAnswerComponent;
        if (this.state.suggestShowAnswer) {
            showAnswerComponent = <div className="exercise-showAnswer-component">
                <Button onClick={() => this.setState({showAnswerPanel: !this.state.showAnswerPanel})}>Посмотреть возможный вариант
                    ответа</Button>
                <Panel className="exercise-showAnswer-panel" collapsible
                       expanded={this.state.showAnswerPanel}>{this.state.answerVariant}</Panel>
            </div>
        }

        return <div>
            <h3>{taskText}</h3>
            <h4>
                <div className="content"
                     dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.state.original)}}></div>
            </h4>

            <FormGroup validationState={this.state.validationState}>
                <FormControl
                    className="exercise-answer-form"
                    componentClass="textarea"
                    inputRef={answer => {
                        this.answer = answer
                    }}
                    placeholder="Введите ответ"
                    rows={4}
                />
            </FormGroup>

            <Button bsSize="large" type="submit" onClick={this.checkAnswer.bind(this)}
                    bsStyle="success">Проверить</Button>
            {' '}
            <Button bsSize="large" type="submit" onClick={this.props.nextExercise.bind(this)} className="pull-right">Следующее
                упражнение</Button>
            <br className="exercise-button-separator"/>
            <Button bsSize="large" type="submit" onClick={this.showDictionaryModal.bind(this)}>Показать словарь</Button>

            {showAnswerComponent}

            <SimpleTextModal showModal={this.state.showDictionaryModal}
                             hideModal={this.hideModals}
                             title="Словарь"
                             text={this.state.dictionary}/>
        </div>;
    }
}

export default ExerciseComponent;