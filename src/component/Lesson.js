import React from "react";
import client from "../util/client";
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

class Lesson extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: undefined,
            title: undefined,
            text: undefined,
            relatedTexts: [],
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
                text: lesson.text,
                relatedTexts: lesson.relatedTexts,
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

        const sortedTexts = this.state.relatedTexts.sort(function(a, b) {
            return a.title.localeCompare(b.title);
        });

        sortedTexts.map((text, index) => {
            texts.push(<Link key={index} className="list-group-item" to={"/text/" + text.id}>{text.title}</Link>);
        });

        // TODO: replace create content to function
        let content = <Panel>
            <Helmet title={title}/>

            <Jumbotron>
                <h2 style={{textAlign: "center"}}>{this.state.title}</h2>

                <div className="content" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.state.text)}}></div>

                <h3>Тексты</h3>
                <ListGroup>
                    {texts}
                </ListGroup>

            </Jumbotron>
        </Panel>;

        if (this.state.loaded) {
            return content;
        } else if (this.state.failed) {
            return <Jumbotron><h2 style={{color: "red", textAlign: "center"}}>Урок не найден</h2></Jumbotron>;
        } else {
            return null;
        }
    }
}

export default Lesson;