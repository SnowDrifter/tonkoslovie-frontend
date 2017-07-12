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
import axios from "axios";
import style from './Text.less'
import EditPartModal from './EditPartModal'
import CreatePartModal from './CreatePartModal'
import * as partTypes from  './TextPartTypes'

class Text extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: null,
            showEditPartModal: false,
            showCreatePartModal: false,
            modalTitle: null,
            currentPart: null,
            currentPartIndex: null,
            textParts: []
        };

        this.hideModal = this.hideModal.bind(this);
        this.saveTextPart = this.saveTextPart.bind(this);
        this.editTextPart = this.editTextPart.bind(this);
        this.removeTextPart = this.removeTextPart.bind(this);

        if (this.props.params.textId) {
            this.loadText(this.props.params.textId)
        }
    }

    loadText(textId) {
        axios.get('http://localhost:8080/api/content/text', {
            params: {
                id: textId
            }
        }).then(response => {
            const text = response.data;
            this.setState({
                id: text.id,
                textParts: text.parts
            });

            ReactDOM.findDOMNode(this.title).value = text.title;
        })
    }

    saveText() {
        axios.post('http://localhost:8080/api/content/text', {
            id: this.state.id,
            title: ReactDOM.findDOMNode(this.title).value,
            parts: this.state.textParts ? this.state.textParts : []
        }).then(() => {
            alert("Сохранено"); // TODO
        })
    }

    hideModal() {
        this.setState({showEditPartModal: false, showCreatePartModal: false});
    }

    saveTextPart(index, textPart) {
        if (index) {
            let textParts = this.state.textParts;
            textParts[index] = textPart;
            this.setState({textParts: textParts, currentPart: null, currentPartIndex: null});
        } else {
            this.setState({textParts: this.state.textParts.concat(textPart)});
        }

        this.hideModal();
    }

    addLineBreak() {
        this.setState({
            textParts: this.state.textParts.concat({
                type: partTypes.LINE_BREAK
            })
        });
    }

    editTextPart(key) {
        let textPart = this.state.textParts[key];
        this.setState({
            showEditPartModal: true,
            modalTitle: "Редактирование",
            currentPart: textPart,
            currentPartIndex: key
        });
    }

    removeTextPart(key) {
        if (confirm("Удалить фрагмент?")) {
            this.setState({textParts: this.state.textParts.filter((value, index) => index != key)});
        }
    }

    showCreatePartModal() {
        this.setState({
            showCreatePartModal: true, modalTitle: "Добавление текста", currentPart: {
                type: partTypes.TEXT
            }
        });
    }

    render() {
        let components = [];

        this.state.textParts.map((part, index) => {
            if (part.type == partTypes.TEXT) {
                components.push(<TextPart key={index} index={index} data={part.data} removePart={this.removeTextPart}
                                          editPart={this.editTextPart}/>);
            } else if (part.type == partTypes.QUESTION) {
                components.push(<QuestionPart key={index} index={index} data={part.data}
                                              removePart={this.removeTextPart} editPart={this.editTextPart}/>);
            } else if (part.type == partTypes.LINE_BREAK) {
                components.push(<LineBreakPart key={index} index={index} removePart={this.removeTextPart}/>);
            }
        });

        return <Panel>
            <Jumbotron>
                <FormGroup>
                    <ControlLabel>Заголовок</ControlLabel>
                    <FormControl
                        inputRef={title => {
                            this.title = title
                        }}
                    />
                </FormGroup>

                {components}
            </Jumbotron>

            <EditPartModal showModal={this.state.showEditPartModal}
                           modalTitle={this.state.modalTitle}
                           currentPartIndex={this.state.currentPartIndex}
                           currentPart={this.state.currentPart}
                           hideModal={this.hideModal}
                           saveTextPart={this.saveTextPart}/>

            <CreatePartModal showModal={this.state.showCreatePartModal}
                             modalTitle={this.state.modalTitle}
                             hideModal={this.hideModal}
                             saveTextPart={this.saveTextPart}/>

            <Button onClick={this.showCreatePartModal.bind(this)}>Добавить элемент</Button>
            <Button onClick={this.addLineBreak.bind(this)}>Добавить перенос строки</Button>
            <Button onClick={this.saveText.bind(this)} className="pull-right" bsStyle="success">Сохранить</Button>
        </Panel>
    }
}

class TextPart extends React.Component {
    render() {
        return <div className="text-part">
            {this.props.data}

            <ButtonGroup className="button-block">
                <Button onClick={() => this.props.editPart(this.props.index)} bsSize="xsmall"><Glyphicon
                    glyph="pencil"/></Button>
                <Button onClick={() => this.props.removePart(this.props.index)} bsSize="xsmall"
                        bsStyle="danger"><Glyphicon glyph="remove"/></Button>
            </ButtonGroup>
        </div>
    }
}

class QuestionPart extends React.Component {
    render() {
        return <div className="question-part">
            {this.props.data}

            <ButtonGroup className="button-block">
                <Button onClick={() => this.props.editPart(this.props.index)} bsSize="xsmall"><Glyphicon
                    glyph="pencil"/></Button>
                <Button onClick={() => this.props.removePart(this.props.index)} bsSize="xsmall"
                        bsStyle="danger"><Glyphicon glyph="remove"/></Button>
            </ButtonGroup>
        </div>
    }
}

class LineBreakPart extends React.Component {
    render() {
        return <div className="line-break-part ">
            ¶
            <ButtonGroup className="button-block">
                <Button onClick={() => this.props.removePart(this.props.index)} bsSize="xsmall"
                        bsStyle="danger"><Glyphicon glyph="remove"/></Button>
            </ButtonGroup>
        </div>
    }
}

export default Text;
