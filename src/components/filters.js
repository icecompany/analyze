import React from "react";
import ReactDOM from "react-dom";
import Spinner from "./spinner";
import Global_heads from "./global_heads";
import Places from "./places";
import Courses from "./courses";

let getDataURI = (familyID) => {
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

let loadData = (familyID) => {
    if (isNaN(parseInt(familyID))) return;
    document.querySelector("#project-title").textContent = document.querySelector(`#select-family option[value='${familyID}']`).textContent;
    ReactDOM.render(<Spinner type="primary" text="Загружаем результаты..." />, document.querySelector("#tables"));
    let url = getDataURI(familyID);
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

class Project extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange() {
        loadData(this.props.familyID);
    }

    render() {
        const project = this.props.project;
        const alias = `project_${this.props.projectID}`;
        return (
            <div className="form-check form-switch form-check-inline">
                <input type="checkbox" key={this.props.projectID} className="form-check-input" defaultChecked={project.checked} onChange={this.handleChange} data-family={this.props.familyID} data-id={this.props.projectID} id={alias} />
                <label className="form-check-label" data-project={this.props.projectID} htmlFor={alias}>
                    {project.title_short}
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
            if (familyID !== '') {
                ReactDOM.render(<Projects familyID={familyID} projects={this.props.families[familyID].projects}/>, document.querySelector("#all-projects"));
            }
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

export default class Filters extends React.Component {
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
