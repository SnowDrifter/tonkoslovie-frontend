import React from "react";
import ReactPlayer from "react-player";

function SoundPlayer({soundFileName}) {

    if (!soundFileName) {
        return null;
    }

    return <ReactPlayer url={`${process.env.API_ENDPOINT}/api/media/sound/${soundFileName}`}
                        width="100%" height={40} controls/>
}

export default SoundPlayer;