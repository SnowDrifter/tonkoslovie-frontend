import React, {useState} from "react";
import {Button, Form, ProgressBar} from "react-bootstrap";
import {toast} from "react-toastify";
import Client from "/util/Client";

function ImageUploader({imageFileName, saveImageFileName}) {

    const [progressUploadFile, setProgressUploadFile] = useState(0);

    function uploadImage(image) {
        if (!image) {
            toast.error("Выберите файл");
            return;
        }

        const data = new FormData();
        data.append("file", image);

        const config = {
            onUploadProgress: (e) => setProgressUploadFile(Math.round((e.loaded * 100) / e.total))
        };

        Client.post("/api/media/image", data, config)
            .then(response => saveImageFileName(response.data.fileName))
            .catch(e => toast.error(`Произошла ошибка во время загрузки! Код: ${e.response.status}`));

        setProgressUploadFile(0)
    }

    function deleteImage() {
        if (confirm("Удалить изображение?")) {
            Client.delete("/api/media/image", {params: {fileName: imageFileName}})
                .then(() => saveImageFileName(null))
                .catch(e => toast.error(`Ошибка удаления! Код: ${e.response.status}`));

            setProgressUploadFile(0)
        }
    }

    if (imageFileName) {
        return <div>
            <h4>Изображение</h4>
            <img className="d-block" src={`${process.env.API_ENDPOINT}/api/media/image/${imageFileName}/200-200.jpg`} alt="image"/>
            <Button className="mt-1" variant="warning" onClick={deleteImage}>Удалить изоражение</Button>
        </div>
    } else {
        return <>
            <Form.Group>
                <Form.Label><h4>Изображение</h4></Form.Label>
                <Form.Control type="file" onChange={e => uploadImage(e.target.files[0])} accept=".jpg,.jpeg"/>
            </Form.Group>
            <ProgressBar striped
                         className="admin-text-progressbar"
                         style={{visibility: progressUploadFile ? "visible " : "hidden"}}
                         variant="success"
                         now={progressUploadFile}
                         label={`${progressUploadFile}%`}/>
        </>
    }
}


export default ImageUploader;