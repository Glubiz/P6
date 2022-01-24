const Prices = require('../models/price')
const { Op } = require("sequelize");

const supply = 5000000000
const volume = 1000000000
const price = 1


function Reflections(Days){
    var ReflectionsSupply = 1000000
    for(let i=1; i <= Days; i++) {
        var dailyReflections = (volume * ReflectionsSupply) / supply;
        ReflectionsSupply += dailyReflections / price;
    
    }
    return ReflectionsSupply
}

function Windmill(Days){
    var ReflectionsSupply = 0
    for(let i=1; i <= Days; i++) {
        var dailyReflections = (volume * ReflectionsSupply) / supply;
        ReflectionsSupply += (dailyReflections / price) + 10000;
    }
    return ReflectionsSupply
}

function Comparing(){
    for (var i = 1; i < 100000; i++){
        if (Windmill(i) >= Reflections(i)){
            console.log("\n")
            console.log("Scenario:")
            console.log("Volume: " + volume + " USD")
            console.log("Supply: 5 Billion")
            console.log("Price: " + price)
            console.log("\n")
            console.log("At day: " + i)
            console.log("Windmill: " + Windmill(i))
            console.log("Reflections: " + Reflections(i))
            console.log("\n")
            break
        } else {
        }
    }
}

function test(){
    Prices.findAll({
        order: [
          ['createdAt', 'DESC']
        ]
    })
    .then(async result => {
        for (let entry of result) {
            if(entry.snapped_at){
                continue;
            } else {
                if (entry.price < 0.0001){

                    Prices.update({
                        price: entry.price * 1000
                        }, {
                        where: {
                            id: entry.id
                        }
                    })
                } else if (entry.price > 0.1){

                    Prices.update({
                        price: entry.price / 1000
                        }, {
                        where: {
                            id: entry.id
                        }
                    })
                }
            }
            console.log(entry.price)
            await new Promise((resolve => setTimeout(resolve,100)))
        }
    })

}
0xce1c347d73f3d4dde31c6c9fa5c863b4d6308701
test()
// Comparing()