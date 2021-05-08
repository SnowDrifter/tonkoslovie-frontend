import React from "react";
import Client from "/util/Client";
import {LinkContainer} from "react-router-bootstrap";
import {Cell, Column, Table} from "fixed-data-table-2";
import "fixed-data-table-2/dist/fixed-data-table.css";
import Loader from "/component/Loader";
import {Breadcrumb, Button, Card} from "react-bootstrap";
import EditRemoveButtons from "/component/button/EditRemoveButtons";


class AdminThemes extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            themes: [],
            loaded: false
        };

        this.deleteTheme = this.deleteTheme.bind(this);
        this.editTheme = this.editTheme.bind(this);
        this.updateThemes = this.updateThemes.bind(this);
    }

    componentDidMount() {
        this.updateThemes();
    }

    updateThemes() {
        Client.get("/api/content/themes?unpublished=true")
            .then(response => {
                const themes = response.data;
                this.setState({
                    themes: themes,
                    loaded: true
                })
            });
    }

    deleteTheme(themeId) {
        if (confirm(`Удалить тему №${themeId}?`)) {
            Client.delete("/api/content/theme", {
                params: {
                    id: themeId
                }
            }).then(() => {
                this.updateThemes();
            });
        }
    }

    addNewTheme() {
        this.props.history.push("/admin/theme")
    }

    editTheme(theme) {
        this.props.history.push(`/admin/theme/${theme.id}`);
    }

    render() {
        let themes = this.state.themes;

        const body = <Card>
            <Card.Body>
                <Breadcrumb>
                    <LinkContainer exact to="/admin"><Breadcrumb.Item>Главная</Breadcrumb.Item></LinkContainer>
                    <Breadcrumb.Item active>Темы упражнений</Breadcrumb.Item>
                </Breadcrumb>

                <div style={{overflow: "auto"}}>
                    <Table
                        rowHeight={50}
                        rowsCount={themes.length}
                        width={1068}
                        height={600}
                        headerHeight={30}>

                        <Column
                            header={<Cell>№</Cell>}
                            cell={({rowIndex}) => (
                                <Cell>{themes[rowIndex].id}</Cell>
                            )}
                            fixed={true}
                            width={80}
                        />

                        <Column
                            header={<Cell>Название</Cell>}
                            cell={({rowIndex}) => (
                                <Cell>
                                    {themes[rowIndex].title}
                                </Cell>
                            )}
                            flexGrow={1}
                            width={100}
                        />

                        <Column
                            cell={({rowIndex}) => (
                                <Cell>
                                    <EditRemoveButtons
                                        edit={() => this.editTheme(themes[rowIndex])}
                                        remove={() => this.deleteTheme(themes[rowIndex].id)}
                                    />
                                </Cell>
                            )}
                            width={100}
                        />
                    </Table>
                </div>

                <br/>
                <Button onClick={this.addNewTheme.bind(this)}>Добавить новую тему</Button>
            </Card.Body>
        </Card>;

        if (this.state.loaded) {
            return body;
        } else {
            return <Loader/>;
        }
    }
}

export default AdminThemes;