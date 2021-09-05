import React from "react";
import {SortableContainer, SortableElement} from "react-sortable-hoc";
import "./DraggableHorizontalList.less";

const SortableItem = SortableElement(({value}) =>
    <div className="sortable-element">
        {value}
    </div>
);

const SortableList = SortableContainer(({items, isDragging}) => {
    return <div className={`sortable-horizontal-container ${isDragging ? "dragging" : ""}`}>
        {items.map((value, index) => (
            <SortableItem key={`item-${index}`} index={index} value={value}/>
        ))}
    </div>;
});

class DraggableHorizontalList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isDragging: false,
        };

        this.onSortStart = this.onSortStart.bind(this);
        this.onSortEnd = this.onSortEnd.bind(this);
    }

    onSortStart() {
        this.setState({isDragging: true})
    }

    onSortEnd(args) {
        this.setState({isDragging: false})
        this.props.onSortEnd(args)
    }

    render() {
        return <SortableList items={this.props.elements}
                             isDragging={this.state.isDragging}
                             onSortStart={this.onSortStart}
                             onSortEnd={this.onSortEnd}
                             distance={1}
                             axis="xy"/>;
    }
}

export default DraggableHorizontalList;