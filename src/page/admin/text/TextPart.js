import React from "react";
import RemoveButton from "/component/button/RemoveButton";
import EditRemoveButtons from "/component/button/EditRemoveButtons";
import SimpleConfirmModal from "/component/SimpleConfirmModal";
import * as partTypes from "/page/content/text/TextPartTypes";

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
        if (this.props.part.type === partTypes.LINE_BREAK) {
            return <RemoveButton action={() => this.props.removePart(this.props.index)}/>
        } else {
            return <EditRemoveButtons edit={() => this.props.editPart(this.props.index)}
                                      remove={this.showConfirmDeleteModal}/>
        }
    }

    createData() {
        switch (this.props.part.type) {
            case partTypes.TEXT:
            case partTypes.QUESTION:
                return this.props.part.data;
            case partTypes.CHOICE:
                return this.props.part.choiceVariants
                    .map(variant => {
                        return variant.title;
                    }).join(", ")
            case partTypes.LINE_BREAK:
                return "¶";
        }
    }

    render() {
        const data = this.createData();
        const buttons = this.createButtons();
        const partClassName = `admin-${this.props.part.type.toLowerCase().replace("_", "-")}-part`

        return <>
            <div className={partClassName}>
                {data}
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
