import React from "react";
import ReactDOM from "react-dom";
import {Button, ControlLabel, FormControl, FormGroup, Jumbotron, Panel} from "react-bootstrap";
import client from "../../util/client";
import * as  exerciseTypes from "../content/ExerciseTypes";
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import {Link} from "react-router";
import {ContentState, convertFromHTML, convertToRaw, EditorState} from "draft-js";
import Loader from "../../component/Loader";
import "./AdminExercise.less";
import {toast} from "react-toastify";


class AdminExercise extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: null,
            type: null,
            original: EditorState.createEmpty(),
            dictionary: EditorState.createEmpty(),
            // Fix empty default value in first answer input
            answersCount: this.props.params.exerciseId ? 0 : 1,
            answers: [],
            loaded: !this.props.params.exerciseId
        };

        if (this.props.params.exerciseId) {
            this.loadExercise(this.props.params.exerciseId)
        }

        this.handleOriginalChange = this.handleOriginalChange.bind(this);
        this.handleDictionaryChange = this.handleDictionaryChange.bind(this);
    }

    loadExercise(exerciseId) {
        client.get("/api/content/exercise", {
            params: {
                id: exerciseId
            }
        }).then(response => {
            const exercise = response.data;

            const answersCount = exercise.answers ? exercise.answers.length : 1;

            const originalBlocksFromHTML = convertFromHTML(exercise.original);
            const originalState = ContentState.createFromBlockArray(
                originalBlocksFromHTML.contentBlocks,
                originalBlocksFromHTML.entityMap
            );

            const dictionaryBlocksFromHTML = convertFromHTML(exercise.dictionary);
            const dictionaryState = ContentState.createFromBlockArray(
                dictionaryBlocksFromHTML.contentBlocks,
                dictionaryBlocksFromHTML.entityMap
            );

            this.setState({
                id: exercise.id,
                answersCount: answersCount,
                original: EditorState.createWithContent(originalState),
                dictionary: EditorState.createWithContent(dictionaryState),
                answers: exercise.answers || [],
                loaded: true
            });

            ReactDOM.findDOMNode(this.type).value = exercise.type;
            ReactDOM.findDOMNode(this.title).value = exercise.title;
            ReactDOM.findDOMNode(this.answerRegex).value = exercise.answerRegex;
        })
    }

    saveExercise() {
        const answers = [];

        for (let i = 0; i < this.state.answersCount; i++) {
            answers.push(ReactDOM.findDOMNode(this["answer-" + i]).value);
        }

        client.post("/api/content/exercise", {
            id: this.state.id,
            title: ReactDOM.findDOMNode(this.title).value,
            original: draftToHtml(convertToRaw(this.state.original.getCurrentContent())),
            dictionary: draftToHtml(convertToRaw(this.state.dictionary.getCurrentContent())),
            answers: answers,
            type: ReactDOM.findDOMNode(this.type).value,
            answerRegex: ReactDOM.findDOMNode(this.answerRegex).value
        }).then(response => {
            this.setState({
                id: response.data.id,
            });

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
            answerForms.push(<FormControl className="admin-exercise-answer-form" key={i} ref={part => {
                    this["answer-" + i] = part
                }} defaultValue={this.state.answers[i] || ""}/>
            );
        }

        const body = <Panel>
            <Panel.Body>

                <ul className="breadcrumb">
                    <li><Link to="/admin">Главная</Link></li>
                    <li><Link to="/admin/exercises">Упражнения</Link></li>
                    <li className="active">{(this.state.id) ? "Уражнение № " + (this.state.id) : "Новое упражнение"}</li>
                </ul>

                <Jumbotron>
                    <FormGroup>
                        <ControlLabel><h4>Заголовок</h4></ControlLabel>
                        <FormControl
                            inputRef={title => {
                                this.title = title
                            }}
                        />
                    </FormGroup>

                    <h4>Оригинал</h4>
                    <Panel>
                        <Panel.Body>
                            <Editor
                                editorState={this.state.original}
                                onEditorStateChange={this.handleOriginalChange}
                            />
                        </Panel.Body>
                    </Panel>

                    <h4>Словарь</h4>
                    <Panel>
                        <Panel.Body>
                            <Editor
                                editorState={this.state.dictionary}
                                onEditorStateChange={this.handleDictionaryChange}
                            />
                        </Panel.Body>
                    </Panel>

                    <FormGroup>
                        <ControlLabel><h4>Вариант перевода</h4></ControlLabel>
                        <FormControl componentClass="select" ref={part => {
                            this["type"] = part
                        }}>
                            <option value={exerciseTypes.RUSSIAN_TO_POLISH}>С русского на польский</option>
                            <option value={exerciseTypes.POLISH_TO_RUSSIAN}>Z polskiego na rosyjski</option>
                        </FormControl>
                    </FormGroup>

                    <FormGroup>
                        <ControlLabel><h4>Регулярное выражение для проверки ответов</h4></ControlLabel>
                        <FormControl
                            componentClass="textarea"
                            inputRef={answerRegex => {
                                this.answerRegex = answerRegex
                            }}
                        />
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
            </Panel.Body>
        </Panel>;

        if (this.state.loaded) {
            return body;
        } else {
            return <Loader/>;
        }
    }
}

export default AdminExercise;