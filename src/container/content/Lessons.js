import React from "react";
import client from "../../util/client";
import {ListGroupItem, ListGroup, Panel, Image} from "react-bootstrap";
import Helmet from "react-helmet";
import {Link} from "react-router";
import style from './Lessons.less'
import Loader from '../../component/Loader';

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
        client.get('/api/content/lessons')
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
            const preview = lesson.previewImage ? <Image className="lesson-preview" src={process.env.MEDIA_ENDPOINT + '/tonkoslovie/images/200_200-' + lesson.previewImage} thumbnail/> : null;

            lessonPreviews.push(
                <Link className="lesson" key={index} to={"/lesson/" + lesson.id}>
                    <li>
                        <div className="lesson-image-wrapper">
                        {preview}
                        </div>
                        <h3 className="lesson-title">{lesson.title}</h3>
                        <p className="lesson-annotation">{lesson.annotation}</p>
                    </li>
                    <hr/>
                </Link>)
        });

        const body = <div>
            <Helmet title="Уроки | Тонкословие"/>

            <Panel header="Уроки">
                <ul className="lessons-list">
                    {lessonPreviews}
                </ul>
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