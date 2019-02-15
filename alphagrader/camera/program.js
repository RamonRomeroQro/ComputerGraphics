/*

  Copyright 2019 © Ramón Romero   @ramonromeroqro
  Description: Computer Graphics, ITESM.
  Camera View
  
  This program is free software: you can redistribute it and/or modify
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

  Thanks Andrew Ippoliti, inversion function 
  and FLOSS Comunity
  
  
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
    var camera = readLine(0).split(" ").map(Number);
    var a = readLine(1).split(" ").map(Number);
    var b = readLine(2).split(" ").map(Number);
    var c = readLine(3).split(" ").map(Number);

    var verticalA = [[a[0]], [a[1]], [a[2]], [1]];
    var verticalB = [[b[0]], [b[1]], [b[2]], [1]];
    var verticalC = [[c[0]], [c[1]], [c[2]], [1]];
    var magnitude = Math.sqrt(camera[0] * camera[0] + camera[1] * camera[1] + camera[2] * camera[2]);
    var camNormal = [
        [camera[0] / magnitude],
        [camera[1] / magnitude],
        [camera[2] / magnitude]
    ];
    var back = camNormal;
    var auxCamNormal = [
        [camera[0] / magnitude],
        [(camera[1] / magnitude) - 1],
        [camera[2] / magnitude]
    ];
    var rigth = [
        [camNormal[1][0] * auxCamNormal[2][0] - camNormal[2][0] * auxCamNormal[1][0]],
        [camNormal[2][0] * auxCamNormal[0][0] - camNormal[0][0] * auxCamNormal[2][0]],
        [camNormal[0][0] * auxCamNormal[1][0] - camNormal[1][0] * auxCamNormal[0][0]]
    ];
    var rigthLen = Math.sqrt(rigth[0][0] * rigth[0][0] + rigth[1][0] * rigth[1][0] + rigth[2][0] * rigth[2][0]);
    rigth = [
        [rigth[0][0] / rigthLen],
        [rigth[1][0] / rigthLen],
        [rigth[2][0] / rigthLen]
    ];
    var up = [
        [back[1][0] * rigth[2][0] - back[2][0] * rigth[1][0]],
        [back[2][0] * rigth[0][0] - back[0][0] * rigth[2][0]],
        [back[0][0] * rigth[1][0] - back[1][0] * rigth[0][0]]
    ];

    var upLen = Math.sqrt(up[0][0] * up[0][0] + up[1][0] * up[1][0] + up[2][0] * up[2][0]);
    up = [
        [up[0][0] / upLen],
        [up[1][0] / upLen],
        [up[2][0] / upLen]
    ];
    var t1 = [[rigth[0][0], up[0][0], back[0][0], camera[0]],
    [rigth[1][0], up[1][0], back[1][0], camera[1]],
    [rigth[2][0], up[2][0], back[2][0], camera[2]],
    [0, 0, 0, 1]];

    var t_1 = matrix_invert(t1);
    var af = multiply(t_1, verticalA);
    var bf = multiply(t_1, verticalB);
    var cf = multiply(t_1, verticalC);

    console.log(af.map(Math.round).join(" "));
    console.log(bf.map(Math.round).join(" "));
    console.log(cf.map(Math.round).join(" "));

}

// Gaussian Elimination
// Returns the inverse of matrix `M`.
function matrix_invert(M){
    // I use Guassian Elimination to calculate the inverse:
    // (1) 'augment' the matrix (left) by the identity (on the right)
    // (2) Turn the matrix on the left into the identity by elemetry row ops
    // (3) The matrix on the right is the inverse (was the identity matrix)
    // There are 3 elemtary row ops: (I combine b and c in my code)
    // (a) Swap 2 rows
    // (b) Multiply a row by a scalar
    // (c) Add 2 rows
    
    //if the matrix isn't square: exit (error)
    if(M.length !== M[0].length){return;}
    
    //create the identity matrix (I), and a copy (C) of the original
    var i=0, ii=0, j=0, dim=M.length, e=0, t=0;
    var I = [], C = [];
    for(i=0; i<dim; i+=1){
        // Create the row
        I[I.length]=[];
        C[C.length]=[];
        for(j=0; j<dim; j+=1){
            
            //if we're on the diagonal, put a 1 (for identity)
            if(i==j){ I[i][j] = 1; }
            else{ I[i][j] = 0; }
            
            // Also, make the copy of the original
            C[i][j] = M[i][j];
        }
    }
    
    // Perform elementary row operations
    for(i=0; i<dim; i+=1){
        // get the element e on the diagonal
        e = C[i][i];
        
        // if we have a 0 on the diagonal (we'll need to swap with a lower row)
        if(e==0){
            //look through every row below the i'th row
            for(ii=i+1; ii<dim; ii+=1){
                //if the ii'th row has a non-0 in the i'th col
                if(C[ii][i] != 0){
                    //it would make the diagonal have a non-0 so swap it
                    for(j=0; j<dim; j++){
                        e = C[i][j];       //temp store i'th row
                        C[i][j] = C[ii][j];//replace i'th row by ii'th
                        C[ii][j] = e;      //repace ii'th by temp
                        e = I[i][j];       //temp store i'th row
                        I[i][j] = I[ii][j];//replace i'th row by ii'th
                        I[ii][j] = e;      //repace ii'th by temp
                    }
                    //don't bother checking other rows since we've swapped
                    break;
                }
            }
            //get the new diagonal
            e = C[i][i];
            //if it's still 0, not invertable (error)
            if(e==0){return}
        }
        
        // Scale this row down by e (so we have a 1 on the diagonal)
        for(j=0; j<dim; j++){
            C[i][j] = C[i][j]/e; //apply to original matrix
            I[i][j] = I[i][j]/e; //apply to identity
        }
        
        // Subtract this row (scaled appropriately for each row) from ALL of
        // the other rows so that there will be 0's in this column in the
        // rows above and below this one
        for(ii=0; ii<dim; ii++){
            // Only apply to other rows (we want a 1 on the diagonal)
            if(ii==i){continue;}
            
            // We want to change this element to 0
            e = C[ii][i];
            
            // Subtract (the row above(or below) scaled by e) from (the
            // current row) but start at the i'th column and assume all the
            // stuff left of diagonal is 0 (which it should be if we made this
            // algorithm correctly)
            for(j=0; j<dim; j++){
                C[ii][j] -= e*C[i][j]; //apply to original matrix
                I[ii][j] -= e*I[i][j]; //apply to identity
            }
        }
    }
    
    //we've done all operations, C should be the identity
    //matrix I should be the inverse:
    return I;
}