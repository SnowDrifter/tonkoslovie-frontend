import React, {createRef} from "react";
import {Button, Form, ProgressBar} from "react-bootstrap";
import {toast} from "react-toastify";
import Client from "/util/Client";

class ImageUploader extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            progressUploadFile: null
        };

        this.uploadImage = this.uploadImage.bind(this);
        this.deleteImage = this.deleteImage.bind(this);

        this.imageInput = createRef();
    }

    uploadImage() {
        const image = this.imageInput.current.files[0];
        if (!image) {
            toast.error("Выберите файл");
            return;
        }

        const data = new FormData();
        data.append("file", image);

        const config = {
            onUploadProgress: (progressEvent) => {
                this.setState({progressUploadFile: Math.round((progressEvent.loaded * 100) / progressEvent.total)});
            }
        };

        Client.post("/api/media/image", data, config)
            .then((response) => {
                this.setState({progressUploadFile: null});
                this.props.saveImageFileName(response.data.fileName);
            })
            .catch((e) => {
                this.setState({progressUploadFile: null});
                toast.error(`Произошла ошибка во время загрузки! Код: ${e.response.status}`);
            });
    }

    deleteImage() {
        if (confirm("Удалить изображение?")) {
            Client.delete("/api/media/image", {
                params: {
                    fileName: this.props.imageFileName
                }
            })
                .then(() => {
                    this.props.saveImageFileName(null);
                })
                .catch((e) => {
                    toast.error(`Ошибка удаления! Код: ${e.response.status}`);
                });
        }
    }

    render() {
        if (this.props.imageFileName) {
            return <>
                <h4>Изображение</h4>
                <img src={`${process.env.MEDIA_ENDPOINT}/tonkoslovie/images/200_200-${this.props.imageFileName}`}
                     alt="image"/>
                <br/>
                <Button variant="warning" style={{marginTop: "5px"}} onClick={this.deleteImage.bind(this)}>
                    Удалить изоражение
                </Button>
            </>
        } else {
            return <>
                <Form.Group>
                    <Form.Label><h4>Изображение</h4></Form.Label>
                    <Form.File ref={this.imageInput} onChange={this.uploadImage}/>
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


export default ImageUploader;