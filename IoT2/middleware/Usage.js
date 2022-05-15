const { Client} = require('tplink-smarthome-api');
const fs = require('fs');

const LogUsage = () => {
    var LegacyData
    var Usage 
    const client = new Client();
    const plug = client.getDevice({ host: '192.168.87.160' }).then((device) => {
        device.getPowerState() && device.emeter.getRealtime().then(result => {
            var now = new Date().getTime().toString()

            if(fs.existsSync('./middleware/Storage/Usage.json')){
                Usage = JSON.parse(fs.readFileSync('./middleware/Storage/Usage.json'))
    
                if(Usage[0].length > 24){
                    LegacyData = Usage.filter(data => data.Date > parseInt(now - 3600 * 1000))
                } else {
                    LegacyData = Usage[Usage.length - 1].Usage
                    LegacyData === 0 ? LegacyData = 0 : 0
                }

            } else {
                Usage = []
                LegacyData = 0
            }
            
            //Simulated Usage
            var Random = parseFloat(Math.random() * (Math.random() * 10)) + parseFloat(LegacyData)
                        
            var CalculatedUsage = parseFloat((result.total - LegacyData) + Random).toFixed(5)

            Usage.push({Usage: CalculatedUsage, Date: now})
            fs.writeFileSync('./middleware/Storage/Usage.json', JSON.stringify(Usage, null, 4))
        })
    })
}

setInterval(LogUsage, 3600 * 1000)

module.exports = LogUsage