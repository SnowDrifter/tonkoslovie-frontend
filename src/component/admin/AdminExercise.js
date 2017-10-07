import React from "react";
import ReactDOM from "react-dom";
import {
    Panel,
    Jumbotron,
    FormGroup,
    Row,
    Col,
    ControlLabel,
    FormControl,
    Button,
    Form,
    Glyphicon
} from "react-bootstrap";
import style from './AdminExercise.less'
import client from "../../util/client";
import * as  exerciseTypes from "../ExerciseTypes";

import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import {convertToRaw, ContentState, convertFromHTML, EditorState} from 'draft-js';


class AdminExercise extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: null,
            type: null,
            original: EditorState.createEmpty(),
            hint: null,
            answersCount: 0,
            answers: []
        };

        if (this.props.params.exerciseId) {
            this.loadExercise(this.props.params.exerciseId)
        } else {
            // Fix empty default value in first answer input
            this.setState({answersCount: 1});
        }

        this.handleOriginalChange = this.handleOriginalChange.bind(this);
    }

    loadExercise(exerciseId) {
        client.get('/api/content/exercise', {
            params: {
                id: exerciseId
            }
        }).then(response => {
            const exercise = response.data;

            const answersCount = exercise.answers ? exercise.answers.length : 1;

            const blocksFromHTML = convertFromHTML(exercise.original);
            const contentState = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap
            );

            this.setState({
                id: exercise.id,
                answersCount: answersCount,
                original: EditorState.createWithContent(contentState),
                answers: exercise.answers || []
            });

            // ReactDOM.findDOMNode(this.original).value = exercise.original;
            ReactDOM.findDOMNode(this.type).value = exercise.type;
            ReactDOM.findDOMNode(this.hint).value = exercise.hint;
        })
    }

    saveExercise() {
        const answers = [];

        for (let i = 0; i < this.state.answersCount; i++) {
            answers.push(ReactDOM.findDOMNode(this['answer-' + i]).value);
        }

        client.post('/api/content/exercise', {
            id: this.state.id,
            original: draftToHtml(convertToRaw(this.state.original.getCurrentContent())),
            hint: ReactDOM.findDOMNode(this.hint).value,
            answers: answers,
            type: ReactDOM.findDOMNode(this.type).value
        }).then(response => {
            this.setState({
                id: response.data.id,
            });

            alert("Сохранено");
        })
    }

    handleOriginalChange(original) {
        this.setState({
            original: original
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
                answerForms.push(<FormControl className="admin-exercise-answer-form" key={i} ref={part => {
                        this['answer-' + i] = part
                    }}  defaultValue={this.state.answers[i] || ""}/>
                );
        }

        return (<Panel>
                <Jumbotron>

                    <h4>Оригинал</h4>
                    <Panel>
                        <Editor
                            editorState={this.state.original}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            onEditorStateChange={this.handleOriginalChange}
                        />
                    </Panel>

                    <FormGroup>
                        <ControlLabel><h4>Подсказка</h4></ControlLabel>
                        <FormControl
                            inputRef={hint => {
                                this.hint = hint
                            }}
                        />
                    </FormGroup>

                    <FormGroup>
                        <ControlLabel><h4>Вариант перевода</h4></ControlLabel>
                        <FormControl componentClass="select" ref={part => {this['type'] = part}}>
                            <option value={exerciseTypes.RUSSIAN_TO_POLISH}>С русского на польский</option>
                            <option value={exerciseTypes.POLISH_TO_RUSSIAN}>Z polskiego na rosyjski</option>
                        </FormControl>
                    </FormGroup>

                    <div className="admin-exercise-answer-panel">
                        <FormGroup>
                            <ControlLabel><h4>Ответы</h4></ControlLabel>
                            {answerForms}
                        </FormGroup>
                        <Button onClick={this.increaseAnswersCount.bind(this)}>Добавить ответ</Button>
                        <Button onClick={this.decreaseAnswersCount.bind(this)}>Удалить ответ</Button>
                    </div>
                </Jumbotron>
                <Button onClick={this.saveExercise.bind(this)} className="pull-right"
                        bsStyle="success">Сохранить</Button>
            </Panel>
        );
    }
}

export default AdminExercise;