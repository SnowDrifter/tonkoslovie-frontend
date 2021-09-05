/* eslint-disable no-irregular-whitespace */
import React from "react";
import {Jumbotron, Image} from "react-bootstrap";
import Helmet from "react-helmet";
import "./Home.less";

class Home extends React.Component {
    render() {
        return <>
            <Helmet title="Главная  | Тонкословие"/>

            <Jumbotron>
                <h1 className="home-title">ÞΣԿb †﻿ØĤҠØϾ/\ØβUମ ∏Ø/\bϾҠØՐØ</h1>
                <Image className="home-image" src="/static/image/main.jpg" thumbnail/>
            </Jumbotron>
        </>
    }
}

export default Home;