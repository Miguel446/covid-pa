const width_threshold = 480;
var defaultOrientation = 0;

window.addEventListener("orientationchange", function () {
  location.reload();
}, false);

const getPolynomialRegression = (data, degre) => {
  degre = degre || 2;
  let resultRegression = [];

  regression('polynomial', data, degre).points.forEach((element) =>
    resultRegression.push(Math.ceil(element[1] * 100) / 100)
  );
  return resultRegression;
};

const getExponentialRegression = (data) => {
  let dataRegression = [];
  data.forEach((element, index) => dataRegression.push([index + 1, element]));

  let resultRegression = [];
  regression('exponential', dataRegression).points.forEach((element) =>
    resultRegression.push(Math.ceil(element[1] * 100) / 100)
  );
  return resultRegression;
};

function getData() {
  let vetorDatas = [];

  let novosCasos = [];
  let totalCasos = [];

  let novosObitos = [];
  let totalObitos = [];

  let arrayRegressaoPolinomial = [];
  let arrayRegressaoExponencial = [];

  $.ajax({
    type: 'GET',
    url: '/boletim',
    success: function (boletim) {

      let b = [];
      let len = boletim.length;

      for (let i = 0; i < len; i++) {
        b = boletim[i];
        vetorDatas.push(ajusteDataHora(b.data));

        novosCasos.push(b.novosCasos);
        totalCasos.push(b.totalCasos);

        novosObitos.push(b.novosObitos);
        totalObitos.push(b.totalObitos);

        arrayRegressaoPolinomial.push([i, b.novosCasos]);

        b.novosCasos === 0 ? arrayRegressaoExponencial.push(0.1) : arrayRegressaoExponencial.push(b.totalCasos);

      }

      let regressaoPolinomial = getPolynomialRegression(arrayRegressaoPolinomial, 2);
      let regressaoExponencial = getExponentialRegression(arrayRegressaoExponencial);

      drawCasosPorDiaChart(vetorDatas, novosCasos, regressaoPolinomial);
      drawCasosAcumuladosChart(vetorDatas, totalCasos, regressaoExponencial);

      drawObitosPorDiaChart(vetorDatas, novosObitos);
      drawObitosAcumuladosChart(vetorDatas, totalObitos);
    }
  });
}

function drawCasosPorDiaChart(data, novosCasos, curvaContagio) {
  if ($("#casosPorDiaChart").length) {
    ctxLine = document.getElementById("casosPorDiaChart").getContext("2d");
    optionsLine = {
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Nº de casos"
            }
          }
        ]
      },
    };

    optionsLine.maintainAspectRatio =
      $(window).width() < width_threshold ? false : true;

    configLine = {
      type: "bar",
      data: {
        labels: data,
        datasets: [
          {
            label: "Total",
            data: novosCasos,
            fill: false,
            borderColor: "rgb(75, 192, 192,0.8)",
            backgroundColor: "rgb(75, 192, 192,0.8)",
            lineTension: 0.1,
          }, {
            label: "Tendência*",
            data: curvaContagio,
            fill: false,
            borderColor: "rgba(255,99,132,1)",
            backgroundColor: "rgba(255,99,132,1)",
            lineTension: 0.1,
            type: 'line',
          }
        ]
      },
      options: optionsLine
    };

    lineChart = new Chart(ctxLine, configLine);
  }
}

function drawObitosPorDiaChart(data, novosObitos, novosSrag) {
  if ($("#obitosPorDiaChart").length) {
    ctxLine = document.getElementById("obitosPorDiaChart").getContext("2d");
    optionsLine = {
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Nº de óbitos"
            }
          }
        ]
      }
    };

    optionsLine.maintainAspectRatio =
      $(window).width() < width_threshold ? false : true;

    configLine = {
      type: "bar",
      data: {
        labels: data,
        datasets: [
          {
            label: "Covid-19",
            data: novosObitos,
            fill: false,
            borderColor: "rgb(75, 192, 192, 1)",
            backgroundColor: "rgb(75, 192, 192, 1)",
            lineTension: 0.1
          }
        ]
      },
      options: optionsLine
    };

    lineChart = new Chart(ctxLine, configLine);
  }
}

function drawCasosAcumuladosChart(data, totalCasos, curvaContagio) {
  if ($("#casosAcumuladosChart").length) {
    ctxLine = document.getElementById("casosAcumuladosChart").getContext("2d");
    optionsLine = {
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Nº de casos"
            }
          }
        ]
      }
    };

    // Set aspect ratio based on window width
    optionsLine.maintainAspectRatio =
      $(window).width() < width_threshold ? false : true;

    configLine = {
      type: "line",
      data: {
        labels: data,
        datasets: [
          {
            label: "Total",
            data: totalCasos,
            fill: false,
            borderColor: "rgb(75, 192, 192, 0.8)",
            backgroundColor: "rgb(75, 192, 192, 0.8)",
            lineTension: 0.1
          },
          {
            label: "Tendência*",
            data: curvaContagio,
            fill: false,
            borderColor: "rgba(255,99,132,1)",
            backgroundColor: "rgba(255,99,132,1)",
            lineTension: 0.1
          }
        ]
      },
      options: optionsLine
    };

    lineChart = new Chart(ctxLine, configLine);
  }
}


function drawObitosAcumuladosChart(data, totalObitos, totalSrag) {
  if ($("#obitosAcumuladosChart").length) {
    ctxLine = document.getElementById("obitosAcumuladosChart").getContext("2d");
    optionsLine = {
      scales: {
        yAxes: [
          {
            type: "logarithmic",
            ticks: {
              min: 0,
              max: 6000,
              callback: function (value, index, values) {//needed to change the scientific notation results from using logarithmic scale
                return Number(value.toString());//pass tick values as a string into Number function
              }
            },
            afterBuildTicks: function (pckBarChart) {
              pckBarChart.ticks = [];
              pckBarChart.ticks.push(0);
              pckBarChart.ticks.push(1000);
              pckBarChart.ticks.push(2000);
              pckBarChart.ticks.push(3000);
              pckBarChart.ticks.push(4000);
              pckBarChart.ticks.push(5000);
              pckBarChart.ticks.push(6000);
            },
            scaleLabel: {
              display: true,
              labelString: "Nº de óbitos"
            }
          }
        ]
      }
    };

    // Set aspect ratio based on window width
    optionsLine.maintainAspectRatio =
      $(window).width() < width_threshold ? false : true;

    configLine = {
      type: "line",
      data: {
        labels: data,
        datasets: [
          {
            label: "Covid-19",
            data: totalObitos,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgb(75, 192, 192)",
            lineTension: 0.1
          }
        ]
      },
      options: optionsLine
    };

    lineChart = new Chart(ctxLine, configLine);
  }
}

function updateChartOptions() {
  if ($(window).width() < width_threshold) {
    if (optionsLine) {
      optionsLine.maintainAspectRatio = false;
    }
  } else {
    if (optionsLine) {
      optionsLine.maintainAspectRatio = true;
    }
  }
}

function ajusteDataHora(data) {
  var dia = data.dayOfMonth;
  var mes = data.monthValue;
  var ano = data.year;
  var hora = data.hour;
  var minuto = data.minute;

  if (dia < 10) {
    dia = "0" + dia;
  }
  if (mes < 10) {
    mes = "0" + mes;
  }
  if (hora < 10) {
    hora = "0" + hora;
  }
  if (minuto < 10) {
    minute = "0" + minuto;

  }
  if (hora == null && minuto == null) {
    var dataHoraAjustada = dia + '/' + mes + '/' + ano;
  } else {
    var dataHoraAjustada = dia + '/' + mes + '/' + ano + ' ' + hora + ':' + minuto;
  }
  return dataHoraAjustada;
}
