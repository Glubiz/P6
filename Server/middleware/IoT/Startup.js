const fs = require('fs')

const Startup = () => {
    // if(!fs.existsSync('./middleware/IoT/Keys.json')){
    //     var ip
    //     require('axios')
    //     .get('https://api.ipify.org/?format=json')
    //     .then(Data =>  {
    //         ip = Data.ip

    //         require('axios')
    //         .post('https://localhost:3033/addNode',{
    //             IP: ip,
    //             AreaCode: '9000',
    //         })
    //         .then(response => {
    //             var KeyStorage = {
    //                 ChainID : response[0],
    //                 APIKey : response[1]
    //             }
    //             fs.writeFileSync('./middleware/IoT/Keys.json', JSON.stringify(KeyStorage, null, 4))
    //         })
    //     })
    // }
}

module.exports = Startup()