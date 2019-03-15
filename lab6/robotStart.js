/*
    Copyright 2019 © Ramón Romero @ramonromeroqro
	Description: Computer Graphics, ITESM.
	Lab 6 - Robot
	V110220192300
	
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

////////////////////////////////////////////////////////////////////////////////
/*global THREE, Coordinates, document, window  */
var camera, scene, renderer;
var cameraControls;

var clock = new THREE.Clock();

function fillScene() {
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );

	// LIGHTS

	scene.add( new THREE.AmbientLight( 0x222222 ) );

	var light = new THREE.DirectionalLight( 0xffffff, 0.7 );
	light.position.set( 200, 500, 500 );

	scene.add( light );

	light = new THREE.DirectionalLight( 0xffffff, 0.9 );
	light.position.set( -200, -100, -400 );

	scene.add( light );

//grid xz
 var gridXZ = new THREE.GridHelper(2000, 100, new THREE.Color(0xCCCCCC), new THREE.Color(0x888888));
 scene.add(gridXZ);

 //axes
 var axes = new THREE.AxisHelper(150);
 axes.position.y = 1;
 scene.add(axes);

 drawRobot();
}

function drawRobot() {

	//////////////////////////////
	// MATERIALS

	var materialGrey = new THREE.MeshLambertMaterial( { color: 0x262626 } );

	var materialBlack = new THREE.MeshLambertMaterial( { color: 0x000000 } );

	var materialYellow = new THREE.MeshPhongMaterial( { color: 0xFFD80D } );

	var materialBlue = new THREE.MeshPhongMaterial( { color: 0x0080ff } );

	// MODELS

	// Root
	var root = new THREE.Group();
	root.position.y = 295;
	root.rotateY(Math.PI/2);

	let hip = new THREE.Mesh(
		new THREE.BoxBufferGeometry(150, 20, 75), materialYellow);

	root.add(hip);

	let hipJoint = new THREE.Mesh(
		new THREE.SphereBufferGeometry(35, 32, 32), materialGrey);
	hipJoint.position.y = 30;

	root.add(hipJoint);

	// Upper Body
	var upperBody = new THREE.Group();
	upperBody.position.y = 115;
	root.add(upperBody);

	let chest = new THREE.Mesh(
		new THREE.BoxBufferGeometry(150, 150, 75), materialYellow);
	chest.position.y = 15;

	upperBody.add(chest);

	// Head
	var head = new THREE.Group();
	head.position.y = 30;
	upperBody.add(head);

	let skull = new THREE.Mesh(
		new THREE.BoxBufferGeometry(100, 50, 50), materialYellow);
	skull.position.y = 100;
	head.add(skull);

	let neck = new THREE.Mesh(
		new THREE.SphereBufferGeometry(25, 32, 32), materialGrey);
	neck.position.y = 60;
	head.add(neck);

	// Face
	let leftEye = new THREE.Mesh(
		new THREE.SphereBufferGeometry(10, 32, 32), materialGrey);
	leftEye.position.y = 110;
	leftEye.position.x = 25;
	leftEye.position.z = -20;
	head.add(leftEye);

	let rightEye = new THREE.Mesh(
		new THREE.SphereBufferGeometry(10, 32, 32), materialGrey);
	rightEye.position.y = 110;
	rightEye.position.x = -25;
	rightEye.position.z = -20;
	head.add(rightEye);

	let mouth = new THREE.Mesh(
		new THREE.BoxBufferGeometry(50, 5, 10), materialGrey);
	mouth.position.y = 90;
	mouth.position.z = -22;
	head.add(mouth);

	// Arms
	var leftArm = new THREE.Group();
	leftArm.position.y = 70;
	leftArm.position.x = 85;
	leftArm.rotateZ(Math.PI/8);

	var rightArm = new THREE.Group();
	rightArm.position.y = 70;
	rightArm.position.x = -85;
	rightArm.rotateZ(-Math.PI/8);

	upperBody.add(leftArm);
	upperBody.add(rightArm);

	let elbow  = new THREE.Mesh(
		new THREE.SphereBufferGeometry(25, 32, 32), materialGrey);

	let armBone = new THREE.Mesh(
		new THREE.CylinderBufferGeometry(20, 20, 100, 32), materialYellow);
	armBone.position.y = -60;

	var armPiece = new THREE.Group();
	armPiece.add(elbow);
	armPiece.add(armBone);

	let leftUpperArm = armPiece.clone();
	let rightUpperArm = armPiece.clone();

	let leftLowerArm = armPiece.clone();
	leftLowerArm.position.y = -120;

	let rightLowerArm = armPiece.clone();
	rightLowerArm.position.y = -120;

	leftArm.add(leftUpperArm);
	rightArm.add(rightUpperArm);

	leftArm.add(leftLowerArm);
	rightArm.add(rightLowerArm);

	// Hands
	var leftHand = new THREE.Group();
	leftHand.position.y = -230;
	leftHand.rotateY(Math.PI/2);

	var rightHand = new THREE.Group();
	rightHand.position.y = -230;
	rightHand.rotateY(Math.PI/2);

	let palm  = new THREE.Mesh(
		new THREE.SphereBufferGeometry(25, 32, 32), materialGrey);

	let hand = new THREE.Mesh(
		new THREE.BoxBufferGeometry(40, 50, 20), materialYellow);
	hand.position.y = -30;

	var handPiece = new THREE.Group();
	handPiece.add(palm);
	handPiece.add(hand);

	let leftHandPiece = handPiece.clone();
	let rightHandPiece = handPiece.clone();

	leftHand.add(leftHandPiece);
	rightHand.add(rightHandPiece);

	leftArm.add(leftHand);
	rightArm.add(rightHand);

	// Legs
	var leftLeg = new THREE.Group();
	leftLeg.position.y = -10;
	leftLeg.position.x = 45;

	var rightLeg = new THREE.Group();
	rightLeg.position.y = -10;
	rightLeg.position.x = -45;

	root.add(leftLeg);
	root.add(rightLeg);

	let legJoint  = new THREE.Mesh(
		new THREE.SphereBufferGeometry(30, 32, 32), materialGrey);

	let legBone = new THREE.Mesh(
		new THREE.CylinderBufferGeometry(25, 25, 100, 32), materialYellow);
	legBone.position.y = -60;

	var legPiece = new THREE.Group();
	legPiece.add(legJoint);
	legPiece.add(legBone);

	let leftUpperLeg = legPiece.clone();
	let rightUpperLeg = legPiece.clone();

	let leftLowerLeg = legPiece.clone();
	leftLowerLeg.position.y = -130;

	let rightLowerLeg = legPiece.clone();
	rightLowerLeg.position.y = -130;

	leftLeg.add(leftUpperLeg);
	rightLeg.add(rightUpperLeg);

	leftLeg.add(leftLowerLeg);
	rightLeg.add(rightLowerLeg);

	// Feet
	var leftFoot = new THREE.Group();
	leftFoot.position.y = -250;
	leftFoot.rotateX(Math.PI/2);

	var rightFoot = new THREE.Group();
	rightFoot.position.y = -250;
	rightFoot.rotateX(Math.PI/2);

	let ankle  = new THREE.Mesh(
		new THREE.SphereBufferGeometry(25, 32, 32), materialGrey);

	let foot = new THREE.Mesh(
		new THREE.BoxBufferGeometry(45, 70, 25), materialYellow);
	foot.position.y = -15;
	foot.position.z = 20;

	var footPiece = new THREE.Group();
	footPiece.add(ankle);
	footPiece.add(foot);

	let leftFootPiece = footPiece.clone();
	let rightFootPiece = footPiece.clone();

	leftFoot.add(leftFootPiece);
	rightFoot.add(rightFootPiece);

	leftLeg.add(leftFoot);
	rightLeg.add(rightFoot);

	// Add to scene
	scene.add(root);

}

function init() {
	var canvasWidth = 600;
	var canvasHeight = 400;
	var canvasRatio = canvasWidth / canvasHeight;

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );

	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor( 0xAAAAAA, 1.0 );

	// CAMERA
	camera = new THREE.PerspectiveCamera( 45, canvasRatio, 1, 4000 );
	// CONTROLS
	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
	camera.position.set( -800, 600, -600);
	cameraControls.target.set(4,301,92);
}

function addToDOM() {
    var canvas = document.getElementById('canvas');
    canvas.appendChild(renderer.domElement);
}

function animate() {
	window.requestAnimationFrame(animate);
	render();
}

function render() {
	var delta = clock.getDelta();
	cameraControls.update(delta);

	renderer.render(scene, camera);
}

try {
  init();
  fillScene();
  addToDOM();
  animate();
} catch(error) {
    console.log("Your program encountered an unrecoverable error, can not draw on canvas. Error was:");
    console.log(error);
}
