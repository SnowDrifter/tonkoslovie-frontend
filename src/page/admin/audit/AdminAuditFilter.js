import React, {createRef} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import "./AdminAuditFilter.less"


class AdminAuditFilter extends React.Component {

    constructor(props) {
        super(props);

        this.tableInput = createRef();
        this.entityIdInput = createRef();

        this.applyFilters = this.applyFilters.bind(this);
    }

    applyFilters(event) {
        event.preventDefault();

        this.props.applyFilters(this.createSearchParameters())
    }

    createSearchParameters() {
        return {
            table: this.tableInput.current.value,
            entityId: this.entityIdInput.current.value
        };
    }

    render() {
        return <Container className="admin-user-filter">
            <h4>Фильтр</h4>

            <Form>
                <Row>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Таблица</Form.Label>
                            <Form.Control as="select" ref={this.tableInput}>
                                <option value="">Все</option>
                                <option value="lesson">Уроки</option>
                                <option value="exercise">Упражнения</option>
                                <option value="theme">Темы упражнений</option>
                                <option value="text">Тексты</option>
                                <option value="word">Слова</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>ID</Form.Label>
                            <Form.Control ref={this.entityIdInput}/>
                        </Form.Group>
                    </Col>
                </Row>

                <Button type="submit" onClick={this.applyFilters}>Применить</Button>
            </Form>
        </Container>
    }
}

export default AdminAuditFilter;
