const width_threshold = 480;
var defaultOrientation = 0;

window.addEventListener("orientationchange", function () {
  location.reload();
}, false);

const getRegression = (data, degre) => {
  degre = degre || 2;
  let dataRegression = [];
  data.forEach((element, index) => dataRegression.push([index + 1, element]));

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
  var data = [];
  var novosCasos = [];
  var totalCasos = [];
  var novosObitos = [];
  var totalObitos = [];
  var r = [];
  var r2 = [];

  $.ajax({
    type: 'GET',
    url: '/boletim',
    success: function (boletim) {

      $.each(boletim, function (i, b) {
        data.push(ajusteDataHora(b.data));
        novosCasos.push(b.novosCasos);
        totalCasos.push(b.totalCasos);
        novosObitos.push(b.novosObitos);
        totalObitos.push(b.totalObitos);
        if (b.novosCasos == 0) {
          r.push([i, 0]);
          r2.push(0.1);
        } else {
          r.push([i, b.novosCasos]);
          r2.push(b.totalCasos);
        }

      });

      var curvaContagio = getRegression(r, 2);
      var expContagio = getExponentialRegression(r2);

      drawCasosPorDiaChart(data, novosCasos, curvaContagio);
      drawCasosAcumuladosChart(data, totalCasos, expContagio);

      drawObitosPorDiaChart(data, novosObitos);
      drawObitosAcumuladosChart(data, totalObitos);
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
            label: "Total",
            data: novosCasos,
            fill: false,
            borderColor: "rgb(75, 192, 192,0.8)",
            backgroundColor: "rgb(75, 192, 192,0.8)",
            lineTension: 0.1,
            order: 0
          }, {
            label: "Curva de contágio*",
            data: curvaContagio,
            fill: false,
            borderColor: "rgba(255,99,132,1)",
            backgroundColor: "rgba(255,99,132,1)",
            lineTension: 0.1,
            type: 'line',
            order: 2
          }
        ]
      },
      options: optionsLine
    };

    lineChart = new Chart(ctxLine, configLine);
  }
}

function drawObitosPorDiaChart(data, novosObitos) {
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
            label: "Total",
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
            label: "Curva de contágio*",
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


function drawObitosAcumuladosChart(data, totalObitos) {
  if ($("#obitosAcumuladosChart").length) {
    ctxLine = document.getElementById("obitosAcumuladosChart").getContext("2d");
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
            data: totalObitos,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgb(75, 192, 192)",
            lineTension: 0.1
          },
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

function updateLineChart() {
  if (lineChart) {
    lineChart.options = optionsLine;
    lineChart.update();
  }
}

function reloadPage() {
  setTimeout(function () {
    window.location.reload();
  }); // Reload the page so that charts will display correctly
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
