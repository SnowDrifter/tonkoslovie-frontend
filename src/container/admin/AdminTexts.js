import React from "react";
import Client from "../../util/Client";
import {LinkContainer} from "react-router-bootstrap";
import {Cell, Column, Table} from "fixed-data-table-2";
import "fixed-data-table-2/dist/fixed-data-table.css";
import Loader from "../../component/Loader";
import {Breadcrumb, Button, Card} from "react-bootstrap";
import EditRemoveButtons from "../../component/admin/EditRemoveButtons";


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
        this.props.history.push("/admin/text")
    }

    editText(text) {
        this.props.history.push("/admin/text/" + text.id);
    }

    render() {
        let texts = this.state.texts;

        const body = <Card>
            <Card.Body>
                <Breadcrumb>
                    <LinkContainer exact to="/admin"><Breadcrumb.Item>Главная</Breadcrumb.Item></LinkContainer>
                    <Breadcrumb.Item active>Тексты</Breadcrumb.Item>
                </Breadcrumb>

                <div style={{overflow: "auto"}}>
                    <Table
                        rowHeight={50}
                        rowsCount={texts.length}
                        width={1068}
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
                                    <EditRemoveButtons
                                        edit={() => this.editText(texts[rowIndex])}
                                        remove={() => this.deleteText(texts[rowIndex].id)}
                                    />
                                </Cell>
                            )}
                            width={100}
                        />
                    </Table>
                </div>

                <br/>
                <Button onClick={this.addNewText.bind(this)}>Добавить новый текст</Button>
            </Card.Body>
        </Card>;

        if (this.state.loaded) {
            return body;
        } else {
            return <Loader/>;
        }
    }
}

export default AdminTexts;