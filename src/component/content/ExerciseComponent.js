import React from "react";
import ReactDOM from "react-dom";
import {Panel, PageHeader, Jumbotron, FormGroup, FormControl, Button} from "react-bootstrap";
import DOMPurify from "dompurify";
import * as  exerciseTypes from "./ExerciseTypes";
import SimpleTextModal from "../SimpleTextModal";

class ExerciseComponent extends React.Component {

    constructor(props) {
        super(props);

        this.updateExercise(this.props.exercise);

        this.hideModals = this.hideModals.bind(this);
        this.updateExercise = this.updateExercise.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.updateExercise(nextProps.exercise);
    }

    updateExercise(exercise) {
        const answersCount = exercise.answers ? exercise.answers.length : 1;

        this.state = {
            id: exercise.id,
            type: exercise.type,
            original: exercise.original,
            dictionary: exercise.dictionary,
            answersCount: answersCount,
            answers: exercise.answers,
            showAnswer: false,
            validationState: null,
            suggestShowAnswer: false,
            showDictionaryModal: false
        };
    }

    checkAnswer() {
        const currentAnswer = ReactDOM.findDOMNode(this.answer).value.trim().toLowerCase();
        let answerIsCorrect = false;
        this.state.answers.map((answer) => {
            if (answer.toLowerCase() == currentAnswer) {
                this.setState({validationState: "success", suggestShowAnswer: true});
                answerIsCorrect = true;
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

        let showAnswerComponent;
        if (this.state.suggestShowAnswer) {
            showAnswerComponent = <div className="exercise-showAnswer-component">
                <Button onClick={() => this.setState({showAnswer: !this.state.showAnswer})}>Посмотреть возможный вариант
                    ответа</Button>
                <Panel className="exercise-showAnswer-panel" collapsible
                       expanded={this.state.showAnswer}>{this.state.answers[0]}</Panel>
            </div>
        }

        return <Panel>
            <PageHeader style={{textAlign: "center"}}>{pageHeader}</PageHeader>
            <h3>{taskText}</h3>
            <h4>
                <div className="content"
                     dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.state.original)}}></div>
            </h4>

            <FormGroup
                validationState={this.state.validationState}>
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
        </Panel>;
    }
}

export default ExerciseComponent;