import React from "react";
import ReactDOM from "react-dom";
import client from "../util/client";
import {Panel, PageHeader, Jumbotron, FormGroup, FormControl, Button} from "react-bootstrap";
import DOMPurify from "dompurify";
import Helmet from "react-helmet";
import {Link, browserHistory} from "react-router";
import style from './Exercise.less'
import * as  exerciseTypes from "./ExerciseTypes";
import SimpleConfirmModal from "./SimpleConfirmModal";
import SimpleTextModal from "./SimpleTextModal";

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
            validationState: null,
            suggestShowAnswer: false,
            showConfirmModal: false,
            showDictionaryModal: false
        };

        this.loadExercise(this.props.params.exerciseId);

        this.loadNextExercise = this.loadNextExercise.bind(this);
        this.hideModals = this.hideModals.bind(this);
    }

    loadExercise(exerciseId) {
        client.get('/api/content/exercise', {
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
                answers:  exercise.answers || [],
                loaded: true
            });

        }).catch(() => {
            this.setState({
                failed: true
            });
        })
    }

    checkAnswer() {
        const currentAnswer = ReactDOM.findDOMNode(this.answer).value.trim().toLowerCase();
        let answerIsCorrect = false;
        this.state.answers.map((answer) => {
            if(answer.toLowerCase() == currentAnswer) {
                this.setState({validationState: "success", suggestShowAnswer: true});
                answerIsCorrect = true;
            }
        });

        if(!answerIsCorrect) {
            this.setState({validationState: "error", suggestShowAnswer: true});
        }
    }

    loadNextExercise(newCycle) {
        let excludeExercises = [];

        if(!newCycle) {
            excludeExercises = [this.props.params.exerciseId];
            if(window.sessionStorage.getItem("loadedExercises")) {
                let oldExercises = JSON.parse(window.sessionStorage.getItem("loadedExercises"));
                excludeExercises = excludeExercises.concat(oldExercises);
            }
            window.sessionStorage.setItem("loadedExercises", JSON.stringify(excludeExercises));
        } else {
            window.sessionStorage.removeItem("loadedExercises");
        }

        client.get('/api/content/exercise/randomId', {
            params: {
                excludeIds: excludeExercises.join(',')
            }
        }).then(response => {
            const nextExerciseId = response.data.id;

            if(nextExerciseId) {
                browserHistory.push("/exercise/" + nextExerciseId);
                window.location.reload();
            } else{
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

        let showAnswerComponent;
        if(this.state.suggestShowAnswer) {
            showAnswerComponent = <div className="exercise-showAnswer-component">
                <Button onClick={()=> this.setState({showAnswer: !this.state.showAnswer})}>Посмотреть возможный вариант ответа</Button>
                <Panel className="exercise-showAnswer-panel" collapsible expanded={this.state.showAnswer}>{this.state.answers[0]}</Panel>
            </div>
        }

        const content = <Panel>
            <Helmet title={title}/>
            <PageHeader style={{textAlign: "center"}}>{pageHeader}</PageHeader>
            <h3>{taskText}</h3>
            <h4><div className="content" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.state.original)}}></div></h4>

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

            <Button bsSize="large" type="submit" onClick={this.checkAnswer.bind(this)} bsStyle="success">Проверить</Button>
            {' '}
            <Button bsSize="large" type="submit" onClick={this.showDictionaryModal.bind(this)}>Показать словарь</Button>
            <Button bsSize="large" type="submit" onClick={() => this.loadNextExercise(false)} className="pull-right">Следующее упражнение</Button>

            {showAnswerComponent}

            <SimpleConfirmModal showModal={this.state.showConfirmModal}
                                hideModal={this.hideModals}
                                confirmFunction={this.loadNextExercise}
                                modalTitle="Новые упражнения закончились, начать заново?"/>

            <SimpleTextModal showModal={this.state.showDictionaryModal}
                             hideModal={this.hideModals}
                             title="Словарь"
                             text={this.state.dictionary}/>
        </Panel>;

        if (this.state.loaded) {
            return content;
        } else if (this.state.failed) {
            return <Jumbotron><h2 style={{color: "red", textAlign: "center"}}>Упражнение не найдено</h2></Jumbotron>;
        } else {
            return null;
        }
    }
}

export default Exercise;