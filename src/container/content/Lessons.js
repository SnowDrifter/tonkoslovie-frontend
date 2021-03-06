import React from "react";
import Client from "../../util/Client";
import {Image, Panel} from "react-bootstrap";
import Helmet from "react-helmet";
import {Link} from "react-router";
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

    render() {
        let lessonPreviews = [];

        const lessons = this.state.lessons.sort(function (a, b) {
            return a.title.localeCompare(b.title);
        });

        lessons.map((lesson, index) => {
            const preview = lesson.previewImage ? <Image className="lesson-preview"
                                                         src={process.env.MEDIA_ENDPOINT + "/tonkoslovie/images/200_200-" + lesson.previewImage}
                                                         thumbnail/> : null;

            lessonPreviews.push(
                <Link className="lesson" key={index} to={"/lesson/" + lesson.id}>
                    <li>
                        {preview}

                        <h3 className="lesson-title">{lesson.title}</h3>
                        <p className="lesson-annotation">{lesson.annotation}</p>
                    </li>
                    <hr/>
                </Link>)
        });

        const body = <div>
            <Helmet title="Уроки | Тонкословие"/>

            <Panel>
                <Panel.Heading>Уроки</Panel.Heading>
                <Panel.Body>
                    <ul className="lessons-list">
                        {lessonPreviews}
                    </ul>
                </Panel.Body>
            </Panel>
        </div>;

        if (this.state.loaded) {
            return body;
        } else {
            return <Loader/>;
        }
    }
}

export default Lessons;