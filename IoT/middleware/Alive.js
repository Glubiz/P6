const fs = require('fs')
const Validate = require('../Blockchain/Consensus/Validate')

const Alive = () => {
    require('axios')
    .get('url here')
    .then(response => {
        //Needs to add ping to node
        if(typeOf(Array.isArray(response.data) || response.data.length > 0)) {
            Validate()
        }
    })
}

setInterval(Alive, 900 * 1000)