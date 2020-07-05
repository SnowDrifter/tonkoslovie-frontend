import React from "react";
import {Link} from "react-router-dom";
import {Card} from "react-bootstrap";

class Admin extends React.Component {

    render() {
        return <Card>
            <Card.Header className="text-center"><h2>Админка</h2></Card.Header>
            <Card.Body>
                <Link to="/admin/lessons"><h3>Уроки</h3></Link>
                <Link to="/admin/texts"><h3>Тексты</h3></Link>
                <Link to="/admin/words"><h3>Слова</h3></Link>
                <Link to="/admin/exercises"><h3>Упражнения</h3></Link>
                <Link to="/admin/themes"><h3>Темы упражнений</h3></Link>
                <hr/>
                <Link to="/admin/users"><h3>Пользователи</h3></Link>
            </Card.Body>
        </Card>
    }
}

export default Admin;