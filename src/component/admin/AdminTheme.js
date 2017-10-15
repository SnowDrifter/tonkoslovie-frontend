import React from "react";
import ReactDOM from "react-dom";
import {
    Panel,
    FormGroup,
    Row,
    Col,
    ControlLabel,
    FormControl,
    Button,
    ButtonToolbar,
    ButtonGroup,
    FieldGroup,
    ProgressBar,
    Modal,
    Form,
    Jumbotron,
    Glyphicon
} from "react-bootstrap";
import client from "../../util/client";
import style from './AdminText.less'
import EditPartModal from './EditPartModal'
import CreatePartModal from './CreatePartModal'
import * as partTypes from  '../content/TextPartTypes'
import ReactPlayer from 'react-player'

class AdminTheme extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: null
        };

        if (this.props.params.themeId) {
            this.loadTheme(this.props.params.themeId)
        }
    }

    loadTheme(themeId) {
        client.get('/api/content/theme', {
            params: {
                id: themeId
            }
        }).then(response => {
            const theme = response.data;
            this.setState({
                id: theme.id
            });

            ReactDOM.findDOMNode(this.title).value = theme.title;
        })
    }

    saveTheme() {
        client.post('/api/content/theme', {
            id: this.state.id,
            title: ReactDOM.findDOMNode(this.title).value
        }).then((response) => {
            this.setState({
                id: response.data.id,
            });

            alert("Сохранено");
        })
    }

    render() {
        return <Panel>
            <Jumbotron>
                <FormGroup>
                    <ControlLabel><h4>Заголовок</h4></ControlLabel>
                    <FormControl
                        inputRef={title => {
                            this.title = title
                        }}
                    />
                </FormGroup>
            </Jumbotron>

            <Button onClick={this.saveTheme.bind(this)} className="pull-right" bsStyle="success">Сохранить</Button>
        </Panel>
    }
}


export default AdminTheme;
