import React from "react";
import ReactDOM from "react-dom";
import Spinner from "./spinner";
import Global_heads from "./global_heads";
import Places from "./places";
import Courses from "./courses";
import Families from "./families";
import Pavilions from "./pavilions";
import Start from "./start";
import Projects from "./projects";
import Modes from "./modes";

export default class Filters extends React.Component {
    constructor(props) {
        super(props);
        this.onChangeFamilyID = this.onChangeFamilyID.bind(this);
        this.onChangePavilionID = this.onChangePavilionID.bind(this);
        this.onChangeMode = this.onChangeMode.bind(this);
        this.onCheckedProject = this.onCheckedProject.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {mode: '', familyID: '', pavilionID: '', projects: []};
    }

    getDataURI() {
        let task = (this.state.mode === 'squares') ? 'items': 'equipments';
        let url = `/administrator/index.php?option=com_janalyze&task=${task}.execute&familyID=${this.state.familyID}&format=json`;
        const projectID = this.getSelectedProjects();
        if (projectID.length > 0) url += projectID;
        const pavilionID = this.getSelectedPavilion();
        if (pavilionID.length > 0) url += pavilionID;
        return url;
    }

    getSelectedPavilion() {
        let result = '';
        if (this.state.pavilionID !== '') result += `&pavilionID=${this.state.pavilionID}`;
        return result;
    }

    getSelectedProjects() {
        let result = '';
        this.state.projects.map((projectID, i) => result += `&projectID[]=${projectID}`);
        return result;
    }

    onSubmit(event) {
        event.preventDefault();
        this.loadData();
    }

    onChangePavilionID(event) {
        this.setState({pavilionID: event.target.value});
    }

    onChangeMode(event) {
        let mode = event.target.value;
        this.setState({mode: event.target.value});
        this.updateInterface(this.state.familyID, mode, this.state.pavilionID, this.state.projects);
    }

    resetPavilionID() {
        document.querySelector("#select-pavilion").value = '';
        this.setState({pavilionID: ''});
    }

    onChangeFamilyID(event) {
        let familyID = event.target.value;
        if (familyID !== '') {
            this.fillProjectsState(familyID, this.props.families[familyID].projects);
            ReactDOM.render(<Modes onChange={this.onChangeMode} />, document.querySelector("#modes"));
            ReactDOM.render(<Pavilions pavilions={this.props.families[familyID].pavilions} onChange={this.onChangePavilionID} />, document.querySelector("#pavilions"));
            ReactDOM.render(<Projects onClick={this.onCheckedProject} familyID={familyID} projects={this.props.families[familyID].projects} />, document.querySelector("#all-projects"));
            this.resetPavilionID();
        }
        else {
            this.updateInterface('', this.state.mode, this.state.pavilionID, this.state.projects);
        }
        this.setState({familyID: familyID});
    }

    addProjectToState(projectID) {
        let arr = this.state.projects;
        if (this.state.projects.indexOf(projectID) < 0) {
            arr.push(projectID);
            this.setState({projects: arr});
        }
        return arr;
    }

    removeProjectFromState(projectID) {
        const index = this.state.projects.indexOf(projectID);
        let arr = this.state.projects;
        if (index >= 0) {
            arr.splice(index, 1);
            this.setState({projects: arr});
        }
        return arr;
    }

    onCheckedProject(event) {
        const projectID = event.target.dataset.id;
        let projects = this.state.projects;
        if (event.target.checked) {
            projects = this.addProjectToState(projectID);
        }
        else {
            projects = this.removeProjectFromState(projectID);
        }
        this.updateInterface(this.state.familyID, this.state.mode, this.state.pavilionID, projects);
    }

    fillProjectsState(familyID, projects) {
        let arr = [];
        Object.keys(projects).map((projectID, i) => {
            if (projects[projectID].checked) arr.push(projectID);
        });
        this.setState({projects: arr});
        this.updateInterface(familyID, this.state.mode, this.state.pavilionID, arr);
    }

    canStart(familyID, mode, pavilionID, projects) {
        let can = false;
        if (familyID !== '' && mode !== '' && projects.length > 0) can = true;
        return can;
    }

    updateInterface(familyID, mode, pavilionID, projects) {
        const disabled = (!this.canStart(familyID, mode, pavilionID, projects));
        ReactDOM.render(<Start disabled={disabled} />, document.querySelector("#start"));
    }

    loadData() {
        document.querySelector("#project-title").textContent = document.querySelector(`#select-family option[value='${this.state.familyID}']`).textContent;
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
                ReactDOM.render(<Global_heads mode={this.state.mode} projects={data.projects} />, document.querySelector("#global_heads"));
                ReactDOM.render(<Places mode={this.state.mode} structure={data.structure} type="places" id="general" data={data} />, document.querySelector("#tables"));
                ReactDOM.render(<Courses projects={data.projects} />, document.querySelector("#courses"));
            }, (error) => {
                console.log(`Получена ошибка: ${error}.`);
            });
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <div className="row">
                    <div className="col-lg-2 col-md-4 pb-2">
                        <Families onChange={this.onChangeFamilyID} families={this.props.families} />
                    </div>
                    <div className="col-lg-2 col-md-2 pb-2" id="modes" />
                    <div className="col-lg-2 col-md-6 pb-2" id="pavilions" />
                    <div className="col-lg-5 col-md-6 pb-2" id="all-projects" />
                    <div className="col-lg-1  col-md-6 pb-2" id="start" />
                </div>
            </form>
        )
    }
}
