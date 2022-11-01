let monedaConversion = document.querySelector('#moneda_a_convertir');
let buttonBuscar = document.querySelector('#buscar');
let cantidad_pesos = document.querySelector('#cantidad_pesos');
let tipoMoneda;
let chart;

function validarCampos(){
    if(cantidad_pesos.value == '') {
        alert('Debes ingresar al menos 1 peso');
        cantidad_pesos.focus();
        return false;
    } else {
        return true;
    }    
}  

//Evento click validarCampos
document.querySelector('#buscar').addEventListener('click', function() {    
  if (validarCampos()) {
    let html = '';
    let monedaSeleccionada = monedaConversion.value;
    html +=  `Resultado: ${Number(cantidad_pesos.value) / tipoMoneda[monedaSeleccionada].valor}`;

    document.querySelector('#resultado').innerHTML = html;
    renderGrafica();
  }
});

// Función para obtener las monedas
async function getMonedas() {
    try {
        const endpoint = "https://mindicador.cl/api/";
        const res = await fetch(endpoint);
        tipoMoneda = await res.json();
    } catch (error) {
        document.querySelector('#mensaje_error').innerHTML = error.message;
    }
}
getMonedas();

async function getHistorialMonedas() {
    try {
        const endpoint = `https://mindicador.cl/api/${monedaConversion.value}`;
        const res = await fetch(endpoint);
        return await res.json();
    } catch (error) {
        document.querySelector('#mensaje_error').innerHTML = error.message;
    }
}

async function prepararConfiguracionParaLaGrafica(monedas) {
    // Creamos las variables necesarias para el objeto de configuración
    const tipoDeGrafica = "line";
    const historialMonedas = await getHistorialMonedas();
    const historialMonedas10 = historialMonedas.serie.slice(0, 10).reverse();
    const nombresDeLasMonedas = historialMonedas10.map(moneda => new Date(moneda.fecha).toLocaleDateString('es-cl'));
    const titulo = "Historial últimos 10 días";
    const colorDeLinea = "blue";
    const valores = historialMonedas10.map((moneda) => moneda.valor);
    
    // Creamos el objeto de configuración usando las variables anteriores
    const config = {
        type: tipoDeGrafica,
        data: {
            labels: nombresDeLasMonedas,
            datasets: [
                {
                    label: titulo,
                    backgroundColor: colorDeLinea,
                    data: valores
                }
            ]
        }
    };
    return config;
}

// Función de renderización para graficar
async function renderGrafica() {
    if(chart != undefined) {
        chart.destroy();
    }
    const config = await prepararConfiguracionParaLaGrafica(tipoMoneda);
    const chartDOM = document.getElementById("myChart");
    chart = new Chart(chartDOM, config);
}


    