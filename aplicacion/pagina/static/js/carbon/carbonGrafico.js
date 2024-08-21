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
async function getData(pais, producto){
   
    try {
        const jsonData = await obtenerCotizacion(pais);
        const jsonData2 = await obtenerEnergia(producto, pais);
        initLineChart(jsonData[0], jsonData[1], jsonData[2],jsonData2[1],jsonData2[2]);
        console.log(jsonData);
    } catch (error) {
        console.error(error.message);
    }
}
async function obtenerCotizacion(pais){
    const url = "http://localhost:5002/cotizacion/"+pais;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        jsonData = await response.json();
        const labels = jsonData.map(item => {
            const date = new Date(item.fecha);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript son 0-indexados
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        });        const data = jsonData.map(item => item.cierre); // Suponiendo que jsonData tiene un campo 'valor'
        return [labels, data, jsonData[0].indice];
}
async function obtenerEnergia(producto, pais){
    const url = "http://localhost:5002/energia/"+pais+"/Coal, Peat and Manufactured Gases";
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        jsonData = await response.json();
        const labels = jsonData.map(item => {
            const date = new Date(item.fecha);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript son 0-indexados
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        });
        const data = jsonData.map(item => item.Value);
        console.log(jsonData);
        return [labels, data, jsonData[0].Product];
}
function initLineChart(labels, dataCotizacion, etiquetaCotizacion, dataEnergia, etiquetaEnergia) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: etiquetaCotizacion,
                    data: dataCotizacion,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                },
                {
                    label: etiquetaEnergia,
                    data: dataEnergia,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1,
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
