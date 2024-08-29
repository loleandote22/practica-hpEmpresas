let jsonData = [];
let sortOrder = {};
let producto = "";
let i = 1;

// #region Función de inicio
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('indice-header').addEventListener('click', () => sortTable('indice'));
    document.getElementById('pais-header').addEventListener('click', () => sortTable('pais'));
    obtenerInfoRuta();
});


function obtenerInfoRuta() {
    let currentURL = window.location.href;
    currentURL = currentURL.replace(/%20/g, " ");
    let lastSlashIndex = currentURL.lastIndexOf("/");
    producto = currentURL.substring(lastSlashIndex + 1);
    getData();
}

// #endregion
// #region Funciones de tabla
async function getData() {
    const url = "http://localhost:5002/cotizaciones";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        jsonData = await response.json();
        console.log(jsonData);
        renderTable(jsonData);

        // Añadir eventos de clic a las cabeceras de la tabla
        document.querySelectorAll('th[data-column]').forEach(header => {
            header.addEventListener('click', () => {
                const column = header.getAttribute('data-column');
                sortTable(column);
            });
        });
    } catch (error) {
        console.error(error.message);
    }
}

function renderTable(data) {
    const tableBody = document.querySelector('#data-table');
    if (!tableBody) {
        throw new Error("No se encontró el elemento tbody en la tabla con id 'data-table'");
    }

    let content = '';
    data.forEach(item => {
        content += `<tr><td><a href="${producto}/${item.pais}">${item.indice}</a></td><td><a href="${producto}/${item.pais}">${item.pais}</a></td></tr>`;
    })

    tableBody.innerHTML = content;
}

function sortTable(column) {
    if (i == 1) {
        // Alternar el orden de clasificación
        if (!sortOrder[column])
            sortOrder[column] = 'asc';
        else 
            sortOrder[column] = sortOrder[column] === 'asc' ? 'desc' : 'asc';
        const sortedData = [...jsonData].sort((a, b) => {
            if (a[column] < b[column]) return sortOrder[column] === 'asc' ? -1 : 1;
            if (a[column] > b[column]) return sortOrder[column] === 'asc' ? 1 : -1;
            return 0;
        });
        renderTable(sortedData);
        i = 0
    } else
        i = 1;
    console.log(i);
}
// #endregion