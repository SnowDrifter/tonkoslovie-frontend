import React from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import "./AdminAuditFilter.less"


class AdminAuditFilter extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            table: "",
            entityId: ""
        };
    }

    applyFilters = (event) => {
        event.preventDefault();

        this.props.applyFilters(this.createSearchParameters())
    }

    createSearchParameters() {
        return {
            table: this.state.table,
            entityId: this.state.entityId
        };
    }

    render() {
        return <Container className="admin-user-filter">
            <h4>Фильтр</h4>

            <Form>
                <Row>
                    <Form.Group as={Col} md={6}>
                        <Form.Label>Таблица</Form.Label>
                        <Form.Control as="select" onChange={e => this.setState({table: e.target.value})}>
                            <option value="">Все</option>
                            <option value="lesson">Уроки</option>
                            <option value="exercise">Упражнения</option>
                            <option value="theme">Темы упражнений</option>
                            <option value="text">Тексты</option>
                            <option value="word">Слова</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} md={6}>
                        <Form.Label>ID</Form.Label>
                        <Form.Control onChange={e => this.setState({entityId: e.target.value})}/>
                    </Form.Group>
                </Row>

                <Button className="my-2" type="submit" onClick={this.applyFilters}>Применить</Button>
            </Form>
        </Container>
    }
}

export default AdminAuditFilter;
