'use strict';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
window.Tablesort = require('tablesort');
window.bootstrap = require('bootstrap');
require('tablesort/src/sorts/tablesort.number');
import React from 'react';
import ReactDOM from 'react-dom';
import Spinner from "./components/spinner";
import Auth from "./components/auth";
import Filters from "./components/filters";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            connected: false,
            url: {
                families: `/administrator/index.php?option=com_janalyze&task=summary.execute&format=json`,
                data: `/administrator/index.php?option=com_janalyze&task=items.execute&format=json`
            },

        }
    }

    loadFamilies() {
        fetch(this.state.url.families)
            .then((response) => {
                if (response.status === 403) {
                    ReactDOM.render(<Auth />, document.querySelector("#app"));
                }
                else {
                    this.setState({connected: true});
                    return response.json();
                }
            }, (error) => {
                console.log(`Not auth: ${error}`)
            })
            .catch((error) => {
                console.log(`Error in parse auth: ${error}`)
            })
            .then((response) => {
                ReactDOM.render(<Filters families={response.data} />, document.querySelector(`#filters`));
            })
    }

    componentDidMount() {
        ReactDOM.render(<Spinner type="primary" text="Загружаем проекты" />, document.querySelector("#filters"));
        this.loadFamilies();
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-9">
                        <div className="container-fluid"><h1>Анализ продаж. <span id="project-title" /></h1></div>
                        <div className="container-fluid" id="filters" />
                    </div>
                    <div className="col-3">
                        <div className="container-fluid" id="courses" />
                    </div>
                </div>
                <br/>
                <div className="container-fluid" id="global_heads" />
                <div className="container-fluid" id="tables" />
            </div>
        )
    }
}

ReactDOM.render(<App />, document.querySelector("#app"));