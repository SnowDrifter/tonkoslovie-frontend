import React from "react";
import {Link} from "react-router";
import {Jumbotron, PageHeader, Grid, Row, Col} from "react-bootstrap";

class Admin extends React.Component {
    render() {
        return <Jumbotron>
            <h3>Админка</h3>

                <Link to="/admin/lessons" activeClassName='active'>Уроки</Link>
                <br/>
                <Link to="/admin/texts" activeClassName='active'>Тексты</Link>
                <br/>
                <Link to="/admin/words" activeClassName='active'>Слова</Link>

        </Jumbotron>
    }
}

export default Admin;