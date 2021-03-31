'use strict';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
window.Tablesort = require('tablesort');
window.bootstrap = require('bootstrap');
require('tablesort/src/sorts/tablesort.number');
import React from 'react';
import ReactDOM from 'react-dom';
import Squares from "./components/squares.jsx";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

class App extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/">
                        <Squares />
                    </Route>
                    <Route path="/analyze">
                        <Squares />
                    </Route>
                </Switch>
            </Router>
        )
    }
}

ReactDOM.render(<App />, document.querySelector("#app"));