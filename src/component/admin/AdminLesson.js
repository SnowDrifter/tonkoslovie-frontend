import React from "react";
import ReactDOM from "react-dom";
import client from "../../util/client";
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
    Glyphicon,
    ListGroup,
    ListGroupItem
} from "react-bootstrap";

import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import {convertToRaw, ContentState, convertFromHTML, EditorState} from 'draft-js';


class Lesson extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: undefined,
            relatedTexts: [],
            foundTexts: [],
            text: ""
        };

        if (this.props.params.lessonId) {
            this.loadLesson(this.props.params.lessonId)
        }
        this.removeText = this.removeText.bind(this);
        this.addText = this.addText.bind(this);
        this.handTextChange = this.handTextChange.bind(this);
    }

    loadLesson(lessonId) {
        client.get('/api/content/lesson', {
            params: {
                id: lessonId
            }
        }).then(response => {
            const lesson = response.data;

            const blocksFromHTML = convertFromHTML(lesson.text);
            const contentState = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap
            );

            this.setState({
                id: lesson.id,
                relatedTexts: lesson.relatedTexts,
                text: EditorState.createWithContent(contentState)
            });

            ReactDOM.findDOMNode(this.title).value = lesson.title;
        })
    }

    saveLesson() {
        client.post('/api/content/lesson', {
            id: this.state.id,
            title: ReactDOM.findDOMNode(this.title).value,
            text: draftToHtml(convertToRaw(this.state.text.getCurrentContent())),
            relatedTexts: this.state.relatedTexts ? this.state.relatedTexts : []
        }).then(() => {
            alert("Сохранено");
        })
    }

    searchText() {
        let searchTitle = ReactDOM.findDOMNode(this.textTitle).value;

        client.get('/api/content/texts/findByTitle', {
            params: {
                title: searchTitle
            }
        }).then(response => {
            const texts = response.data;
            this.setState({
                foundTexts: texts
            });
        })
    }

    checkTextAlreadyAdded(text) {
        let alreadyAdded = false;
        this.state.relatedTexts.forEach(function (oldText, index, array) {
            if (oldText.id == text.id) {
                alreadyAdded = true;
            }
        });

        return alreadyAdded;
    }

    addText(index) {
        let text = this.state.foundTexts[index];

        let foundTexts = this.state.foundTexts;
        foundTexts.splice(index, 1);
        this.setState({foundTexts: foundTexts});

        this.setState({relatedTexts: this.state.relatedTexts.concat(text)});
    }

    removeText(textId) {
        let relatedTexts = this.state.relatedTexts;
        relatedTexts.splice(textId, 1);
        this.setState({relatedTexts: relatedTexts});
    }

    handTextChange(text) {
        this.setState({
            text: text
        });
    }

    render() {
        let texts = [];

        this.state.relatedTexts.map((text, index) => {
            texts.push(<ListGroupItem bsStyle="info" key={index}>
                {text.title}
                <Button className="pull-right" onClick={() => this.removeText(index)} bsSize="xsmall"
                        bsStyle="danger"><Glyphicon glyph="remove"/></Button>
            </ListGroupItem>);
        });

        let foundTexts = [];

        if (this.state.foundTexts.length > 0) {
            this.state.foundTexts.map((text, index) => {
                if (!this.checkTextAlreadyAdded(text)) {
                    foundTexts.push(<ListGroupItem onClick={() => this.addText(index)} key={index}>
                        {text.title}
                    </ListGroupItem>);
                }
            });
        } else {
            foundTexts.push(<span key={0}>Ничего не найдено</span>);
        }

        return <Panel>
            <Jumbotron>
                <h3>Заголовок</h3>
                <FormGroup>
                    <FormControl
                        inputRef={title => {
                            this.title = title
                        }}
                    />
                </FormGroup>

                <h3>Текст урока</h3>
                <Panel>
                    <Editor
                        editorState={this.state.text}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                        onEditorStateChange={this.handTextChange}
                    />
                </Panel>

                <h3>Добавленные тексты</h3>
                <ListGroup>
                    {texts}
                </ListGroup>

                <Panel>
                    <FormGroup>
                        <ControlLabel>Поиск текста</ControlLabel>
                        <FormControl
                            type="text"
                            inputRef={textTitle => {
                                this.textTitle = textTitle
                            }}
                            placeholder="Начните вводить данные для выбора"
                            onChange={this.searchText.bind(this)}
                        />
                    </FormGroup>

                    Варианты:
                    <ListGroup>
                        {foundTexts}
                    </ListGroup>
                </Panel>

            </Jumbotron>
            <Button onClick={this.saveLesson.bind(this)} className="pull-right" bsStyle="success">Сохранить</Button>
        </Panel>
    }
}

export default Lesson;