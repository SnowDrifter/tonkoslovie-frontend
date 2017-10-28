import React from "react";
import client from "../../util/client";
import {browserHistory} from 'react-router'
import {Table, Column, Cell} from "fixed-data-table-2";
import "fixed-data-table-2/dist/fixed-data-table.css";
import {
    Button,
    Glyphicon,
    ButtonGroup,
    ButtonToolbar
} from "react-bootstrap";


class AdminThemes extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            themes: []
        };

        this.deleteTheme = this.deleteTheme.bind(this);
        this.editTheme = this.editTheme.bind(this);
        this.updateThemes = this.updateThemes.bind(this);
    }

    componentDidMount() {
        this.updateThemes();
    }

    updateThemes() {
        client.get('/api/content/themes?onlyPublished=false')
            .then(response => {
                const themes = response.data;
                this.setState({themes: themes})
            });
    }

    deleteTheme(themeId) {
        if (confirm("Удалить тему №" + themeId + "?")) {
            client.delete('/api/content/theme', {
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

        return (
            <div>
                <Table
                    rowHeight={50}
                    rowsCount={themes.length}
                    width={1140}
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
                                        <Button onClick={() => this.editTheme(themes[rowIndex])} bsSize="small"><Glyphicon glyph="pencil"/></Button>
                                        <Button bsSize="small" onClick={() => this.deleteTheme(themes[rowIndex].id)} className="pull-right" bsStyle="danger"> <Glyphicon glyph="remove"/></Button>
                                    </ButtonGroup>
                                </ButtonToolbar>
                            </Cell>
                        )}
                        width={100}
                    />
                </Table>
                <br/>
                <Button onClick={this.addNewTheme.bind(this)}>Добавить новую тему</Button>
            </div>
        );
    }
}

export default AdminThemes;