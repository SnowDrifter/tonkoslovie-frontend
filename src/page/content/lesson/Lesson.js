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
            loading: true,
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
                loading: false
            });
        }).catch(() => {
            this.setState({
                loading: false,
                failed: true
            });
        })
    }

    createTextList() {
        const texts = this.state.texts.map((text, index) =>
            <LinkContainer key={index} className="list-group-item" to={`/text/${text.id}`}>
                <span>{text.title}</span>
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

        const textList = this.createTextList();

        return <Card>
            <Helmet title={`${this.state.title} | Тонкословие`}/>
            <Card.Header style={{textAlign: "center"}}><h2>{this.state.title}</h2></Card.Header>

            <Card.Body>
                <div className="content" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.state.content)}}/>
                {textList}
            </Card.Body>
        </Card>;
    }
}

export default Lesson;