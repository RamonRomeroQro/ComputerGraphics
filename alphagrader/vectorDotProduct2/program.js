/*

    Copyright 2019 © Ramón Romero @ramonromeroqro
    Copyright 2019 © Iancarlo Romero @ianroses
    Description: Computer Graphics, ITESM.
    DotProduct2
    V050220191100

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

function parseLine(_textArray){

    var stringArray = _textArray.split(" ");
    var intArray = [];
    for(var i=0;i<stringArray.length;i++){
        intArray.push(parseInt(stringArray[i]));
    }

    return intArray;
}

function solveMeFirst(a, b) {
    // Hint: Type return a+b+c below
    var f = 0;
    var t = a.split(" ");
    var v = b.split(" ");
    for(var i=0;i<t.length;i++){
      f = f +(parseInt(t[i])*parseInt(v[i]));
    }
    return f;

}
function ramen(a){
  var res = a.split(" ");
  var s=0;
  for (var i=0; i<res.length; i++){
    s=s+(parseInt(res[i]))*(parseInt(res[i]));
  }
  a=Math.sqrt(s);
  if(Number.isInteger(a)){
    return a;
  }else{
    return a.toFixed(2);
  }
}


function main() {
    // write your code here.
    // call `readLine()` to read a line.
    // use console.log() to write to stdout
    var a = readLine(0);
    var b = readLine(1);
    var res = solveMeFirst(a, b);
    var ganso = res/(ramen(a)*ramen(b));
    ganso = Math.acos(ganso);
    ganso = ganso * 180/Math.PI;
    console.log(ganso.toFixed(2));
}

