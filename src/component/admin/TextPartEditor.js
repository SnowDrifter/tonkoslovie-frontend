import React from "react";
import ReactDOM from "react-dom";
import {

    FormGroup,
    Row,
    Col,
    ControlLabel,
    FormControl,
    Button,
    ButtonToolbar,
    ButtonGroup,
    Modal,
    Form,
    Jumbotron,
    Glyphicon
} from "react-bootstrap";

class TextPartEditor extends React.Component {
    saveTextPart(){
        let textPart = this.props.currentPart ? this.props.currentPart : {};
        textPart.data = ReactDOM.findDOMNode(this.data).value;
        this.props.saveTextPart(this.props.currentPartIndex, textPart)
    }

    render() {
        return <Modal show={this.props.showEditor} onHide={this.props.hideEditor.bind(this)}>
            <Modal.Header closeButton>
                <Modal.Title>{this.props.editorTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="word-modal-body">
                <Form>
                    <FormGroup>
                        <Row>
                            <Col md={12}>
                                <FormGroup controlId="formInlineName">
                                    <ControlLabel>Текст</ControlLabel>
                                    <FormControl
                                        inputRef={data => {
                                            this.data = data
                                        }}
                                        componentClass="textarea" defaultValue={this.props.currentPart ? this.props.currentPart.data : ""}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </FormGroup>

                    <Button
                        onClick={this.saveTextPart.bind(this)}
                        className="pull-right" bsStyle="success">Сохранить</Button>
                </Form>
            </Modal.Body>
        </Modal>
    }
}

export default TextPartEditor;
