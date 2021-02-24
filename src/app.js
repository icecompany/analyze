'use strict';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
window.Tablesort = require('tablesort');
require('tablesort/src/sorts/tablesort.number');
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
                document.querySelector(`#heading-more button`).innerText = e.target.textContent;
                ReactDOM.render(<Summary type="more" selector="more" head="Компания" projects={data.projects} types={data.companies} data={data.data} total={data.total} />, document.querySelector("#table-more"));
            });
        return false;
    }

    render() {
        return (
            <a href="#" data-bs-target={`#collapse-${this.props.collapse}`} data-bs-toggle="collapse" onClick={this.load} data-square={this.props.square_type} data-commercial={this.props.commercial}>{this.props.title}</a>
        )
    }
}

class ShowCollapse extends React.Component {
    click(e) {
        e.preventDefault();
        return false;
    }

    render() {
        if (this.props.collapse !== 'sponsor' && this.props.collapse !== 'non_commercial') {
            return (
                <a href="#" data-bs-target={`#collapse-${this.props.collapse}`} data-bs-toggle="collapse" onClick={this.click}>{this.props.title}</a>
            )
        }
        else {
            return (this.props.title);
        }
    }
}

class Summary extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let sort = new Tablesort(document.querySelector(`#selector-${this.props.selector}`));
        sort.refresh();
    }

    render() {
        let heads = Object.keys(this.props.projects).map((id, i) => {
            if (i !== 0) {
                return ['square', 'percent_square', 'money', 'percent_money'].map((what, j) => {
                    return (
                        <th key={j} style={{cursor: "pointer"}} data-sort-method='number'>{this.props.projects[id]}</th>
                    )
                })
            }
            else {
                return ['square', 'money'].map((what, j) => {
                    return (
                        <th key={j} style={{cursor: "pointer"}} data-sort-method='number'>{this.props.projects[id]}</th>
                    )
                })
            }
        });
        let data = Object.keys(this.props.types).map((type_id, i) => {
            switch (this.props.type) {
                case 'squares': {
                    return (
                        <tr key={i}>
                            <td>
                                <More collapse="more" title={this.props.types[type_id]} square_type={type_id} commercial="commercial" />
                            </td>
                            {Object.keys(this.props.data[type_id]).map((projectID, j) => {
                                if (j !== 0) {
                                    return ['square', 'percent_square', 'money', 'percent_money'].map((what, k) => {
                                        return (<td key={k}>{this.props.data[type_id][projectID][what]}</td>);
                                    })
                                }
                                else {
                                    return ['square', 'money'].map((what, k) => {
                                        return (<td key={k}>{this.props.data[type_id][projectID][what]}</td>);
                                    })
                                }
                            })}
                        </tr>
                    )
                }
                case 'global': {
                    return (
                        <tr key={i}>
                            <td>
                                <ShowCollapse collapse={type_id} title={this.props.types[type_id]} />
                            </td>
                            {Object.keys(this.props.data[type_id]).map((projectID, j) => {
                                if (j !== 0) {
                                    return ['square', 'percent_square', 'money', 'percent_money'].map((what, k) => {
                                        return (<td key={k}>{this.props.data[type_id][projectID][what]}</td>);
                                    })
                                }
                                else {
                                    return ['square', 'money'].map((what, k) => {
                                        return (<td key={k}>{this.props.data[type_id][projectID][what]}</td>);
                                    })
                                }
                            })}
                        </tr>
                    )
                }
                default: {
                    return (
                        <tr key={i}>
                            <td>
                                {this.props.types[type_id]}
                            </td>
                            {Object.keys(this.props.data[type_id]).map((projectID, j) => {
                                if (j !== 0) {
                                    return ['square', 'percent_square', 'money', 'percent_money'].map((what, k) => {
                                        return (<td key={k}
                                                    data-sort={this.props.data[type_id][projectID][`${what}_clean`]}>{this.props.data[type_id][projectID][what]}</td>);
                                    })
                                }
                                else {
                                    return ['square', 'money'].map((what, k) => {
                                        return (<td key={k}
                                                    data-sort={this.props.data[type_id][projectID][`${what}_clean`]}>{this.props.data[type_id][projectID][what]}</td>);
                                    })
                                }
                            })}
                        </tr>
                    )
                }
            }
        });
        let total = Object.keys(this.props.projects).map((projectID, i) => {
            if (i !== 0) {
                return ['square', 'percent_square', 'money', 'percent_money'].map((what, k) => {
                    return (<th key={k}>{this.props.total[projectID][what]}</th>);
                })
            }
            else {
                return ['square', 'money'].map((what, k) => {
                    return (<th key={k}>{this.props.total[projectID][what]}</th>);
                })
            }
        });
        return (
            <table className="table table-bordered table-hover" id={`selector-${this.props.selector}`}>
                <thead>
                <tr>
                    <th>{this.props.head}</th>
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
                            data-bs-target={`#collapse-${this.props.id}`} aria-expanded={this.props.expand} aria-controls={`collapse-${this.props.id}`}>
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
            return (<AccordionItem key={i} id={id} title={items[id]} accordion={this.props.id} expand="false" />)
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
            ReactDOM.render(<Summary type="global" selector="summary" head="Площадь" projects={data.summary.projects} types={data.summary.types} data={data.summary.data} total={data.summary.total} />, document.querySelector("#table-summary"));
            ReactDOM.render(<Summary type="squares" selector="pavilion" head="Площадь" projects={data.squares.projects} types={data.squares.types.pavilion} data={data.squares.data.pavilion} total={data.squares.total.pavilion} />, document.querySelector("#table-pavilion"));
            ReactDOM.render(<Summary type="squares" selector="street" head="Площадь" projects={data.squares.projects} types={data.squares.types.street} data={data.squares.data.street} total={data.squares.total.street} />, document.querySelector("#table-street"));
            ReactDOM.render(<Summary type="2th-floor" selector="floor" head="Площадь" projects={data.squares.projects} types={data.floor.types} data={data.floor.data} total={data.floor.total} />, document.querySelector("#table-floor"));
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
