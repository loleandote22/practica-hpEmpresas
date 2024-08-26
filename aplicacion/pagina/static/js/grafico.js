function obtenerInfoRuta() {
    let currentURL = window.location.href;
    currentURL = currentURL.replace(/%20/g, " ");
    let lastSlashIndex = currentURL.lastIndexOf("/");
    let penultimateSlashIndex = currentURL.lastIndexOf("/", lastSlashIndex - 1);
    let producto = currentURL.substring(penultimateSlashIndex + 1, lastSlashIndex);
    let pais = currentURL.substring(lastSlashIndex + 1);
    console.log("La URL actual es: " + currentURL);
    console.log("Producto: " + producto);
    console.log("Pais: " + pais);
    getData(pais, producto);
}
async function getData(pais, producto) {

    try {
        const jsonData = await obtenerCotizacion(pais);
        const jsonData2 = await obtenerEnergia(producto, pais);
        initLineChart(jsonData[0], jsonData[1], jsonData[2], jsonData[3], jsonData2[0], jsonData2[1], jsonData2[2]);
        console.log(jsonData);
    } catch (error) {
        document.querySelector('h1').textContent = 'No hay datos disponibles';
        console.error(error.message);
    }
}
async function obtenerCotizacion(pais) {
    try {
        const url = "http://localhost:5002/cotizacion/" + pais;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const jsonData = await response.json();
        console.log(jsonData);
        const fechasUnicas = new Set();
        const datosFiltrados = jsonData.filter(item => {
            const fecha = item.fecha;
            if (fechasUnicas.has(fecha)) {
                return false;
            } else {
                fechasUnicas.add(fecha);
                return true;
            }
        });
        const fechas = datosFiltrados.map(item => item.fecha).sort((a, b) => new Date(a) - new Date(b)); // Suponiendo que jsonData tiene un campo 'fecha'
        const labels = fechas.map(fecha => new Date(fecha).toLocaleDateString('es-ES')); // Formatear fechas
        const data = datosFiltrados.map(item => item.cierre); // Suponiendo que jsonData tiene un campo 'cierre'
        if (fechas.length === 0) {
            throw new Error('No hay datos de cotización');
        }
        return [labels,fechas, data, datosFiltrados[0].indice];
    }
    catch (error) {
        console.error(error.message);
    }
    return null;

}
async function obtenerEnergia(producto, pais) {
    const url = "http://localhost:5002/energia/" + pais + "/" + producto.substring(0, 3);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    jsonData = await response.json();
    console.log(jsonData);
    const fechas = jsonData.map(item => item.Time); // Suponiendo que jsonData tiene un campo 'Time'
    const labels = fechas.sort((a, b) => new Date(a) - new Date(b)); // Ordenar las fechas
    const data = jsonData.map(item => item.Value);
    if (jsonData.length === 0) {
        throw new Error('No hay datos de energía');
    }
    return [labels, data, jsonData[0]['Product']];
}
function initLineChart(labelsCotizacion,fechas, dataCotizacion, etiquetaCotizacion, labelsEnergia, dataEnergia, etiquetaEnergia) {
    // Hay mas cotizaciones que datos de energía
    if (fechas[0] < labelsEnergia[0]) {
        console.log(fechas[0]);
        const fechaInicio = new Date(fechas[0])
        const fechaEnergiaInicio = new Date(labelsEnergia[0]);
        const diferenciaMeses = (fechaEnergiaInicio.getFullYear()-fechaInicio.getFullYear()) * 12 + (fechaEnergiaInicio.getMonth()-fechaInicio.getMonth())*-1;
        console.log(diferenciaMeses);
        const missingData = new Array(diferenciaMeses).fill(0);
        dataEnergia = [...missingData, ...dataEnergia];
    }
    else if (fechas[0] > labelsEnergia[0]) {
        labelsCotizacion = fechas;
        const missingData = new Array(labelsCotizacion.indexOf(fechas[0])).fill(0);
        dataCotizacion = [...missingData, ...dataCotizacion];
    }
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labelsCotizacion,
            datasets: [
                {
                    label: etiquetaCotizacion,
                    data: dataCotizacion,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false,
                    yAxisID: 'y'
                },
                {
                    label: etiquetaEnergia,
                    data: dataEnergia,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1,
                    fill: false,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true,
                     ticks: {
                        align: 'end' // Alinea los puntos a la derecha
                    }
                },
                y: {
                    beginAtZero: true
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false // Solo dibuja la cuadrícula en el eje y principal
                    }
                }
            }
        }
    });
}
