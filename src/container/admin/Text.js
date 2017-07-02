import React from "react";
import ReactDOM from "react-dom";
import {
    Panel,
    FormGroup,
    Row,
    Col,
    ControlLabel,
    FormControl,
    Button,
    ButtonToolbar,
    ButtonGroup,
    Modal,
    Form,
    Jumbotron,
    Glyphicon
} from "react-bootstrap";
import style from './Text.less'
import TextPartEditor from '../../component/admin/TextPartEditor'
import * as  partTypes from '../../component/admin/TextPartTypes'

class Text extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showEditor: false,
            editorTitle: null,
            currentPart: null,
            currentPartIndex: null,
            textParts: [
                {
                    type: partTypes.TEXT,
                    data: "test1"
                },
                {
                    type: partTypes.TEXT,
                    data: "test2"
                },
                {
                    type: partTypes.TEXT,
                    data: "test3"
                },
                {
                    type: partTypes.QUESTION,
                    data: "question"
                }
            ]
        };

        this.hideEditor = this.hideEditor.bind(this);
        this.saveTextPart = this.saveTextPart.bind(this);
        this.editTextPart = this.editTextPart.bind(this);
        this.removeTextPart = this.removeTextPart.bind(this);
    }

    saveText() {

    }

    hideEditor() {
        this.setState({showEditor: false});
    }

    saveTextPart(index, textPart) {
        if (index) {
            let textParts = this.state.textParts;
            textParts[index] = textPart;
            this.setState({showEditor: false, textParts: textParts, currentPart: null, currentPartIndex: null});
        } else {
            this.setState({
                showEditor: false,
                textParts: this.state.textParts.concat(textPart)
            });
        }
    }

    editTextPart(key) {
        let textPart = this.state.textParts[key];
        this.setState({showEditor: true, editorTitle: "Редактирование", currentPart: textPart, currentPartIndex: key});
    }

    removeTextPart(key) {
        this.setState({textParts: this.state.textParts.filter((value, index) => index != key)});
    }

    addTextPart() {
        this.setState({
            showEditor: true, editorTitle: "Добавление текста", currentPart: {
                type: partTypes.TEXT
            }
        });
    }

    addQuestionPart() {
        this.setState({
            showEditor: true, editorTitle: "Добавление вопроса", currentPart: {
                type: partTypes.QUESTION
            }
        });
    }

    render() {
        let components = [];

        this.state.textParts.map((part, index) => {
            if (part.type == partTypes.TEXT) {
                components.push(<TextPart key={index} index={index} data={part.data} removePart={this.removeTextPart} editPart={this.editTextPart}/>);
            } else if (part.type == partTypes.QUESTION) {
                components.push(<QuestionPart key={index} index={index} data={part.data} removePart={this.removeTextPart} editPart={this.editTextPart}/>);
            }
        });

        return <Panel>
            <Jumbotron>
                {components}
            </Jumbotron>

            <TextPartEditor showEditor={this.state.showEditor}
                            editorTitle={this.state.editorTitle}
                            currentPartIndex={this.state.currentPartIndex}
                            currentPart={this.state.currentPart}
                            hideEditor={this.hideEditor}
                            saveTextPart={this.saveTextPart}/>

            <Button onClick={this.addTextPart.bind(this)}>Добавить текст</Button>
            <Button onClick={this.addQuestionPart.bind(this)}>Добавить вопрос</Button>
            <Button onClick={this.saveText.bind(this)} className="pull-right" bsStyle="success">Сохранить</Button>
        </Panel>
    }
}

class TextPart extends React.Component {
    render() {
        return <div className="text-part">
            {this.props.data}

            <ButtonGroup className="button-block">
                <Button onClick={() => this.props.editPart(this.props.index)} bsSize="xsmall"><Glyphicon glyph="pencil"/></Button>
                <Button onClick={() => this.props.removePart(this.props.index)} bsSize="xsmall" bsStyle="danger"><Glyphicon glyph="remove"/></Button>
            </ButtonGroup>
        </div>
    }
}

class QuestionPart extends React.Component {
    render() {
        return <div className="question-part">
            {this.props.data}

            <ButtonGroup className="button-block">
                <Button onClick={() => this.props.editPart(this.props.index)} bsSize="xsmall"><Glyphicon glyph="pencil"/></Button>
                <Button onClick={() => this.props.removePart(this.props.index)} bsSize="xsmall" bsStyle="danger"><Glyphicon glyph="remove"/></Button>
            </ButtonGroup>
        </div>
    }
}

export default Text;
