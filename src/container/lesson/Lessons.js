import React from "react";
import client from "../../util/client";
import {ListGroupItem, ListGroup, Panel} from "react-bootstrap";
import Helmet from "react-helmet";

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

        this.state.lessons.map((text, index) => {
            texts.push(<ListGroupItem href={"/lesson/" + text.id} key={index}>
                {text.title}
            </ListGroupItem>);
        });

        return <div>
            <Helmet title="Уроки | Тонкословие"/>

            <Panel header="Уроки">
                <ListGroup>
                    {texts}
                </ListGroup>
            </Panel>
        </div>
    }
}

export default Lessons;