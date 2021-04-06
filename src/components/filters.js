import React from "react";
import ReactDOM from "react-dom";
import Spinner from "./spinner";
import Global_heads from "./global_heads";
import Places from "./places";
import Courses from "./courses";
import Families from "./families";
import Pavilions from "./pavilions";
import Start from "./start.jsx";
import Projects from "./projects";
import Modes from "./modes";
import Equipments from "./equipments.jsx";
import Modal from "./modal.jsx";

export default class Filters extends React.Component {
    constructor(props) {
        super(props);
        this.onChangeFamilyID = this.onChangeFamilyID.bind(this);
        this.onChangePavilionID = this.onChangePavilionID.bind(this);
        this.onChangeMode = this.onChangeMode.bind(this);
        this.onCheckedProject = this.onCheckedProject.bind(this);
        this.onChangeEquipmentID = this.onChangeEquipmentID.bind(this);
        this.onClickEquipment = this.onClickEquipment.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {mode: '', familyID: '', pavilionID: '', equipmentID: '', projects: []};
    }

    getDataURI() {
        let task = (this.state.mode === 'squares') ? 'items': 'equipments';
        let url = `/administrator/index.php?option=com_janalyze&task=${task}.execute&familyID=${this.state.familyID}&format=json`;
        return this.addFiltersToURI(url);
    }

    getEquipmentsURI() {
        let url = `/administrator/index.php?option=com_prices&task=equipments.execute&format=json`;
        return this.addFiltersToURI(url);
    }

    getEquipmentURI(equipmentID, finance_type, sponsor) {
        let url = `/administrator/index.php?option=com_janalyze&task=equipment.execute&format=json&equipmentID=${equipmentID}&familyID=${this.state.familyID}`;
        if (sponsor === 'sponsor') finance_type = 'sponsor';
        url += `&finance_type=${finance_type}`;
        return this.addFiltersToURI(url);
    }

    addFiltersToURI(url) {
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

    onClickEquipment(event) {
        event.preventDefault();
        let equipmentID = event.target.dataset.equipment;
        let finance_type = event.target.dataset.finance;
        let sponsor = event.target.dataset.sponsor;
        this.setState({equipmentID: event.target.value});
        const url = this.getEquipmentURI(equipmentID, finance_type, sponsor);
        console.log(url);
    }

    onChangePavilionID(event) {
        this.setState({pavilionID: event.target.value});
    }

    onChangeEquipmentID(event) {
        this.setState({equipmentID: event.target.value});
    }

    onChangeMode(event) {
        let mode = event.target.value;
        this.setState({mode: event.target.value});
        switch (mode) {
            case 'squares': {
                this.setState({equipmentID: ''});
                ReactDOM.render(<Pavilions pavilions={this.props.families[this.state.familyID].pavilions} onChange={this.onChangePavilionID} />, document.querySelector("#pavilions"));
                break;
            }
            case 'equipments': {
                this.setState({pavilionID: ''});
                this.loadEquipments();
                break;
            }
            default: {
                this.setState({pavilionID: ''});
                ReactDOM.unmountComponentAtNode(document.querySelector("#pavilions"));
                break;
            }
        }
        this.updateInterface(this.state.familyID, mode, this.state.pavilionID, this.state.projects);
    }

    loadEquipments() {
        let url = this.getEquipmentsURI();
        fetch(url)
            .then((response) => {
                return response.json();
            }, (error) => {
                console.log(`Ошибка получения списка оборудования: ${error}`);
            })
            .then((data) => {
                data = data.data;
                ReactDOM.render(<Equipments equipments={data} onChange={this.onChangeEquipmentID} />, document.querySelector("#pavilions"));
            })
    }

    resetMode() {
        try {
            let field = document.querySelector("#modes");
            if (field !== undefined) field.value = '';
        }
        catch (e) {

        }
        finally {
            this.resetPavilionID();
        }
        this.setState({mode: ''});
    }

    resetPavilionID() {
        try {
            let field = document.querySelector("#select-pavilion");
            if (field !== undefined) field.value = '';
        }
        catch (e) {

        }
        finally {
            this.setState({pavilionID: ''});
        }
    }

    onChangeFamilyID(event) {
        let familyID = event.target.value;
        if (familyID !== '') {
            ReactDOM.unmountComponentAtNode(document.querySelector("#modes"));
            ReactDOM.unmountComponentAtNode(document.querySelector("#all-projects"));
            this.fillProjectsState(familyID, this.props.families[familyID].projects);
            ReactDOM.render(<Modes onChange={this.onChangeMode} />, document.querySelector("#modes"));
            ReactDOM.render(<Projects onClick={this.onCheckedProject} familyID={familyID} projects={this.props.families[familyID].projects} />, document.querySelector("#all-projects"));
            this.resetMode();
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
                ReactDOM.render(<Places mode={this.state.mode} structure={data.structure} type="places" id="general" data={data} onClickEquipment={this.onClickEquipment} />, document.querySelector("#tables"));
                ReactDOM.render(<Courses projects={data.projects} />, document.querySelector("#courses"));
                ReactDOM.render(<Modal id="modal-equipment" title="Test modal" />, document.querySelector("#div-equipment"));
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
