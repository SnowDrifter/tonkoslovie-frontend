import React from "react";
import client from "../util/client";
import {ListGroupItem, ListGroup, Panel} from "react-bootstrap";
import Helmet from "react-helmet";
import {Link} from "react-router";
import style from './Lessons.less'

class Lessons extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            lessons: []
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
                this.setState({lessons: lessons})
            });
    }

    render() {
        let texts = [];

        const lessons = this.state.lessons.sort(function (a, b) {
            return a.title.localeCompare(b.title);
        });

        lessons.map((lesson, index) => {
            const preview = lesson.previewImage ?
                <img src={process.env.NGINX_ENDPOINT + '/tonkoslovie/images/200_200-' + lesson.previewImage}/> : null;

            texts.push(
                <Link key={index} to={"/lesson/" + lesson.id}>
                    <li>
                        {preview}
                        <h3>{lesson.title}</h3>
                        <p>{lesson.annotation}</p>
                    </li>
                </Link>)
        });

        return <div>
            <Helmet title="Уроки | Тонкословие"/>

            <Panel header="Уроки">
                <ul className="lessons-list">
                    {texts}
                </ul>
            </Panel>
        </div>
    }
}

export default Lessons;