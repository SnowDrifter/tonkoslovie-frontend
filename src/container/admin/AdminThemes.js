import React from "react";
import Client from "../../util/Client";
import {browserHistory, Link} from "react-router";
import {Cell, Column, Table} from "fixed-data-table-2";
import "fixed-data-table-2/dist/fixed-data-table.css";
import Loader from "../../component/Loader";
import {Button, ButtonGroup, ButtonToolbar, Glyphicon, Panel} from "react-bootstrap";


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
        Client.get("/api/content/themes?onlyPublished=false")
            .then(response => {
                const themes = response.data;
                this.setState({
                    themes: themes,
                    loaded: true
                })
            });
    }

    deleteTheme(themeId) {
        if (confirm("Удалить тему №" + themeId + "?")) {
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
        browserHistory.push("/admin/theme")
    }

    editTheme(theme) {
        browserHistory.push("/admin/theme/" + theme.id);
    }

    render() {
        let themes = this.state.themes;

        const body = <Panel>
            <Panel.Body>
                <ul className="breadcrumb" style={{width: 1100}}>
                    <li><Link to="/admin">Главная</Link></li>
                    <li>Темы упражнений</li>
                </ul>

                <div style={{overflow: "auto"}}>
                    <Table
                        rowHeight={50}
                        rowsCount={themes.length}
                        width={1100}
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
                                    <ButtonToolbar>
                                        <ButtonGroup>
                                            <Button bsSize="small"
                                                    onClick={() => this.editTheme(themes[rowIndex])}>
                                                <Glyphicon glyph="pencil"/>
                                            </Button>
                                            <Button bsSize="small" bsStyle="danger" className="pull-right"
                                                    onClick={() => this.deleteTheme(themes[rowIndex].id)}>
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
                <Button onClick={this.addNewTheme.bind(this)}>Добавить новую тему</Button>
            </Panel.Body>;
        </Panel>;

        if (this.state.loaded) {
            return body;
        } else {
            return <Loader/>;
        }
    }
}

export default AdminThemes;