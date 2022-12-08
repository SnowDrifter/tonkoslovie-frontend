import React from "react";
import Client from "/util/Client";
import {ListGroup, Card} from "react-bootstrap";
import DOMPurify from "dompurify";
import Helmet from "react-helmet";
import {LinkContainer} from "react-router-bootstrap";
import ErrorPanel from "/component/ErrorPanel";
import Loader from "/component/Loader";
import "./Lesson.less"

class Lesson extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            lesson: {},
            loading: true,
            failed: false
        };

        this.loadLesson(props.params.lessonId);
    }

    loadLesson(lessonId) {
        Client.get("/api/content/lesson", {params: {id: lessonId}})
            .then(response => {
                this.setState({
                    lesson: response.data,
                    loading: false
                });
            })
            .catch(() => {
                this.setState({
                    loading: false,
                    failed: true
                });
            })
    }

    createTextList() {
        const texts = this.state.lesson.texts?.map((text, index) =>
            <LinkContainer key={index} to={`/text/${text.id}`}>
                <ListGroup.Item action>{text.title}</ListGroup.Item>
            </LinkContainer>
        );

        if (texts.length > 0) {
            return <div>
                <h3>Тексты</h3>
                <ListGroup>
                    {texts}
                </ListGroup>
            </div>
        }
    }

    render() {
        if (this.state.loading) {
            return <Loader/>;
        } else if (this.state.failed) {
            return <ErrorPanel text="Урок не найден"/>
        }

        const {lesson} = this.state;

        return <Card>
            <Helmet title={`${lesson.title} | Тонкословие`}/>
            <Card.Header style={{textAlign: "center"}}><h2>{lesson.title}</h2></Card.Header>

            <Card.Body>
                <div className="content" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(lesson.content)}}/>
                {this.createTextList()}
            </Card.Body>
        </Card>;
    }
}

export default Lesson;