import React from "react";
import client from "../../util/client";
import {
    Panel,
    PageHeader,
    Jumbotron,
    ListGroup,
    ListGroupItem
} from "react-bootstrap";
import DOMPurify from 'dompurify'
import Helmet from "react-helmet";
import {Link} from 'react-router'
import Loader from '../Loader';

class Lesson extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: undefined,
            title: undefined,
            content: undefined,
            texts: [],
            loaded: false,
            failed: false
        };

        this.loadLesson(this.props.params.lessonId);
    }

    loadLesson(lessonId) {
        client.get('/api/content/lesson', {
            params: {
                id: lessonId
            }
        }).then(response => {
            const lesson = response.data;
            this.setState({
                id: lesson.id,
                title: lesson.title,
                content: lesson.content,
                texts: lesson.texts,
                loaded: true
            });
        }).catch(() => {
            this.setState({
                failed: true
            });
        })
    }

    render() {
        let texts = [];
        let title = this.state.title + " | Тонкословие";

        const sortedTexts = this.state.texts.sort(function(a, b) {
            return a.title.localeCompare(b.title);
        });

        sortedTexts.map((text, index) => {
            texts.push(<Link key={index} className="list-group-item" to={"/text/" + text.id}>{text.title}</Link>);
        });

        let body = <Panel>
            <Helmet title={title}/>
                <PageHeader style={{textAlign: "center"}}>{this.state.title}</PageHeader>

                <div className="content" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.state.content)}}></div>

                <h3>Тексты</h3>
                <ListGroup>
                    {texts}
                </ListGroup>
        </Panel>;

        if (this.state.loaded) {
            return body;
        } else if (this.state.failed) {
            return <Jumbotron><h2 style={{color: "red", textAlign: "center"}}>Урок не найден</h2></Jumbotron>;
        } else {
            return <Loader/>;
        }
    }
}

export default Lesson;