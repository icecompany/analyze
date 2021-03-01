'use strict';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
window.Tablesort = require('tablesort');
window.bootstrap = require('bootstrap');
require('tablesort/src/sorts/tablesort.number');
import React from 'react';
import ReactDOM from 'react-dom';
import Spinner from "./components/spinner";
import Auth from "./components/auth";

class Project extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange() {
        loadData(this.props.familyID);
    }

    render() {
        let project = this.props.project;
        return (
            <div className="form-check form-switch form-check-inline">
                <input type="checkbox" key={this.props.projectID} className="form-check-input" defaultChecked={project.checked} onChange={this.handleChange} data-family={this.props.familyID} data-id={this.props.projectID} id={project.alias} />
                <label className="form-check-label" htmlFor={project.alias}>{project.title}</label>
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

    componentDidMount() {
        loadData(this.props.familyID);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        loadData(this.props.familyID);
    }

    render() {
        let familyID = this.props.familyID;
        return (
            <div data-id={familyID} className="select-project form-check-inline">
                {Object.keys(this.props.projects).map((projectID, i) => {
                    return (
                        <Project familyID={familyID} projectID={projectID} project={this.props.projects[projectID]} key={i} />
                    )
                })}
            </div>
        )
    }
}

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
        let titles = {
            'square': 'кв. м.',
            'percent_square': '% площ.',
            'money': 'руб.',
            'percent_money': '% руб.',
        }
        let color = {
            'square': '#4F4F4F',
            'percent_square': '#666666',
            'money': 'black',
            'percent_money': '#666666',
        }
        let background = {
            0: '#D1FFD1',
            1: '#B7E2B7',
        }
        let heads = Object.keys(this.props.projects).map((id, i) => {
            return ((i !== 0) ? ['square', 'percent_square', 'money', 'percent_money'] : ['square', 'money']).map((what, j) => {
                return (
                    <th key={j} style={{cursor: "pointer", backgroundColor: background[i % 2], color: color[what]}} data-sort-method='number'>{`${this.props.projects[id]} (${titles[what]})`}</th>
                )
            })
        });
        let data = Object.keys(this.props.types).map((type_id, i) => {
            let items = {
                global: <ShowCollapse collapse={type_id} title={this.props.types[type_id]} />,
                squares: <More collapse="more" title={this.props.types[type_id]} square_type={type_id} commercial="commercial" />,
                '2th-floor': this.props.types[type_id],
                more: <a href={`/administrator/index.php?option=com_companies&task=company.edit&id=${type_id}`} target="_blank">{this.props.types[type_id]}</a>
            }
            return (
                <tr key={i}>
                    <td>
                        {items[this.props.type]}
                    </td>
                    {Object.keys(this.props.data[type_id]).map((projectID, j) => {
                        return ((j !== 0) ? ['square', 'percent_square', 'money', 'percent_money'] : ['square', 'money']).map((what, k) => {
                            return (<td style={{backgroundColor: background[j % 2], color: color[what]}} key={k}>{this.props.data[type_id][projectID][what]}</td>);
                        });
                    })}
                </tr>
            )
        });
        let total = Object.keys(this.props.projects).map((projectID, i) => {
            return ((i !== 0) ? ['square', 'percent_square', 'money', 'percent_money'] : ['square', 'money']).map((what, k) => {
                return (<th style={{backgroundColor: background[i % 2], color: color[what]}} key={k}>{this.props.total[projectID][what]}</th>);
            })
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
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        if (event.target.value !== undefined) {
            let familyID = event.target.value;
            ReactDOM.render(<Projects familyID={familyID} projects={this.props.families[familyID].projects} />, document.querySelector("#all-projects"));
        }
    }

    render() {
        return (
            <select className="form-select" id="select-family" onChange={this.handleChange} defaultValue="">
                <option value="">Семейство проектов</option>
                {Object.keys(this.props.families).map((familyID, i) => {
                    return (<option value={familyID} key={i}>{this.props.families[familyID].title}</option> )
                })}
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

class Filters extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="row">
                <div className="col-3">
                    <Families families={this.props.families} />
                </div>
                <div className="col-9" id="all-projects" />
            </div>
        )
    }
}

let loadData = (familyID) => {
    if (isNaN(parseInt(familyID))) return;
    document.querySelector("#project-title").textContent = document.querySelector(`#select-family option[value='${familyID}']`).textContent;
    ReactDOM.render(<Spinner type="primary" text="Загружаем результаты..." />, document.querySelector("#tables"));
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
    let projectID = getProjects();
    if (projectID.length > 0) url += projectID;
    return url;
}

let getURITypes = (familyID, square_type, commercial) => {
    let url = `/administrator/index.php?option=com_janalyze&task=types.execute&familyID=${familyID}&square_type=${square_type}&commercial=${commercial}&format=json`;
    let projectID = getProjects();
    if (projectID.length > 0) url += projectID;
    return url;
}

let getProjects = () => {
    let result = '';
    for (let project of document.querySelectorAll(`.select-project div input[type='checkbox']`)) {
        if (project.checked) result += `&projectID[]=${project.dataset.id}`;
    }
    return result;
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            connected: false,
            url: {
                families:'src/data/families.json'
            }
        }
    }

    connect() {
        const url = "/administrator/index.php?option=com_janalyze&task=summary.execute&familyID=1&excludeID=5&format=json";
        fetch(url)
            .then((response) => {
                if (response.status === 403) {
                    ReactDOM.render(<Auth />, document.querySelector("#app"));
                }
                else {
                    this.setState({connected: true});
                    this.loadFilters();
                }
            }, (error) => {
                console.log(`Not auth: ${error}`)
            })
            .catch((error) => {
                console.log(`Error in parse auth: ${error}`)
            })
    }

    loadFilters() {
        fetch(this.state.url.families)
            .then((response) => {
                if (!response.ok) console.log(`Code: ${response.status}`);
                else return response.json();
            }, (error) => {
                console.log(`Получена ошибка: ${error}.`);
            })
            .then((families) => {
                ReactDOM.render(<Filters families={families} />, document.querySelector(`#filters`));
            }, (error) => {
                console.log(`Получена ошибка (1): ${error}.`);
            })
    }

    componentDidMount() {
        ReactDOM.render(<Spinner type="primary" text="Загружаем проекты" />, document.querySelector("#filters"));
        this.connect();
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="container-fluid"><h1>Анализ продаж. <span id="project-title" /></h1></div>
                <div className="container-fluid" id="filters" />
                <br/>
                <div className="container-fluid" id="tables" />
            </div>
        )
    }
}

ReactDOM.render(<App />, document.querySelector("#app"));