import React from "react";
import Client from "/util/Client";
import {FormLabel, FormControl, Button, Modal, Form} from "react-bootstrap";
import {toast} from "react-toastify";
import "./AdminWord.less"

function AdminWord({word, showModal, hideModal, modalTitle, changeCurrentWord}) {

    function saveWord() {
        Client.post("/api/content/word", word)
            .then(() => hideModal())
            .catch(e => toast.error(`Ошибка сохранения! Код: ${e.response.status}`))
    }

    function updateWord(field, value) {
        changeCurrentWord({...word, [field]: value});
    }

    return <Modal show={showModal} onHide={hideModal}>
        <Modal.Header closeButton>
            <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>

        <Modal.Body className="admin-word-modal-body">
            <Form>
                <FormLabel>Русский текст</FormLabel>
                <FormControl defaultValue={word.russianText}
                             onChange={e => updateWord("russianText", e.target.value)}/>

                <FormLabel className="mt-3">Польский текст</FormLabel>
                <FormControl defaultValue={word.polishText}
                             onChange={e => updateWord("polishText", e.target.value)}/>

                <Button onClick={saveWord} className="mt-3 float-end" variant="success">Сохранить</Button>
            </Form>
        </Modal.Body>
    </Modal>
}

export default AdminWord;