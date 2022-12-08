import React from "react";
import {Pagination} from "react-bootstrap";


function PaginationContainer({maxPage, currentPage, handleChangePage, maxItems = 5, style}) {

    let startItem = currentPage - (Math.round(maxItems / 2)) + (maxItems % 2)
    let endItem = currentPage + (Math.round(maxItems / 2))

    if (startItem < 0) {
        startItem = 0
        endItem = maxItems
    }

    if (endItem > maxPage) {
        startItem = maxPage - maxItems + 1
        if (startItem < 0) {
            startItem = 0
        }
        endItem = maxPage
    }

    const items = []
    for (let i = startItem; i < endItem; i++) {
        if (i === currentPage) {
            items.push(<Pagination.Item key={i} active>{i + 1}</Pagination.Item>)
        } else {
            items.push(<Pagination.Item key={i} onClick={() => handleChangePage(i)}>{i + 1}</Pagination.Item>)
        }
    }

    // @formatter:off
    return <Pagination style={style}>
        {startItem > 0 && <Pagination.Item onClick={() => handleChangePage(0)}>1</Pagination.Item>}
        {startItem > 1 && <Pagination.Ellipsis disabled/>}
        {items}
        {endItem + 1 < maxPage && <Pagination.Ellipsis disabled/>}
        {endItem < maxPage && <Pagination.Item onClick={() => handleChangePage(maxPage - 1)}>{maxPage}</Pagination.Item>}
    </Pagination>;
    // @formatter:on
}

export default PaginationContainer;