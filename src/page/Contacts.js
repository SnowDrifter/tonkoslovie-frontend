import React from "react";
import {Card} from "react-bootstrap";
import Helmet from "react-helmet";

class Contacts extends React.Component {
    render() {
        return <>
            <Helmet title="Контакты | Тонкословие"/>

            <Card className="jumbotron">
                <h2 style={{textAlign: "center"}}>Страница находится в разработке</h2>
            </Card>
        </>
    }
}

export default Contacts;