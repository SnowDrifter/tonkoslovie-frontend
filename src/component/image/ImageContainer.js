import React from "react";
import {Image} from "react-bootstrap";

class ImageContainer extends React.Component {

    render() {
        const {imageFileName, className, size} = this.props;
        if (!imageFileName) {
            return null;
        }

        return <Image className={className}
                      src={`${process.env.MEDIA_ENDPOINT}/tonkoslovie/images/${size}-${imageFileName}`}
                      rounded/>
    }
}

export default ImageContainer;