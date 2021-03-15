import React from "react";
import ReactDOM from "react-dom";
import Spinner from "./spinner";
import Global_heads from "./global_heads";
import Places from "./places";
import Courses from "./courses";
import Families from "./families";
import Pavilions from "./pavilions";
import Start from "./start";

class Project extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const project = this.props.project;
        const alias = `project_${this.props.projectID}`;
        return (
            <div className="form-check form-switch form-check-inline">
                <input type="checkbox" key={this.props.projectID} className="form-check-input" defaultChecked={project.checked} data-family={this.props.familyID} data-id={this.props.projectID} id={alias} />
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

    render() {
        let familyID = this.props.familyID;
        return (
            <div data-id={familyID} className="select-project form-check-inline">
                {Object.keys(this.props.projects).map((projectID, i) => {
                    return (
                        <Project familyID={familyID} projectID={projectID} project={this.props.projects[projectID]} onClick={this.props.onClick} key={i} />
                    )
                })}
            </div>
        )
    }
}

export default class Filters extends React.Component {
    constructor(props) {
        super(props);
        this.onChangeFamilyID = this.onChangeFamilyID.bind(this);
        this.onChangePavilionID = this.onChangePavilionID.bind(this);
        this.onClickStart = this.onClickStart.bind(this);
        this.state = {familyID: null, pavilionID: null, projects: []};
    }

    getDataURI() {
        let url = `/administrator/index.php?option=com_janalyze&task=items.execute&familyID=${familyID}&format=json`;
        let projectID = this.getSelectedProjects();
        if (projectID.length > 0) url += projectID;
        return url;
    }

    getSelectedProjects() {
        let result = '';
        for (let project of document.querySelectorAll(`.select-project div input[type='checkbox']`)) {
            if (project.checked) result += `&projectID[]=${project.dataset.id}`;
        }
        return result;
    }

    onClickStart() {
        this.loadData();
    }

    onChangePavilionID(event) {
        if (event.target.value !== undefined) {
            let pavilion = event.target.value;
            this.setState({pavilionID: pavilion});
        }
    }

    onChangeFamilyID(event) {
        if (event.target.value !== undefined) {
            let familyID = event.target.value;
            if (familyID !== '') {
                this.setState({familyID: familyID});
                ReactDOM.render(<Pavilions onChange={this.onChangePavilionID} pavilions={this.props.families[familyID].pavilions} />, document.querySelector("#pavilions"));
                ReactDOM.render(<Projects familyID={familyID} projects={this.props.families[familyID].projects} />, document.querySelector("#all-projects"));
                ReactDOM.render(<Start onClick={this.onClickStart} disabled={false} />, document.querySelector("#start"));
            }
            else {
                ReactDOM.render(<Start disabled={true} />, document.querySelector("#start"));
            }
        }
    }

    loadData() {
        const familyID = this.state.familyID;
        const pavilionID = this.state.pavilionID;

        console.log(familyID, pavilionID);

        if (isNaN(parseInt(familyID))) return;
        document.querySelector("#project-title").textContent = document.querySelector(`#select-family option[value='${familyID}']`).textContent;
        ReactDOM.render(<Spinner type="primary" text="Загружаем результаты..." />, document.querySelector("#tables"));
        const url = this.getDataURI();
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

    render() {
        return (
            <div className="row">
                <div className="col-lg-3 col-md-6 pb-2">
                    <Families onChange={this.onChangeFamilyID} families={this.props.families} />
                </div>
                <div className="col-lg-3 col-md-6 pb-2" id="pavilions" />
                <div className="col-lg-5 col-md-6 pb-2" id="all-projects" />
                <div className="col-lg-1  col-md-6 pb-2" id="start" />
            </div>
        )
    }
}
