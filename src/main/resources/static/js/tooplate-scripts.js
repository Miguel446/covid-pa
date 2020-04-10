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
  console.log(regression('polynomial', data, degre));

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
      type: "line",
      data: {
        labels: data,
        datasets: [
          {
            label: "Total",
            data: novosCasos,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            lineTension: 0.1
          }, {
            label: "Curva de contágio*",
            data: curvaContagio,
            fill: false,
            borderColor: "rgba(255,99,132,1)",
            lineTension: 0.1
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
    ctxObitoDiaLine = document.getElementById("obitosPorDiaChart").getContext("2d");
    optionsObitoDiaLine = {
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

    optionsObitoDiaLine.maintainAspectRatio =
      $(window).width() < width_threshold ? false : true;

    configObitoDiaLine = {
      type: "line",
      data: {
        labels: data,
        datasets: [
          {
            label: "Total",
            data: novosObitos,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            lineTension: 0.1
          }
        ]
      },
      options: optionsObitoDiaLine
    };

    lineObitoDiaChart = new Chart(ctxObitoDiaLine, configObitoDiaLine);
  }
}

function drawCasosAcumuladosChart(data, totalCasos, curvaContagio) {
  if ($("#casosAcumuladosChart").length) {
    ctxAcumuladoLine = document.getElementById("casosAcumuladosChart").getContext("2d");
    optionsAcumuladoLine = {
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
    optionsAcumuladoLine.maintainAspectRatio =
      $(window).width() < width_threshold ? false : true;

    configAcumuladoLine = {
      type: "line",
      data: {
        labels: data,
        datasets: [
          {
            label: "Total",
            data: totalCasos,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            lineTension: 0.1
          },
          {
            label: "Curva de contágio*",
            data: curvaContagio,
            fill: false,
            borderColor: "rgba(255,99,132,1)",
            lineTension: 0.1
          }
          /*
          {
            label: "Popular Hits",
            data: [33, 45, 37, 21, 55, 74, 69],
            fill: false,
            borderColor: "rgba(255,99,132,1)",
            lineTension: 0.1
          },
          {
            label: "Featured",
            data: [44, 19, 38, 46, 85, 66, 79],
            fill: false,
            borderColor: "rgba(153, 102, 255, 1)",
            lineTension: 0.1
          }
          */
        ]
      },
      options: optionsAcumuladoLine
    };

    lineAcumuladoChart = new Chart(ctxAcumuladoLine, configAcumuladoLine);
  }
}


function drawObitosAcumuladosChart(data, totalObitos) {
  if ($("#obitosAcumuladosChart").length) {
    ctxObitoAcumuladoLine = document.getElementById("obitosAcumuladosChart").getContext("2d");
    optionsObitoAcumuladoLine = {
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
    optionsObitoAcumuladoLine.maintainAspectRatio =
      $(window).width() < width_threshold ? false : true;

    configObitoAcumuladoLine = {
      type: "line",
      data: {
        labels: data,
        datasets: [
          {
            label: "Total",
            data: totalObitos,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            lineTension: 0.1
          },
          /*
          {
            label: "Popular Hits",
            data: [33, 45, 37, 21, 55, 74, 69],
            fill: false,
            borderColor: "rgba(255,99,132,1)",
            lineTension: 0.1
          },
          {
            label: "Featured",
            data: [44, 19, 38, 46, 85, 66, 79],
            fill: false,
            borderColor: "rgba(153, 102, 255, 1)",
            lineTension: 0.1
          }
          */
        ]
      },
      options: optionsObitoAcumuladoLine
    };

    lineObitoAcumuladoChart = new Chart(ctxObitoAcumuladoLine, configObitoAcumuladoLine);
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

function updateBarChart() {
  if (barChart) {
    barChart.options = optionsBar;
    barChart.update();
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
