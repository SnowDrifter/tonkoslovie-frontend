import React from "react";
import ReactDOM from "react-dom";
import Client from "../../util/Client";
import {
    Button,
    Checkbox,
    ControlLabel,
    FormControl,
    FormGroup,
    Glyphicon,
    Jumbotron,
    ListGroup,
    ListGroupItem,
    Panel,
    ProgressBar
} from "react-bootstrap";
import Loader from "../../component/Loader";
import {Link} from "react-router";
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import {ContentState, convertFromHTML, convertToRaw, EditorState} from "draft-js";
import {toast} from "react-toastify";
import {browserHistory} from "react-router"
import TagUtil from "../../util/TagUtil";


class Lesson extends React.Component {

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
            loaded: !this.props.params.lessonId
        };

        if (this.props.params.lessonId) {
            this.loadLesson(this.props.params.lessonId)
        }

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

            ReactDOM.findDOMNode(this.title).value = lesson.title;
            ReactDOM.findDOMNode(this.annotation).value = lesson.annotation || "";
        })
    }

    saveLesson() {
        Client.post("/api/content/lesson", {
            id: this.state.id,
            title: ReactDOM.findDOMNode(this.title).value,
            annotation: ReactDOM.findDOMNode(this.annotation).value,
            content: draftToHtml(convertToRaw(this.state.content.getCurrentContent())),
            published: this.state.published,
            texts: this.state.texts || [],
            previewImage: this.state.previewFileName
        }).then((response) => {
            this.setState({
                id: response.data.id,
            });

            if (!this.props.params.lessonId) {
                browserHistory.push("/admin/lesson/" + response.data.id)
            }

            toast.success("Сохранено");
        })
    }

    searchText() {
        let searchTitle = ReactDOM.findDOMNode(this.textTitle).value;

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
            if (oldText.id == text.id) {
                alreadyAdded = true;
            }
        });

        return alreadyAdded;
    }

    addText(index) {
        let text = this.state.foundTexts[index];

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
        const preview = this.preview.files[0];
        if (preview == undefined) {
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
        let texts = [];

        this.state.texts.map((text, index) => {
            texts.push(<ListGroupItem bsStyle="info" key={index}>
                {text.title}
                <Button bsSize="xsmall" bsStyle="danger" className="pull-right"
                        onClick={() => this.removeText(index)}>
                    <Glyphicon glyph="remove"/>
                </Button>
            </ListGroupItem>);
        });

        let foundTexts = [];

        if (this.state.foundTexts.length > 0) {
            this.state.foundTexts.map((text, index) => {
                if (!this.checkTextAlreadyAdded(text)) {
                    foundTexts.push(<ListGroupItem onClick={() => this.addText(index)} key={index}>
                        {text.title}
                    </ListGroupItem>);
                }
            });
        } else {
            foundTexts.push(<span key={0}>Ничего не найдено</span>);
        }

        let previewComponent;

        if (this.state.previewFileName) {
            previewComponent = <div>
                <h3>Превью</h3>
                <img src={process.env.MEDIA_ENDPOINT + "/tonkoslovie/images/200_200-" + this.state.previewFileName}/>
                <br/>
                <Button style={{marginTop: "5px"}} onClick={this.deletePreview.bind(this)}>Удалить превью</Button>
            </div>
        } else {
            previewComponent = <div>
                <FormGroup>
                    <ControlLabel><h4>Превью</h4></ControlLabel>
                    <FormControl
                        type="file"
                        inputRef={preview => {
                            this.preview = preview
                        }}
                    />
                </FormGroup>
                <Button bsSize="small" onClick={this.uploadPreviewImage.bind(this)}>Загрузить файл</Button>
                <ProgressBar striped
                             className="admin-text-progressbar"
                             active={this.state.progressUploadFile && this.state.progressUploadFile != 100}
                             style={{visibility: this.state.progressUploadFile ? "visible " : "hidden"}}
                             bsStyle="success"
                             now={this.state.progressUploadFile}
                             label={(this.state.progressUploadFile) + "%"}/>
            </div>
        }

        const body = <Panel>
            <Panel.Body>
                <ul className="breadcrumb">
                    <li><Link to="/admin">Главная</Link></li>
                    <li><Link to="/admin/lessons">Уроки</Link></li>
                    <li>{(this.state.id) ? "Урок № " + (this.state.id) : "Новый урок"}</li>
                </ul>

                <Jumbotron>
                    <h3>Заголовок</h3>
                    <FormGroup>
                        <FormControl
                            inputRef={title => {
                                this.title = title
                            }}
                        />
                    </FormGroup>

                    {previewComponent}

                    <h3>Аннотация</h3>
                    <FormGroup>
                        <FormControl
                            componentClass="textarea"
                            inputRef={annotation => {
                                this.annotation = annotation
                            }}
                        />
                    </FormGroup>

                    <h3>Текст урока</h3>
                    <Panel>
                        <Panel.Body>
                            <Editor
                                editorState={this.state.content}
                                toolbarClassName="toolbarClassName"
                                wrapperClassName="wrapperClassName"
                                editorClassName="editorClassName"
                                onEditorStateChange={this.handTextChange}
                            />
                        </Panel.Body>
                    </Panel>

                    <h3>Добавленные тексты</h3>
                    <ListGroup>
                        {texts}
                    </ListGroup>

                    <Panel>
                        <Panel.Body>
                            <FormGroup>
                                <ControlLabel>Поиск текста</ControlLabel>
                                <FormControl
                                    type="text"
                                    inputRef={textTitle => {
                                        this.textTitle = textTitle
                                    }}
                                    placeholder="Начните вводить данные для выбора"
                                    onChange={this.searchText.bind(this)}
                                />
                            </FormGroup>

                            Варианты:
                            <ListGroup>
                                {foundTexts}
                            </ListGroup>
                        </Panel.Body>
                    </Panel>

                    <Checkbox checked={this.state.published} onChange={this.togglePublished.bind(this)}>
                        Опубликовать урок
                    </Checkbox>
                </Jumbotron>
                <Button onClick={this.saveLesson.bind(this)} className="pull-right" bsStyle="success">Сохранить</Button>
            </Panel.Body>
        </Panel>;

        if (this.state.loaded) {
            return body;
        } else {
            return <Loader/>;
        }
    }
}

export default Lesson;