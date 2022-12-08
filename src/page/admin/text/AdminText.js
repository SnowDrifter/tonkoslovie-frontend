import React from "react";
import {Breadcrumb, Button, ButtonGroup, Card, Form} from "react-bootstrap";
import Loader from "/component/Loader";
import {LinkContainer} from "react-router-bootstrap";
import Client from "/util/Client";
import EditPartModal from "/page/admin/text/edit/EditPartModal";
import TextPart from "/page/admin/text/TextPart";
import {TEXT, LINE_BREAK} from "/page/content/text/TextPartTypes";
import {toast} from "react-toastify";
import {arrayMoveImmutable} from "array-move";
import DraggableHorizontalList from "/component/DraggableHorizontalList";
import SoundUploader from "/component/sound/SoundUploader";
import "./AdminText.less";


class AdminText extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            text: {},
            showEditPartModal: false,
            showConfirmModal: false,
            modalTitle: null,
            currentPart: null,
            currentPartIndex: null,
            loading: props.params.textId !== undefined
        };

        if (props.params.textId) {
            this.loadText(this.props.params.textId)
        }
    }

    loadText(textId) {
        Client.get("/api/content/text", {params: {id: textId}})
            .then(response => {
                this.setState({
                    text: response.data,
                    loading: false
                });
            })
            .catch(e => {
                this.setState({loading: false});
                toast.error(`Ошибка загрузки! Код: ${e.response.status}`);
            })
    }

    saveText = () => {
        Client.post("/api/content/text", this.state.text)
            .then((response) => {
                this.setState({id: response.data.id});

                if (!this.props.params.textId) {
                    this.props.navigate(`/admin/text/${response.data.id}`)
                }

                toast.success("Сохранено");
            })
            .catch(e => toast.error(`Ошибка сохранения! Код: ${e.response.status}`))
    }

    hideModal = () => {
        this.setState({
            showEditPartModal: false,
            currentPart: null,
            currentPartIndex: null
        });
    }

    addLineBreak = () => {
        const parts = [...this.state.text.parts || [], {type: LINE_BREAK}]
        this.updateText("parts", parts)
    }

    editTextPart = (index) => {
        const textPart = this.state.text.parts[index];
        this.setState({
            showEditPartModal: true,
            modalTitle: "Редактирование",
            currentPart: textPart,
            currentPartIndex: index
        });
    }

    removeTextPart = (index) => {
        const newParts = this.state.text.parts?.filter((v, i) => i !== index);
        this.updateText("parts", newParts)
    }

    showCreatePartModal = () => {
        this.setState({
            showEditPartModal: true,
            modalTitle: "Добавление текста",
            currentPartIndex: null,
            currentPart: {type: TEXT}
        });
    }

    changeTextPart = (textPart) => {
        this.setState({currentPart: textPart})
    }

    saveTextPartChanges = (newPart) => {
        const {currentPartIndex, text} = this.state;
        const parts = text.parts || []

        if (currentPartIndex !== null) {
            const newParts = parts.map((part, index) => index === currentPartIndex ? newPart : part)
            this.updateText("parts", newParts)
        } else {
            this.updateText("parts", parts.concat(newPart))
        }

        this.hideModal()
    }

    saveSoundFileName = (soundFileName) => {
        this.updateText("soundFileName", soundFileName, this.saveText)
    }

    onSortEnd = (args) => {
        const newParts = arrayMoveImmutable(this.state.text.parts, args.oldIndex, args.newIndex);
        this.updateText("parts", newParts)
    }

    createElements = () => {
        return this.state.text.parts?.map((part, index) =>
            <TextPart key={index}
                      index={index}
                      part={part}
                      removePart={this.removeTextPart}
                      editPart={this.editTextPart}/>
        );
    }

    updateText = (field, value, callback) => this.setState({text: {...this.state.text, [field]: value}}, callback);

    render() {
        if (this.state.loading) {
            return <Loader/>;
        }

        const {text} = this.state;
        const elements = this.createElements();

        return <Card>
            <Card.Body>
                <Breadcrumb>
                    <LinkContainer to="/admin"><Breadcrumb.Item>Главная</Breadcrumb.Item></LinkContainer>
                    <LinkContainer to="/admin/texts"><Breadcrumb.Item>Тексты</Breadcrumb.Item></LinkContainer>
                    <Breadcrumb.Item active>
                        {(this.state.id) ? `Текст №${this.state.id}` : "Новый текст"}
                    </Breadcrumb.Item>
                </Breadcrumb>

                <Card className="jumbotron" style={{padding: "2rem"}}>
                    <Form.Group className="mb-3">
                        <h3>Заголовок</h3>
                        <Form.Control defaultValue={text.title}
                                      onChange={e => this.updateText("title", e.target.value)}/>
                    </Form.Group>

                    <SoundUploader soundFileName={text.soundFileName}
                                   saveSoundFileName={this.saveSoundFileName}/>

                    <h3 className="mt-2">Элементы текста</h3>
                    <DraggableHorizontalList elements={elements || []} changeElements={this.onSortEnd}/>

                    <div className="mt-2">
                        <ButtonGroup>
                            <Button onClick={this.showCreatePartModal}>Добавить элемент</Button>
                            <Button onClick={this.addLineBreak}>Добавить перенос строки</Button>
                        </ButtonGroup>
                    </div>
                </Card>

                <EditPartModal showModal={this.state.showEditPartModal}
                               modalTitle={this.state.modalTitle}
                               textPart={this.state.currentPart}
                               hideModal={this.hideModal}
                               changeTextPart={this.changeTextPart}
                               saveTextPartChanges={this.saveTextPartChanges}/>

                <Button onClick={this.saveText} className="float-end" variant="success">Сохранить</Button>
            </Card.Body>
        </Card>;
    }
}

export default AdminText;
