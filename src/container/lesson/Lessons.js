import React from "react";
import axios from "axios";
import {Jumbotron, ListGroupItem, ListGroup} from "react-bootstrap";

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
        axios.get('http://localhost:8080/api/content/lessons')
            .then(response => {
                const lessons = response.data;
                this.setState({lessons: lessons})
            });
    }

    render() {
        let texts = [];

        this.state.lessons.map((text, index) => {
            texts.push(<ListGroupItem  href={"/lesson/" + text.id} key={index}>
                {text.title}
            </ListGroupItem>);
        });

        return <Jumbotron>
            <h3>Уроки</h3>
            <ListGroup>
                {texts}
            </ListGroup>
        </Jumbotron>
    }
}

export default Lessons;