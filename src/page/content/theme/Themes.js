import React from "react";
import Client from "/util/Client";
import {Card, ListGroup} from "react-bootstrap";
import Helmet from "react-helmet";
import {LinkContainer} from "react-router-bootstrap";
import Loader from "/component/Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import InfinityScrollLoader from "/component/InfinityScrollLoader";
import "./Themes.less"

class Themes extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            themes: [],
            currentPage: 0,
            hasMore: true,
            loading: true
        };

        this.loadThemes = this.loadThemes.bind(this);
        this.loadMoreThemes = this.loadMoreThemes.bind(this);
    }

    componentDidMount() {
        this.loadThemes();
    }

    loadMoreThemes() {
        this.setState({currentPage: this.state.currentPage + 1}, this.loadThemes)
    }

    loadThemes() {
        Client.get("/api/content/themes", {
            params: {
                page: this.state.currentPage,
                size: 40
            }
        })
            .then(response => {
                this.setState({
                    themes: this.state.themes.concat(response.data.content),
                    loading: false,
                    hasMore: !response.data.last
                })
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
                    <InfiniteScroll dataLength={themePreviews.length}
                                    next={this.loadMoreThemes}
                                    hasMore={this.state.hasMore}
                                    loader={<InfinityScrollLoader/>}>
                        <ListGroup>
                            {themePreviews}
                        </ListGroup>
                    </InfiniteScroll>
                </Card.Body>
            </Card>
        </>;
    }
}

export default Themes;