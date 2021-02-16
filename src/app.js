'use strict';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

window.onload = () => {
    let url = "data.json";
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            addGlobalData(data);
            addSquareTypesData(data);
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

let addSquareTypesData = (data) => {
    for(let i = 0; i < data.projects.length; i++) {
        let th = document.createElement('th');
        th.innerText = data.projects[i].title;
        th.colSpan = 4;
        document.querySelector("#in_pav-head").appendChild(th);
        for(let type of [1, 2, 3, 4]) {
            let td_square = document.createElement('td');
            let td_money = document.createElement('td');
            let td_percent_squares = document.createElement('td');
            let td_percent_money = document.createElement('td');
            for (let j = 0; j < data.by_square_type.length; j++) {
                td_square.innerText = '0 кв. м.';
                td_money.innerText = formatter_money.format(parseFloat(0));
                td_percent_squares.innerText = formatter_percent.format(parseFloat(0));
                td_percent_money.innerText = formatter_percent.format(parseFloat(0));
                if (data.by_square_type[j].projectID === data.projects[i].id && data.by_square_type[j].square_type === type) {
                    td_square.innerText = formatter_square.format(parseFloat(data.by_square_type[j].square)) + ' кв. м.';
                    td_square.id = `by_square_type_data_${data.projects[i].id}_${type}`;
                    td_money.innerText = formatter_money.format(parseFloat(data.by_square_type[j].money));
                    td_percent_squares.innerText = formatter_percent.format(parseFloat(0));
                    td_percent_money.innerText = formatter_percent.format(parseFloat(0));
                    break;
                }
            }
            document.querySelector(`#in_pav-${type}`).appendChild(td_square);
            document.querySelector(`#in_pav-${type}`).appendChild(td_percent_squares);
            document.querySelector(`#in_pav-${type}`).appendChild(td_money);
            document.querySelector(`#in_pav-${type}`).appendChild(td_percent_money);
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
