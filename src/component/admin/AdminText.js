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
    FieldGroup,
    ProgressBar,
    Modal,
    Form,
    Jumbotron,
    Glyphicon
} from "react-bootstrap";
import client from "../../util/client";
import style from './AdminText.less'
import EditPartModal from './EditPartModal'
import CreatePartModal from './CreatePartModal'
import * as partTypes from  '../TextPartTypes'
import ReactPlayer from 'react-player'

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
            textParts: [],
            progressUploadFile: null,
            soundFileName: null
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
        client.get('/api/content/text', {
            params: {
                id: textId
            }
        }).then(response => {
            const text = response.data;
            this.setState({
                id: text.id,
                textParts: text.parts,
                soundFileName: text.soundFileName
            });

            ReactDOM.findDOMNode(this.title).value = text.title;
        })
    }

    saveText() {
        client.post('/api/content/text', {
            id: this.state.id,
            title: ReactDOM.findDOMNode(this.title).value,
            parts: this.state.textParts ? this.state.textParts : [],
            soundFileName: this.state.soundFileName
        }).then((response) => {
            this.setState({
                id: response.data.id,
            });

            alert("Сохранено");
        })
    }

    hideModal() {
        this.setState({showEditPartModal: false, showCreatePartModal: false});
    }

    saveTextPart(index, textPart) {
        if (index || index == 0) {
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

    deleteSoundFile() {
        if (confirm("Удалить звуковую дорожку?")) {
            client.delete('/api/media/sound', {
                params: {
                    fileName: this.state.soundFileName
                }
            })
                .then(() => {
                    this.setState({soundFileName: null});
                    this.saveText();
                });
        }
    }

    uploadSound() {
        const sound = this.sound.files[0];
        if (sound == undefined) {
            alert("Выберите файл");
            return;
        }

        const data = new FormData();
        data.append('file', sound);
        data.append('textId', this.state.id);

        let config = {
            onUploadProgress: (progressEvent) => {
                this.setState({progressUploadFile: Math.round((progressEvent.loaded * 100) / progressEvent.total)});
            }
        };

        client.post('/api/media/sound', data, config)
            .then((response) => {
                this.setState({soundFileName: response.data.fileName, progressUploadFile: null});
                this.saveText();
            })
            .catch(() => {
                this.setState({progressUploadFile: null});
                alert("Произошла ошибка во время загрузки");
            });
    }

    render() {
        let elements = [];

        this.state.textParts.map((part, index) => {
            if (part.type == partTypes.TEXT) {
                elements.push(<TextPart key={index} index={index} data={part.data} removePart={this.removeTextPart}
                                        editPart={this.editTextPart}/>);
            } else if (part.type == partTypes.QUESTION) {
                elements.push(<QuestionPart key={index} index={index} data={part.data}
                                            removePart={this.removeTextPart} editPart={this.editTextPart}/>);
            } else if (part.type == partTypes.CHOICE) {
                elements.push(<ChoicePart choiceVariants={part.choiceVariants} key={index} index={index}
                                          removePart={this.removeTextPart} editPart={this.editTextPart}/>);
            } else if (part.type == partTypes.LINE_BREAK) {
                elements.push(<LineBreakPart key={index} index={index} removePart={this.removeTextPart}/>);
            }
        });

        let soundComponent;

        if (this.state.soundFileName) {
            soundComponent = <div>
                <h4>Звуковая дорожка</h4>
                <ReactPlayer
                    height={40}
                    controls={true}
                    url={process.env.NGINX_ENDPOINT + '/tonkoslovie/sounds/' + this.state.soundFileName}/>
                <Button onClick={this.deleteSoundFile.bind(this)}>Удалить дорожку</Button>
            </div>
        } else {
            soundComponent = <div>
                <FormGroup>
                    <ControlLabel><h4>Звуковая дорожка</h4></ControlLabel>
                    <FormControl
                        type="file"
                        inputRef={sound => {
                            this.sound = sound
                        }}
                    />
                </FormGroup>
                <Button bsSize="small" onClick={this.uploadSound.bind(this)}>Загрузить файл</Button>
                <ProgressBar striped
                             className="admin-text-progressbar"
                             active={this.state.progressUploadFile && this.state.progressUploadFile != 100}
                             style={{visibility: this.state.progressUploadFile ? 'visible ' : 'hidden'}}
                             bsStyle="success"
                             now={this.state.progressUploadFile}
                             label={(this.state.progressUploadFile) + "%"}/>
            </div>
        }

        return <Panel>
            <Jumbotron>
                <FormGroup>
                    <ControlLabel><h4>Заголовок</h4></ControlLabel>
                    <FormControl
                        inputRef={title => {
                            this.title = title
                        }}
                    />
                </FormGroup>

                {soundComponent}

                <h4>Элементы текста</h4>
                {elements}
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
        return <div className="admin-text-part">
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
        return <div className="admin-question-part">
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

class ChoicePart extends React.Component {
    render() {
        const words = [];

        this.props.choiceVariants.map(variant => {
            words.push(variant.title);
        });

        return <div className="admin-choice-part">
            {words.join(', ')}

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
        return <div className="admin-line-break-part ">
            ¶
            <ButtonGroup className="button-block">
                <Button onClick={() => this.props.removePart(this.props.index)} bsSize="xsmall"
                        bsStyle="danger"><Glyphicon glyph="remove"/></Button>
            </ButtonGroup>
        </div>
    }
}

export default Text;
