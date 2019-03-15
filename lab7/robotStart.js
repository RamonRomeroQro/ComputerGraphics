/*
    Copyright 2019 © Ramón Romero @ramonromeroqro
	Description: Computer Graphics, ITESM.
	Lab 7 - Robot
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

/*global THREE, Coordinates, document, window  */
var camera, scene, renderer;
var cameraControls;
var keyboard = new KeyboardState();

var clock = new THREE.Clock();
var counter = 0;
var root, robotChest, robotNeck, robotHead, robotHip, robotLeftHip, robotRightHip,
	robotRightKnee, robotLeftKnee, robotLeftAnkle, robotRightAnkle, robotRightShoulder,
	robotLeftShoulder, robotLeftElbow, robotRightElbow, robotLeftWritst, robotRightWrist;

function fillScene() {
	scene = new THREE.Scene();

	// LIGHTS
	scene.add(new THREE.AmbientLight(0x222222));

	var light = new THREE.DirectionalLight(0xffffff, 0.7);
	light.position.set(200, 500, 500);

	scene.add(light);

	light = new THREE.DirectionalLight(0xffffff, 0.9);
	light.position.set(-200, -100, -400);

	scene.add(light);

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
	root = new THREE.Group();
	root.position.y = -75;
	scene.add(root);

	// MATERIALS
	let materialBlue = new THREE.MeshPhongMaterial({ color: 0x243ec6 });
	let materialGray = new THREE.MeshPhongMaterial({ color: 0x1a1d2b });

	let joint = new THREE.Mesh(new THREE.SphereBufferGeometry(15, 96, 96), materialGray);
	let bone = new THREE.Mesh(new THREE.CylinderBufferGeometry(12, 12, 60, 96), materialBlue);

	bone.position.y = -30;

	let piece = new THREE.Group();
	piece.add(joint);
	piece.add(bone);

	let hand = new THREE.Mesh(new THREE.BoxBufferGeometry(6, 24, 24), materialBlue);
	hand.position.y = -15;

	let wristPiece = new THREE.Group();
	wristPiece.add(joint.clone());
	wristPiece.add(hand);

	let feet = new THREE.Mesh(new THREE.BoxBufferGeometry(18, 12, 45), materialBlue);
	feet.position.y = -18;
	feet.position.z = 12;

	let feetPiece = new THREE.Group();
	feetPiece.add(joint.clone());
	feetPiece.add(feet);

	//body
	robotChest = new THREE.Group();
	root.add(robotChest);

	let chest = new THREE.Mesh(new THREE.BoxBufferGeometry(90, 120, 45), materialBlue);
	chest.position.x = 0;
	chest.position.y = 300;
	chest.position.z = 0;
	robotChest.add(chest);

	robotNeck = new THREE.Group();
	chest.add(robotNeck);

	let neckSphere = new THREE.Mesh(new THREE.SphereBufferGeometry(12, 96, 96), materialGray);
	robotNeck.add(neckSphere);
	robotNeck.position.y = 69;

	robotHead = new THREE.Group();
	let jointSphere = new THREE.Mesh(new THREE.SphereBufferGeometry(9, 96, 96), materialGray);
	let face = new THREE.Mesh(new THREE.BoxBufferGeometry(60, 45, 45), materialBlue);
	robotHead.add(face);

	let leftEye = jointSphere.clone();
	leftEye.position.x = 15;
	leftEye.position.y = 9;
	leftEye.position.z = 21;
	robotHead.add(leftEye);

	let rightEye = jointSphere.clone();
	rightEye.position.x = -15;
	rightEye.position.y = 9;
	rightEye.position.z = 21;
	robotHead.add(rightEye);

	let leftEar = jointSphere.clone();
	leftEar.position.x = 30;
	robotHead.add(leftEar);

	let rightEar = jointSphere.clone();
	rightEar.position.x = -30;
	robotHead.add(rightEar);

	let mouth = new THREE.Mesh(new THREE.BoxBufferGeometry(10, 2, 1), materialGray);
	mouth.position.y = -9;
	mouth.position.z = 24;
	robotHead.add(mouth);

	robotHead.position.y = 24;
	robotNeck.add(robotHead);

	robotRightShoulder = piece.clone();
	robotRightShoulder.position.x = -45;
	robotRightShoulder.position.y = 60;
	robotRightShoulder.position.z = 0;
	robotRightElbow = piece.clone();

	robotRightElbow.position.y = -54;
	robotRightShoulder.add(robotRightElbow);
	robotRightWrist = wristPiece.clone();
	robotRightWrist.position.y = -54;

	robotRightElbow.add(robotRightWrist);
	chest.add(robotRightShoulder);
	robotRightShoulder.rotateZ(-0.3);


	robotLeftShoulder = piece.clone();
	robotLeftElbow = piece.clone();
	robotLeftElbow.position.y = -54;
	robotLeftShoulder.add(robotLeftElbow);

	robotLeftWritst = wristPiece.clone();
	robotLeftWritst.position.y = -54;
	robotLeftElbow.add(robotLeftWritst);

	robotLeftShoulder.position.x = 45;
	robotLeftShoulder.position.y = 60;
	robotLeftShoulder.position.z = 0;
	chest.add(robotLeftShoulder);

	robotLeftShoulder.rotateZ(0.3);

	robotHip = new THREE.Group();
	let sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(21, 96, 96), materialGray);
	let box = new THREE.Mesh(new THREE.BoxBufferGeometry(90, 18, 45), materialBlue);

	box.position.y = -21;
	robotHip.add(sphere);
	robotHip.add(box);
	robotHip.position.y = 231;
	root.add(robotHip);

	robotRightHip = piece.clone();
	robotRightKnee = piece.clone();
	robotRightKnee.position.y = -54;
	robotRightHip.add(robotRightKnee);

	robotRightAnkle = feetPiece.clone();
	robotRightAnkle.position.y = -54;
	robotRightKnee.add(robotRightAnkle);

	robotRightHip.position.x = -33;
	robotRightHip.position.y = -24;
	robotHip.add(robotRightHip);

	robotLeftHip = piece.clone();
	robotLeftKnee = piece.clone();
	robotLeftKnee.position.y = -54;
	robotLeftHip.add(robotLeftKnee);

	robotLeftAnkle = feetPiece.clone();
	robotLeftAnkle.position.y = -54;
	robotLeftKnee.add(robotLeftAnkle);

	robotLeftHip.position.x = 33;
	robotLeftHip.position.y = -24;
	robotHip.add(robotLeftHip);
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

function moveRobot() {
	counter += 0.15;
	let range = 0.15;

	robotHead.rotateZ(Math.cos(counter) * range * 0.02);
	robotHead.rotateZ(-Math.cos(counter) * range * 0.1);

	robotChest.rotateZ(-Math.cos(counter) * range * 0.02);
	robotChest.rotateZ(Math.cos(counter) * range * 0.01);

	robotLeftShoulder.rotateX(-Math.cos(counter) * range);
	robotLeftElbow.rotateX(-Math.sin(counter) * range * 0.5);

	robotRightShoulder.rotateX(Math.cos(counter) * range);
	robotRightElbow.rotateX(-Math.sin(counter) * range * 0.5);

	robotHip.rotateY(-Math.cos(counter) * range * 0.2);

	robotLeftHip.rotateX(-Math.cos(counter) * range);
	robotLeftKnee.rotateX(Math.sin(counter) * range * 0.5);

	robotRightHip.rotateX(Math.cos(counter) * range);
	robotRightKnee.rotateX(Math.sin(counter) * range * 0.5);
}

function render() {
	keyboard.update();
	var delta = clock.getDelta();

	if (keyboard.pressed("W")) {
		moveRobot();
		root.translateZ(7);
	}

	if (keyboard.pressed("A")) {
		root.rotateY(0.1);
	}

	if (keyboard.pressed("D")) {
		root.rotateY(-0.1);
	}

	if (keyboard.pressed("S")) {
		moveRobot();
		root.translateZ(-7);
	}

	cameraControls.update(delta);
	renderer.render(scene, camera);
}

try {
	init();
	fillScene();
	addToDOM();
	animate();
}

catch (error) {
	console.log("Your program encountered an unrecoverable error, can not draw on canvas. Error was:");
	console.log(error);
}
