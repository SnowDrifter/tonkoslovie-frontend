import React from "react";
import {LinkContainer} from "react-router-bootstrap";
import {Card, ListGroup} from "react-bootstrap";
import "./Admin.less"

const menu = [
    {name: "Уроки", url: "/admin/lessons"},
    {name: "Тексты", url: "/admin/texts"},
    {name: "Слова", url: "/admin/words"},
    {name: "Упражнения", url: "/admin/exercises"},
    {name: "Темы упражнений", url: "/admin/themes"},
    {name: "Пользователи", url: "/admin/users"},
    {name: "Аудит", url: "/admin/audits"},
]

class Admin extends React.Component {

    render() {
        return <Card>
            <Card.Header className="text-center"><h2>Админка</h2></Card.Header>
            <Card.Body>
                <ListGroup>
                    {menu.map((item, index) =>
                        <LinkContainer key={index} to={item.url}>
                            <ListGroup.Item action className="admin-menu-item">{item.name}</ListGroup.Item>
                        </LinkContainer>)}
                </ListGroup>
            </Card.Body>
        </Card>
    }
}

export default Admin;