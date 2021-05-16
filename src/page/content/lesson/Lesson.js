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
            id: undefined,
            title: undefined,
            content: undefined,
            texts: [],
            loaded: false,
            failed: false
        };

        this.loadLesson(props.match.params.lessonId);
    }

    loadLesson(lessonId) {
        Client.get("/api/content/lesson", {
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

    createTextList() {
        const sortedTexts = this.state.texts.sort(function (a, b) {
            return a.title.localeCompare(b.title);
        });

        let texts = [];
        sortedTexts.map((text, index) => {
            texts.push(
                <LinkContainer key={index} className="list-group-item" to={`/text/${text.id}`}>
                    <span>{text.title}</span>
                </LinkContainer>
            );
        });

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
        const title = `${this.state.title} | Тонкословие`;
        const textList = this.createTextList();

        let body = <Card>
            <Helmet title={title}/>
            <Card.Header style={{textAlign: "center"}}><h2>{this.state.title}</h2></Card.Header>

            <Card.Body>
                <div className="content" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.state.content)}}/>
                {textList}
            </Card.Body>
        </Card>;

        if (this.state.loaded) {
            return body;
        } else if (this.state.failed) {
            return <ErrorPanel text="Урок не найден"/>
        } else {
            return <Loader/>;
        }
    }
}

export default Lesson;