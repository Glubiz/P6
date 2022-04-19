const fs = require('fs')

const Startup = () => {
    if(!fs.existsSync('./middleware/IoT/Keys.json')){
        var IP
        require('axios')
        .get('https://api.ipify.org/?format=json')
        .then(response => response.json())
        .then(json => {
            IP = json.ip

            require('axios')
            .post('url here',{
                IP: IP,
                AreaCode: '9000',
            })
            .then(response => {
                var KeyStorage = {
                    ChainID : response[0],
                    APIKey : response[1]
                }
                fs.writeFileSync('./middleware/IoT/Keys.json', JSON.stringify(KeyStorage, null, 4))
            })
        })
    }
}

module.exports = Startup