const { Client} = require('tplink-smarthome-api');

const client = new Client();
const plug = client.getDevice({ host: '192.168.87.160' }).then((device) => {
    device.getPowerState() && device.emeter.getRealtime().then(console.log)
    device.getLedState().then(console.log)
    device.setLedState(true)
})