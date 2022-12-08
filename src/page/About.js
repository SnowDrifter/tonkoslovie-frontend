import React from "react";
import {Card} from "react-bootstrap";
import Helmet from "react-helmet";

class About extends React.Component {
    render() {
        return <>
            <Helmet title="О проекте | Тонкословие"/>

            <Card className="jumbotron">
                <h2 style={{textAlign: "center"}}>Страница находится в разработке</h2>
                <h4 style={{textAlign: "center"}}>
                    <span style={{textDecoration: "line-through"}}>Скоро</span>&nbsp;Когда-нибудь
                    здесь будут описаны детали проекта
                </h4>
            </Card>
        </>
    }
}

export default About;