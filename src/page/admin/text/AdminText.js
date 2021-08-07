import React, {createRef} from "react";
import {Breadcrumb, Button, ButtonGroup, Card, Form, Jumbotron, ProgressBar} from "react-bootstrap";
import Loader from "/component/Loader";
import {LinkContainer} from "react-router-bootstrap";
import Client from "/util/Client";
import EditPartModal from "./EditPartModal";
import * as partTypes from "/page/content/text/TextPartTypes";
import ReactPlayer from "react-player";
import "./AdminText.less";
import {toast} from "react-toastify";
import RemoveButton from "/component/button/RemoveButton";
import EditRemoveButtons from "/component/button/EditRemoveButtons";
import {arrayMove} from "react-sortable-hoc";
import DraggableHorizontalList from "/component/DraggableHorizontalList";

class AdminText extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: null,
            showEditPartModal: false,
            modalTitle: null,
            currentPart: null,
            currentPartIndex: null,
            textParts: [],
            progressUploadFile: null,
            soundFileName: null,
            loaded: !this.props.computedMatch.params.textId
        };

        this.hideModal = this.hideModal.bind(this);
        this.editTextPart = this.editTextPart.bind(this);
        this.removeTextPart = this.removeTextPart.bind(this);
        this.changeTextPart = this.changeTextPart.bind(this);
        this.saveTextPartChanges = this.saveTextPartChanges.bind(this);
        this.onSortEnd = this.onSortEnd.bind(this);

        this.titleInput = createRef();
        this.soundInput = createRef();

        if (this.props.computedMatch.params.textId) {
            this.loadText(this.props.computedMatch.params.textId)
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
            this.setState({id: response.data.id});

            if (!this.props.computedMatch.params.lessonId) {
                this.props.history.push(`/admin/text/${response.data.id}`)
            }

            toast.success("Сохранено");
        }).catch((e) => {
            toast.error(`Ошибка сохранения! Код: ${e.response.status}`);
        })
    }

    hideModal() {
        this.setState({
            showEditPartModal: false,
            currentPart: null,
            currentPartIndex: null
        });
    }

    addLineBreak() {
        this.setState({
            textParts: this.state.textParts.concat({
                type: partTypes.LINE_BREAK
            })
        });
    }

    editTextPart(key) {
        const textPart = this.state.textParts[key];
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
            showEditPartModal: true,
            modalTitle: "Добавление текста",
            currentPartIndex: null,
            currentPart: {type: partTypes.TEXT}
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
                })
                .catch((e) => {
                    toast.error(`Ошибка удаления! Код: ${e.response.status}`);
                });
        }
    }

    changeTextPart(textPart) {
        this.setState({currentPart: textPart})
    }

    saveTextPartChanges(textPart) {
        if (this.state.currentPartIndex !== null) {
            this.setState(prevState => ({
                textParts: prevState.textParts.map(
                    (part, index) => {
                        return index === this.state.currentPartIndex ? textPart : part
                    }
                )
            }))
        } else {
            this.setState({textParts: this.state.textParts.concat(textPart)});
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

        const config = {
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

    onSortEnd(args) {
        this.setState({
            textParts: arrayMove(this.state.textParts, args.oldIndex, args.newIndex)
        });
    }

    render() {
        const elements = this.state.textParts
            .map((part, index) => {
                if (part.type === partTypes.TEXT) {
                    return <TextPart key={index} index={index} data={part.data}
                                     removePart={this.removeTextPart} editPart={this.editTextPart}/>;
                } else if (part.type === partTypes.QUESTION) {
                    return <QuestionPart key={index} index={index} data={part.data}
                                         removePart={this.removeTextPart} editPart={this.editTextPart}/>;
                } else if (part.type === partTypes.CHOICE) {
                    return <ChoicePart choiceVariants={part.choiceVariants} key={index} index={index}
                                       removePart={this.removeTextPart} editPart={this.editTextPart}/>;
                } else if (part.type === partTypes.LINE_BREAK) {
                    return <LineBreakPart key={index} index={index} removePart={this.removeTextPart}/>;
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
                    url={`${process.env.MEDIA_ENDPOINT}/tonkoslovie/sounds/${this.state.soundFileName}`}/>
                <Button variant="warning" onClick={this.deleteSoundFile.bind(this)}>Удалить дорожку</Button>
            </div>
        } else {
            soundComponent = <div>
                <Form.Group>
                    <Form.Label><h4>Звуковая дорожка</h4></Form.Label>
                    <Form.File ref={this.soundInput}/>
                </Form.Group>
                <Button size="sm" onClick={this.uploadSound.bind(this)}>Загрузить файл</Button>
                <ProgressBar striped
                             className="admin-text-progressbar"
                             style={{visibility: this.state.progressUploadFile ? "visible " : "hidden"}}
                             variant="success"
                             now={this.state.progressUploadFile}
                             label={`${this.state.progressUploadFile}%`}/>
            </div>
        }

        const body = <Card>
            <Card.Body>
                <Breadcrumb>
                    <LinkContainer exact to="/admin"><Breadcrumb.Item>Главная</Breadcrumb.Item></LinkContainer>
                    <LinkContainer exact to="/admin/texts"><Breadcrumb.Item>Тексты</Breadcrumb.Item></LinkContainer>
                    <Breadcrumb.Item
                        active>{(this.state.id) ? `Текст №${this.state.id}` : "Новый текст"}</Breadcrumb.Item>
                </Breadcrumb>

                <Jumbotron>
                    <Form.Group>
                        <Form.Label><h3>Заголовок</h3></Form.Label>
                        <Form.Control ref={this.titleInput}/>
                    </Form.Group>

                    {soundComponent}

                    <h3>Элементы текста</h3>
                    <DraggableHorizontalList elements={elements} onSortEnd={this.onSortEnd}/>
                </Jumbotron>

                <EditPartModal showModal={this.state.showEditPartModal}
                               modalTitle={this.state.modalTitle}
                               textPart={this.state.currentPart}
                               hideModal={this.hideModal}
                               changeTextPart={this.changeTextPart}
                               saveTextPartChanges={this.saveTextPartChanges}/>

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

            <EditRemoveButtons edit={() => this.props.editPart(this.props.index)}
                               remove={() => this.props.removePart(this.props.index)}/>
        </div>
    }
}

class QuestionPart extends React.Component {
    render() {
        return <div className="admin-question-part">
            {this.props.data}

            <EditRemoveButtons edit={() => this.props.editPart(this.props.index)}
                               remove={() => this.props.removePart(this.props.index)}/>
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

            <EditRemoveButtons edit={() => this.props.editPart(this.props.index)}
                               remove={() => this.props.removePart(this.props.index)}/>
        </div>
    }
}

class LineBreakPart extends React.Component {
    render() {
        return <div className="admin-line-break-part">
            ¶
            <RemoveButton action={() => this.props.removePart(this.props.index)}/>
        </div>
    }
}

export default AdminText;
