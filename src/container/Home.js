/* eslint-disable no-irregular-whitespace */
import React from "react";
import {Jumbotron, Image} from "react-bootstrap";
import Helmet from "react-helmet";
import "./Home.less";

class Home extends React.Component {
    render() {
        return <div>
            <Helmet title="Главная  | Тонкословие"/>

            <Jumbotron>
                <h1 style={{textAlign: "center"}}>ÞΣԿb †﻿ØĤҠØϾ/\ØβUମ ∏Ø/\bϾҠØՐØ</h1>
                <Image className="home-image" src="/assets/image/main.jpg" thumbnail/>
            </Jumbotron>
        </div>
    }
}

export default Home;