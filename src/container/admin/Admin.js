import React from "react";
import {Link} from "react-router";
import {Panel, PageHeader} from "react-bootstrap";

class Admin extends React.Component {

    render() {
        return <Panel>
            <PageHeader className="text-center">Админка</PageHeader>
                <Link to="/admin/lessons" activeClassName='active'><h3>Уроки</h3></Link>
                <Link to="/admin/texts" activeClassName='active'><h3>Тексты</h3></Link>
                <Link to="/admin/words" activeClassName='active'><h3>Слова</h3></Link>
                <Link to="/admin/exercises" activeClassName='active'><h3>Упражнения</h3></Link>
        </Panel>
    }
}

export default Admin;