import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
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

import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';


class Lesson extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: undefined,
            relatedTexts: [],
            foundTexts: []
        };

        if (this.props.params.lessonId) {
            this.loadLesson(this.props.params.lessonId)
        }
        this.removeText = this.removeText.bind(this);
        this.addText = this.addText.bind(this);
        this.handTextChange = this.handTextChange.bind(this);
    }

    loadLesson(lessonId) {
        axios.get('http://localhost:8080/api/content/lesson', {
            params: {
                id: lessonId
            }
        }).then(response => {
            const lesson = response.data;
            this.setState({
                id: lesson.id,
                relatedTexts: lesson.relatedTexts,
                text: lesson.text
            });

            ReactDOM.findDOMNode(this.title).value = lesson.title;
        })
    }

    saveLesson() {
        axios.post('http://localhost:8080/api/content/lesson', {
            id: this.state.id,
            title: ReactDOM.findDOMNode(this.title).value,
            text: this.state.text,
            relatedTexts: this.state.relatedTexts ? this.state.relatedTexts : []
        }).then(() => {
            alert("Сохранено");
        })
    }

    searchText() {
        let searchTitle = ReactDOM.findDOMNode(this.textTitle).value;

        axios.get('http://localhost:8080/api/content/texts/findByTitle', {
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

    checkTextAlreadyAdded(text){
        let alreadyAdded = false;
        this.state.relatedTexts.forEach(function(oldText, index, array){
            if(oldText.id == text.id) {
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

        if(this.state.foundTexts.length > 0) {
            this.state.foundTexts.map((text, index) => {
                if(!this.checkTextAlreadyAdded(text)) {
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
                <FroalaEditor
                    tag='textarea'
                    config={{
                        placeholderText: 'Редактирование текста',
                        charCounterCount: false,
                        height: 500
                    }}
                    model={this.state.text}
                    onModelChange={this.handTextChange}
                />

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