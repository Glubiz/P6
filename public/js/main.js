const input = document.querySelector('#price');
const input2 = document.querySelector('#volume');
const input3 = document.querySelector('#amount');
const input4 = document.querySelector('#supply');
const input7 = document.querySelector('#burnAmount');
const input9 = document.querySelector('#swapvolume');
const input10 = document.querySelector('#daysReflections');
const input11 = document.querySelector('#priceIncrement');
var label = []
var reflctionsDataBurn = []
var reflctionsDataStatic = []

var reflctionsDataBurnR = []
var reflctionsDataStaticR = []



window.onload = function() {
  document.querySelector(".static").style.display = "none";
  document.querySelector(".burn").style.display = "block";
  document.querySelector("#ref-switch").style.display = "block";
  document.querySelector("#burn-switch").style.display = "none";
  document.querySelector("#toggleAdvancedOn").style.display = "block";
  document.querySelector("#toggleAdvancedOff").style.display = "none";
  document.querySelector("#toggleBurnWalletOn").style.display = "block";
  document.querySelector("#toggleBurnWalletOff").style.display = "none";
  document.querySelector(".burnCalculator").style.display = "none";
  document.querySelector(".advancedSettings").style.display = "none";
  document.querySelector(".normalCalc").style.display = "flex";
  calculateBurn();
  calculateStatic();
  calculateBurnAmount();
  offset();
};

input11.addEventListener("input", function(){
  calculateBurn();
  calculateStatic();
  calculateBurnAmount();
  offset();
})
input10.addEventListener("input", function(){
  calculateBurn();
  calculateStatic();
  calculateBurnAmount();
  
})
input.addEventListener("input", function(){
  calculateBurn();
  calculateStatic();
  calculateBurnAmount()
  offset();
})
input2.addEventListener("input", function(){
  calculateBurn();
  calculateStatic();
  calculateBurnAmount()
  offset();
})
input9.addEventListener("input", function(){
  calculateBurn();
  calculateStatic();
  calculateBurnAmount()
  offset();
})
input3.addEventListener("input", function(){
  calculateBurn();
  calculateStatic();
  calculateBurnAmount()
  offset();
})
input4.addEventListener("input", function(){
  calculateBurn();
  calculateStatic();
  calculateBurnAmount();
  offset();
})
input7.addEventListener("input", function(){
  calculateBurnAmount();
})

function convert(value){
  if (value.length >= 10 && value.length <= 12){
    value = parseFloat(value / 1000000).toFixed(2).toString();
    value = value + " million"
  } else if (value.length >= 13){
    value = parseFloat(value / 1000000000).toFixed(2).toString();
    value = value + " billion"
  }  else {
    value = parseFloat(value).toFixed(2).toString();
  }
  return value;
}

function calculateBurn() {
  reflctionsDataBurn = []
  reflctionsDataBurnR = []
  var dailyReflections;
  var totalReflections = 0

  const priceIncrement = document.querySelector('#priceIncrement').value;
  const volumeState = document.querySelector('#volumeState').value;
  const amountState = document.querySelector('#amountState').value;
  var volume = document.querySelector('#volume').value;
  var amount = document.querySelector('#amount').value;
  var price = document.querySelector('#price').value;
  var daysReflections = document.querySelector('#daysReflections').value;
  var percentageDistributed = document.querySelector('#distribution').value;
  var percentageConversion = 100 / percentageDistributed

  const swapState = document.querySelector('#swapvolumeState').value;
  var swap = document.querySelector('#swapvolume').value;
  var swapVolume = 0;

 

  if(swap > 0.0001){
    if (swapState=='1'){
      swap = swap * 1000000;
    } else if (swapState=='2'){
      swap = swap * 1000000000;
    } else if (swapState=='3'){
      swap = swap * 1000000000000;
    } else {
      swap = swap * 1000000;
    }
    swapVolume = (swap / 100) * 0.03;
  }

  if(volume > 0.0001){
    if (volumeState=='1'){
      volume = volume * 1000000;
    } else if (volumeState=='2'){
      volume = volume * 1000000000;
    } else if (volumeState=='3'){
      volume = volume * 1000000000000;
    } else {
      volume = volume * 1000000;
    }
  }

  if(amount > 0.0001){
    if (amountState=='1'){
      amount = amount * 1000;
    } else if (amountState=='2'){
      amount = amount * 1000000;
    } else if (amountState=='3'){
      amount = amount * 1000000000;
    } else {
      amount = amount * 1000;
    }
  }

  volume = volume + swapVolume;
  var supply = 1000000000000000
  supply /= 1000
  if (document.querySelector('#supplyHidden').value && document.querySelector('#toggleBurnWalletOff').style.display == 'none'){
    supply = supply - document.querySelector('#supplyHidden').value;
  }
  supply = supply * percentageConversion;
  var usdValue = parseFloat(price * amount).toFixed(2)
  usdValue = convert(usdValue)
  document.getElementById("totalValue").textContent = usdValue + " USD";

  var ReflectionsSupply = amount;
  for(let i=0; i<30; i++) {
    dailyReflections = (volume * ReflectionsSupply) / supply;
    ReflectionsSupply += dailyReflections / price;
    totalReflections += dailyReflections;

    if (priceIncrement > 0 && priceIncrement <= 1.5 ){
      price = price * (1 + (priceIncrement / 100))
    } else if (priceIncrement < 0 || priceIncrement > 1.5 ){
      document.querySelector('#priceIncrement').value = 0;
    }else {
      price = document.querySelector('#price').value;
    }
    console.log(price)
    if (i == 0){
      var calculatedReflections = parseFloat(totalReflections).toFixed(2).toString();
      var calculatedSafemoon = parseFloat(ReflectionsSupply - amount).toFixed(2).toString();
      if (calculatedSafemoon > (amount * 0.07)){
        document.querySelector(".dailyReflectionsOutputBurn").style.boxShadow = "0 0 1rem rgba(194, 0, 0, 1)"
        document.querySelector("#dailyReflectionsOutputBurnText").textContent = "Probability: Unlikely"
      } else if (calculatedSafemoon <= (amount * 0.07) && calculatedSafemoon >= (amount * 0.02)){
        document.querySelector(".dailyReflectionsOutputBurn").style.boxShadow = "0 0 1rem rgba(32, 151, 135, 1)"
        document.querySelector("#dailyReflectionsOutputBurnText").textContent = "Probability: Likely"
      }else {
        document.querySelector(".dailyReflectionsOutputBurn").style.boxShadow = "0 0 1rem rgba(18, 168, 18, 1)"
        document.querySelector("#dailyReflectionsOutputBurnText").textContent = "Probability: Imminent"
      }
      calculatedReflections = convert(calculatedReflections)
      calculatedSafemoon = convert(calculatedSafemoon)

      document.getElementById("dailyReflectionsBurn").textContent = calculatedReflections + " USD";
      document.getElementById("dailySafemoonReflectionsBurn").textContent = calculatedSafemoon + " Safemoon";
    } else if (i == 6) {
      var calculatedReflections = parseFloat(totalReflections).toFixed(2).toString();
      var calculatedSafemoon = parseFloat(ReflectionsSupply - amount).toFixed(2).toString();
      if (calculatedSafemoon > (amount * 0.4)){
        document.querySelector(".weeklyReflectionsOutputBurn").style.boxShadow = "0 0 1rem rgba(194, 0, 0, 1)"
        document.querySelector("#weeklyReflectionsOutputBurnText").textContent = "Probability: Unlikely"
      } else if (calculatedSafemoon <= (amount * 0.4) && calculatedSafemoon >= (amount * 0.18)){
        document.querySelector(".weeklyReflectionsOutputBurn").style.boxShadow = "0 0 1rem rgba(32, 151, 135, 1)"
        document.querySelector("#weeklyReflectionsOutputBurnText").textContent = "Probability: Likely"
      }else {
        document.querySelector(".weeklyReflectionsOutputBurn").style.boxShadow = "0 0 1rem rgba(18, 168, 18, 1)"
        document.querySelector("#weeklyReflectionsOutputBurnText").textContent = "Probability: Imminent"
      }

      calculatedReflections = convert(calculatedReflections)
      calculatedSafemoon = convert(calculatedSafemoon)

      document.getElementById("weeklyReflectionsBurn").textContent = calculatedReflections + " USD";
      document.getElementById("weeklySafemoonReflectionsBurn").textContent = calculatedSafemoon + " Safemoon";
    } else if (i == 29) {
      var calculatedReflections = parseFloat(totalReflections).toFixed(2).toString();
      var calculatedSafemoon = parseFloat(ReflectionsSupply - amount).toFixed(2).toString();
      if (calculatedSafemoon > (amount * 1.4)){
        document.querySelector(".monthlyReflectionsOutputBurn").style.boxShadow = "0 0 1rem rgba(194, 0, 0, 1)"
        document.querySelector("#monthlyReflectionsOutputBurnText").textContent = "Probability: Unlikely"
      } else if (calculatedSafemoon <= (amount * 1.4)&& calculatedSafemoon >= (amount * 0.8)){
        document.querySelector(".monthlyReflectionsOutputBurn").style.boxShadow = "0 0 1rem rgba(32, 151, 135, 1)"
        document.querySelector("#monthlyReflectionsOutputBurnText").textContent = "Probability: Likely"
      }else {
        document.querySelector(".monthlyReflectionsOutputBurn").style.boxShadow = "0 0 1rem rgba(18, 168, 18, 1)"
        document.querySelector("#monthlyReflectionsOutputBurnText").textContent = "Probability: Imminent"
      }

      calculatedReflections = convert(calculatedReflections)
      calculatedSafemoon = convert(calculatedSafemoon)

      document.getElementById("monthlyReflectionsBurn").textContent = calculatedReflections + " USD";
      document.getElementById("monthlySafemoonReflectionsBurn").textContent = calculatedSafemoon + " Safemoon";
    }
  }

  var dailyReflections;
  var totalReflections = 0
  var standardReflectionsSupply = 0;
  ReflectionsSupply = amount;
  for(let i=1; i <= daysReflections; i++) {
    dailyReflections = (volume * ReflectionsSupply) / supply;
    ReflectionsSupply += dailyReflections / price;
    totalReflections += dailyReflections;

    if (priceIncrement > 0 && priceIncrement <= 1.5 ){
      price = price * (1 + (priceIncrement / 100))
    } else if (priceIncrement < 0 || priceIncrement > 1.5 ){
      document.querySelector('#priceIncrement').value = 0;
    }else {
      price = document.querySelector('#price').value;
    }
    console.log(price)
    if (i == 1){
      standardReflectionsSupply = ReflectionsSupply - amount
    }

    if (i == daysReflections){
      document.querySelector('#customeReflectionsHeaderBurn').textContent = 'in ' + i + ' days'
      var calculatedReflections = parseFloat(totalReflections).toFixed(2).toString();
      var calculatedSafemoon = parseFloat(ReflectionsSupply - amount).toFixed(2).toString();

      calculatedReflections = convert(calculatedReflections)
      calculatedSafemoon = convert(calculatedSafemoon)

      document.getElementById("customeReflectionsBurn").textContent = calculatedReflections + " USD";
      document.getElementById("customeSafemoonReflectionsBurn").textContent = calculatedSafemoon + " Safemoon";
    }
    var totalReflectionsPercentage = ((ReflectionsSupply - amount) / amount) * 100
    var reflectionsData = parseFloat(totalReflectionsPercentage).toFixed(3)
    var reflectionsDataR = parseFloat((((standardReflectionsSupply) * i) / amount) * 100).toFixed(3)
    label.push(i.toString())
    
    reflctionsDataBurnR.push(reflectionsDataR)
    reflctionsDataBurn.push(reflectionsData)
  }
  document.querySelector('#reflectionBurnChart').remove()
  var createCanvas = document.createElement('canvas')
  createCanvas.id = 'reflectionBurnChart'
  document.querySelector('#Chart').appendChild(createCanvas)
  var chartPlacement = document.getElementById('reflectionBurnChart').getContext("2d")
  
  new Chart(chartPlacement, {
    type: 'line',
    data: {
      labels: label,
      datasets: [{
        label: 'Compounding Reflections',
        backgroundColor: 'rgb(0, 167, 157)',
        borderColor: 'rgb(0, 167, 157)',
        data: reflctionsDataBurn,
      }, {
        label: 'Linear Reflections',
        backgroundColor: 'rgb(108, 117, 125)',
        borderColor: 'rgb(108, 117, 125)',
        data: reflctionsDataBurnR,
      }]
    },
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: true,
      },
      plugins: {
        title: {
          display: true,
          text: 'Reflections in % of Balance'
        }
      },
      scales: {
        y: {
          type: 'linear',
          position: 'left',
          display: true,
          stacked: false,
        },
        x: {
          display: true,
          min: 0,
          max: 365,
          stacked: false,
          ticks: {
              stepSize: 10,
          },
        }
      }
    }
  });
}

function calculateStatic(){
  var reflctionsDataStatic = []
  var reflctionsDataStaticR = []
  const priceIncrement = document.querySelector('#priceIncrement').value;

  const volumeState = document.querySelector('#volumeState').value;
  const amountState = document.querySelector('#amountState').value;
  const supplyState = document.querySelector('#supplyState').value;
  const swapState = document.querySelector('#swapvolumeState').value;
  var swap = document.querySelector('#swapvolume').value;
  var volume = document.querySelector('#volume').value;
  var amount = document.querySelector('#amount').value;
  var supply = document.querySelector('#supply').value;
  var price = document.querySelector('#price').value;
  var daysReflections = document.querySelector('#daysReflections').value;

  var percentageDistributed = document.querySelector('#distribution').value;
  var percentageConversion = 100 / percentageDistributed

  var totalReflections = 0
  var swapVolume= 0;

  if(volume > 0.0001){
    if (volumeState=='1'){
      volume = volume * 1000000;
    } else if (volumeState=='2'){
      volume = volume * 1000000000;
    } else if (volumeState=='3'){
      volume = volume * 1000000000000;
    } else {
      volume = volume * 1000000;
    }
  }

  if(amount > 0.0001){
    if (amountState=='1'){
      amount = amount * 1000;
    } else if (amountState=='2'){
      amount = amount * 1000000;
    } else if (amountState=='3'){
      amount = amount * 1000000000;
    } else {
      amount = amount * 1000;
    }
  }

  if(supply > 0.0001){
    if (supplyState=='1'){
      supply = supply * 1000;
    } else if (supplyState=='2'){
      supply = supply * 1000000;
    } else if (supplyState=='3'){
      supply = supply * 1000000000;
    } else {
      supply = supply * 1000;
    }
  }

  if(swap > 0.0001){
    if (swapState=='1'){
      swap = swap * 1000000;
    } else if (swapState=='2'){
      swap = swap * 1000000000;
    } else if (swapState=='3'){
      swap = swap * 1000000000000;
    } else {
      swap = swap * 1000000;
    }
    swapVolume = (swap / 100) * 0.03;
  }

  volume = volume + swapVolume;
  var usdValue = parseFloat(price * amount).toFixed(2)
  usdValue = convert(usdValue)
  document.getElementById("totalValueStatic").textContent = usdValue + " USD";
  var ReflectionsSupply = amount;

  for(let i=0; i<30; i++) {
    dailyReflections = (volume * ReflectionsSupply) / (percentageConversion * supply);
    ReflectionsSupply += dailyReflections / price;
    totalReflections += dailyReflections;

    if (priceIncrement > 0 && priceIncrement <= 1.5 ){
      price = price * (1 + (priceIncrement / 100))
    } else if (priceIncrement < 0 || priceIncrement > 1.5 ){
      document.querySelector('#priceIncrement').value = 0;
    }else {
      price = document.querySelector('#price').value;
    }

    if (i == 0){
      var calculatedReflections = parseFloat(totalReflections).toFixed(2).toString();
      var calculatedSafemoon = parseFloat(ReflectionsSupply - amount).toFixed(2).toString();
      if (calculatedSafemoon > (amount * 0.25)){
        document.querySelector(".dailyReflectionsOutputStatic").style.boxShadow = "0 0 1rem rgba(194, 0, 0, 1)"
        document.querySelector("#dailyReflectionsOutputStaticText").textContent = "Probability: Unlikely"
      } else if (calculatedSafemoon <= (amount * 0.25) && calculatedSafemoon >= (amount * 0.1)){
        document.querySelector(".dailyReflectionsOutputStatic").style.boxShadow = "0 0 1rem rgba(32, 151, 135, 1)"
        document.querySelector("#dailyReflectionsOutputStaticText").textContent = "Probability: Likely"
      }else {
        document.querySelector(".dailyReflectionsOutputStatic").style.boxShadow = "0 0 1rem rgba(18, 168, 18, 1)"
        document.querySelector("#dailyReflectionsOutputStaticText").textContent = "Probability: Imminent"
      }
      calculatedReflections = convert(calculatedReflections)
      calculatedSafemoon = convert(calculatedSafemoon)

      document.getElementById("dailyReflectionsStatic").textContent = calculatedReflections + " USD";
      document.getElementById("dailySafemoonReflectionsStatic").textContent = calculatedSafemoon + " Safemoon";
    } else if (i == 6) {
      var calculatedReflections = parseFloat(totalReflections).toFixed(2).toString();
      var calculatedSafemoon = parseFloat(ReflectionsSupply - amount).toFixed(2).toString();
      if (calculatedSafemoon > (amount * 2)){
        document.querySelector(".weeklyReflectionsOutputStatic").style.boxShadow = "0 0 1rem rgba(194, 0, 0, 1)"
        document.querySelector("#weeklyReflectionsOutputStaticText").textContent = "Probability: Unlikely"
      } else if (calculatedSafemoon <= (amount * 2) && calculatedSafemoon >= (amount * 0.7)){
        document.querySelector(".weeklyReflectionsOutputStatic").style.boxShadow = "0 0 1rem rgba(32, 151, 135, 1)"
        document.querySelector("#weeklyReflectionsOutputStaticText").textContent = "Probability: Likely"
      }else {
        document.querySelector(".weeklyReflectionsOutputStatic").style.boxShadow = "0 0 1rem rgba(18, 168, 18, 1)"
        document.querySelector("#weeklyReflectionsOutputStaticText").textContent = "Probability: Imminent"
      }
      calculatedReflections = convert(calculatedReflections)
      calculatedSafemoon = convert(calculatedSafemoon)

      document.getElementById("weeklyReflectionsStatic").textContent = calculatedReflections + " USD";
      document.getElementById("weeklySafemoonReflectionsStatic").textContent = calculatedSafemoon + " Safemoon";
    } else if (i == 29) {
      var calculatedReflections = parseFloat(totalReflections).toFixed(2).toString();
      var calculatedSafemoon = parseFloat(ReflectionsSupply - amount).toFixed(2).toString();
      if (calculatedSafemoon > (amount * 8)){
        document.querySelector(".monthlyReflectionsOutputStatic").style.boxShadow = "0 0 1rem rgba(194, 0, 0, 1)"
        document.querySelector("#monthlyReflectionsOutputStaticText").textContent = "Probability: Unlikely"
      } else if (calculatedSafemoon <= (amount * 8)&& calculatedSafemoon >= (amount * 3)){
        document.querySelector(".monthlyReflectionsOutputStatic").style.boxShadow = "0 0 1rem rgba(32, 151, 135, 1)"
        document.querySelector("#monthlyReflectionsOutputStaticText").textContent = "Probability: Likely"
      }else {
        document.querySelector(".monthlyReflectionsOutputStatic").style.boxShadow = "0 0 1rem rgba(18, 168, 18, 1)"
        document.querySelector("#monthlyReflectionsOutputStaticText").textContent = "Probability: Imminent"
      }
      calculatedReflections = convert(calculatedReflections)
      calculatedSafemoon = convert(calculatedSafemoon)

      document.getElementById("monthlyReflectionsStatic").textContent = calculatedReflections + " USD";
      document.getElementById("monthlySafemoonReflectionsStatic").textContent = calculatedSafemoon + " Safemoon";
    }
  }

  var dailyReflections = 0;
  var totalReflections = 0
  ReflectionsSupply = amount;
  for(let i=1; i <= daysReflections; i++) {
    dailyReflections = (volume * ReflectionsSupply) / (percentageConversion * supply);
    ReflectionsSupply += dailyReflections / price;
    totalReflections += dailyReflections;
    if (priceIncrement > 0 && priceIncrement <= 1.5 ){
      price = price * (1 + (priceIncrement / 100))
    } else if (priceIncrement < 0 || priceIncrement > 1.5 ){
      document.querySelector('#priceIncrement').value = 0;
    }else {
      price = document.querySelector('#price').value;
    }

    if (i == 1){
      var standardReflectionsSupply = ReflectionsSupply - amount
    }
    if (i == daysReflections){
      document.querySelector('#customeReflectionsHeaderStatic').textContent = 'in ' + i + ' days'
      var calculatedReflections = parseFloat(totalReflections).toFixed(2).toString();
      var calculatedSafemoon = parseFloat(ReflectionsSupply - amount).toFixed(2).toString();
      calculatedReflections = convert(calculatedReflections)
      calculatedSafemoon = convert(calculatedSafemoon)

      document.getElementById("customeReflectionsStatic").textContent = calculatedReflections + " USD";
      document.getElementById("customeSafemoonReflectionsStatic").textContent = calculatedSafemoon + " Safemoon";
    }
    var totalReflectionsPercentage = ((ReflectionsSupply - amount) / amount) * 100
    var reflectionsDataS = parseFloat(totalReflectionsPercentage).toFixed(3)
    var reflectionsDataRS = parseFloat((((standardReflectionsSupply) * i) / amount) * 100).toFixed(3)

    reflctionsDataStaticR.push(reflectionsDataRS)
    reflctionsDataStatic.push(reflectionsDataS)
  }
  document.querySelector('#reflectionStaticChart').remove()
  var createCanvas = document.createElement('canvas')
  createCanvas.id = 'reflectionStaticChart'
  document.querySelector('#ChartStatic').appendChild(createCanvas)
  var chartPlacement = document.getElementById('reflectionStaticChart').getContext("2d")
  new Chart(chartPlacement, {
    type: 'line',
    data: {
      labels: label,
      datasets: [{
        label: 'Compounding Reflections',
        backgroundColor: 'rgb(0, 167, 157)',
        borderColor: 'rgb(0, 167, 157)',
        data: reflctionsDataStatic
      }, {
        label: 'Linear Reflections',
        backgroundColor: 'rgb(108, 117, 125)',
        borderColor: 'rgb(108, 117, 125)',
        data: reflctionsDataStaticR
      }]
    },
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: true,
      },
      plugins: {
        title: {
          display: true,
          text: 'Reflections in % of Balance'
        }
      },
      scales: {
        y: {
          type: 'linear',
          position: 'left',
          display: true,
          stacked: false,
        },
        x: {
          display: true,
          min: 0,
          max: 365,
          stacked: false,
          ticks: {
              stepSize: 10,
          },
        }
      }
    }
  });
}

function calculateBurnAmount() {
  var dailyReflectionsBurn;

  var weeklyReflectionsBurn;
  var weeklyReflectionsBurnTotal = 0;

  var monthlyReflectionsBurn;
  var monthlyReflectionsBurnTotal = 0;
  const volumeState = document.querySelector('#volumeState').value;
  const supplyState = document.querySelector('#supplyState').value;
  const swapState = document.querySelector('#swapvolumeState').value;
  var price = document.querySelector('#price').value;
  var swap = document.querySelector('#swapvolume').value;
  var burnAmount = document.querySelector('#burnAmount').value;
  var burnPercentage = document.querySelector('#burned').value;
  var convertedPercentage = 100 / burnPercentage

  var volume = document.querySelector('#volume').value;

  var swapVolume = 0;
  if (volume > 0.0001){
    if (volumeState=='1'){
      volume = volume * 1000000;
    } else if (volumeState=='2'){
      volume = volume * 1000000000;
    } else if (volumeState=='3'){
      volume = volume * 1000000000000;
    } else {
      volume = volume * 1000000;
    }

  if(swap > 0.0001){
    if (swapState=='1'){
      swap = swap * 1000000;
    } else if (swapState=='2'){
      swap = swap * 1000000000;
    } else if (swapState=='3'){
      swap = swap * 1000000000000;
    } else {
      swap = swap * 1000000;
    }
    swapVolume = (swap / 100) * 0.03;
  } else {
    swap = 0
  }

  var supply = document.querySelector('#supply').value;
  if (supply < 999.999){
    if (supply > 0.0001){
      if (supplyState=='1'){
        supply = supply * 1000;
      } else if (supplyState=='2'){
        supply = supply * 1000000;
      } else if (supplyState=='3'){
        supply = supply * 1000000000;
      } else {
        supply = supply * 1000000;
      }
    }
    burnAmount *= 1000000000;
    var amount = 1000000000000 - supply;
    
    if (swapVolume > 0.0001 && swap > 0.0001){
      swapVolume = swapVolume * 0.9;
      swapVolume = swapVolume / price;
    } 
      var ReflectionsBurnSupply = amount;
    
      //Daily
      dailyReflectionsBurn = ((volume * (burnPercentage / 100)) / price);
      dailyReflectionsBurn = (dailyReflectionsBurn + swapVolume) / 1000000;
      dailyReflectionsBurn = Math.round(dailyReflectionsBurn).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      document.getElementById("dailyburn").textContent = dailyReflectionsBurn.toString() + " Million safemoon";
      
      // Weekly
      ReflectionsBurnSupply = amount;
        weeklyReflectionsBurn = ((volume * (burnPercentage / 100)) / price);
        ReflectionsBurnSupply = weeklyReflectionsBurn * 7;
    
        weeklyReflectionsBurnTotal = ReflectionsBurnSupply;
        if (swapVolume > 0.0001){
          var weeklySwapVolume = swapVolume * 7;
        } else {
          var weeklySwapVolume = 0;
        }
        weeklyReflectionsBurnTotal = (weeklyReflectionsBurnTotal + weeklySwapVolume) / 1000000;
        weeklyReflectionsBurnTotal = Math.round(weeklyReflectionsBurnTotal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        document.getElementById("weeklyburn").textContent = weeklyReflectionsBurnTotal.toString() + " Million safemoon";
      
      // Monthly
      ReflectionsBurnSupply = amount;
        monthlyReflectionsBurn = ((volume * (burnPercentage / 100)) / price);
        ReflectionsBurnSupply = monthlyReflectionsBurn * 30;
        monthlyReflectionsBurnTotal = ReflectionsBurnSupply
        if (swapVolume > 0.0001){
          var monthlySwapVolume = swapVolume * 30;
        } else {
          var monthlySwapVolume = 0;
        }
        monthlyReflectionsBurnTotal = (monthlyReflectionsBurnTotal + monthlySwapVolume) / 1000000;
        monthlyReflectionsBurnTotal = Math.round(monthlyReflectionsBurnTotal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        document.getElementById("monthlyburn").textContent = monthlyReflectionsBurnTotal.toString() + " Million safemoon";
    
      //time till 50 trillion
      ReflectionsBurnSupply = amount;
      totalSupply = supply;

      var finalSwapVolume = 0;
      for(let i=1; i<1001; i++) {
        monthlyReflectionsBurn = ((volume * (burnPercentage / 100)) / price);
        ReflectionsBurnSupply = monthlyReflectionsBurn
        
        if (swapVolume > 0.0001 && i <= 1000){
          finalSwapVolume = swapVolume * (i);
        } else {
          finalSwapVolume = 0;
        }
        totalSupply = totalSupply - finalSwapVolume - ReflectionsBurnSupply;

        if (i > 999) {
          
          document.getElementById("daysleftv2").textContent = "999+";
          i = 2501;
        } else if (totalSupply <= burnAmount) {
          
          document.getElementById("daysleftv2").textContent = i.toString() + " days";
          i = 2501;
        }
          
      }
    }
  }
}

function changeToStateCal(){
  var ref = document.querySelector("#ref-switch");
  var burnb = document.querySelector("#burn-switch");
  var static = document.querySelector(".static");
  var burn = document.querySelector(".burn");
  var burnCal = document.querySelector(".burnCalculator");
  if (ref.style.display === "none") {
    ref.style.display = "block";
    burnb.style.display = "none";
    static.style.display = "none";
    burn.style.display = "block";
    burnCal.style.display = "none";
    document.querySelector(".switch_box").style.display = "flex";
    document.querySelector(".hideDaysBurn").style.display = "block";
  } else {
    ref.style.display = "none";
    burnb.style.display = "block";
    static.style.display = "none";
    burn.style.display = "none";
    burnCal.style.display = "block";
    document.querySelector(".hideDaysBurn").style.display = "none";
    document.querySelector(".switch_box").style.display = "none";
    calculateBurnAmount();
  }
}

function changeToState(state){
  var static = document.querySelector(".static");
  var burn = document.querySelector(".burn");

  var sliderBurn = document.getElementById("burnCalculator");
  var sliderStatic = document.getElementById("staticCalculator");

  if (state == 'burn'){
    static.style.display = "none";
    burn.style.display = "block";
    if (sliderBurn.className != "choosen"){
      sliderBurn.classList.add("choosen");
    }
    if (sliderStatic.className == "choosen"){
      sliderStatic.classList.remove("choosen");
    }
    offset()
  } else if (state == 'static') {
    static.style.display = "block";
    burn.style.display = "none";
    if (sliderStatic.className != "choosen"){
      sliderStatic.classList.add("choosen");
    }
    if (sliderBurn.className == "choosen"){
      sliderBurn.classList.remove("choosen");
    }
    offset()
  }
}

function offset(){
  var sliderBurn = document.getElementById("burnCalculator");
  const volumeState = document.querySelector('#volumeState').value;
  const amountState = document.querySelector('#amountState').value;
  const supplyState = document.querySelector('#supplyState').value;
  var volume = document.querySelector('#volume').value;
  var amount = document.querySelector('#amount').value;
  var price = document.querySelector('#price').value;

  var percentageDistributed = document.querySelector('#distribution').value;
  var percentageConversion = 100 / percentageDistributed

  const swapState = document.querySelector('#swapvolumeState').value;
  var swap = document.querySelector('#swapvolume').value;
  var swapVolume = 0;

  if (sliderBurn.className == "choosen"){
    var supply = 1000000000000
    if (document.querySelector('#supplyHidden').value > 1){
      supply = supply - document.querySelector('#supplyHidden').value;
      supply = supply * 20;
    }
  } else {
    var supply = document.querySelector('#supply').value;
    if (supply > 0.0001){
      if (supplyState=='1'){
        supply = supply * 1000;
      } else if (supplyState=='2'){
        supply = supply * 1000000;
      } else if (supplyState=='3'){
        supply = supply * 1000000000;
      } else {
        supply = supply * 1000000;
      }
    }
    supply *= percentageConversion
  }

  if(swap > 0.0001){
    if (swapState=='1'){
      swap = swap * 1000000;
    } else if (swapState=='2'){
      swap = swap * 1000000000;
    } else if (swapState=='3'){
      swap = swap * 1000000000000;
    } else {
      swap = swap * 1000000;
    }
    swapVolume = (swap / 100) * 0.03;
  }

  if(volume > 0.0001){
    if (volumeState=='1'){
      volume = volume * 1000000;
    } else if (volumeState=='2'){
      volume = volume * 1000000000;
    } else if (volumeState=='3'){
      volume = volume * 1000000000000;
    } else {
      volume = volume * 1000000;
    }
  }

  if(amount > 0.0001){
    if (amountState=='1'){
      amount = amount * 1000000;
    } else if (amountState=='2'){
      amount = amount * 1000000000;
    } else if (amountState=='3'){
      amount = amount * 1000000000000;
    } else {
      amount = amount * 1000000;
    }
  }

  volume = volume + swapVolume;

  var dailyReflections;

  var ReflectionsSupply = amount * 0.9;
  for (let i = 0; i < 1000; i++){
    dailyReflections = (volume * ReflectionsSupply) / supply;
    ReflectionsSupply += dailyReflections / price;

    if((ReflectionsSupply - amount) >= (amount * 0.1)){
      document.getElementById("offset").textContent = i.toString() + " days";
      document.getElementById("offsetStatic").textContent = i.toString() + " days";
      break;
    } else if (i == 999){
      document.getElementById("offset").textContent = "999+ days";
      document.getElementById("offsetStatic").textContent = "999+ days";
    }
  }
}

function toggleAdvanced(state){
  if(state == 'Advanced'){
    document.querySelector(".advancedSettings").style.display = "block";
    document.querySelector("#toggleAdvancedOn").style.display = "none";
    document.querySelector("#toggleAdvancedOff").style.display = "block";
  } else {
    document.querySelector(".advancedSettings").style.display = "none";
    document.querySelector("#toggleAdvancedOn").style.display = "block";
    document.querySelector("#toggleAdvancedOff").style.display = "none";
  }
}

function toggleBurnWallet(state, supply = 1000000000000){
  if(state == 'include'){
    document.querySelector("#toggleBurnWalletOff").style.display = "block";
    document.querySelector("#toggleBurnWalletOn").style.display = "none";
    
  } else {
    document.querySelector("#toggleBurnWalletOn").style.display = "block";
    document.querySelector("#toggleBurnWalletOff").style.display = "none";
  }
  calculateBurn()
  calculateStatic()
  
}

function toggleReset(Supply, Volume, Price){
  document.querySelector('#price').value = Price.toString();
  document.querySelector('#volume').value = Volume.toString();
  document.querySelector('#volumeState').options.selectedIndex = 0
  document.querySelector('#supply').value = Supply.toString();
  document.querySelector('#supplyState').options.selectedIndex = 2
  document.querySelector('#burnAmount').value = "50";
  document.querySelector('#swapvolume').value = "0";
  document.querySelector('#daysReflections').value = "365";

  calculateBurn()
  calculateStatic()
  offset();
}