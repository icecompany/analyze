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
import Places from "./components/places";
import Courses from "./components/courses";
import Global_heads from "./components/global_heads";

class Project extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange() {
        loadData(this.props.familyID);
    }

    render() {
        let project = this.props.project;
        return (
            <div className="form-check form-switch form-check-inline">
                <input type="checkbox" key={this.props.projectID} className="form-check-input" defaultChecked={project.checked} onChange={this.handleChange} data-family={this.props.familyID} data-id={this.props.projectID} id={project.alias} />
                <label className="form-check-label" data-project={this.props.projectID} htmlFor={project.alias}>
                    {project.title}
                </label>
            </div>
        )
    }
}


class Projects extends React.Component {
    constructor(props) {
        super(props);
        let checked = [];
        Object.keys(this.props.projects).map((projectID, i) => {
            if (this.props.projects[projectID].checked) checked.push(projectID);
        });
        this.state = {projects: checked};
    }

    componentDidMount() {
        loadData(this.props.familyID);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        loadData(this.props.familyID);
    }

    render() {
        let familyID = this.props.familyID;
        return (
            <div data-id={familyID} className="select-project form-check-inline">
                {Object.keys(this.props.projects).map((projectID, i) => {
                    return (
                        <Project familyID={familyID} projectID={projectID} project={this.props.projects[projectID]} key={i} />
                    )
                })}
            </div>
        )
    }
}

class Families extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        if (event.target.value !== undefined) {
            let familyID = event.target.value;
            ReactDOM.render(<Projects familyID={familyID} projects={this.props.families[familyID].projects} />, document.querySelector("#all-projects"));
        }
    }

    render() {
        return (
            <select className="form-select" id="select-family" onChange={this.handleChange} defaultValue="">
                <option value="">Семейство проектов</option>
                {Object.keys(this.props.families).map((familyID, i) => {
                    return (<option value={familyID} key={i}>{this.props.families[familyID].title}</option> )
                })}
            </select>
        )
    }
}

class Filters extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="row">
                <div className="col-3">
                    <Families families={this.props.families} />
                </div>
                <div className="col-9" id="all-projects" />
            </div>
        )
    }
}

let loadData = (familyID) => {
    if (isNaN(parseInt(familyID))) return;
    document.querySelector("#project-title").textContent = document.querySelector(`#select-family option[value='${familyID}']`).textContent;
    ReactDOM.render(<Spinner type="primary" text="Загружаем результаты..." />, document.querySelector("#tables"));
    let url = getURISummary(familyID);
    fetch(url)
        .then((response) => {
            if (!response.ok) console.log(`Code: ${response.status}`);
            else return response.json();
        }, (error) => {
            console.log(`Получена ошибка: ${error}.`);
        })
        .then((response) => {
            let data = response.data;
            ReactDOM.render(<Global_heads projects={data.projects} />, document.querySelector("#global_heads"));
            ReactDOM.render(<Places structure={data.structure} type="places" id="general" data={data} />, document.querySelector("#tables"));
            ReactDOM.render(<Courses projects={data.projects} />, document.querySelector("#courses"));
        }, (error) => {
            console.log(`Получена ошибка: ${error}.`);
        });
}

let getURISummary = (familyID) => {
    let url = `/administrator/index.php?option=com_janalyze&task=items.execute&familyID=${familyID}&format=json`;
    let projectID = getProjects();
    if (projectID.length > 0) url += projectID;
    return url;
}

let getProjects = () => {
    let result = '';
    for (let project of document.querySelectorAll(`.select-project div input[type='checkbox']`)) {
        if (project.checked) result += `&projectID[]=${project.dataset.id}`;
    }
    return result;
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            connected: false,
            url: {
                families:'src/data/families.json'
            }
        }
    }

    connect() {
        const url = "/administrator/index.php?option=com_janalyze&task=summary.execute&familyID=1&excludeID=5&format=json";
        fetch(url)
            .then((response) => {
                if (response.status === 403) {
                    ReactDOM.render(<Auth />, document.querySelector("#app"));
                }
                else {
                    this.setState({connected: true});
                    this.loadFilters();
                }
            }, (error) => {
                console.log(`Not auth: ${error}`)
            })
            .catch((error) => {
                console.log(`Error in parse auth: ${error}`)
            })
    }

    loadFilters() {
        fetch(this.state.url.families)
            .then((response) => {
                if (!response.ok) console.log(`Code: ${response.status}`);
                else return response.json();
            }, (error) => {
                console.log(`Получена ошибка: ${error}.`);
            })
            .then((families) => {
                ReactDOM.render(<Filters families={families} />, document.querySelector(`#filters`));
            }, (error) => {
                console.log(`Получена ошибка (1): ${error}.`);
            })
    }

    componentDidMount() {
        ReactDOM.render(<Spinner type="primary" text="Загружаем проекты" />, document.querySelector("#filters"));
        this.connect();
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-8">
                        <div className="container-fluid"><h1>Анализ продаж. <span id="project-title" /></h1></div>
                        <div className="container-fluid" id="filters" />
                    </div>
                    <div className="col-4">
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