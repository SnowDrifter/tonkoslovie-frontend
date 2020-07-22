import React from "react";
import Client from "../../util/Client";
import {Image, Card} from "react-bootstrap";
import Helmet from "react-helmet";
import {LinkContainer} from "react-router-bootstrap";
import Loader from "../../component/Loader";
import "./Lessons.less";

class Lessons extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            lessons: [],
            loaded: false
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
                this.setState({lessons: lessons, loaded: true})
            });
    }

    createLessonPreviews() {
        return this.state.lessons
            .sort(function (a, b) {
                return a.title.localeCompare(b.title);
            })
            .map((lesson, index) => {
                const imagePreview = lesson.previewImage ? <Image className="lesson-preview"
                                                             src={process.env.MEDIA_ENDPOINT + "/tonkoslovie/images/200_200-" + lesson.previewImage}
                                                             thumbnail/> : null;

                return <LinkContainer to={"/lesson/" + lesson.id} key={index}>
                    <li className="lesson">
                        {imagePreview}
                        <h3 className="lesson-title">{lesson.title}</h3>
                        <p className="lesson-annotation">{lesson.annotation}</p>
                        <hr/>
                    </li>
                </LinkContainer>;
            });
    }

    render() {
        const lessonPreviews = this.createLessonPreviews();

        const body = <div>
            <Helmet title="Уроки | Тонкословие"/>

            <Card>
                <Card.Header>Уроки</Card.Header>
                <Card.Body>
                    <ul className="lessons-list">
                        {lessonPreviews}
                    </ul>
                </Card.Body>
            </Card>
        </div>;

        if (this.state.loaded) {
            return body;
        } else {
            return <Loader/>;
        }
    }
}

export default Lessons;