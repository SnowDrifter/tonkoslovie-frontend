import React from "react";
import {Jumbotron} from "react-bootstrap";
import Helmet from "react-helmet";

class Contacts extends React.Component {
    render() {
        return <>
            <Helmet title="Контакты | Тонкословие"/>

            <Jumbotron>
                <h2 style={{textAlign: "center"}}>Страница находится в разработке</h2>
            </Jumbotron>
        </>
    }
}

export default Contacts;