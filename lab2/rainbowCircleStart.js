/*
    Copyright 2019 © Ramón Romero @ramonromeroqro
	Description: Computer Graphics, ITESM.
	Lab 2 - Rainbow circle
	V290120192300
	
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
    
    
    Three.js is distributed under the MIT License
    Copyright © 2010-2019 three.js authors
    
  
    
*/


var scene;
var camera;
initializeScene();
renderScene();


function initializeScene(){
  if(Detector.webgl){
    renderer = new THREE.WebGLRenderer( { antialias: true} );
  }else{
    renderer = new THREE.CanvasRenderer();
  }

  renderer.setClearColor(0x000000, 1);

  canvasWidth = 600;
  canvasHeight = 400;

  renderer.setSize(canvasWidth, canvasHeight);

  document.getElementById("canvas").appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, canvasWidth/canvasHeight, 1, 100);

  camera.position.set(0, 0, 10);

  camera.lookAt(scene.position);

  scene.add(camera);
  //define more colors and steps

  var angle = 2 * Math.PI / 360;
  var internalRadius = 0.5;
  var circle_radius = 3;
  var number_of_steps = 16;
  var step = (circle_radius - internalRadius)/number_of_steps;

  var colorArray = [new THREE.Color(0,0,0),
                    new THREE.Color(1,0,0),
                    new THREE.Color(1,0.5,0),
                    new THREE.Color(1,1,0),
                    new THREE.Color(0,1,0),
                    new THREE.Color(0,0,1),
                    new THREE.Color(0.5,0,0.5),
                    new THREE.Color(1,0,1),
                    new THREE.Color(1,0.7,1),
                    new THREE.Color(1,0,1),
                    new THREE.Color(0.5,0,0.5),
                    new THREE.Color(0,0,1),
                    new THREE.Color(0,1,0),
                    new THREE.Color(1,1,0),
                    new THREE.Color(1,0.5,0),
                    new THREE.Color(1,0,0),
                    new THREE.Color(0,0,0)];
//forming verices and faces
  for (var j = 0; j <= angle * 360; j += angle){
    for (var i = 0; i < number_of_steps; i++){
      var vector1 = new THREE.Vector3(Math.cos(j) * (internalRadius + i * step),
        Math.sin(j) * (internalRadius + i * step), 0);
      var vector2 = new THREE.Vector3(Math.cos(j + angle) * (internalRadius + i * step),
        Math.sin(j + angle) * (internalRadius + i * step), 0);
      var vector3 = new THREE.Vector3(Math.cos(j) * (internalRadius + (i + 1) * step),
        Math.sin(j) * (internalRadius + (i + 1) * step), 0);
      var vector4 = new THREE.Vector3(Math.cos(j + angle) * (internalRadius + (i + 1) * step),
        Math.sin(j + angle) * (internalRadius + (i + 1) * step), 0);
      var innerRainbowGeometry = new THREE.Geometry();

      innerRainbowGeometry.vertices.push(vector2);
      innerRainbowGeometry.vertices.push(vector1);
      innerRainbowGeometry.vertices.push(vector3);
      innerRainbowGeometry.faces.push(new THREE.Face3(0,1,2));

      innerRainbowGeometry.faces[0].vertexColors[0] = colorArray[i];
      innerRainbowGeometry.faces[0].vertexColors[1] = colorArray[i];
      innerRainbowGeometry.faces[0].vertexColors[2] = colorArray[i+1];

      var rainbowMaterial = new THREE.MeshBasicMaterial({
        vertexColors:THREE.VertexColors,
        side:THREE.DoubleSide
      });

      var rainbowMesh = new THREE.Mesh(innerRainbowGeometry, rainbowMaterial);

      rainbowMesh.position.set(0.0, 0.0, 0.0);
      scene.add(rainbowMesh);

      var upperRainbowGeometry = new THREE.Geometry();

      upperRainbowGeometry.vertices.push(vector4);
      upperRainbowGeometry.vertices.push(vector2);
      upperRainbowGeometry.vertices.push(vector3);
      upperRainbowGeometry.faces.push(new THREE.Face3(0,1,2));

      upperRainbowGeometry.faces[0].vertexColors[0] = colorArray[i+1];
      upperRainbowGeometry.faces[0].vertexColors[1] = colorArray[i];
      upperRainbowGeometry.faces[0].vertexColors[2] = colorArray[i+1];

      var rainbowMesh2 = new THREE.Mesh(upperRainbowGeometry, rainbowMaterial);

      rainbowMesh2.position.set(0.0, 0.0, 0.0);
      scene.add(rainbowMesh2);
    }
  }
}


function renderScene(){
  renderer.render(scene, camera);
}