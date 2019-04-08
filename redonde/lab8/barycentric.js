////////////////////////////////////////////////////////////////////////////////

// Copyright 2019 © Ramón Romero @ramonromeroqro
// Description: Computer Graphics, ITESM.
// Lab 8 - Barycentric Coordinates
// V070420192300

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.


// Three.js is distributed under the MIT License
// Copyright © 2010-2019 three.js authors

////////////////////////////////////////////////////////////////////////////////

/*global THREE, Coordinates, document, window  */
var camera, scene, renderer, cameraControls, canvasWidth, canvasHeight;
var v1, v2, v3, b1, t1, t2, t3, tri, b1, b2, b3, triNormal, center, inTriangle;
var v1label, v2label, v3label, plabel;
var objects = [];
var plane = new THREE.Plane();
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3();
var intersection = new THREE.Vector3();
var INTERSECTED;
var SELECTED;

var projector = new THREE.Projector();
var raycaster = new THREE.Raycaster();
var clock = new THREE.Clock();

function fillScene() {
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x808080, 2000, 4000);
  scene.add(new THREE.AmbientLight(0x222222));

  var light = new THREE.DirectionalLight(0xffffff, 0.9);
  light.position.set(-200, 500, 500);
  scene.add(light);

  light = new THREE.DirectionalLight(0xffffff, 0.6);
  light.position.set(100, 100, -400);
  scene.add(light);

  //grid xz
  var gridXZ = new THREE.GridHelper(2000, 100, new THREE.Color(0xCCCCCC), new THREE.Color(0x888888));
  scene.add(gridXZ);

  //axes
  var axes = new THREE.AxisHelper(150);
  axes.position.y = 1;
  scene.add(axes);

  drawTriangle();
}

function drawTriangle() {
  // Triangle vertices represented as spheres
  v1 = new THREE.Mesh(new THREE.SphereGeometry(30, 12, 12),
    new THREE.MeshLambertMaterial({ color: 0xff0000 }));
  v1.position.x = 100;
  v1.position.y = 520;
  v1.position.z = 200;
  scene.add(v1);

  v2 = new THREE.Mesh(new THREE.SphereGeometry(30, 12, 12),
    new THREE.MeshLambertMaterial({ color: 0x00ff00 }));
  v2.position.x = 100;
  v2.position.y = 300;
  v2.position.z = -200;
  scene.add(v2);

  v3 = new THREE.Mesh(new THREE.SphereGeometry(30, 12, 12),
    new THREE.MeshLambertMaterial({ color: 0x0000ff }));
  v3.position.x = -50;
  v3.position.y = -50;
  v3.position.z = 300;
  scene.add(v3);

  // center is used for the initial position of p, and also for the positioning of
  // the line representing the normal.
  center = new THREE.Vector3((v1.position.x + v2.position.x + v3.position.x) / 3,
    (v1.position.y + v2.position.y + v3.position.y) / 3,
    (v1.position.z + v2.position.z + v3.position.z) / 3);

  // p is the point we want to calculate barycentric coordinates for
  p = new THREE.Mesh(new THREE.SphereGeometry(40, 12, 12),
    new THREE.MeshLambertMaterial());

  p.position.copy(center);

  // p's color is based on the barycentric coordinates.
  // Initialized in init() as 0.33, 0.33, 0.33.
  p.material.color.setRGB(b1, b2, b3);

  scene.add(p);

  var geo = new THREE.Geometry();
  geo.vertices = [v1.position, v2.position, v3.position];
  geo.faces = [new THREE.Face3(0, 1, 2)];

  tri = new THREE.Mesh(geo,
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      wireframeLinewidth: 2,
      side: THREE.DoubleSide
    }));
  scene.add(tri);

  // this line will be used to display the face normal direction
  // its geometry will be set based on the orientation of the face
  // in the render function.
  triNormal = new THREE.Line(new THREE.Geometry(),
    new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2
    }));
  scene.add(triNormal);

  geo = new THREE.Geometry();
  geo.vertices = [v2.position, v3.position, p.position];
  geo.faces = [new THREE.Face3(0, 1, 2)];
  t1 = new THREE.Mesh(geo,
    new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide
    }));
  scene.add(t1);

  geo = new THREE.Geometry();
  geo.vertices = [v1.position, p.position, v3.position];
  geo.faces = [new THREE.Face3(0, 1, 2)];
  t2 = new THREE.Mesh(geo,
    new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide
    }));
  scene.add(t2);

  geo = new THREE.Geometry();
  geo.vertices = [v2.position, p.position, v1.position];
  geo.faces = [new THREE.Face3(0, 1, 2)];
  t3 = new THREE.Mesh(geo,
    new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide
    }));
  scene.add(t3);

  // objects that we want to test for intersection (picking) by
  // the ray caster
  objects = [v1, v2, v3, p];
}

function init() {
  canvasWidth = 600;
  canvasHeight = 400;

  var canvasRatio = canvasWidth / canvasHeight;
  b1 = 0.33;
  b2 = 0.33;
  b3 = 0.33;
  inTriangle = true;

  // RENDERER
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.setClearColor(0xAAAAAA, 1.0);
  renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
  renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
  renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
  renderer.setPixelRatio(window.devicePixelRatio);

  // CAMERA
  camera = new THREE.PerspectiveCamera(45, canvasRatio, 1, 4000);

  // CONTROLS
  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
  camera.position.set(-800, 600, -500);
  cameraControls.target.set(4, 301, 92);

  // HTML LABELS
  v1label = document.createElement('div');
  v1label.style.position = 'absolute';
  v1label.style['pointer-events'] = 'none';
  v1label.style.width = 100;
  v1label.style.height = 50;

  v2label = document.createElement('div');
  v2label.style.position = 'absolute';
  v2label.style['pointer-events'] = 'none';
  v2label.style.width = 100;
  v2label.style.height = 50;

  v3label = document.createElement('div');
  v3label.style.position = 'absolute';
  v3label.style['pointer-events'] = 'none';
  v3label.style.width = 100;
  v3label.style.height = 50;

  plabel = document.createElement('div');
  plabel.style.position = 'absolute';
  plabel.style['pointer-events'] = 'none';
  plabel.style.width = 100;
  plabel.style.height = 50;
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

  tri.geometry.vertices = [v1.position, v2.position, v3.position]
  tri.geometry.verticesNeedUpdate = true;

  t1.geometry.vertices = [v2.position, v3.position, p.position];
  t1.geometry.verticesNeedUpdate = true;

  t2.geometry.vertices = [v1.position, p.position, v3.position];;
  t2.geometry.verticesNeedUpdate = true;

  t3.geometry.vertices = [v2.position, p.position, v1.position];
  t3.geometry.verticesNeedUpdate = true;

  t1.visible = t2.visible = t3.visible = inTriangle;

  center.set((v1.position.x + v2.position.x + v3.position.x) / 3,
    (v1.position.y + v2.position.y + v3.position.y) / 3,
    (v1.position.z + v2.position.z + v3.position.z) / 3);

  // it's necessary to call computeFaceNormals() to use the normals of a face
  tri.geometry.computeFaceNormals();
  // set the geometry for the line object to represent the face normal
  // for display purposes.
  triNormal.geometry.vertices = [
    center.clone(),
    center.clone().add(tri.geometry.faces[0].normal.multiplyScalar(250))];

  triNormal.geometry.verticesNeedUpdate = true;

  // if p is inside the triangle, set its color to the barycentric coords
  // otherwise, color it black
  if (inTriangle) {
    p.material.color.setRGB(b1, b2, b3);
  } else {
    p.material.color.setRGB(0, 0, 0);
  }

  // place x, y, z HTML labels on each of the points
  camera.updateMatrixWorld();
  v1label.style.top = (toXYCoords(v1.position).y + $("#canvas").offset().top + 10) + 'px';
  v1label.style.left = (toXYCoords(v1.position).x + $("#canvas").offset().left + 10) + 'px';
  v1label.innerHTML =
    Math.round(v1.position.x) + ", " +
    Math.round(v1.position.y) + ", " +
    Math.round(v1.position.z);
  document.body.appendChild(v1label);

  v2label.style.top = (toXYCoords(v2.position).y + $("#canvas").offset().top + 10) + 'px';
  v2label.style.left = (toXYCoords(v2.position).x + $("#canvas").offset().left + 10) + 'px';
  v2label.innerHTML =
    Math.round(v2.position.x) + ", " +
    Math.round(v2.position.y) + ", " +
    Math.round(v2.position.z);
  document.body.appendChild(v2label);

  v3label.style.top = (toXYCoords(v3.position).y + $("#canvas").offset().top + 10) + 'px';
  v3label.style.left = (toXYCoords(v3.position).x + $("#canvas").offset().left + 10) + 'px';
  v3label.innerHTML =
    Math.round(v3.position.x) + ", " +
    Math.round(v3.position.y) + ", " +
    Math.round(v3.position.z);
  document.body.appendChild(v3label);

  plabel.style.top = (toXYCoords(p.position).y + $("#canvas").offset().top + 10) + 'px';
  plabel.style.left = (toXYCoords(p.position).x + $("#canvas").offset().left + 10) + 'px';
  plabel.innerHTML =
    Math.round(p.position.x) + ", " +
    Math.round(p.position.y) + ", " +
    Math.round(p.position.z);
  document.body.appendChild(plabel);

  renderer.render(scene, camera);
}


function onDocumentMouseMove(event) {
  event.preventDefault();
  // this converts window mouse values to x and y mouse coordinates that range
  // between -1 and 1 in the canvas
  mouse.set(
    ((event.clientX / window.innerWidth) * 2 - 1) *
    (window.innerWidth / canvasWidth),
    (-((event.clientY - ($("#canvas").position().top + (canvasHeight / 2))) / window.innerHeight) * 2)
    * (window.innerHeight / canvasHeight));

  // uses Three.js built-in raycaster to send a ray from the camera
  raycaster.setFromCamera(mouse, camera);
  if (SELECTED) {
    if (SELECTED === p) {
      // in the case that p is selected, the draggng plane should be coplanar with
      // the triangle
      plane.setFromCoplanarPoints(
        tri.geometry.vertices[0],
        tri.geometry.vertices[1],
        tri.geometry.vertices[2]);

      // if p is dragged, we need to recalculate the barycentric coordinates
      recalculateBarycentricCoords();
    }
    if (raycaster.ray.intersectPlane(plane, intersection)) {
      SELECTED.position.copy(intersection.sub(offset));
    }
    if (SELECTED != p) {
      // if one of the triangle corners is dragged, p should be repositioned on the
      // new triangle according to its unchanged barycentric coordinates
      p.position.x = (v1.position.x * b1 + v2.position.x * b2 + v3.position.x * b3);
      p.position.y = (v1.position.y * b1 + v2.position.y * b2 + v3.position.y * b3);
      p.position.z = (v1.position.z * b1 + v2.position.z * b2 + v3.position.z * b3);
    }
    return;
  }

  // determines which objects are intersected by the ray, and sets the dragging
  // plane with respect to the camera view.
  var intersects = raycaster.intersectObjects(objects);
  if (intersects.length > 0) {
    if (INTERSECTED != intersects[0].object) {
      INTERSECTED = intersects[0].object;
      plane.setFromNormalAndCoplanarPoint(
        camera.getWorldDirection(plane.normal),
        INTERSECTED.position);
    }
    canvas.style.cursor = 'pointer';
  } else {
    INTERSECTED = null;
    canvas.style.cursor = 'auto';
  }
}

// handles mouse down event
function onDocumentMouseDown(event) {
  event.preventDefault();
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(objects);
  if (intersects.length > 0) {
    cameraControls.enabled = false;
    SELECTED = intersects[0].object;
    if (raycaster.ray.intersectPlane(plane, intersection)) {
      offset.copy(intersection).sub(SELECTED.position);
    }
    canvas.style.cursor = 'move';
  }
}

// handles mouse up event
function onDocumentMouseUp(event) {
  event.preventDefault();
  cameraControls.enabled = true;
  if (INTERSECTED) {
    SELECTED = null;
  }
  canvas.style.cursor = 'auto';
}

function toXYCoords(pos) {
  //var vector = projector.projectVector(pos.clone(), camera);
  var vector = pos.clone().project(camera);
  vector.x = (vector.x + 1) / 2 * canvasWidth;
  vector.y = -(vector.y - 1) / 2 * canvasHeight;
  //console.log(vector);
  return vector;
}

function recalculateBarycentricCoords() {
  // TODO: calculate b1, b2, and b3, and set the inTriangle value

  // Use the approach described in pp 328-329 of "3D Math Primer for Graphics
  // and Game Development" to calculate the barycentric coordinates using
  // vector cross products.

  // To do this, you will represent vectors as THREE.Vector3 objects. Everything
  // you need to work with vectors is in the API here:
  // http://threejs.org/docs/#Reference/Math/Vector3

  // Some of the three.js vector operations change the vectors they operate
  // on. Be careful about this. If you want to call a method on a vector to
  // return a vector value, (for example, finding a cross product) consider
  // using the .clone() method, which duplicates the vector it's called on.
  // Vector operations can be chained, so, for example, to return the dot product
  // of vector A and the vector representing the cross product of vectors B and C
  // without altering any of the original vectors, you can call
  // C.clone().cross(B).dot(A)

  // Be careful with the sub() and/or subVectors() methods to be sure you are
  // calling them with the arguments in the correct order.

  // YOUR CODE HERE:

  // Define 6 vectors as auxiliar variables in order to calculate the new color and baricenter

  var element1 = new THREE.Vector3()
  var element2 = new THREE.Vector3()
  var element3 = new THREE.Vector3()
  var dimension1 = new THREE.Vector3()
  var dimension2 = new THREE.Vector3()
  var dimension3 = new THREE.Vector3()
  var normalVector = new THREE.Vector3();

  // set using the current configurations 
  element1 = element1.subVectors(v3.position, v2.position);
  element2 = element2.subVectors(v1.position, v3.position);
  element3 = element3.subVectors(v2.position, v1.position);
  dimension1 = dimension1.subVectors(p.position, v1.position);
  dimension2 = dimension2.subVectors(p.position, v2.position);
  dimension3 = dimension3.subVectors(p.position, v3.position);

  // calculate normal from current position
  tri.geometry.computeFaceNormals();
  normalVector = tri.geometry.faces[0].normal.clone().normalize();

  // Normalizing Factor
  var calcNorm = element1.clone()
  calcNorm = calcNorm.cross(element2).dot(normalVector) / 2;

  // Factors of generation of color

  var calcV1 = element1.clone()
  calcV1 = calcV1.cross(dimension3).dot(normalVector) / 2;
  var calcV2 = element2.clone()
  calcV2 = calcV2.cross(dimension1).dot(normalVector) / 2;
  var calcV3 = element3.clone()
  calcV3 = calcV3.cross(dimension2).dot(normalVector) / 2;

  // Compound and assignament of elements for barycenter

  b1 = calcV1 / calcNorm;
  b2 = calcV2 / calcNorm;
  b3 = calcV3 / calcNorm;

  // validate point in valid area
  if (calcV1 < 0 || calcV2 < 0 || calcV3 < 0) {
    inTriangle = false;
  }
  else {
    inTriangle = true;
  }
};

try {
  init();
  fillScene();
  addToDOM();
  animate();
} catch (error) {
  console.log("Your program encountered an unrecoverable error, can not draw on canvas. Error was:");
  console.log(error);
}
