import React from "react";
import "./Oauth.less";
const apiEndpoint = process.env.API_ENDPOINT;


class Oauth extends React.Component {

    render() {
        const height = this.props.height || "5em";

        return <div className="oauth-panel">
            <div className="text-center">Войти с помощью</div>

            <div className="oauth-social-links-wrapper" style={{height: height}}>
                <div className="oauth-social-links">
                    <a href={apiEndpoint + "/api/oauth/login/vk"}>
                        <img className="oauth-social-icon-image" src="/assets/social/vk.svg"/>
                    </a>
                    <a href={apiEndpoint + "/api/oauth/login/google"}>
                        <img className="oauth-social-icon-image" src="/assets/social/google.svg"/>
                    </a>
                    <a href={apiEndpoint + "/api/oauth/login/facebook"}>
                        <img className="oauth-social-icon-image" src="/assets/social/facebook.svg"/>
                    </a>
                </div>
            </div>
        </div>
    }
}

export default Oauth;