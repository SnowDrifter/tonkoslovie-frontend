import React, {useState} from "react";
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

function DraggableHorizontalList({elements, changeElements}) {

    const [isDragging, setIsDragging] = useState(false)

    function onSortEnd(args) {
        setIsDragging(false)
        changeElements(args)
    }

    return <SortableList style={{padding: "20px", minHeight: "20px"}}
                         items={elements}
                         isDragging={isDragging}
                         onSortStart={() => setIsDragging(true)}
                         onSortEnd={onSortEnd}
                         distance={1}
                         axis="xy"/>;
}

export default DraggableHorizontalList;