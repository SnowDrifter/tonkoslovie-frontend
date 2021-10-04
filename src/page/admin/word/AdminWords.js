import React from "react";
import Client from "/util/Client";
import {LinkContainer} from "react-router-bootstrap";
import {Cell, Column, Table} from "fixed-data-table-2";
import "fixed-data-table-2/dist/fixed-data-table.css";
import Loader from "/component/Loader";
import {Breadcrumb, Button, Card} from "react-bootstrap";
import AdminWord from "./AdminWord";
import EditRemoveButtons from "/component/button/EditRemoveButtons";
import {toast} from "react-toastify";
import PaginationContainer from "/component/PaginationContainer";


class AdminWords extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            words: [],
            currentPage: 0,
            totalElements: null,
            maxPage: null,
            showModal: false,
            word: {},
            modalTitle: null,
            loading: false
        };

        this.handleChangePage = this.handleChangePage.bind(this);
        this.showEditWord = this.showEditWord.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.deleteWord = this.deleteWord.bind(this);
    }

    componentDidMount() {
        this.updateWords();
    }

    updateWords() {
        Client.get("/api/content/words", {
            params: {
                page: this.state.currentPage,
                sortField: "id",
                direction: "desc"
            }
        })
            .then(response => {
                this.setState({
                    loading: false,
                    words: response.data.content,
                    currentPage: response.data.number,
                    maxPage: response.data.totalPages
                });
            })
            .catch((e) => {
                this.setState({loading: false});
                toast.error(`Ошибка загрузки! Код: ${e.response.status}`);
            });
    }

    handleChangePage(newPage) {
        this.setState({currentPage: newPage}, this.updateWords)
    }

    showEditWord(word) {
        this.setState({showModal: true, word: word, modalTitle: "Редактирование"});
    }

    hideModal() {
        this.updateWords();
        this.setState({showModal: false, word: {}});
    }

    deleteWord(wordId) {
        if (confirm(`Удалить слово №${wordId}?`)) {
            Client.delete("/api/content/word", {
                params: {
                    id: wordId
                }
            }).then(() => {
                this.updateWords();
            }).catch((e) => {
                toast.error(`Ошибка удаления! Код: ${e.response.status}`);
            });
        }
    }

    showAddWord() {
        this.setState({showModal: true, modalTitle: "Добавление"});
    }

    render() {
        if (this.state.loading) {
            return <Loader/>;
        }

        const words = this.state.words;

        return <Card>
            <Card.Body>
                <Breadcrumb>
                    <LinkContainer exact to="/admin"><Breadcrumb.Item>Главная</Breadcrumb.Item></LinkContainer>
                    <Breadcrumb.Item active>Слова</Breadcrumb.Item>
                </Breadcrumb>

                <Table rowHeight={45}
                       rowsCount={words.length}
                       width={1068}
                       height={487}
                       headerHeight={35}>

                    <Column header={<Cell>№</Cell>}
                            cell={({rowIndex}) => <Cell>{words[rowIndex].id}</Cell>}
                            fixed={true}
                            width={80}/>

                    <Column header={<Cell>Русский текст</Cell>}
                            cell={({rowIndex}) => <Cell>{words[rowIndex].russianText}</Cell>}
                            flexGrow={1}
                            width={100}/>

                    <Column header={<Cell>Польский текст</Cell>}
                            cell={({rowIndex}) => <Cell>{words[rowIndex].polishText}</Cell>}
                            flexGrow={1}
                            width={100}/>

                    <Column cell={({rowIndex}) =>
                        <Cell>
                            <EditRemoveButtons edit={() => this.showEditWord(words[rowIndex])}
                                               remove={() => this.deleteWord(words[rowIndex].id)}/>
                        </Cell>}
                            width={100}/>
                </Table>


                <PaginationContainer style={{marginTop: "15px"}}
                                     currentPage={this.state.currentPage}
                                     maxPage={this.state.maxPage}
                                     handleChangePage={this.handleChangePage}/>

                <Button onClick={this.showAddWord.bind(this)}>Добавить слово</Button>

                <AdminWord showModal={this.state.showModal}
                           modalTitle={this.state.modalTitle}
                           word={this.state.word}
                           hideModal={this.hideModal}/>
            </Card.Body>
        </Card>;
    }
}

export default AdminWords;