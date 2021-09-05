import React, {createRef} from "react";
import {Button, Col, Container, Form, InputGroup, Row} from "react-bootstrap";
import "./AdminUserFilter.less"

class AdminUserFilter extends React.Component {

    constructor(props) {
        super(props);

        this.usernameInput = createRef();
        this.emailInput = createRef();
        this.creationDateInput = createRef();
        this.creationDateOperationInput = createRef();
        this.enabledInput = createRef();

        this.applyFilters = this.applyFilters.bind(this);
    }

    applyFilters(event) {
        event.preventDefault();

        this.props.applyFilters(this.createSearchParameters())
    }

    createSearchParameters() {
        const username = this.usernameInput.current.value;
        const email = this.emailInput.current.value;
        const creationDate = new Date(this.creationDateInput.current.value).getTime();
        const creationDateOperation = this.creationDateOperationInput.current.value;
        const enabled = this.enabledInput.current.value;

        const parameters = [];
        if (username !== "") {
            parameters.push({field: "username", operation: ":", value: username});
        }
        if (email !== "") {
            parameters.push({field: "email", operation: ":", value: email});
        }
        if (creationDate) {
            parameters.push({field: "creationDate", operation: creationDateOperation, value: creationDate});
        }
        if (enabled !== "") {
            parameters.push({field: "enabled", operation: ":", value: enabled});
        }
        return parameters;
    }

    render() {
        return <Container className="admin-user-filter">
            <h4>Фильтр</h4>

            <Form>
                <Row>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Никнейм</Form.Label>
                            <Form.Control ref={this.usernameInput}/>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Почта</Form.Label>
                            <Form.Control ref={this.emailInput}/>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Дата создания</Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <Form.Control as="select" ref={this.creationDateOperationInput}>
                                        <option value="<">До</option>
                                        <option value=">">После</option>
                                    </Form.Control>
                                </InputGroup.Prepend>

                                <Form.Control type="date" defaultValue={null} ref={this.creationDateInput}/>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col md={2}>
                        <Form.Group>
                            <Form.Label>Активен</Form.Label>
                            <Form.Control as="select" ref={this.enabledInput}>
                                <option value="">Не указано</option>
                                <option value="true">Да</option>
                                <option value="false">Нет</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>

                <Button type="submit" onClick={this.applyFilters}>Применить</Button>
            </Form>
        </Container>
    }
}

export default AdminUserFilter;
