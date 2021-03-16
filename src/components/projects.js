import React from "react";

class Project extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const project = this.props.project;
        const alias = `project_${this.props.projectID}`;
        return (
            <div className="form-check form-switch form-check-inline">
                <input type="checkbox" key={this.props.projectID} onChange={this.props.onClick} className="form-check-input" defaultChecked={project.checked} data-family={this.props.familyID} data-id={this.props.projectID} id={alias} />
                <label className="form-check-label" data-project={this.props.projectID} htmlFor={alias}>
                    {project.title_short}
                </label>
            </div>
        )
    }
}


export default class Projects extends React.Component {
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
