'use strict';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';

class Summary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            children: this.props.data
        }
    }

    render() {
        let heads = Object.keys(this.props.projects).map((id, i) => {
            return (
                <th key={i} colSpan={2}>{this.props.projects[id]}</th>
            )
        });
        let data = Object.keys(this.props.types).map((type_id, i) => {
            return (
                <tr key={i}>
                    <td>{this.props.types[type_id]}</td>
                    {Object.keys(this.props.projects).map((projectID, j) => {
                        return (<td key={j}>{this.props.data[type_id][projectID].square}</td>)
                    })}
                    {Object.keys(this.props.projects).map((projectID, j) => {
                        return (<td key={j}>{this.props.data[type_id][projectID].money}</td>)
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
                    <tr><th>Площадь</th>{heads}</tr>
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
    let url = "/administrator/index.php?option=com_janalyze&task=summary.execute&familyID=1&format=json";
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

let loadMore = (square_type, commercial) => {
    let familyID = document.querySelector("#select-family").value;
    if (isNaN(parseInt(familyID))) return;
    let url = getURITypes(familyID, square_type, commercial);
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            let data = response.data;
            addMore(data, "#more-companies");
            addTotal(data, "#more-total");
        });
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
        })
        .then((response) => {
            let data = response.data;
            ReactDOM.render(<Summary projects={data.summary.projects} types={data.summary.types} data={data.summary.data} total={data.summary.total} />, document.querySelector("#table-summary"));
            document.querySelector("#more-companies").innerHTML = "";
            addProjects(data.summary);
            addSquare(data.floor, "#floor-square-types");
            addSquare(data.squares, "#pavilion-types", 'pavilion');
            addTotal(data.squares, "#pavilion-total", 'pavilion');
            addSquare(data.squares, "#street-types", 'street');
            addTotal(data.squares, "#street-total", 'street');
        }, (error) => {

        })
        .catch((response) => {
            console.log(`Получена ошибка: ${response}.`);
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

let addProjects = (data) => {
    let thead = document.querySelectorAll(".projects-head");
    for (let head of thead) {
        head.innerHTML = '<th>Площадь</th>';
        for (let projectID in data.projects) {
            let th = document.createElement('th');
            th.innerText = data.projects[projectID];
            th.colSpan = 2;
            head.appendChild(th);
        }
    }
}

let addTotal = (data, selector, square_type = false) => {
    let total = document.querySelector(selector);
    total.innerHTML = '<th>Итого</th>';
    for (let projectID in data.projects) {
        for (let what of ['square', 'money']) {
            let th_total = document.createElement('th');
            th_total.innerText = (!square_type) ? data.total[projectID][what] : data.total[square_type][projectID][what];
            total.appendChild(th_total);
        }
    }
}

let addSquare = (data, selector, square_type = false) => {
    let tbody = document.querySelector(selector);
    tbody.innerHTML = '';
    for (let typeID in (!square_type) ? data.types: data.types[square_type]) {
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        let a = document.createElement('a');
        a.href = '#';
        a.addEventListener('click', () => {
            loadMore(typeID, 'commercial');
            return false;
        });
        a.text = (!square_type) ? data.types[typeID] : data.types[square_type][typeID];
        td.appendChild(a);
        tr.appendChild(td);
        for (let projectID in data.projects) {
            for (let what of ['square', 'money']) {
                let td = document.createElement('td');
                try {
                    td.innerText = (!square_type) ? data.data[typeID][projectID][what] : data.data[square_type][typeID][projectID][what];
                } catch (e) {
                    td.innerText = '-';
                } finally {
                    tr.appendChild(td);
                }
            }
        }
        tbody.appendChild(tr);
    }
}

let addMore = (data, selector) => {
    let tbody = document.querySelector(selector);
    tbody.innerHTML = '';
    for (let company in data.companies) {
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        let a = document.createElement('a');
        a.href = `https://port.icecompany.org/administrator/index.php?option=com_companies&view=company&layout=edit&id=${company}`;
        a.text = data.companies[company];
        a.target = '_blank';
        td.appendChild(a);
        tr.appendChild(td);
        for (let projectID in data.projects) {
            for (let what of ['square', 'money']) {
                let td = document.createElement('td');
                try {
                    td.innerText = data.data[company][projectID][what];
                } catch (e) {
                    td.innerText = '-';
                } finally {
                    tr.appendChild(td);
                }
            }
        }
        tbody.appendChild(tr);
    }
}

