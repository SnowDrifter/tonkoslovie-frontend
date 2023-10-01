import React from "react";
import {Button, Col, Container, Form, InputGroup, Row} from "react-bootstrap";
import "./AdminUserFilter.less"

class AdminUserFilter extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            email: "",
            creationDate: "",
            creationDateOperation: "<",
            enabled: ""
        };
    }

    applyFilters = (event) => {
        event.preventDefault();

        this.props.applyFilters(this.createSearchParameters())
    }

    createSearchParameters() {
        const {username, email, creationDate, creationDateOperation, enabled} = this.state;

        const parameters = [];

        username && parameters.push({field: "username", operation: ":", value: username});
        email && parameters.push({field: "email", operation: ":", value: email});
        creationDate && parameters.push({field: "creationDate", operation: creationDateOperation, value: creationDate});
        enabled && parameters.push({field: "enabled", operation: ":", value: enabled});

        return parameters;
    }

    render() {
        return <Container className="admin-user-filter">
            <h4>Фильтр</h4>

            <Form>
                <Row>
                    <Form.Group as={Col} md={3}>
                        <Form.Label>Никнейм</Form.Label>
                        <Form.Control onChange={e => this.setState({username: e.target.value})}/>
                    </Form.Group>
                    <Form.Group as={Col} md={3}>
                        <Form.Label>Почта</Form.Label>
                        <Form.Control onChange={e => this.setState({email: e.target.value})}/>
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                        <Form.Label>Дата создания</Form.Label>
                        <InputGroup>
                            <Form.Control as="select"
                                          onChange={e => this.setState({creationDateOperation: e.target.value})}>
                                <option value="<">До</option>
                                <option value=">">После</option>
                            </Form.Control>

                            <Form.Control type="date" defaultValue={null}
                                          onChange={e => this.setState({creationDate: new Date(e.target.value).getTime()})}/>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} md={2}>
                        <Form.Label>Активен</Form.Label>
                        <Form.Control as="select" onChange={e => this.setState({enabled: e.target.value})}>
                            <option value="">Не указано</option>
                            <option value="true">Да</option>
                            <option value="false">Нет</option>
                        </Form.Control>
                    </Form.Group>
                </Row>

                <Button className="my-2" type="submit" onClick={this.applyFilters}>Применить</Button>
            </Form>
        </Container>
    }
}

export default AdminUserFilter;
