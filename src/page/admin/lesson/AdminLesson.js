import React, {createRef} from "react";
import Client from "../../../util/Client";
import {LinkContainer} from "react-router-bootstrap";
import {
    Breadcrumb,
    Button,
    Card,
    Form,
    Jumbotron,
    ListGroup,
    ProgressBar
} from "react-bootstrap";
import Loader from "../../../component/Loader";
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import {ContentState, convertFromHTML, convertToRaw, EditorState} from "draft-js";
import {toast} from "react-toastify";
import TagUtil from "../../../util/TagUtil";
import RemoveButton from "../../../component/button/RemoveButton";


class AdminLesson extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: null,
            texts: [],
            foundTexts: [],
            content: EditorState.createEmpty(),
            published: false,
            previewFileName: null,
            progressUploadFile: null,
            loaded: !props.computedMatch.params.lessonId,
            lessonId: props.computedMatch.params.lessonId
        };

        if (this.state.lessonId) {
            this.loadLesson(this.state.lessonId)
        }

        this.previewInput = createRef();
        this.titleInput = createRef();
        this.annotationInput = createRef();
        this.textTitleInput = createRef();

        this.removeText = this.removeText.bind(this);
        this.addText = this.addText.bind(this);
        this.handTextChange = this.handTextChange.bind(this);
    }

    loadLesson(lessonId) {
        Client.get("/api/content/lesson", {
            params: {
                id: lessonId
            }
        }).then(response => {
            const lesson = response.data;

            if (TagUtil.isNotEmptyTag(lesson.content)) {
                const blocksFromHTML = convertFromHTML(lesson.content);
                const contentState = ContentState.createFromBlockArray(
                    blocksFromHTML.contentBlocks,
                    blocksFromHTML.entityMap
                );

                this.setState({content: EditorState.createWithContent(contentState)});
            }

            this.setState({
                id: lesson.id,
                texts: lesson.texts,
                published: lesson.published,
                previewFileName: lesson.previewImage,
                progressUploadFile: null,
                loaded: true
            });

            this.titleInput.current.value = lesson.title;
            this.annotationInput.current.value = lesson.annotation || "";
        })
    }

    saveLesson() {
        Client.post("/api/content/lesson", {
            id: this.state.id,
            title: this.titleInput.current.value,
            annotation: this.annotationInput.current.value,
            content: draftToHtml(convertToRaw(this.state.content.getCurrentContent())),
            published: this.state.published,
            texts: this.state.texts || [],
            previewImage: this.state.previewFileName
        }).then((response) => {
            this.setState({
                id: response.data.id,
            });

            if (!this.state.lessonId) {
                this.props.history.push("/admin/lesson/" + response.data.id)
            }

            toast.success("Сохранено");
        })
    }

    searchText() {
        let searchTitle = this.textTitleInput.current.value;

        Client.get("/api/content/texts/find", {
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

    checkTextAlreadyAdded(text) {
        let alreadyAdded = false;
        this.state.texts.forEach(function (oldText) {
            if (oldText.id === text.id) {
                alreadyAdded = true;
            }
        });

        return alreadyAdded;
    }

    addText(index) {
        const text = this.state.foundTexts[index];

        let foundTexts = this.state.foundTexts;
        foundTexts.splice(index, 1);
        this.setState({foundTexts: foundTexts});

        this.setState({texts: this.state.texts.concat(text)});
    }

    removeText(textId) {
        let texts = this.state.texts;
        texts.splice(textId, 1);
        this.setState({texts: texts});
    }

    handTextChange(content) {
        this.setState({
            content: content
        });
    }

    uploadPreviewImage() {
        const preview = this.previewInput.current.files[0];
        if (preview === undefined) {
            toast.error("Выберите файл");
            return;
        }

        const data = new FormData();
        data.append("file", preview);
        data.append("lessonId", this.state.id);

        let config = {
            onUploadProgress: (progressEvent) => {
                this.setState({progressUploadFile: Math.round((progressEvent.loaded * 100) / progressEvent.total)});
            }
        };

        Client.post("/api/media/image", data, config)
            .then((response) => {
                this.setState({previewFileName: response.data.fileName, progressUploadFile: null});
                this.saveLesson();
            })
            .catch(() => {
                this.setState({progressUploadFile: null});
                toast.error("Произошла ошибка во время загрузки");
            });
    }

    deletePreview() {
        if (confirm("Удалить превью?")) {
            Client.delete("/api/media/image", {
                params: {
                    fileName: this.state.previewFileName
                }
            }).then(() => {
                this.setState({previewFileName: null});
                this.saveLesson();
            }).catch(() => {
                toast.error("Произошла ошибка во время удаления");
            });
        }
    }

    togglePublished() {
        this.setState({published: !this.state.published});
    }

    render() {
        let texts = this.state.texts.map((text, index) => {
            return <ListGroup.Item key={index}
                                   variant="info"
                                   className="admin-lesson-text-preview">
                {text.title}
                <RemoveButton action={() => this.removeText(index)}/>
            </ListGroup.Item>
        });

        let foundTexts = [];

        if (this.state.foundTexts.length > 0) {
            this.state.foundTexts.map((text, index) => {
                if (!this.checkTextAlreadyAdded(text)) {
                    foundTexts.push(<ListGroup.Item onClick={() => this.addText(index)} key={index}>
                        {text.title}
                    </ListGroup.Item>);
                }
            });
        } else {
            foundTexts.push(<span key={0}>Ничего не найдено</span>);
        }

        let previewComponent;

        if (this.state.previewFileName) {
            previewComponent = <div>
                <h3>Превью</h3>
                <img src={process.env.MEDIA_ENDPOINT + "/tonkoslovie/images/200_200-" + this.state.previewFileName} alt="preview"/>
                <br/>
                <Button style={{marginTop: "5px"}} onClick={this.deletePreview.bind(this)}>Удалить превью</Button>
            </div>
        } else {
            previewComponent = <div>
                <Form.Group>
                    <Form.Label><h4>Превью</h4></Form.Label>
                    <Form.Control type="file" ref={this.previewInput}/>
                </Form.Group>
                <Button size="sm" onClick={this.uploadPreviewImage.bind(this)}>Загрузить файл</Button>
                <ProgressBar striped
                             className="admin-text-progressbar"
                             active={this.state.progressUploadFile && this.state.progressUploadFile !== 100}
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
                    <LinkContainer exact to="/admin/lessons"><Breadcrumb.Item>Уроки</Breadcrumb.Item></LinkContainer>
                    <Breadcrumb.Item active>
                        {(this.state.id) ? "Урок № " + (this.state.id) : "Новый урок"}
                    </Breadcrumb.Item>
                </Breadcrumb>

                <Jumbotron>
                    <h3>Заголовок</h3>
                    <Form.Group>
                        <Form.Control ref={this.titleInput}/>
                    </Form.Group>

                    {previewComponent}

                    <h3>Аннотация</h3>
                    <Form.Group>
                        <Form.Control as="textarea" ref={this.annotationInput}/>
                    </Form.Group>

                    <h3>Текст урока</h3>
                    <Card>
                        <Card.Body>
                            <Editor editorState={this.state.content}
                                    toolbarClassName="toolbarClassName"
                                    wrapperClassName="wrapperClassName"
                                    editorClassName="editorClassName"
                                    onEditorStateChange={this.handTextChange}
                            />
                        </Card.Body>
                    </Card>

                    <h3>Добавленные тексты</h3>
                    <ListGroup horizontal>
                        {texts}
                    </ListGroup>

                    <Card>
                        <Card.Body>
                            <Form.Group>
                                <Form.Label>Поиск текста</Form.Label>
                                <Form.Control
                                    type="text"
                                    ref={this.textTitleInput}
                                    placeholder="Начните вводить данные для выбора"
                                    onChange={this.searchText.bind(this)}
                                />
                            </Form.Group>

                            Варианты:
                            <ListGroup>
                                {foundTexts}
                            </ListGroup>
                        </Card.Body>
                    </Card>

                    <Form.Check type="checkbox" checked={this.state.published}
                                onChange={this.togglePublished.bind(this)} label="Опубликовать урок"/>
                </Jumbotron>
                <Button onClick={this.saveLesson.bind(this)} className="float-right"
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

export default AdminLesson;