// Part 1:
// Opgave 1 - 3:
// Installer udviklingsmiljø

// Link for VS Code
// https://code.visualstudio.com

// Link for Node.JS
// https://nodejs.org/en/download/

// For at køre filen skal man navigere til mappen ved hjælp af cd kommandoen på mac og derefter skrive "node opgave"

// Opgave 4:
// Console.log
console.log("Hej med dig!")

// Opgave 5:
// Varibler
// const bruges til variabler som ikke skulle kunne ændres
const a = 40
const b = 2

// let eller var bruges til variabler som skulle kunne ændres
let c = a + b
console.log(c)

// Part 2:
// Opgave 1:
// Lav en trekant
var str = ""
for (let i = 1; i <= 7; i++) {
    str += '#'
    console.log(str)
}

// Opgave 2:
// Lav en chessboard
var str = ""
for (let i = 1; i <= 8; i++) {
    if (i % 2 == 0){
        str = ' # # # #'
    } else {
        str = '# # # # '
    }
    console.log(str)
}
