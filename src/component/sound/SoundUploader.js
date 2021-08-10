import React, {createRef} from "react";
import {Button, Form, ProgressBar} from "react-bootstrap";
import SoundPlayer from "./SoundPlayer";
import {toast} from "react-toastify";
import Client from "/util/Client";

class SoundUploader extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            progressUploadFile: null
        };

        this.uploadSound = this.uploadSound.bind(this);
        this.deleteSoundFile = this.deleteSoundFile.bind(this);

        this.soundInput = createRef();
    }

    uploadSound() {
        const sound = this.soundInput.current.files[0];
        if (!sound) {
            toast.error("Выберите файл");
            return;
        }

        const data = new FormData();
        data.append("file", sound);
        data.append("textId", this.state.id);

        const config = {
            onUploadProgress: (progressEvent) => {
                this.setState({progressUploadFile: Math.round((progressEvent.loaded * 100) / progressEvent.total)});
            }
        };

        Client.post("/api/media/sound", data, config)
            .then((response) => {
                this.setState({progressUploadFile: null});
                this.props.saveSoundFileName(response.data.fileName);
            })
            .catch(() => {
                this.setState({progressUploadFile: null});
                toast.error("Произошла ошибка во время загрузки");
            });
    }

    deleteSoundFile() {
        if (confirm("Удалить звуковую дорожку?")) {
            Client.delete("/api/media/sound", {
                params: {
                    fileName: this.props.soundFileName
                }
            })
                .then(() => {
                    this.props.saveSoundFileName(null);
                })
                .catch((e) => {
                    toast.error(`Ошибка удаления! Код: ${e.response.status}`);
                });
        }
    }

    render() {
        if (this.props.soundFileName) {
            return <>
                <h3>Звуковая дорожка</h3>
                <SoundPlayer soundFileName={this.props.soundFileName}/>
                <Button variant="warning" onClick={this.deleteSoundFile}>Удалить дорожку</Button>
            </>
        } else {
            return <>
                <Form.Group>
                    <Form.Label><h4>Звуковая дорожка</h4></Form.Label>
                    <Form.File ref={this.soundInput} onChange={this.uploadSound}/>
                </Form.Group>
                <ProgressBar striped
                             className="admin-text-progressbar"
                             style={{visibility: this.state.progressUploadFile ? "visible " : "hidden"}}
                             variant="success"
                             now={this.state.progressUploadFile}
                             label={`${this.state.progressUploadFile}%`}/>
            </>
        }
    }
}


export default SoundUploader;