import React, {createRef} from "react";
import {Button, Card, Form} from "react-bootstrap";
import DOMPurify from "dompurify";
import * as  exerciseTypes from "./ExerciseTypes";
import SimpleTextModal from "/component/SimpleTextModal";
import sample from "lodash/sample";
import "../exercise/Exercise.less"
import {WRONG_ANSWER, CORRECT_ANSWER} from "/constant/AnswerStatus";

class ExerciseComponent extends React.Component {

    constructor(props) {
        super(props);

        const exercise = props.exercise;

        this.state = {
            id: exercise.id,
            type: exercise.type,
            original: exercise.original,
            dictionary: exercise.dictionary,
            answers: exercise.answers,
            answerStatus: undefined,
            showPossibleAnswer: false,
            showDictionaryModal: false
        };

        this.answerInput = createRef();

        this.hideModals = this.hideModals.bind(this);
    }

    componentDidMount() {
        this.updateExercise();
    }

    static getDerivedStateFromProps(props) {
        return {
            exercise: props.exercise
        }
    }

    updateExercise() {
        const exercise = this.state.exercise;

        this.setState({
            id: exercise.id,
            type: exercise.type,
            original: exercise.original,
            dictionary: exercise.dictionary,
            answers: exercise.answers,
            answerStatus: undefined,
            showPossibleAnswer: false,
            showDictionaryModal: false
        });
    }

    checkAnswer() {
        const rawAnswer = this.answerInput.current.value;
        const currentAnswer = rawAnswer.trim().toLowerCase();

        let answerStatus = WRONG_ANSWER;

        // Try check regexp
        if (this.props.exercise.answerRegex) {
            if (new RegExp(this.props.exercise.answerRegex, "gi").test(currentAnswer)) {
                answerStatus = CORRECT_ANSWER;
            }
        }

        // Try check all simple answers
        this.state.answers.forEach(answer => {
            if (answer.toLowerCase() === currentAnswer) {
                answerStatus = CORRECT_ANSWER;
            }
        });

        this.setState({answerStatus})

        if (answerStatus === CORRECT_ANSWER) {
            this.props.markExerciseAsSolved();
        }
    }

    hideModals() {
        this.setState({showDictionaryModal: false});
    }

    showDictionaryModal() {
        this.setState({showDictionaryModal: true});
    }

    getTaskText() {
        switch (this.state.type) {
            case exerciseTypes.RUSSIAN_TO_POLISH:
                return "Переведите на польский фразу:";
            case exerciseTypes.POLISH_TO_RUSSIAN:
                return "Переведите на русский фразу:";
        }
    }

    createPossibleAnswerComponent() {
        if (this.state.answerStatus === WRONG_ANSWER) {
            const answerVariant = sample(this.state.answers);
            const collapseClass = this.state.showPossibleAnswer ? "collapse.show" : "collapse";

            return <div className="exercise-show-answer-component">
                <Button onClick={() => this.setState({showPossibleAnswer: !this.state.showPossibleAnswer})}>
                    Посмотреть возможный вариант ответа
                </Button>
                <Card className={`exercise-show-answer-panel ${collapseClass}`}>
                    {answerVariant}
                </Card>
            </div>
        }
    }

    render() {
        const taskText = this.getTaskText();
        const possibleAnswerComponent = this.createPossibleAnswerComponent();
        const validationClass = this.state.answerStatus?.validationClass;

        return <>
            <h3>{taskText}</h3>
            <h4>
                <div className="content" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.state.original)}}/>
            </h4>

            <Form.Group className="exercise-answer-form">
                <Form.Control className={validationClass}
                              as="textarea"
                              ref={this.answerInput}
                              placeholder="Введите ответ"
                              rows={4}/>
            </Form.Group>

            <Button onClick={this.checkAnswer.bind(this)}
                    className="exercise-check-answer-button"
                    size="lg" variant="success">
                Проверить
            </Button>

            <Button onClick={this.showDictionaryModal.bind(this)} size="lg">Показать словарь</Button>

            <Button onClick={this.props.nextExercise.bind(this)}
                    size="lg" className="float-right" disabled={this.state.answerStatus !== CORRECT_ANSWER}>
                Следующее упражнение
            </Button>

            {possibleAnswerComponent}

            <SimpleTextModal showModal={this.state.showDictionaryModal}
                             hideModal={this.hideModals}
                             title="Словарь"
                             text={this.state.dictionary}/>
        </>;
    }
}

export default ExerciseComponent;
