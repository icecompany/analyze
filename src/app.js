'use strict';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';

class More extends React.Component {
    constructor(props) {
        super(props);
    }

    load(e) {
        e.preventDefault();
        let familyID = document.querySelector("#select-family").value;
        if (isNaN(parseInt(familyID))) return;
        let url = getURITypes(familyID, e.target.dataset.square, e.target.dataset.commercial);
        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((response) => {
                let data = response.data;
                ReactDOM.render(<Summary type="more" projects={data.projects} types={data.companies} data={data.data} total={data.total} />, document.querySelector("#table-more"));
            });
        return false;
    }

    render() {
        return (
            <a href="#" onClick={this.load} data-square={this.props.square_type} data-commercial={this.props.commercial}>{this.props.title}</a>
        )
    }
}

class Summary extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let heads = Object.keys(this.props.projects).map((id, i) => {
            return (
                <th key={i} colSpan={2}>{this.props.projects[id]}</th>
            )
        });
        let data = Object.keys(this.props.types).map((type_id, i) => {
            return (this.props.type !== 'squares') ? (
                <tr key={i}>
                    <td>
                        {this.props.types[type_id]}
                    </td>
                    {Object.keys(this.props.data[type_id]).map((projectID, j) => {
                        return ['square', 'money'].map((what, k) => {
                            return (<td key={k}>{this.props.data[type_id][projectID][what]}</td>);
                        })
                    })}
                </tr>
            ) : (
                <tr key={i}>
                    <td>
                        <More title={this.props.types[type_id]} square_type={type_id} commercial="commercial" />
                    </td>
                    {Object.keys(this.props.data[type_id]).map((projectID, j) => {
                        return ['square', 'money'].map((what, k) => {
                            return (<td key={k}>{this.props.data[type_id][projectID][what]}</td>);
                        })
                    })}
                </tr>
            )
        });
        let total = Object.keys(this.props.projects).map((projectID, i) => {
            return (
                Object.keys(this.props.total[projectID]).map((type, j) => {
                    return (<th key={j}>{this.props.total[projectID][type]}</th>)
                })
            )
        });
        return (
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Площадь</th>
                        {heads}
                    </tr>
                </thead>
                <tbody>{data}</tbody>
                <tfoot>
                    <tr>
                        <th>Итого</th>
                        {total}
                    </tr>
                </tfoot>
            </table>
        )
    }
}

class Families extends React.Component {
    render() {
        return (
            <select className="form-select" id="select-family" defaultValue="">
                <option value="">Семейство проектов</option>
                <option value="1">Армия</option>
                <option value="2">Комплексная безопасность</option>
            </select>
        )
    }
}

class AccordionItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="accordion-item">
                <h4 className="accordion-header" id={`heading-${this.props.id}`}>
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target={`#collapse-${this.props.id}`} aria-expanded="false" aria-controls={`collapse-${this.props.id}`}>
                        {this.props.title}
                    </button>
                </h4>
                <div id={`collapse-${this.props.id}`} className="accordion-collapse collapse" aria-labelledby={`heading-${this.props.id}`}
                     data-bs-parent={`#${this.props.accordion}`}>
                    <div className="accordion-body table-result" id={`table-${this.props.id}`}>

                    </div>
                </div>
            </div>
        )
    }
}

class Accordion extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let items = {
            "summary": "Суммарная таблица",
            "pavilion": "В павильоне",
            "street": "На улице",
            "floor": "Второй этаж",
            "more": "Подробнее"
        };
        let accordion_items = Object.keys(items).map((id, i) => {
            return (<AccordionItem key={i} id={id} title={items[id]} accordion={this.props.id} />)
        });
        return (
            <div className="accordion" id={this.props.id}>
                {accordion_items}
            </div>
        )
    }
}

let all_projects = document.querySelector("#all-projects");
let app = document.querySelector("#app");
let need_auth = document.querySelector("#need_auth");
let projects = document.querySelectorAll(".select-project input[type='checkbox']");

window.onload = () => {
    ReactDOM.render(<Families />, document.querySelector("#families"));
    all_projects.style.display = 'none';
    checkAuth();
    document.querySelector("#select-family").addEventListener('change', loadData, false);
    for (let project of projects) project.addEventListener('change', loadData, false);
}

let checkAuth = () => {
    const url = "/administrator/index.php?option=com_janalyze&task=summary.execute&familyID=1&format=json";
    fetch(url)
        .then((response) => {
            if (response.status !== 403) {
                need_auth.style.display = 'none';
            }
            else {
                app.style.display = 'none';
            }
        })
        .catch((error) => {
            app.style.display = 'none';
        })
}

let loadData = () => {
    let familyID = document.querySelector("#select-family").value;
    if (isNaN(parseInt(familyID))) return;
    all_projects.style.display = 'block';
    for (let project of document.querySelectorAll(".select-project")) project.style.display = (parseInt(project.dataset.id) !== parseInt(familyID)) ? 'none' : 'block';
    document.querySelector("#project-title").textContent = document.querySelector(`#select-family option[value='${familyID}']`).textContent;
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
            ReactDOM.render(<Accordion id="accordion-analyze" />, document.querySelector("#tables"));
            ReactDOM.render(<Summary type="global" projects={data.summary.projects} types={data.summary.types} data={data.summary.data} total={data.summary.total} />, document.querySelector("#table-summary"));
            ReactDOM.render(<Summary type="squares" projects={data.squares.projects} types={data.squares.types.pavilion} data={data.squares.data.pavilion} total={data.squares.total.pavilion} />, document.querySelector("#table-pavilion"));
            ReactDOM.render(<Summary type="squares" projects={data.squares.projects} types={data.squares.types.street} data={data.squares.data.street} total={data.squares.total.street} />, document.querySelector("#table-street"));
            ReactDOM.render(<Summary type="2th-floor" projects={data.squares.projects} types={data.floor.types} data={data.floor.data} total={data.floor.total} />, document.querySelector("#table-floor"));
        }, (error) => {
            console.log(`Получена ошибка: ${error}.`);
        });
}

let getURISummary = (familyID) => {
    let url = `/administrator/index.php?option=com_janalyze&task=summary.execute&familyID=${familyID}&format=json`;
    let excludeID = getExcludedProjects(familyID);
    if (excludeID.length > 0) url += excludeID;
    return url;
}

let getURITypes = (familyID, square_type, commercial) => {
    let url = `/administrator/index.php?option=com_janalyze&task=types.execute&familyID=${familyID}&square_type=${square_type}&commercial=${commercial}&format=json`;
    let excludeID = getExcludedProjects(familyID);
    if (excludeID.length > 0) url += excludeID;
    return url;
}

let getExcludedProjects = (familyID) => {
    let exclude = '';
    for (let project of projects) {
        if (!project.checked && parseInt(familyID) === parseInt(project.dataset.family)) exclude += `&excludeID[]=${project.dataset.id}`;
    }
    return exclude;
}
