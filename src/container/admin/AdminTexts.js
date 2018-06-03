import React from "react";
import Client from "../../util/Client";
import {browserHistory, Link} from "react-router";
import {Cell, Column, Table} from "fixed-data-table-2";
import "fixed-data-table-2/dist/fixed-data-table.css";
import Loader from "../../component/Loader";
import {Button, ButtonGroup, ButtonToolbar, Glyphicon, Panel} from "react-bootstrap";


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
        Client.get("/api/content/texts")
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
            Client.delete("/api/content/text", {
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
            <Panel.Body>
                <ul className="breadcrumb" style={{width: 1100}}>
                    <li><Link to="/admin">Главная</Link></li>
                    <li>Тексты</li>
                </ul>

                <div style={{overflow: "auto"}}>
                    <Table
                        rowHeight={50}
                        rowsCount={texts.length}
                        width={1100}
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
                                            <Button bsSize="small"
                                                    onClick={() => this.editText(texts[rowIndex])}>
                                                <Glyphicon glyph="pencil"/>
                                            </Button>
                                            <Button bsSize="small" bsStyle="danger" className="pull-right"
                                                    onClick={() => this.deleteText(texts[rowIndex].id)}>
                                                <Glyphicon glyph="remove"/>
                                            </Button>
                                        </ButtonGroup>
                                    </ButtonToolbar>
                                </Cell>
                            )}
                            width={100}
                        />
                    </Table>
                </div>

                <br/>
                <Button onClick={this.addNewText.bind(this)}>Добавить новый текст</Button>
            </Panel.Body>
        </Panel>;

        if (this.state.loaded) {
            return body;
        } else {
            return <Loader/>;
        }
    }
}

export default AdminTexts;