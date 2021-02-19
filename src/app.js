'use strict';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

window.onload = () => {
    let url = "data.json";
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            let data = response.data;
            addProjects(data.summary);
            addSquare(data.summary, "#global-square-types");
            addTotal(data.summary, "#summary-total");
            addSquare(data.floor, "#floor-square-types");
            addSquare(data.squares, "#pavilion-types", 'pavilion');
            addTotal(data.squares, "#pavilion-total", 'pavilion');
            addSquare(data.squares, "#street-types", 'street');
            addTotal(data.squares, "#street-total", 'street');
        });

    let url_more = "more.json";
    fetch(url_more)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            let data = response.data;
            addMore(data, "#more-companies");
            addTotal(data, "#more-total");
        });
}

let addProjects = (data) => {
    for (let head of document.querySelectorAll(".projects-head")) {
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
    for (let typeID in (!square_type) ? data.types: data.types[square_type]) {
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        td.innerText = (!square_type) ? data.types[typeID] : data.types[square_type][typeID];
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

