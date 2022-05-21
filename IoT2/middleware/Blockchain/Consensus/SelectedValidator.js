const fs = require('fs')
const axios = require('axios')
const Server = require('../../../util/server')

var Validators = []

const SelectValidators = () => {
    var Self = JSON.parse(fs.readFileSync('./middleware/Storage/Keys.json'))

    axios({
        method: 'post',
        url: Server + 'Validators',
        params: {
            APIKey : Self.APIKey,
            AreaCode : Self.AreaCode
        },
    })
    .then(response => {
        Validators[0] = response.data
    })
}

setInterval(SelectValidators, 900000)

module.exports = [Validators]