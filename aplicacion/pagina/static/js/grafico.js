const correlation = document.getElementById("correlacion");
const analisis = document.getElementById("analisis");
const imagenAnalisis = document.getElementById("imagenAnalisis");

function obtenerInfoRuta() {
    let currentURL = window.location.href;
    currentURL = currentURL.replace(/%20/g, " ");
    let lastSlashIndex = currentURL.lastIndexOf("/");
    let penultimateSlashIndex = currentURL.lastIndexOf("/", lastSlashIndex - 1);
    let producto = currentURL.substring(penultimateSlashIndex + 1, lastSlashIndex);
    let pais = currentURL.substring(lastSlashIndex + 1);
    getData(pais, producto);
}

// #region Funciones de correlación
function calcularCovarianza(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        throw new Error('Los arrays deben tener la misma longitud');
    }
    const n = arr1.length;
    // Calcular las medias de los arrays
    const mediaArr1 = arr1.reduce((acc, val) => acc + val, 0) / n;
    const mediaArr2 = arr2.reduce((acc, val) => acc + val, 0) / n;
    // Calcular la covarianza
    let sumaCovarianza = 0;
    for (let i = 0; i < n; i++) {
        sumaCovarianza += (arr1[i] - mediaArr1) * (arr2[i] - mediaArr2);
    }

    return sumaCovarianza / n;
}
function calcularVarianza(arr) {
    const n = arr.length;
    const media = arr.reduce((acc, val) => acc + val, 0) / n;
    let sumaVarianza = 0;
    for (let i = 0; i < n; i++) {
        sumaVarianza += Math.pow(arr[i] - media, 2);
    }
    const varianza = sumaVarianza / n;
    return varianza;
}

function calcularCorrelacion(arr1, arr2) {
    const covarianza = calcularCovarianza(arr1, arr2);
    const desviacionEstandarArr1 = Math.sqrt(calcularVarianza(arr1));
    const desviacionEstandarArr2 = Math.sqrt(calcularVarianza(arr2));

    const correlacion = covarianza / (desviacionEstandarArr1 * desviacionEstandarArr2);
    return correlacion;
}

function mostrarCorrelacion(datosCotizacion, datosEnergia) {
    const tamanoCotizacion = datosCotizacion.length;
    const tamanoEnergia = datosEnergia.length;
    if (tamanoCotizacion > tamanoEnergia)
        datosCotizacion = datosCotizacion.slice(tamanoCotizacion - tamanoEnergia);
    else if (tamanoEnergia > tamanoCotizacion)
        datosEnergia = datosEnergia.slice(tamanoEnergia - tamanoCotizacion);
    const correlacion = calcularCorrelacion(datosCotizacion, datosEnergia);
    var correlacionAbs = Math.abs(correlacion);
    let correlacionTexto = "";
    let resto = 0;
    let color = "#ffffff";
    let colorHover = "#ffffff";
    let correlacionGrafica = Math.round((correlacionAbs) * 100);
    if (correlacionAbs > 0.8) {
        correlacionTexto = "Existe una correlación fuerte entre los datos";
        color = '#00ff00';
        colorHover = '#66ff66'
    }
    else if (correlacionAbs > 0.6) {
        correlacionTexto = "Existe una correlación moderada entre los datos";
        color = '#ffff00';
        colorHover = '#ffff99';
    }
    else if (correlacionAbs > 0.4) {
        correlacionTexto = "Existe una correlación débil entre los datos";
        color = '#ff8000';
        colorHover = '#ffcc99';
    } else if (correlacionAbs >= 0) {
        correlacionTexto = "La correlación es muy débil entre los datos";
        color = '#ff0000';
        colorHover = '#ff6666';
    }
    if (correlacion.length === 0)
        correlacionTexto = "No hay correlación entre los datos";
    else if (correlacionTexto.length > 0) {
        if (correlacion < 0) {
            correlacionTexto += " y es inversa";
        }
        else {
            correlacionTexto += " y es directa";
            resto = 1;
        }
    } else {
        correlacionTexto = "No hay correlación entre los datos";
        correlacionGrafica = 0;
    }
    let datosGrafica = [correlacionGrafica, 100 - correlacionGrafica];
    piechart(datosGrafica, color, colorHover);
    correlation.textContent = correlacionTexto + ".";
}
// #endregion

// #region Funciones de analisis

function compbararTendencia(min, max, minUltimo, maxUltimo, difernciaMinimos, difernciaMaximos, imagenAnalisis) {
    if ((min < minUltimo) & ((max <= maxUltimo) || (difernciaMinimos > difernciaMaximos))) {
        imagenAnalisis.src = "/static/imagenes/alcista.svg";
        return "alcista";
    }
    else {
        imagenAnalisis.src = "/static/imagenes/bajista.svg";
        return "bajista";
    }
}
function analizarDatos(datosCotizacion, fechaInicio) {
    const ultimosValores = datosCotizacion.slice(-60);
    const max = Math.max(...ultimosValores.slice(0, 12));
    const maxUltimo = Math.max(...ultimosValores.slice(-12));
    const minUltimo = Math.min(...ultimosValores.slice(-12));
    const min = Math.min(...ultimosValores.slice(0, 12));
    const diferenciaInicio = max - min;
    const diferenciaUltimo = maxUltimo - minUltimo;
    const difernciaMaximos = max - maxUltimo;
    const difernciaMinimos = minUltimo - min;
    const opcionesFecha = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const fechaFormateada = fechaInicio.toLocaleDateString('es-ES', opcionesFecha).replace(/\//g, '-');
    let texto = "Desde " + fechaFormateada + ", la tendencia es ";
    if (diferenciaUltimo > diferenciaInicio)
    {
        const primerDato = ultimosValores[0];
        const ultimoDato = ultimosValores[ultimosValores.length - 1];
        if(ultimoDato > primerDato*1.2)
            //alcista
        {
            imagenAnalisis.src = "/static/imagenes/alcista.svg";
            return texto+"alcista";
        }
        else if(ultimoDato < primerDato*0.8)
            //bajista
        {
                    imagenAnalisis.src = "/static/imagenes/alcista.svg";
            return texto+"bajista";
        }

        else
            //lateral
        imagenAnalisis.src = "/static/imagenes/nodata.png";
        return "No hay una tendencia establecida";
    }
    else {
        if (diferenciaUltimo < diferenciaInicio * 0.9)
            // Es un triangulo

            texto += "triangular y ";
        else
            // Es un rectangulo
            texto += "rectangular y ";

        texto += compbararTendencia(min, max, minUltimo, maxUltimo, difernciaMinimos, difernciaMaximos, imagenAnalisis);

        return texto;
    }
}
// #endregion

// #region Funciones de obtención de datos
async function getData(pais, producto) {

    try {
        const jsonData = await obtenerCotizacion(pais);
        const jsonData2 = await obtenerEnergia(producto, pais);
        let datosCotizacion = jsonData[2];
        let datosEnergia = jsonData2[1];

        mostrarCorrelacion(datosCotizacion, datosEnergia);
        const fechaInicio = new Date(jsonData[1].slice(-60)[0]);
        analisis.textContent = analizarDatos(datosCotizacion, fechaInicio);
        initLineChart(jsonData[0], jsonData[1], jsonData[2], jsonData[3], jsonData2[0], jsonData2[1], jsonData2[2]);
    } catch (error) {
        imagenAnalisis.src = "/static/imagenes/nodata.png";
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
        console.log(jsonData);
        if (fechas.length === 0) {
            throw new Error('No hay datos de cotización');
        }
        return [labels, fechas, data, datosFiltrados[0].indice];
    }
    catch (error) {
        console.error(error.message);
    }
    return null;

}
async function obtenerEnergia(producto, pais) {
    const url = "http://localhost:5002/energia/" + pais + "/" + producto.substring(0, 3);
    console.log(url);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    jsonData = await response.json();
    const fechas = jsonData.map(item => item.Time); // Suponiendo que jsonData tiene un campo 'Time'
    const labels = fechas.sort((a, b) => new Date(a) - new Date(b)); // Ordenar las fechas
    const data = jsonData.map(item => item.Value);
    if (jsonData.length === 0) {
        throw new Error('No hay datos de energía');
    }
    console.log(jsonData);
    return [labels, data, jsonData[0]['Product']];
}
// #endregion

// #region Funciones de gráficos
function initLineChart(labelsCotizacion, fechas, dataCotizacion, etiquetaCotizacion, labelsEnergia, dataEnergia, etiquetaEnergia) {
    // Hay mas cotizaciones que datos de energía
    if (fechas[0] < labelsEnergia[0]) {
        const fechaInicio = new Date(fechas[0])
        const fechaEnergiaInicio = new Date(labelsEnergia[0]);
        const diferenciaMeses = (fechaEnergiaInicio.getFullYear() - fechaInicio.getFullYear()) * 12 + (fechaEnergiaInicio.getMonth() - fechaInicio.getMonth()) * -1;
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
                        align: 'end'
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

function piechart(datosGrafica, color, colorHover) {
    const ctx = document.getElementById('myPieChart').getContext('2d');
    const data = {
        labels: ['Correlación', ''],
        datasets: [{
            data: datosGrafica, // Los datos deben sumar 100 para representar 180 grados
            backgroundColor: [color, '#808080'],
            hoverBackgroundColor: [colorHover, '#787276']
        }]
    };

    const options = {
        rotation: 270, // Rotar el gráfico para que empiece desde 180 grados
        circumference: 180, // Mostrar solo 180 grados
        cutout: '70%',
        plugins: {
            legend: {
                display: false // Ocultar la leyenda
            }
        }
    };

    const myPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });
    const centerX = ctx.canvas.width / 2;
    const radius = (ctx.canvas.width / 2) * 0.85; // Ajustar el radio según el tamaño del gráfico y el cutout

    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX + radius * Math.cos(Math.PI), 0 + radius * Math.sin(Math.PI));
    ctx.strokeStyle = '#000000'; // Color de la línea
    ctx.lineWidth = 20; // Ancho de la línea
    ctx.stroke();
}
// #endregion