import React from "react";
import client from "../../util/client";
import {Panel} from "react-bootstrap";
import Helmet from "react-helmet";
import {Link} from "react-router";
import Loader from "../../component/Loader";
import "./Themes.less"

class ExercisesThemes extends React.Component {

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
        client.get("/api/content/themes")
            .then(response => {
                const themes = response.data;
                this.setState({themes: themes, loaded: true})
            });
    }

    render() {
        let themePreviews = [];

        const themes = this.state.themes.sort(function (a, b) {
            return a.title.localeCompare(b.title);
        });

        themes.map((theme, index) => {

            themePreviews.push(
                // TODO: temp url
                <Link key={index} to={"/theme/" + theme.id}>
                    <li>
                        <h3 className="lesson-title">{theme.title}</h3>
                    </li>
                </Link>)
        });

        const body = <div>
            <Helmet title="Темы упражнений | Тонкословие"/>

            <Panel>
                <Panel.Heading>Темы упражнений</Panel.Heading>
                <Panel.Body>
                    <ul className="exercise-theme-list">
                        {themePreviews}
                    </ul>
                </Panel.Body>
            </Panel>
        </div>;

        if (this.state.loaded) {
            return body;
        } else {
            return <Loader/>;
        }
    }
}

export default ExercisesThemes;