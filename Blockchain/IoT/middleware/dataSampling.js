var sensorLib = require("node-dht-sensor")

var Data = {
    temp : 21,
}

function collectData(){
    Data.humidity = 100
}

collectData()
setInterval(collectData, 900000)

module.exports = {Data}