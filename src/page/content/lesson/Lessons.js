import React from "react";
import Client from "/util/Client";
import {Card, ListGroup} from "react-bootstrap";
import Helmet from "react-helmet";
import {LinkContainer} from "react-router-bootstrap";
import Loader from "/component/Loader";
import ImageContainer from "/component/image/ImageContainer";
import InfiniteScroll from "react-infinite-scroll-component";
import InfinityScrollLoader from "/component/InfinityScrollLoader";
import "./Lessons.less";

class Lessons extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            lessons: [],
            currentPage: 0,
            hasMore: true,
            loading: true
        };

        this.loadNewLessons = this.loadNewLessons.bind(this);
        this.updateLessons = this.updateLessons.bind(this);
    }

    componentDidMount() {
        this.updateLessons();
    }

    loadNewLessons() {
        this.setState({currentPage: this.state.currentPage + 1}, this.updateLessons)
    }

    updateLessons() {
        Client.get("/api/content/lessons", {
            params: {
                page: this.state.currentPage
            }
        })
            .then(response => {
                this.setState({
                    lessons: this.state.lessons.concat(response.data.content),
                    loading: false,
                    hasMore: !response.data.last
                })
            });
    }

    createLessonPreviews() {
        return this.state.lessons.map((lesson, index) =>
            <LinkContainer to={`/lesson/${lesson.id}`} key={index}>
                <ListGroup.Item>
                    <ImageContainer imageFileName={lesson.previewImage} className="lesson-preview" size="200_200"/>
                    <h3 className="lesson-title">{lesson.title}</h3>
                    <p className="lesson-annotation">{lesson.annotation}</p>
                </ListGroup.Item>
            </LinkContainer>
        );
    }

    render() {
        if (this.state.loading) {
            return <Loader/>;
        }

        const lessonPreviews = this.createLessonPreviews();

        return <Card>
            <Helmet title="Уроки | Тонкословие"/>

            <Card.Header>Уроки</Card.Header>
            <Card.Body>
                <InfiniteScroll dataLength={lessonPreviews.length}
                                next={this.loadNewLessons}
                                hasMore={this.state.hasMore}
                                loader={<InfinityScrollLoader/>}>
                    <ListGroup>
                        {lessonPreviews}
                    </ListGroup>
                </InfiniteScroll>
            </Card.Body>
        </Card>;
    }
}

export default Lessons;