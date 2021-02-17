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
            addProjects(data);
            addGlobalSquare(data);
            //addGlobalData(data);
            //addSquareTypesData(data);
        });
}

let addGlobalData = (data) => {
    for(let i = 0; i < data.projects.length; i++) {
        let th = document.createElement('th');
        th.innerText = data.projects[i].title;
        th.colSpan = 4;
        document.querySelector("#global-head").appendChild(th);
        for(let type of ['pavilion', 'street', '2th-floor', 'sponsor']) {
            let td_square = document.createElement('td');
            let td_money = document.createElement('td');
            let td_percent_squares = document.createElement('td');
            let td_percent_money = document.createElement('td');
            for (let j = 0; j < data.global.length; j++) {
                td_square.innerText = '0 кв. м.';
                td_money.innerText = formatter_money.format(parseFloat(0));
                td_percent_squares.innerText = formatter_percent.format(parseFloat(0));
                td_percent_money.innerText = formatter_percent.format(parseFloat(0));
                if (data.global[j].projectID === data.projects[i].id && data.global[j].tip === type) {
                    td_square.innerText = formatter_square.format(parseFloat(data.global[j].square)) + ' кв. м.';
                    td_square.id = `global_data_${data.projects[i].id}_${type}`;
                    td_money.innerText = formatter_money.format(parseFloat(data.global[j].money));
                    td_percent_squares.innerText = formatter_percent.format(parseFloat(0));
                    td_percent_money.innerText = formatter_percent.format(parseFloat(0));
                    break;
                }
            }
            document.querySelector(`#global-${type}`).appendChild(td_square);
            document.querySelector(`#global-${type}`).appendChild(td_percent_squares);
            document.querySelector(`#global-${type}`).appendChild(td_money);
            document.querySelector(`#global-${type}`).appendChild(td_percent_money);
        }
    }
}

let addProjects = (data) => {
    let total = document.querySelector("#summary-total");
    for (let head of document.querySelectorAll(".projects-head")) {
        for (let projectID in data.projects) {
            let th = document.createElement('th');
            th.innerText = data.projects[projectID];
            th.colSpan = 2;
            head.appendChild(th);
        }
    }
    //Total
    for (let projectID in data.projects) {
        for (let what of ['square', 'money']) {
            let th_total = document.createElement('th');
            th_total.innerText = data.total[projectID][what];
            total.appendChild(th_total);
        }
    }
}

let addGlobalSquare = (data) => {
    let tbody = document.querySelector("#global-square-types");
    for (let typeID in data.types) {
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        td.innerText = data.types[typeID];
        tr.appendChild(td);
        for (let projectID in data.projects) {
            for (let what of ['square', 'money']) {
                let td = document.createElement('td');
                try {
                    td.innerText = data.data[typeID][projectID][what];
                }
                catch (e) {
                    td.innerText = '-';
                }
                finally {
                    tr.appendChild(td);
                }
            }
        }
        tbody.appendChild(tr);
    }
}

let addSquareTypesData = (data) => {
    addProjects(data);
    for(let i = 0; i < data.projects.length; i++) {
        //Commercial
        for(let type of [1, 2, 3, 4, 5, 6, 7, 8]) {
            let td_square = document.createElement('td');
            let td_money = document.createElement('td');
            let td_percent_squares = document.createElement('td');
            let td_percent_money = document.createElement('td');
            let tds = [td_square,td_percent_squares, td_money, td_percent_money];
            for (let j = 0; j < data.by_square_type.commercial.length; j++) {
                td_square.innerText = '0 кв. м.';
                td_money.innerText = formatter_money.format(parseFloat(0));
                td_percent_squares.innerText = formatter_percent.format(parseFloat(0));
                td_percent_money.innerText = formatter_percent.format(parseFloat(0));
                if (data.by_square_type.commercial[j].projectID === data.projects[i].id && data.by_square_type.commercial[j].square_type === type) {
                    td_square.innerText = formatter_square.format(parseFloat(data.by_square_type.commercial[j].square)) + ' кв. м.';
                    td_money.innerText = formatter_money.format(parseFloat(data.by_square_type.commercial[j].money));
                    td_percent_squares.innerText = formatter_percent.format(parseFloat(0));
                    td_percent_money.innerText = formatter_percent.format(parseFloat(0));
                    break;
                }
            }
            for (let td of tds) document.querySelector(`#by_square_type-${type}`).appendChild(td);
        }
        //Sponsor
        for (let type of ['pavilion', 'street']) {
            let td_square = document.createElement('td');
            let td_money = document.createElement('td');
            let td_percent_squares = document.createElement('td');
            let td_percent_money = document.createElement('td');
            let tds = [td_square,td_percent_squares, td_money, td_percent_money];
            for (let j = 0; j < data.by_square_type.sponsor.length; j++) {
                td_square.innerText = '0 кв. м.';
                td_money.innerText = formatter_money.format(parseFloat(0));
                td_percent_squares.innerText = formatter_percent.format(parseFloat(0));
                td_percent_money.innerText = formatter_percent.format(parseFloat(0));
                if (data.by_square_type.sponsor[j].projectID === data.projects[i].id && data.by_square_type.sponsor[j].tip === type) {
                    td_square.innerText = formatter_square.format(parseFloat(data.by_square_type.sponsor[j].square)) + ' кв. м.';
                    td_money.innerText = formatter_money.format(parseFloat(data.by_square_type.sponsor[j].money));
                    td_percent_squares.innerText = formatter_percent.format(parseFloat(0));
                    td_percent_money.innerText = formatter_percent.format(parseFloat(0));
                    break;
                }
            }
            for (let td of tds) document.querySelector(`#by_square_${type}-sponsor`).appendChild(td);
        }
        //Non-commercial
        for (let type of ['pavilion', 'street']) {
            let td_square = document.createElement('td');
            let td_money = document.createElement('td');
            let td_percent_squares = document.createElement('td');
            let td_percent_money = document.createElement('td');
            let tds = [td_square,td_percent_squares, td_money, td_percent_money];
            for (let j = 0; j < data.by_square_type.noc.length; j++) {
                td_square.innerText = '0 кв. м.';
                td_money.innerText = formatter_money.format(parseFloat(0));
                td_percent_squares.innerText = formatter_percent.format(parseFloat(0));
                td_percent_money.innerText = formatter_percent.format(parseFloat(0));
                if (data.by_square_type.noc[j].projectID === data.projects[i].id && data.by_square_type.noc[j].tip === type) {
                    td_square.innerText = formatter_square.format(parseFloat(data.by_square_type.noc[j].square)) + ' кв. м.';
                    td_money.innerText = formatter_money.format(parseFloat(data.by_square_type.noc[j].money));
                    td_percent_squares.innerText = formatter_percent.format(parseFloat(0));
                    td_percent_money.innerText = formatter_percent.format(parseFloat(0));
                    break;
                }
            }
            for (let td of tds) document.querySelector(`#by_square_${type}-non-commercial`).appendChild(td);
        }
    }
}

let formatter_square = new Intl.NumberFormat("ru", {
    maximumFractionDigits: 0
});

let formatter_percent = new Intl.NumberFormat("ru", {
    style: "percent"
});

let formatter_money = new Intl.NumberFormat("ru", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 2
});
