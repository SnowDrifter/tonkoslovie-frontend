import React from "react";
import axios from "axios";
import {
    Panel,
    PageHeader,
    Jumbotron,
    ListGroup,
    ListGroupItem
} from "react-bootstrap";
import DOMPurify from 'dompurify'
import Helmet from "react-helmet";

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
        axios.get('http://localhost:8080/api/content/lesson', {
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
        // TODO: add failure load message
        let texts = [];
        let title = this.state.title + " | Тонкословие";

        this.state.relatedTexts.map((text, index) => {
            texts.push(<ListGroupItem key={index} href={"/text/" + text.id}>
                {text.title}
            </ListGroupItem>);
        });

        // TODO: replace create content to function
        let content = <Panel>
            <Helmet title={title}/>

            <Jumbotron>
                <PageHeader style={{textAlign: "center"}}>{this.state.title}</PageHeader>

                <div className="content" dangerouslySetInnerHTML={{__html:  DOMPurify.sanitize(this.state.text)}}></div>

                <h3>Тексты</h3>
                <ListGroup>
                    {texts}
                </ListGroup>

            </Jumbotron>
        </Panel>;

        if (this.state.loaded) {
            return content;
        } else {
            return null;
        }
    }
}

export default Lesson;