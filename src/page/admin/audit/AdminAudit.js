import React from "react";
import {Modal} from "react-bootstrap";
import ReactDiffViewer from "react-diff-viewer";
import {DiffMethod} from "react-diff-viewer/lib/compute-lines";


class AdminAudit extends React.Component {

    render() {
        const {showModal, audit, hideModal} = this.props;

        const oldValue = JSON.stringify(audit.before, null, 2)
        const newValue = JSON.stringify(audit.after, null, 2)

        return (
            <Modal show={showModal} onHide={hideModal.bind(this)} size="xl" centered animation={false}>
                <Modal.Body>
                    <ReactDiffViewer oldValue={oldValue} newValue={newValue}
                                     compareMethod={DiffMethod.WORDS} splitView/>
                </Modal.Body>
            </Modal>
        );
    }
}

export default AdminAudit;