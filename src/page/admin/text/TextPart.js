import React from "react";
import RemoveButton from "/component/button/RemoveButton";
import EditRemoveButtons from "/component/button/EditRemoveButtons";
import SimpleConfirmModal from "/component/SimpleConfirmModal";
import {TEXT, QUESTION, CHOICE, LINE_BREAK} from "/page/content/text/TextPartTypes";

class TextPart extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showConfirmModal: false,
        };
    }

    showConfirmDeleteModal = () => this.setState({showConfirmModal: true})

    hideConfirmModal = () => this.setState({showConfirmModal: false})

    removeTextPart = () => {
        this.hideConfirmModal();
        this.props.removePart(this.props.index)
    }

    createButtons = () => {
        if (this.props.part.type === LINE_BREAK) {
            return <RemoveButton action={() => this.props.removePart(this.props.index)}/>
        } else {
            return <EditRemoveButtons edit={() => this.props.editPart(this.props.index)}
                                      remove={this.showConfirmDeleteModal}/>
        }
    }

    createData = () => {
        switch (this.props.part.type) {
            case TEXT:
            case QUESTION:
                return this.props.part.data;
            case CHOICE:
                return this.props.part.choiceVariants
                    .map(variant => variant.title)
                    .join(", ")
            case LINE_BREAK:
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

            <SimpleConfirmModal text="Удалить фрагмент?"
                                showModal={this.state.showConfirmModal}
                                onHide={this.hideConfirmModal}
                                onConfirm={this.removeTextPart}
                                onNegative={this.hideConfirmModal}/>
        </>
    }
}

export default TextPart;
