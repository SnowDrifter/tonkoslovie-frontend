import React, {createRef} from "react";
import {Breadcrumb, Button, ButtonGroup, Card, Form, Jumbotron} from "react-bootstrap";
import Loader from "/component/Loader";
import {LinkContainer} from "react-router-bootstrap";
import Client from "/util/Client";
import EditPartModal from "/page/admin/text/edit/EditPartModal";
import TextPart from "/page/admin/text/TextPart";
import * as partTypes from "/page/content/text/TextPartTypes";
import "./AdminText.less";
import {toast} from "react-toastify";
import {arrayMove} from "react-sortable-hoc";
import DraggableHorizontalList from "/component/DraggableHorizontalList";
import SoundUploader from "/component/sound/SoundUploader";

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
        this.saveSoundFileName = this.saveSoundFileName.bind(this);

        this.titleInput = createRef();

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

    saveSoundFileName(soundFileName) {
        this.setState({soundFileName});
        this.saveText()
    }

    onSortEnd(args) {
        this.setState({
            textParts: arrayMove(this.state.textParts, args.oldIndex, args.newIndex)
        });
    }

    createElements() {
        return this.state.textParts
            .map((part, index) => {
                return <TextPart key={index}
                                 index={index}
                                 part={part}
                                 removePart={this.removeTextPart}
                                 editPart={this.editTextPart}/>
            });
    }

    render() {
        if (!this.state.loaded) {
            return <Loader/>;
        }

        const elements = this.createElements();

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

                    <SoundUploader soundFileName={this.state.soundFileName}
                                   saveSoundFileName={this.saveSoundFileName}/>

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
