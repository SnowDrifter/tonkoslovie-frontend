import React from "react";
import Client from "/util/Client";
import {Card, ListGroup} from "react-bootstrap";
import Helmet from "react-helmet";
import {LinkContainer} from "react-router-bootstrap";
import Loader from "/component/Loader";
import ImageContainer from "/component/image/ImageContainer";
import "./Lessons.less";

class Lessons extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            lessons: [],
            loading: true
        };

        this.updateLessons = this.updateLessons.bind(this);
    }

    componentDidMount() {
        this.updateLessons();
    }

    updateLessons() {
        Client.get("/api/content/lessons")
            .then(response => {
                const lessons = response.data;
                this.setState({lessons: lessons, loading: false})
            });
    }

    createLessonPreviews() {
        return this.state.lessons.map((lesson, index) =>
            <LinkContainer to={`/lesson/${lesson.id}`} key={index}>
                <ListGroup.Item>
                    <ImageContainer imageFileName={lesson.previewImage} className="lesson-preview" size="200_200"/>
                    <h3 className="lesson-title">{lesson.title}</h3>
                    <p className="lesson-annotation">{lesson.annotation}</p>
                </ListGroup.Item>
            </LinkContainer>
        );
    }

    render() {
        if (this.state.loading) {
            return <Loader/>;
        }

        const lessonPreviews = this.createLessonPreviews();

        return <Card>
            <Helmet title="Уроки | Тонкословие"/>
            <Card.Header>Уроки</Card.Header>
            <Card.Body>
                <ListGroup>
                    {lessonPreviews}
                </ListGroup>
            </Card.Body>
        </Card>;
    }
}

export default Lessons;