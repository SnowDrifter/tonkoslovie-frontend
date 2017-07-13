import React from "react";
import axios from "axios";
import {
    Panel,
    PageHeader,
    Jumbotron,
    ListGroup,
    ListGroupItem
} from "react-bootstrap";

class Lesson extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: undefined,
            title: undefined,
            text: undefined,
            relatedTexts: []
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
                relatedTexts: lesson.relatedTexts
            });
        })
    }

    render() {
        let texts = [];

        this.state.relatedTexts.map((text, index) => {
            texts.push(<ListGroupItem key={index} href={"/text/" + text.id}>
                {text.title}
            </ListGroupItem>);
        });


        return <Panel>
            <Jumbotron>
                <PageHeader style={{textAlign: "center"}}>{this.state.title}</PageHeader>

                <div className="content" dangerouslySetInnerHTML={{__html: this.state.text}}></div>

                <h3>Тексты</h3>
                <ListGroup>
                    {texts}
                </ListGroup>

            </Jumbotron>
        </Panel>
    }
}

export default Lesson;