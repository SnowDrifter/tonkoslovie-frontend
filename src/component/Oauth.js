import React from "react";
import "./Oauth.less";
const apiEndpoint = process.env.API_ENDPOINT;


class Oauth extends React.Component {

    render() {
        return <div className="oauth-panel">
            <div className="text-center">Войти с помощью</div>

            <div className="oauth-social-links-wrapper">
                <div className="oauth-social-links">
                    <a href={apiEndpoint + "/api/oauth/login/vk"}>
                        <img className="oauth-social-icon-image" src="/static/social/vk.svg" alt="vk"/>
                    </a>
                    <a href={apiEndpoint + "/api/oauth/login/google"}>
                        <img className="oauth-social-icon-image" src="/static/social/google.svg" alt="google"/>
                    </a>
                    <a href={apiEndpoint + "/api/oauth/login/facebook"}>
                        <img className="oauth-social-icon-image" src="/static/social/facebook.svg" alt="facebook"/>
                    </a>
                </div>
            </div>
        </div>
    }
}

export default Oauth;