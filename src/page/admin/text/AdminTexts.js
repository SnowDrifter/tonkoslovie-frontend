import React from "react";
import Client from "/util/Client";
import {LinkContainer} from "react-router-bootstrap";
import {Cell, Column, Table} from "fixed-data-table-2";
import "fixed-data-table-2/dist/fixed-data-table.css";
import Loader from "/component/Loader";
import {Breadcrumb, Button, Card} from "react-bootstrap";
import EditRemoveButtons from "/component/button/EditRemoveButtons";
import {toast} from "react-toastify";


class AdminTexts extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            texts: [],
            loading: true
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
                    loading: false
                })
            });
    }

    deleteText(textId) {
        if (confirm(`Удалить текст №${textId}?`)) {
            Client.delete("/api/content/text", {
                params: {
                    id: textId
                }
            }).then(() => {
                this.updateTexts();
            }).catch((e) => {
                toast.error(`Ошибка сохранения! Код: ${e.response.status}`);
            });
        }
    }

    addNewText() {
        this.props.history.push("/admin/text")
    }

    editText(text) {
        this.props.history.push(`/admin/text/${text.id}`);
    }

    render() {
        if (this.state.loading) {
            return <Loader/>;
        }

        const texts = this.state.texts;

        return <Card>
            <Card.Body>
                <Breadcrumb>
                    <LinkContainer exact to="/admin"><Breadcrumb.Item>Главная</Breadcrumb.Item></LinkContainer>
                    <Breadcrumb.Item active>Тексты</Breadcrumb.Item>
                </Breadcrumb>

                <Table rowHeight={45}
                       rowsCount={texts.length}
                       width={1068}
                       height={600}
                       headerHeight={46}>

                    <Column header={<Cell>№</Cell>}
                            cell={({rowIndex}) => <Cell>{texts[rowIndex].id}</Cell>}
                            fixed={true}
                            width={80}/>

                    <Column header={<Cell>Название</Cell>}
                            cell={({rowIndex}) => <Cell>{texts[rowIndex].title}</Cell>}
                            flexGrow={1}
                            width={100}/>

                    <Column cell={({rowIndex}) =>
                        <Cell>
                            <EditRemoveButtons edit={() => this.editText(texts[rowIndex])}
                                               remove={() => this.deleteText(texts[rowIndex].id)}/>
                        </Cell>}
                            width={100}/>
                </Table>

                <br/>
                <Button onClick={this.addNewText.bind(this)}>Добавить новый текст</Button>
            </Card.Body>
        </Card>;
    }
}

export default AdminTexts;