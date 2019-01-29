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
    
    Forked from @elizabethZweizig

  
    
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

  rainbowCircleGeometry = new THREE.Geometry();
  
  // Color definition

  black = new THREE.Color('#000000');
  red = new THREE.Color('#f40202');
  orange = new THREE.Color('#f49702');
  yellow = new THREE.Color('#f4db02');
  green = new THREE.Color('#52f402');
  blue = new THREE.Color('#0222f4');
  indigo = new THREE.Color('#4b0082')

  // split circle
  
  for( var d=0; d<361; d++ ) {
    var angle= Math.PI*(d/180);
    
    // Fill faces and vertices

    rainbowCircleGeometry.vertices.push(new THREE.Vector3(Math.sin(angle), Math.cos(angle), 0));

    if(rainbowCircleGeometry.vertices.length > 3) {
      rainbowCircleGeometry.faces.push(new THREE.Face3(
        rainbowCircleGeometry.vertices.length - 10,
        rainbowCircleGeometry.vertices.length - 9,
        rainbowCircleGeometry.vertices.length));

      rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[0] = black;
      rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[1] = red;
      rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[2] = red;
    }

    rainbowCircleGeometry.vertices.push(new THREE.Vector3(Math.sin(angle)*0.5, Math.cos(angle)*0.5, 0));

    if(rainbowCircleGeometry.vertices.length > 3) {
      rainbowCircleGeometry.faces.push(new THREE.Face3(
        rainbowCircleGeometry.vertices.length - 10,
        rainbowCircleGeometry.vertices.length - 9,
        rainbowCircleGeometry.vertices.length));

      rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[0] = red;
      rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[1] = orange;
      rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[2] = orange;

      rainbowCircleGeometry.faces.push(new THREE.Face3(
        rainbowCircleGeometry.vertices.length - 10,
        rainbowCircleGeometry.vertices.length,
        rainbowCircleGeometry.vertices.length - 1));

      rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[0] = red;
      rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[1] = orange;
      rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[2] = red;
    }

    rainbowCircleGeometry.vertices.push(new THREE.Vector3(Math.sin(angle)*1, Math.cos(angle)*1, 0));

    if(rainbowCircleGeometry.vertices.length > 3) {
      rainbowCircleGeometry.faces.push(new THREE.Face3(
	    rainbowCircleGeometry.vertices.length - 10,
	    rainbowCircleGeometry.vertices.length - 9,
  	    rainbowCircleGeometry.vertices.length));

      rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[0] = orange;
	  rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[1] = yellow;
	  rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[2] = yellow;

      rainbowCircleGeometry.faces.push(new THREE.Face3(
        rainbowCircleGeometry.vertices.length - 10,
		rainbowCircleGeometry.vertices.length,
		rainbowCircleGeometry.vertices.length - 1));

      rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[0] = orange;
	  rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[1] = yellow;
	  rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[2] = orange;
	}

    rainbowCircleGeometry.vertices.push(new THREE.Vector3(Math.sin(angle)*1.5, Math.cos(angle)*1.5, 0));

    if(rainbowCircleGeometry.vertices.length > 3) {
      rainbowCircleGeometry.faces.push(new THREE.Face3(
        rainbowCircleGeometry.vertices.length - 10,
		rainbowCircleGeometry.vertices.length - 9,
		rainbowCircleGeometry.vertices.length));

      rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[0] = yellow;
	  rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[1] = green;
	  rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[2] = green;

      rainbowCircleGeometry.faces.push(new THREE.Face3(
        rainbowCircleGeometry.vertices.length - 10,
		rainbowCircleGeometry.vertices.length,
		rainbowCircleGeometry.vertices.length - 1));

      rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[0] = yellow;
      rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[1] = green;
	  rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[2] = yellow;
    }

    rainbowCircleGeometry.vertices.push(new THREE.Vector3(Math.sin(angle)*2, Math.cos(angle)*2, 0));

    if(rainbowCircleGeometry.vertices.length > 3) {
      rainbowCircleGeometry.faces.push(new THREE.Face3(
        rainbowCircleGeometry.vertices.length - 10,
  	    rainbowCircleGeometry.vertices.length - 9,
  	    rainbowCircleGeometry.vertices.length));

      rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[0] = green;
  	  rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[1] = blue;
  	  rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[2] = blue;

      rainbowCircleGeometry.faces.push(new THREE.Face3(
        rainbowCircleGeometry.vertices.length - 10,
  	    rainbowCircleGeometry.vertices.length,
  	    rainbowCircleGeometry.vertices.length - 1));

      rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[0] = green;
  	  rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[1] = blue;
  	  rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[2] = green;
    }

  	rainbowCircleGeometry.vertices.push(new THREE.Vector3(Math.sin(angle)*2.7, Math.cos(angle)*2.7, 0));

    if(rainbowCircleGeometry.vertices.length > 3) {
      rainbowCircleGeometry.faces.push(new THREE.Face3(
        rainbowCircleGeometry.vertices.length - 10,
  	    rainbowCircleGeometry.vertices.length - 9,
  	    rainbowCircleGeometry.vertices.length));

      rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[0] = blue;
      rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[1] = blue;
      rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[2] = blue;

      rainbowCircleGeometry.faces.push(new THREE.Face3(
        rainbowCircleGeometry.vertices.length - 10,
  	    rainbowCircleGeometry.vertices.length,
  	    rainbowCircleGeometry.vertices.length - 1));

      rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[0] = blue;
      rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[1] = blue;
      rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[2] = blue;
    }
    
    
    

     rainbowCircleGeometry.vertices.push(new THREE.Vector3(Math.sin(angle)*3, Math.cos(angle)*3, 0));

     if(rainbowCircleGeometry.vertices.length > 3) {
       rainbowCircleGeometry.faces.push(new THREE.Face3(
         rainbowCircleGeometry.vertices.length - 10,
         rainbowCircleGeometry.vertices.length - 9,
         rainbowCircleGeometry.vertices.length));

       rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[0] = blue;
       rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[1] = indigo;
       rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[2] = indigo;

       rainbowCircleGeometry.faces.push(new THREE.Face3(
         rainbowCircleGeometry.vertices.length - 10,
		 rainbowCircleGeometry.vertices.length,
		 rainbowCircleGeometry.vertices.length - 1));

       rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[0] = blue;
	   rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[1] = indigo;
	   rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[2] = blue;
    }




    rainbowCircleGeometry.vertices.push(new THREE.Vector3(Math.sin(angle)*3.3, Math.cos(angle)*3.3, 0));

    if(rainbowCircleGeometry.vertices.length > 3) {
      rainbowCircleGeometry.faces.push(new THREE.Face3(
        rainbowCircleGeometry.vertices.length - 10,
		rainbowCircleGeometry.vertices.length - 9,
		rainbowCircleGeometry.vertices.length));

      rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[0] = indigo;
	  rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[1] = black;
	  rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[2] = black;

      rainbowCircleGeometry.faces.push(new THREE.Face3(
        rainbowCircleGeometry.vertices.length - 10,
		rainbowCircleGeometry.vertices.length,
		rainbowCircleGeometry.vertices.length - 1));

      rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[0] = indigo;
      rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[1] = black;
      rainbowCircleGeometry.faces[rainbowCircleGeometry.faces.length - 1].vertexColors[2] = indigo;
    }

   rainbowCircleGeometry.vertices.push(new THREE.Vector3(Math.sin(angle)*4.2, Math.cos(angle)*4.2, 0));
  }
  
  
  
  
  //Create Material

  var rainbowMaterial = new THREE.MeshBasicMaterial({
    vertexColors:THREE.VertexColors,
    side:THREE.DoubleSide,
	//wireframe: true
  });
  
//Create Object


  var rainbowMesh = new THREE.Mesh(rainbowCircleGeometry, rainbowMaterial);

  scene.add(rainbowMesh);
}

function renderScene(){
  renderer.render(scene, camera);
}