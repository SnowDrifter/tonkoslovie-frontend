import React from "react";
import {Image} from "react-bootstrap";

function ImageContainer({imageFileName, className, size = "200-200", format = "jpg"}) {

    if (!imageFileName) {
        return null;
    }

    return <Image className={className}
                  src={`${process.env.API_ENDPOINT}/api/media/image/${imageFileName}/${size}.${format}`}
                  rounded/>
}

export default ImageContainer;