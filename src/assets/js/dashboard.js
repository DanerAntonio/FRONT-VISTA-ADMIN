$(function () {
  // =====================================
  // Ventas Totales 2024
  // =====================================
  var chart = {
    series: [
      {
        name: "Ventas 2024",
        data: [450, 560, 700, 620, 750, 810, 950, 900, 800, 820, 780, 850] // Datos de ventas mensuales
      }
    ],
    chart: {
      type: "line",
      height: 345,
      toolbar: { show: true },
      foreColor: "#adb0bb",
    },
    colors: ["#5D87FF"],
    xaxis: {
      type: "category",
      categories: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    },
    yaxis: {
      show: true,
      labels: {
        formatter: function (value) { return "$" + value + "K"; }
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    tooltip: {
      theme: "light",
    },
  };
  var chart = new ApexCharts(document.querySelector("#chart"), chart);
  chart.render();

  // =====================================
  // Top 3 Productos Más Vendidos
  // =====================================
  var topProducts = {
    series: [70, 50, 40], // Datos de ventas de productos
    labels: ["Producto A", "Producto B", "Producto C"],
    chart: {
      type: 'donut',
      width: 300,
    },
    colors: ["#49BEFF", "#5D87FF", "#FF4560"],
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
        },
      },
    },
    tooltip: {
      theme: "light",
    },
  };
  var chartTopProducts = new ApexCharts(document.querySelector("#top-products"), topProducts);
  chartTopProducts.render();

  // =====================================
  // Top 3 Productos Menos Vendidos
  // =====================================
  var lowProducts = {
    series: [10, 20, 30], // Datos de ventas de productos menos vendidos
    labels: ["Producto X", "Producto Y", "Producto Z"],
    chart: {
      type: 'donut',
      width: 300,
    },
    colors: ["#FF4560", "#FEB019", "#775DD0"],
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
        },
      },
    },
    tooltip: {
      theme: "light",
    },
  };
  var chartLowProducts = new ApexCharts(document.querySelector("#low-products"), lowProducts);
  chartLowProducts.render();
});
