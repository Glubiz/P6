
window.onload = function() {
  DrawGraph()
};



function DrawGraph(){
  console.log("drawing")
  var Graph = []
  var Label = []
  for(let i = 0; i < 24; i++) {
    var Price = (((parseInt(60 - 40)) / 2) * Math.sin(0.5 * (i - 6.5)) + 50)
    Graph.push(Price)
    Label.push(i)
  }
  document.querySelector('#chart').remove()
  var createCanvas = document.createElement('canvas')
  createCanvas.id = 'chart'
  document.querySelector('#ChartDiv').appendChild(createCanvas)
  var chartPlacement = document.getElementById('chart').getContext("2d")
  new Chart(chartPlacement, {
    type: 'line',
    data: {
      labels: Label,
      datasets: [{
        label: 'Daily Price',
        backgroundColor: '#169068',
        borderColor: '#169068',
        data: Graph
      }]
    },
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: true,
      },
      scales: {
        y: {
          type: 'linear',
          position: 'left',
          display: true,
          stacked: false,
          min: 0,
          max: 100
        },
        x: {
          display: true,
          min: 0,
          max: 23,
          stacked: false,
          ticks: {
              stepSize: 1,
          },
        }
      }
    }
  });
}
