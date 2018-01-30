import React from "react";
import client from "../../util/client";
import {browserHistory, Link} from "react-router";
import {Table, Column, Cell} from "fixed-data-table-2";
import "fixed-data-table-2/dist/fixed-data-table.css";
import Loader from "../../component/Loader";
import {Button, Glyphicon, ButtonGroup, ButtonToolbar, Panel} from "react-bootstrap";


class AdminTexts extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            texts: [],
            loaded: false
        };

        this.deleteText = this.deleteText.bind(this);
        this.editText = this.editText.bind(this);
        this.updateTexts = this.updateTexts.bind(this);
    }

    componentDidMount() {
        this.updateTexts();
    }

    updateTexts() {
        client.get("/api/content/texts")
            .then(response => {
                const texts = response.data;
                this.setState({
                    texts: texts,
                    loaded: true
                })
            });
    }

    deleteText(textId) {
        if (confirm("Удалить текст №" + textId + "?")) {
            client.delete("/api/content/text", {
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

        const body = <Panel>
            <h4><Link to="/admin">Главная</Link> / Тексты</h4>
            <Table
                rowHeight={50}
                rowsCount={texts.length}
                width={1110}
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

        </Panel>;

        if (this.state.loaded) {
            return body;
        } else {
            return <Loader/>;
        }
    }
}

export default AdminTexts;