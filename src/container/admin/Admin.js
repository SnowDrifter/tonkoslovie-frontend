import React from "react";
import {LinkContainer} from "react-router-bootstrap";
import {Card, ListGroup} from "react-bootstrap";
import "./Admin.less"

class Admin extends React.Component {

    render() {
        return <Card>
            <Card.Header className="text-center"><h2>Админка</h2></Card.Header>
            <Card.Body>
                <ListGroup>
                    <LinkContainer to="/admin/lessons">
                        <ListGroup.Item className="admin-menu-item">
                            Уроки
                        </ListGroup.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/texts">
                        <ListGroup.Item className="admin-menu-item">
                            Тексты
                        </ListGroup.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/words">
                        <ListGroup.Item className="admin-menu-item">
                            Слова
                        </ListGroup.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/exercises">
                        <ListGroup.Item className="admin-menu-item">
                            Упражнения
                        </ListGroup.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/themes">
                        <ListGroup.Item className="admin-menu-item">
                            Темы упражнений
                        </ListGroup.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/users">
                        <ListGroup.Item className="admin-menu-item">
                            Пользователи
                        </ListGroup.Item>
                    </LinkContainer>
                </ListGroup>
            </Card.Body>
        </Card>
    }
}

export default Admin;