import React from "react";
import Client from "../../util/Client";
import {LinkContainer} from "react-router-bootstrap";
import {Cell, Column, Table} from "fixed-data-table-2";
import "fixed-data-table-2/dist/fixed-data-table.css";
import Loader from "../../component/Loader";
import {Breadcrumb, Button, Card} from "react-bootstrap";
import AdminWord from "../../component/admin/AdminWord";
import EditRemoveButtons from "../../component/admin/EditRemoveButtons";


class AdminWords extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            words: [],
            showModal: false,
            word: {},
            modalTitle: null,
            loaded: false
        };

        this.showEditWord = this.showEditWord.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.deleteWord = this.deleteWord.bind(this);
    }

    componentDidMount() {
        this.updateWords();
    }

    updateWords() {
        Client.get("/api/content/words")
            .then(response => {
                const words = response.data;
                this.setState({
                    words: words,
                    loaded: true
                });
            });
    }

    showEditWord(word) {
        this.setState({showModal: true, word: word, modalTitle: "Редактирование"});
    }

    hideModal() {
        this.updateWords();
        this.setState({showModal: false, word: {}});
    }

    deleteWord(wordId) {
        if (confirm("Удалить слово №" + wordId + "?")) {
            Client.delete("/api/content/word", {
                params: {
                    id: wordId
                }
            }).then(() => {
                this.updateWords();
            });
        }
    }

    showAddWord() {
        this.setState({showModal: true, modalTitle: "Добавление"});
    }

    render() {
        let words = this.state.words;

        const body = <Card>
            <Card.Body>
                <Breadcrumb>
                    <LinkContainer exact to="/admin"><Breadcrumb.Item>Главная</Breadcrumb.Item></LinkContainer>
                    <Breadcrumb.Item active>Слова</Breadcrumb.Item>
                </Breadcrumb>

                <div style={{overflow: "auto"}}>
                    <Table
                        rowHeight={50}
                        rowsCount={words.length}
                        width={1068}
                        height={600}
                        headerHeight={30}>

                        <Column
                            header={<Cell>№</Cell>}
                            cell={({rowIndex}) => (
                                <Cell>{words[rowIndex].id}</Cell>
                            )}
                            fixed={true}
                            width={80}
                        />

                        <Column
                            header={<Cell>Русский текст</Cell>}
                            cell={({rowIndex}) => (
                                <Cell>
                                    {words[rowIndex].russianText}
                                </Cell>
                            )}
                            flexGrow={1}
                            width={100}
                        />

                        <Column
                            header={<Cell>Польский текст</Cell>}
                            cell={({rowIndex}) => (
                                <Cell>
                                    {words[rowIndex].polishText}
                                </Cell>
                            )}
                            flexGrow={1}
                            width={100}
                        />

                        <Column
                            cell={({rowIndex}) => (
                                <Cell>
                                    <EditRemoveButtons
                                        edit={() => this.showEditWord(words[rowIndex])}
                                        remove={() => this.deleteWord(words[rowIndex].id)}
                                    />
                                </Cell>
                            )}
                            width={100}
                        />
                    </Table>
                </div>

                <br/>
                <Button onClick={this.showAddWord.bind(this)}>Добавить слово</Button>

                <AdminWord showModal={this.state.showModal}
                           modalTitle={this.state.modalTitle}
                           word={this.state.word}
                           hideModal={this.hideModal}/>
            </Card.Body>
        </Card>;

        if (this.state.loaded) {
            return body;
        } else {
            return <Loader/>;
        }
    }
}

export default AdminWords;