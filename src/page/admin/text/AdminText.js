import React, {createRef} from "react";
import {Breadcrumb, Button, ButtonGroup, Card, Form, Jumbotron, ProgressBar} from "react-bootstrap";
import Loader from "/component/Loader";
import {LinkContainer} from "react-router-bootstrap";
import Client from "/util/Client";
import EditPartModal from "/page/admin/text/edit/EditPartModal";
import TextPart from "/page/admin/text/TextPart";
import * as partTypes from "/page/content/text/TextPartTypes";
import ReactPlayer from "react-player";
import "./AdminText.less";
import {toast} from "react-toastify";
import {arrayMove} from "react-sortable-hoc";
import DraggableHorizontalList from "/component/DraggableHorizontalList";

class AdminText extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: null,
            showEditPartModal: false,
            showConfirmModal: false,
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
        this.createElements = this.createElements.bind(this);

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
        this.setState({textParts: this.state.textParts.filter((value, index) => index !== key)});
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

    createElements() {
        return this.state.textParts
            .map((part, index) => {
                let className;
                let data;
                let enableEditing = true;

                if (part.type === partTypes.TEXT) {
                    className = "admin-text-part";
                    data = part.data;
                } else if (part.type === partTypes.QUESTION) {
                    className = "admin-question-part";
                    data = part.data;
                } else if (part.type === partTypes.CHOICE) {
                    const words = part.choiceVariants.map(variant => {
                        return variant.title;
                    });

                    className = "admin-choice-part";
                    data = words.join(", ");
                } else if (part.type === partTypes.LINE_BREAK) {
                    className = "admin-line-break-part";
                    data = "¶";
                    enableEditing = false;
                }

                return <TextPart key={index}
                                 index={index}
                                 data={data}
                                 className={className}
                                 removePart={this.removeTextPart}
                                 editPart={enableEditing ? this.editTextPart : null}/>
            });
    }

    render() {
        if (!this.state.loaded) {
            return <Loader/>;
        }

        const elements = this.createElements();

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

        return <Card>
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
    }
}

export default AdminText;
