import React, {useState} from "react";
import {Button, Form, ProgressBar} from "react-bootstrap";
import SoundPlayer from "./SoundPlayer";
import {toast} from "react-toastify";
import Client from "/util/Client";

function SoundUploader({soundFileName, saveSoundFileName}) {

    const [progressUploadFile, setProgressUploadFile] = useState(0);

    function uploadSound(sound) {
        if (!sound) {
            toast.error("Выберите файл");
            return;
        }

        const data = new FormData();
        data.append("file", sound);

        const config = {
            onUploadProgress: (e) => setProgressUploadFile(Math.round((e.loaded * 100) / e.total))
        };

        Client.post("/api/media/sound", data, config)
            .then(response => saveSoundFileName(response.data.fileName))
            .catch(e => toast.error(`Произошла ошибка во время загрузки! Код: ${e.response.status}`));

        setProgressUploadFile(0)
    }

    function deleteSoundFile() {
        if (confirm("Удалить звуковую дорожку?")) {
            Client.delete("/api/media/sound", {params: {fileName: soundFileName}})
                .then(() => saveSoundFileName(null))
                .catch(e => toast.error(`Ошибка удаления! Код: ${e.response.status}`));

            setProgressUploadFile(0)
        }
    }

    if (soundFileName) {
        return <div>
            <h3>Звуковая дорожка</h3>
            <SoundPlayer soundFileName={soundFileName}/>
            <Button className="mt-1" variant="warning" onClick={deleteSoundFile}>Удалить дорожку</Button>
        </div>
    } else {
        return <>
            <Form.Group>
                <Form.Label><h4>Звуковая дорожка</h4></Form.Label>
                <Form.Control type="file" onChange={e => uploadSound(e.target.files[0])} accept=".mp3"/>
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


export default SoundUploader;