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
            loading: true
        };

        this.loadThemes = this.loadThemes.bind(this);
    }

    componentDidMount() {
        this.loadThemes();
    }

    loadThemes() {
        Client.get("/api/content/themes")
            .then(response => {
                const themes = response.data;
                this.setState({themes: themes, loading: false})
            });
    }

    createThemePreviews() {
        return this.state.themes
            .map((theme, index) =>
                <LinkContainer exact to={`/theme/${theme.id}`}
                               className="theme-title"
                               key={index}>
                    <ListGroup.Item>
                        {theme.title}
                    </ListGroup.Item>
                </LinkContainer>
            );
    }

    render() {
        if (this.state.loading) {
            return <Loader/>;
        }

        const themePreviews = this.createThemePreviews();

        return <>
            <Helmet title="Темы упражнений | Тонкословие"/>
            <Card>
                <Card.Header>Темы упражнений</Card.Header>
                <Card.Body>
                    <ListGroup>
                        {themePreviews}
                    </ListGroup>
                </Card.Body>
            </Card>
        </>;
    }
}

export default Themes;