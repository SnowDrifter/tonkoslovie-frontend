import React, {createRef} from "react";
import {
    Breadcrumb,
    Button,
    ButtonGroup,
    Card,
    Form,
    Jumbotron,
    ProgressBar
} from "react-bootstrap";
import Loader from "../../component/Loader";
import {LinkContainer} from "react-router-bootstrap";
import Client from "../../util/Client";
import EditPartModal from "./EditPartModal";
import CreatePartModal from "./CreatePartModal";
import * as partTypes from "../content/TextPartTypes";
import ReactPlayer from "react-player";
import "./AdminText.less";
import {toast} from "react-toastify";
import {BsPencil, BsX} from "react-icons/bs"

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
            soundFileName: null,
            loaded: !this.props.match.params.textId
        };

        this.hideModal = this.hideModal.bind(this);
        this.saveTextPart = this.saveTextPart.bind(this);
        this.editTextPart = this.editTextPart.bind(this);
        this.removeTextPart = this.removeTextPart.bind(this);

        this.titleInput = createRef();
        this.soundInput = createRef();

        if (this.props.match.params.textId) {
            this.loadText(this.props.match.params.textId)
        }
    }

    loadText(textId) {
        Client.get("/api/content/text", {
            params: {
                id: textId
            }
        }).then(response => {
            const text = response.data;
            this.setState({
                id: text.id,
                textParts: text.parts,
                soundFileName: text.soundFileName,
                loaded: true
            });

            this.titleInput.current.value = text.title;
        })
    }

    saveText() {
        Client.post("/api/content/text", {
            id: this.state.id,
            title: this.titleInput.current.value,
            parts: this.state.textParts ? this.state.textParts : [],
            soundFileName: this.state.soundFileName
        }).then((response) => {
            this.setState({
                id: response.data.id,
            });

            if (!this.props.match.params.lessonId) {
                this.props.history.push("/admin/text/" + response.data.id)
            }

            toast.success("Сохранено");
        })
    }

    hideModal() {
        this.setState({showEditPartModal: false, showCreatePartModal: false});
    }

    saveTextPart(index, textPart) {
        if (index || index === 0) {
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
            this.setState({textParts: this.state.textParts.filter((value, index) => index !== key)});
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
            Client.delete("/api/media/sound", {
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
        const sound = this.soundInput.current.files[0];
        if (!sound) {
            toast.error("Выберите файл");
            return;
        }

        const data = new FormData();
        data.append("file", sound);
        data.append("textId", this.state.id);

        let config = {
            onUploadProgress: (progressEvent) => {
                this.setState({progressUploadFile: Math.round((progressEvent.loaded * 100) / progressEvent.total)});
            }
        };

        Client.post("/api/media/sound", data, config)
            .then((response) => {
                this.setState({soundFileName: response.data.fileName, progressUploadFile: null});
                this.saveText();
            })
            .catch(() => {
                this.setState({progressUploadFile: null});
                toast.error("Произошла ошибка во время загрузки");
            });
    }

    render() {
        let elements = [];

        this.state.textParts.map((part, index) => {
            if (part.type === partTypes.TEXT) {
                elements.push(<TextPart key={index} index={index} data={part.data} removePart={this.removeTextPart}
                                        editPart={this.editTextPart}/>);
            } else if (part.type === partTypes.QUESTION) {
                elements.push(<QuestionPart key={index} index={index} data={part.data}
                                            removePart={this.removeTextPart} editPart={this.editTextPart}/>);
            } else if (part.type === partTypes.CHOICE) {
                elements.push(<ChoicePart choiceVariants={part.choiceVariants} key={index} index={index}
                                          removePart={this.removeTextPart} editPart={this.editTextPart}/>);
            } else if (part.type === partTypes.LINE_BREAK) {
                elements.push(<LineBreakPart key={index} index={index} removePart={this.removeTextPart}/>);
            }
        });

        let soundComponent;

        if (this.state.soundFileName) {
            soundComponent = <div>
                <h3>Звуковая дорожка</h3>
                <ReactPlayer
                    width="100%"
                    height={40}
                    controls={true}
                    url={process.env.MEDIA_ENDPOINT + "/tonkoslovie/sounds/" + this.state.soundFileName}/>
                <Button variant="warning" onClick={this.deleteSoundFile.bind(this)}>Удалить дорожку</Button>
            </div>
        } else {
            soundComponent = <div>
                <Form.Group>
                    <Form.Label><h4>Звуковая дорожка</h4></Form.Label>
                    <Form.File ref={this.soundInput}/>
                </Form.Group>
                <Button size="small" onClick={this.uploadSound.bind(this)}>Загрузить файл</Button>
                <ProgressBar striped
                             className="admin-text-progressbar"
                             style={{visibility: this.state.progressUploadFile ? "visible " : "hidden"}}
                             variant="success"
                             now={this.state.progressUploadFile}
                             label={(this.state.progressUploadFile) + "%"}/>
            </div>
        }

        const body = <Card>
            <Card.Body>
                <Breadcrumb>
                    <LinkContainer exact to="/admin"><Breadcrumb.Item>Главная</Breadcrumb.Item></LinkContainer>
                    <LinkContainer exact to="/admin/texts"><Breadcrumb.Item>Тексты</Breadcrumb.Item></LinkContainer>
                    <Breadcrumb.Item
                        active>{(this.state.id) ? "Текст № " + (this.state.id) : "Новый текст"}</Breadcrumb.Item>
                </Breadcrumb>

                <Jumbotron>
                    <Form.Group>
                        <Form.Label><h3>Заголовок</h3></Form.Label>
                        <Form.Control
                            ref={this.titleInput}
                        />
                    </Form.Group>

                    {soundComponent}

                    <h3>Элементы текста</h3>
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

                <ButtonGroup>
                    <Button onClick={this.showCreatePartModal.bind(this)}>Добавить элемент</Button>
                    <Button onClick={this.addLineBreak.bind(this)}>Добавить перенос строки</Button>
                </ButtonGroup>
                <Button onClick={this.saveText.bind(this)} className="float-right"
                        variant="success">Сохранить</Button>
            </Card.Body>
        </Card>;

        if (this.state.loaded) {
            return body;
        } else {
            return <Loader/>;
        }
    }
}

class TextPart extends React.Component {
    render() {
        return <div className="admin-text-part">
            {this.props.data}

            <ButtonGroup className="button-block">
                <Button onClick={() => this.props.editPart(this.props.index)} size="xsmall">
                    <BsPencil/>
                </Button>
                <Button onClick={() => this.props.removePart(this.props.index)} size="xsmall" variant="danger">
                    <BsX/>
                </Button>
            </ButtonGroup>
        </div>
    }
}

class QuestionPart extends React.Component {
    render() {
        return <div className="admin-question-part">
            {this.props.data}

            <ButtonGroup className="button-block">
                <Button size="xsmall"
                        onClick={() => this.props.editPart(this.props.index)}>
                    <BsPencil/>
                </Button>
                <Button size="xsmall" variant="danger"
                        onClick={() => this.props.removePart(this.props.index)}>
                    <BsX/>
                </Button>
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
            {words.join(", ")}

            <ButtonGroup className="button-block">
                <Button size="xsmall"
                        onClick={() => this.props.editPart(this.props.index)}>
                    <BsPencil/>
                </Button>
                <Button size="xsmall" variant="danger"
                        onClick={() => this.props.removePart(this.props.index)}>
                    <BsX/>
                </Button>
            </ButtonGroup>
        </div>
    }
}

class LineBreakPart extends React.Component {
    render() {
        return <div className="admin-line-break-part ">
            ¶
            <ButtonGroup className="button-block">
                <Button size="xsmall" variant="danger"
                        onClick={() => this.props.removePart(this.props.index)}>
                    <BsX/>
                </Button>
            </ButtonGroup>
        </div>
    }
}

export default Text;
