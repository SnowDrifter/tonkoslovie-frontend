import React from "react";
import ReactPlayer from "react-player";

class SoundPlayer extends React.Component {

    render() {
        if (!this.props.soundFileName) {
            return null;
        }

        return <ReactPlayer
                width="100%"
                height={40}
                controls={true}
                url={`${process.env.MEDIA_ENDPOINT}/tonkoslovie/sounds/${this.props.soundFileName}`}/>
    }
}

export default SoundPlayer;