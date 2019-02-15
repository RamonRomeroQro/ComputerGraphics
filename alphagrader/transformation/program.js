/*

  Copyright 2019 © Ramón Romero   @ramonromeroqro
  Description: Computer Graphics, ITESM.
  Translation and rotation
  
  his program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.
  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
  
  node.js is distributed under the MIT License
  Copyright © 2009-2019 node.js authors
  
  
*/

// start processing user input
process.stdin.resume();
process.stdin.setEncoding('ascii');
// declare global variables
var input_stdin = "";
var input_stdin_array = "";
// standard input is stored into input_stdin
process.stdin.on('data', function (data) {
    input_stdin += data;
});
// standard input is done and stored into an array
// then main is called so that you can start processing your data
process.stdin.on('end', function () {
    input_stdin_array = input_stdin.split("\n");
    main();
});
// reads a line from the standard input array
// returns string
function readLine(_line_number) {
    return input_stdin_array[_line_number];
}

function parseLine(_textArray) {

    var stringArray = _textArray.split(" ");
    var intArray = [];
    for (var i = 0; i < stringArray.length; i++) {
        intArray.push(parseInt(stringArray[i]));
    }
    return intArray;
}

function multiply(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b) || !a.length || !b.length) {
        console.log("Matrices are not compatible");
    }

    var x = a.length,
        z = a[0].length,
        y = b[0].length;

    if (b.length !== z) {
        // XxZ & ZxY => XxY
        console.log("Matrices are not compatible");
    }

    var productRow = Array.apply(null, new Array(y)).map(Number.prototype.valueOf, 0);
    var product = new Array(x);
    for (var p = 0; p < x; p++) {
        product[p] = productRow.slice();
    }

    for (var i = 0; i < x; i++) {
        for (var j = 0; j < y; j++) {
            for (var k = 0; k < z; k++) {
                product[i][j] += a[i][k] * b[k][j];
            }
        }
    }

    return product;
}

function main() {
    // write your code here.
    // call `readLine()` to read a line.
    // use console.log() to write to stdout
    var a = readLine(0).split(" ").map(Number);
    var b = readLine(1).split(" ").map(Number);
    var c = readLine(2).split(" ").map(Number);
    var d = parseInt(readLine(3)); //angle
    var e = readLine(4).split(" ").map(Number);
    var xp = (a[0] + b[0] + c[0]) / 3;
    var yp = (a[1] + b[1] + c[1]) / 3;
    var zp = (a[2] + b[2] + c[2]) / 3;
    //console.log(m);
    var tr = [[1, 0, 0, -xp],
    [0, 1, 0, -yp],
    [0, 0, 1, -zp],
    [0, 0, 0, 1]];
    var trInv = [[1, 0, 0, xp],
    [0, 1, 0, yp],
    [0, 0, 1, zp],
    [0, 0, 0, 1]];
    var trFin = [[1, 0, 0, e[0]],
    [0, 1, 0, e[1]],
    [0, 0, 1, e[2]],
    [0, 0, 0, 1]];
    //this send this to the center
    var av = [[a[0]], [a[1]], [a[2]], [a[3]]];
    var bv = [[b[0]], [b[1]], [b[2]], [b[3]]];
    var cv = [[c[0]], [c[1]], [c[2]], [c[3]]];
    var acenter = multiply(tr, av);
    var bcenter = multiply(tr, bv);
    var ccenter = multiply(tr, cv);
    var gr = [[Math.cos(d * Math.PI / 180), -Math.sin(d * Math.PI / 180), 0, 0],
    [Math.sin(d * Math.PI / 180), Math.cos(d * Math.PI / 180), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]];
    var arot = multiply(gr, acenter);
    var brot = multiply(gr, bcenter);
    var crot = multiply(gr, ccenter);
    arot = multiply(trInv, arot);
    brot = multiply(trInv, brot);
    crot = multiply(trInv, crot);
    arot = multiply(trFin, arot);
    brot = multiply(trFin, brot);
    crot = multiply(trFin, crot);

    console.log(arot.map(Math.round).join(" "));
    console.log(brot.map(Math.round).join(" "));
    console.log(crot.map(Math.round).join(" "));


}

function jdjd(){

    var sjsjssj; s
    return jsjs;
};




