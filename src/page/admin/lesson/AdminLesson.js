import React from "react";
import Client from "/util/Client";
import {LinkContainer} from "react-router-bootstrap";
import {Breadcrumb, Button, Card, Form, ListGroup} from "react-bootstrap";
import Loader from "/component/Loader";
import JoditEditor from "jodit-react";
import {toast} from "react-toastify";
import RemoveButton from "/component/button/RemoveButton";
import ImageUploader from "/component/image/ImageUploader";


class AdminLesson extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            lesson: {},
            textVariants: [],
            loading: props.params.lessonId !== undefined
        };

        if (props.params.lessonId) {
            this.loadLesson(props.params.lessonId)
        }
    }

    loadLesson(lessonId) {
        Client.get("/api/content/lesson", {params: {id: lessonId}})
            .then(response => {
                this.setState({
                    lesson: response.data,
                    loading: false
                });
            })
    }

    saveLesson = () => {
        Client.post("/api/content/lesson", this.state.lesson)
            .then((response) => {
                this.updateLesson("id", response.data.id)

                if (!this.props.params.lessonId) {
                    this.props.navigate(`/admin/lesson/${response.data.id}`)
                }

                toast.success("Сохранено");
            })
            .catch(e => toast.error(`Ошибка сохранения! Код: ${e.response.status}`))
    }

    searchText = (searchTitle) => {
        Client.get("/api/content/texts/find", {params: {title: searchTitle}})
            .then(response => this.setState({textVariants: response.data}))
            .catch(e => toast.error(`Ошибка поиска! Код: ${e.response.status}`))
    }

    isTextAlreadyAdded = (text) => this.state.lesson.texts?.some(t => t.id === text.id)

    addText = (index) => {
        const {textVariants} = this.state;
        const text = textVariants[index];
        textVariants.splice(index, 1);

        this.setState({textVariants});
        this.updateLesson("texts", [...this.state.lesson.texts, text])
    }

    removeText = (textId) => {
        const {texts} = this.state.lesson;
        texts.splice(textId, 1);
        this.updateLesson("texts", texts)
    }

    savePreviewImage = (previewImage) => {
        this.updateLesson("previewImage", previewImage, this.saveLesson)
    }

    createTexts = () => {
        return this.state.lesson.texts?.map((text, index) =>
            <ListGroup.Item key={index} variant="info" className="admin-lesson-text-preview">
                {text.title}
                <RemoveButton action={() => this.removeText(index)}/>
            </ListGroup.Item>
        );
    }

    createTextVariants = () => {
        return this.state.textVariants?.map((text, index) => {
            if (!this.isTextAlreadyAdded(text)) {
                return <ListGroup.Item onClick={() => this.addText(index)} key={index}>
                    {text.title}
                </ListGroup.Item>;
            }
        });
    }

    updateLesson = (field, value, callback) => this.setState({lesson: {...this.state.lesson, [field]: value}}, callback)

    render() {
        if (this.state.loading) {
            return <Loader/>;
        }

        const {lesson} = this.state;
        const textVariants = this.createTextVariants();

        return <Card>
            <Card.Body>
                <Breadcrumb>
                    <LinkContainer to="/admin"><Breadcrumb.Item>Главная</Breadcrumb.Item></LinkContainer>
                    <LinkContainer to="/admin/lessons"><Breadcrumb.Item>Уроки</Breadcrumb.Item></LinkContainer>
                    <Breadcrumb.Item active>{(lesson.id) ? `Урок №${lesson.id}` : "Новый урок"}</Breadcrumb.Item>
                </Breadcrumb>

                <Card className="jumbotron">
                    <h3>Заголовок</h3>
                    <Form.Group className="mb-3">
                        <Form.Control defaultValue={lesson.title}
                                      onChange={e => this.updateLesson("title", e.target.value)}/>
                    </Form.Group>

                    <ImageUploader imageFileName={lesson.previewImage} saveImageFileName={this.savePreviewImage}/>

                    <h3>Аннотация</h3>
                    <Form.Group>
                        <Form.Control defaultValue={lesson.annotation} as="textarea"
                                      onChange={e => this.updateLesson("annotation", e.target.value)}/>
                    </Form.Group>

                    <h3 className="mt-3">Текст урока</h3>
                    <Card>
                        <JoditEditor value={lesson.content}
                                     onChange={content => this.updateLesson("content", content)}/>
                    </Card>

                    <h3 className="mt-3">Добавленные тексты</h3>
                    <ListGroup horizontal>
                        {this.createTexts()}
                    </ListGroup>

                    <Card>
                        <Card.Body>
                            <Form.Group>
                                <Form.Label>Поиск текста</Form.Label>
                                <Form.Control type="text" placeholder="Начните вводить данные для выбора"
                                              onChange={e => this.searchText(e.target.value)}/>
                            </Form.Group>

                            Варианты:
                            <ListGroup>
                                {textVariants.length ? textVariants : <span key={0}>Ничего не найдено</span>}
                            </ListGroup>
                        </Card.Body>
                    </Card>

                    <Form.Check className="mt-3" name="published" label="Опубликовать урок"
                                defaultChecked={lesson.published} onChange={e => this.updateLesson("published", e.target.checked)}/>
                </Card>
                <Button onClick={this.saveLesson} className="float-end"
                        variant="success">Сохранить</Button>
            </Card.Body>
        </Card>;
    }
}

export default AdminLesson;