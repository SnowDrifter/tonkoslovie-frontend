import React from "react";
import Client from "/util/Client";
import {Card, ListGroup} from "react-bootstrap";
import Helmet from "react-helmet";
import {LinkContainer} from "react-router-bootstrap";
import Loader from "/component/Loader";
import "./Themes.less"

class Themes extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            themes: [],
            loaded: false
        };

        this.updateThemes = this.updateThemes.bind(this);
    }

    componentDidMount() {
        this.updateThemes();
    }

    updateThemes() {
        Client.get("/api/content/themes")
            .then(response => {
                const themes = response.data;
                this.setState({themes: themes, loaded: true})
            });
    }

    createThemePreviews() {
        return this.state.themes
            .sort(function (a, b) {
                return a.title.localeCompare(b.title);
            })
            .map((theme, index) => {
                return <LinkContainer exact to={`/theme/${theme.id}`}
                                      className="theme-title"
                                      key={index}>
                    <ListGroup.Item>
                        {theme.title}
                    </ListGroup.Item>
                </LinkContainer>
            });
    }

    render() {
        const themePreviews = this.createThemePreviews();

        const body = <Card>
            <Helmet title="Темы упражнений | Тонкословие"/>
            <Card.Header>Темы упражнений</Card.Header>
            <Card.Body>
                <ListGroup>
                    {themePreviews}
                </ListGroup>
            </Card.Body>
        </Card>;

        if (this.state.loaded) {
            return body;
        } else {
            return <Loader/>;
        }
    }
}

export default Themes;