import React from "react";
import ReactDOM from "react-dom";
import client from "../util/client";
import {
    Panel,
    PageHeader,
    Jumbotron,
    FormGroup,
    FormControl,
    Button
} from "react-bootstrap";
import DOMPurify from 'dompurify'
import style from './Exercise.less'
import Helmet from "react-helmet";
import {Link} from 'react-router'

import * as  exerciseTypes from "./ExerciseTypes";

class Exercise extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: null,
            type: null,
            original: null,
            hint: null,
            answersCount: 0,
            answers: [],
            loaded: false,
            failed: false,
            showAnswer: false,
            validationState: null,
            suggestShowAnswer: false
        };

        this.loadExercise(this.props.params.exerciseId)
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
                hint: exercise.hint,
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

    render() {
        let title = "Тонкословие"; // TODO: create custom style

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
            showAnswerComponent = <div>
                <Button onClick={()=> this.setState({showAnswer: !this.state.showAnswer})}>Посмотреть возможный вариант ответа</Button>
                <Panel className="exercise-answer-panel" collapsible expanded={this.state.showAnswer}>{this.state.answers[0]}</Panel>
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
                    componentClass="textarea"
                    inputRef={answer => {
                        this.answer = answer
                    }}
                    placeholder="Введите ответ"
                />
            </FormGroup>

            <p>Подсказка: {this.state.hint}</p>

            <Button bsSize="large" type="submit" onClick={this.checkAnswer.bind(this)} className="pull-right"
                    bsStyle="success">Проверить</Button>

            {showAnswerComponent}
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