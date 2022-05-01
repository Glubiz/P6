const { Client} = require('tplink-smarthome-api');
const fs = require('fs');

const LogUsage = () => {
    const client = new Client();
    const plug = client.getDevice({ host: '192.168.87.160' }).then((device) => {
        device.getPowerState() && device.emeter.getRealtime().then(result => {
            var now = new Date().getTime().toString()

            if(fs.existsSync('./middleware/IoT/Storage/Usage.json')){
                var Usage = JSON.parse(fs.readFileSync('./middleware/IoT/Storage/Usage.json'))
    
                var LegacyData = Usage.filter(data => data.Date > parseInt(now - 3600 * 1000))
            } else {
                var Usage = []
                var LegacyData = 0
            }
            var CalculatedUsage = result.total - LegacyData
            Usage.push({Usage: CalculatedUsage, Date: now})
            console.log(Usage)
            fs.writeFileSync('./middleware/IoT/Storage/Usage.json', JSON.stringify(Usage, null, 4))
        })
    })
}

setInterval(LogUsage, 3600 * 1000)

module.exports = LogUsage()