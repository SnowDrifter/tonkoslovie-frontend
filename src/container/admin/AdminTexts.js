import React from "react";
import client from "../../util/client";
import {browserHistory} from 'react-router'
import {Table, Column, Cell} from "fixed-data-table-2";
import "fixed-data-table-2/dist/fixed-data-table.css";
import {
    Panel,
    FormGroup,
    Row,
    Col,
    ControlLabel,
    FormControl,
    Button,
    Modal,
    Form,
    Glyphicon,
    ButtonGroup,
    ButtonToolbar
} from "react-bootstrap";
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'


class Texts extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            texts: []
        };

        this.deleteText = this.deleteText.bind(this);
        this.editText = this.editText.bind(this);
        this.updateTexts = this.updateTexts.bind(this);
    }

    componentDidMount(){
        this.updateTexts();
    }

    updateTexts() {
        client.get('/api/content/texts')
            .then(response => {
                const texts = response.data;
                this.setState({texts: texts})
            });
    }

    deleteText(textId) {
        if(confirm("Удалить текст №" + textId + "?")) {
            client.delete('/api/content/text', {
                params: {
                    id: textId
                }
            }).then(() => {
                this.updateTexts();
            });
        }
    }

    addNewText() {
         browserHistory.push("/admin/text")
    }

    editText(text) {
        browserHistory.push("/admin/text/" + text.id);
    }

    render() {
        let texts = this.state.texts;

        return (
            <div>
                <Table
                    rowHeight={50}
                    rowsCount={texts.length}
                    width={1140}
                    height={600}
                    headerHeight={30}>

                    <Column
                        header={<Cell>№</Cell>}
                        cell={({rowIndex}) => (
                            <Cell>{texts[rowIndex].id}</Cell>
                        )}
                        fixed={true}
                        width={80}
                    />

                    <Column
                        header={<Cell>Название</Cell>}
                        cell={({rowIndex}) => (
                            <Cell>
                                {texts[rowIndex].title}
                            </Cell>
                        )}
                        flexGrow={1}
                        width={100}
                    />

                    <Column
                        cell={({rowIndex}) => (
                            <Cell>
                                <ButtonToolbar>
                                    <ButtonGroup>
                                        <Button onClick={() => this.editText(texts[rowIndex])} bsSize="small"><Glyphicon
                                            glyph="pencil"/></Button>
                                        <Button bsSize="small" onClick={() => this.deleteText(texts[rowIndex].id)}
                                                className="pull-right" bsStyle="danger"> <Glyphicon
                                            glyph="remove"/></Button>
                                    </ButtonGroup>
                                </ButtonToolbar>
                            </Cell>
                        )}
                        width={100}
                    />
                </Table>
                <br/>
                <Button onClick={this.addNewText.bind(this)}>Добавить новый текст</Button>

            </div>
        );
    }
}

export default Texts