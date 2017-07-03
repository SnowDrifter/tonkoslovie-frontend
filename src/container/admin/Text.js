import React from "react";
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
import EditPartModal from '../../component/admin/EditPartModal'
import CreatePartModal from '../../component/admin/CreatePartModal'
import * as  partTypes from '../../component/admin/TextPartTypes'

class Text extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showEditPartModal: false,
            showCreatePartModal: false,
            modalTitle: null,
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

        this.hideModal = this.hideModal.bind(this);
        this.saveTextPart = this.saveTextPart.bind(this);
        this.editTextPart = this.editTextPart.bind(this);
        this.removeTextPart = this.removeTextPart.bind(this);
    }

    saveText() {
        alert("Сохранено");
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

    addLineBreak(){
            this.setState({textParts: this.state.textParts.concat({
            type: partTypes.LINE_BREAK
        })});
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
        this.setState({textParts: this.state.textParts.filter((value, index) => index != key)});
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
