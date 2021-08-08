import React from "react";
import RemoveButton from "/component/button/RemoveButton";
import EditRemoveButtons from "/component/button/EditRemoveButtons";
import SimpleConfirmModal from "/component/SimpleConfirmModal";

class TextPart extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showConfirmModal: false,
        };

        this.showConfirmDeleteModal = this.showConfirmDeleteModal.bind(this);
        this.hideConfirmModal = this.hideConfirmModal.bind(this);
        this.removeTextPart = this.removeTextPart.bind(this);
    }

    showConfirmDeleteModal() {
        this.setState({showConfirmModal: true});
    }

    hideConfirmModal() {
        this.setState({showConfirmModal: false});
    }

    removeTextPart() {
        this.hideConfirmModal();
        this.props.removePart(this.props.index)
    }

    createButtons() {
        if (this.props.editPart) {
            return <EditRemoveButtons edit={() => this.props.editPart(this.props.index)}
                                         remove={this.showConfirmDeleteModal}/>
        } else {
            return <RemoveButton action={() => this.props.removePart(this.props.index)}/>
        }
    }

    render() {
        const buttons = this.createButtons();

        return <>
            <div className={this.props.className}>
                {this.props.data}

                {buttons}
            </div>

            <SimpleConfirmModal modalTitle="Удалить фрагмент?"
                                showModal={this.state.showConfirmModal}
                                hideModal={this.hideConfirmModal}
                                confirmFunction={this.removeTextPart}
                                negativeFunction={this.hideConfirmModal}/>
        </>
    }
}

export default TextPart;
