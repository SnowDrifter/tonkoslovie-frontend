import React, {PropTypes} from "react";

export default class RouterHandler extends React.Component {
    render() {
        const { children } = this.props;

        if (!children) {
            return null;
        }

        const propsWithoutChildren = { ...this.props };
        delete propsWithoutChildren.children;

        return React.cloneElement(children, propsWithoutChildren);
    }
}