"use strict";

//CORE VARIABLES
var canvas, context, imageBuffer;

var DEBUG = false; //whether to show debug messages
var EPSILON = 0.00001; //error margins

// Scene to render
var scene, camera, surfaces; //etc...

// Initializes the canvas and drawing buffers
function init() {
    canvas = $('#canvas')[0];
    context = canvas.getContext("2d");
    imageBuffer = context.createImageData(canvas.width, canvas.height); //buffer for pixels

    loadSceneFile("assets/MyTest.json");
}

/* --------------------- ES2015 class declarations -------------------- */

/* 
    The camera constructor takes a field of view on Y, an aspect ratio,
    an eye origin, the position it's looking at, and finally its up vector.
    It creates a new camer instance that looks from eye to at and calculates 
    the pixel volume to be rendered. 
*/
class Camera {
    constructor(fovy, aspect, eye, at, up) {
        // Assign FOV and Aspect-ratio
        this.fovy = fovy;
        this.aspect = aspect;

        // Assign simple values to eye, looking at, and upwards vectors
        this.eye = new THREE.Vector3(eye[0], eye[1], eye[2]);
        this.at = new THREE.Vector3(at[0], at[1], at[2]);
        this.up = new THREE.Vector3(up[0], up[1], up[2]);

        // Instantiate backwards, upwards, and rightwards vectors originating
        // from the camera
        this.back = new THREE.Vector3().subVectors(this.eye, this.at).normalize();
        this.right = new THREE.Vector3().crossVectors(this.up, this.back).normalize();
        this.upward = new THREE.Vector3().crossVectors(this.back, this.right).normalize();

        // Calculates viewing volume (how many pixels rendered) as a product 
        // of FOV and and aspect ratio
        this.height = 2 * Math.tan(rad(this.fovy / 2.0));
        this.width = this.height * this.aspect;

        // Calculates pixel size in 3-dimensional space for ray intersection
        this.pxHeight = this.height / (canvas.height - 1);
        this.pxWidth = this.width / (canvas.width - 1);
    }

    // Define method to extend camera prototype object. castRay takes a pixel's x and y 
    // coordinates as input and calculates a vector from the eye origin to the x,y coordinates given
    // Its return type is an object that contains the direction it is facing and the origin of the ray.
    castRay(x, y) {
        // Calculates length of u and v constants
        var u = ((this.width * x) / (canvas.width - 1)) - (this.width / 2.0);
        var v = ((-this.height * y) / (canvas.height - 1)) + (this.height / 2.0);

        // Rightwards pixel component
        var uRight = this.right.clone().multiplyScalar(u);

        // Upwards pixel component
        var vUpward = this.upward.clone().multiplyScalar(v);
        var vCompound = new THREE.Vector3().addVectors(uRight, vUpward);

        // Calculates facing direction for the eye
        var direction = new THREE.Vector3().addVectors(vCompound, this.back.clone().multiplyScalar(-1));

        // Creates ray hash with the eye (origin) and the direction it is facing
        var ray = {
            "eye": this.eye, // origin of vector
            "direction": direction // direction the vector is facing
        };

        return ray;
    }
}

/* 
    The sphere constructor takes parameters for its name, its shape 
    (to instantiate as from a surface), where it's centered on the screen,
    the radius of the sphere, which material it uses, and the matrix transformations
    it supports.
*/
class Sphere {
    constructor(name, shape, center, radius, material, transforms) {
        // Simple variable assignment
        this.name = name;
        this.shape = shape;
        this.center = new THREE.Vector3(center[0], center[1], center[2]);
        this.radius = radius;
        // Calls material constructor and assigns a new material to the sphere
        this.material = new Material(material);
        this.transforms = transforms;
    }

    /* 
        Define intersection method on the sphere based on the quadratic general formula 
        This method takes as input a rayVector object (which contains the origin and the 
        direction it's facing). It returns a vector whether there were 1 or more intersections. 
    */
    intersects(rayVector) {
        var radius = this.radius;
        var direction = rayVector.direction.normalize();
        var eye = new THREE.Vector3().subVectors(this.center, rayVector.eye);
        var b = eye.clone().dot(direction);

        /* 
            We first compute the determinant to verify if an intersection 
            is possible. If it's lower than 0 then the intersection is an imaginary number, if it's
            0 then there's exactly 1 intersection point. Otherwise there are multiple solutions
            to the general equation and, as such, multiple intersection points.
        */
        var discriminant = Math.pow(radius, 2) - (Math.pow(eye.length(), 2)) + Math.pow(b, 2);
        var f = Math.sqrt(discriminant);
        var t = b + f; // This is equivalent to x =  [-b +/- sqrt(b^2 - 4ac) ] / 2a

        var result = direction.clone().multiplyScalar(t);

        /* 
            If there's a solution vector returns true, adding the origin + the result of the general
            formula, otherwise returns null 
        */
        return (discriminant > 0 ? rayVector.eye.clone().add(result) : null);
    }

    lightIntersects(ray, intersect) {
        var center = this.center;
        var intersection = intersect;
        var light = ray.clone().normalize();
        var radius = this.radius;
        var a = light.clone().dot(light);
        var b_1 = light.clone().multiplyScalar(2);
        var b_2 = intersection.clone().sub(center);
        var b = b_1.dot(b_2);
        var c_1 = intersection.clone().sub(center);
        var c = c_1.clone().dot(c_1) - (radius * radius);

        if (((b * b) - 4 * (a * c)) > 0) {
            var t = (-b + Math.sqrt(b * b - 4 * a * c)) / 2 * a;
            return intersection.clone().add(light.clone().multiplyScalar(t));
        }

        else {
            return null;
        }
    }

    /*
        Calculates the normal vector (which is perpendicular to the tangent plane of the point P's surface)
        In this case the method receives an intersection as P, and returns a new vector computed as a substraction
        of the intersection and the center of the sphere, normalizing it, and assigning it to a new THREE.Vector3 
    */
    normal(intersection) {
        return new THREE.Vector3().subVectors(intersection, this.center).normalize();
    }
}

/* 
    The triangle constructor takes parameters for its name, its shape 
    (to instantiate as from a surface), its three edges (p1,p2,p3),
    which material it uses, and the matrix transformations
    it supports.
*/
class Triangle {
    constructor(name, shape, p1, p2, p3, material, transforms) {
        this.name = name;
        this.shape = shape;
        this.p1 = new THREE.Vector3(p1[0], p1[1], p1[2]);
        this.p2 = new THREE.Vector3(p2[0], p2[1], p2[2]);
        this.p3 = new THREE.Vector3(p3[0], p3[1], p3[2]);
        this.material = new Material(material);
        this.transforms = transforms;
    }

    /*  
        Implements Moller Algorithm for Triangle-Ray Intersection, this method is 
        preferred for its simplicity and not requiring extra memory for precomputing
        the plane equation that contains the triangle. This method takes a ray and
        checks for collision with the triangle, returning an intersection vector in
        that case.
    */
    intersects(rayVector) {
        var firstEdge = new THREE.Vector3().subVectors(this.p2, this.p1);
        var secondEdge = new THREE.Vector3().subVectors(this.p3, this.p1);
        var h = new THREE.Vector3().crossVectors(rayVector.direction.clone(), secondEdge);
        var a = firstEdge.clone().dot(h);

        if (a < EPSILON && a > -EPSILON) return null;

        var f = 1.0 / a;
        var s = new THREE.Vector3().subVectors(camera.eye, this.p1);
        var u = f * s.clone().dot(h);

        if (u > 1.0 || u < 0.0) return null;

        var q = new THREE.Vector3().crossVectors(s, firstEdge);
        var v = f * rayVector.direction.clone().dot(q);

        if (u + v > 1.0 || v < 0.0) return null;

        var t = f * secondEdge.dot(q);
        var intersection = camera.eye.clone().add(rayVector.direction.clone().normalize().multiplyScalar(t));

        return (t > EPSILON ? intersection : null)

    }

    /*  
        Implements Moller Algorithm for Triangle-Ray Intersection, this method is 
        preferred for its simplicity and not requiring extra memory for precomputing
        the plane equation that contains the triangle. This version takes a light source
        and an intersection and returns an intersection vector if the light collided with
        the triangle.
    */
    lightIntersects(ray, intersect) {
        //Moller Algoritm
        var edge_1 = new THREE.Vector3().subVectors(this.p2, this.p1);
        var edge_2 = new THREE.Vector3().subVectors(this.p3, this.p1);
        var h = new THREE.Vector3().crossVectors(ray.clone(), edge_2);
        var a = edge_1.clone().dot(h);

        if (a > -EPSILON && a < EPSILON) {
            return null;
        }
        var f = 1.0 / a;
        var s = new THREE.Vector3().subVectors(intersect, this.p1);
        var u = f * s.clone().dot(h);
        if (u < 0.0 || u > 1.0) {
            return null;
        }
        var q = new THREE.Vector3().crossVectors(s, edge_1);
        var v = f * ray.clone().dot(q);
        if (v < 0.0 || u + v > 1.0) {
            return null;
        }
        var t = f * edge_2.dot(q);
        if (t > EPSILON) {
            return intersect.clone().add(ray.clone().multiplyScalar(t));
        } else {
            return null;
        }
    }

    /*
        A surface normal for a triangle can be calculated by taking the vector cross product of two edges of that triangle. 
        The order of the vertices used in the calculation will affect the direction of the normal (in or out of the face w.r.t. winding).
        So for a triangle p1, p2, p3, if the vector U = p2 - p1 and the vector V = p3 - p1 then the normal N = U X V and can be calculated by:
        
        Nx = UyVz - UzVy

        Ny = UzVx - UxVz

        Nz = UxVy - UyVx 

        This method takes no parameters as input, as the points needed for calculating the edges are part of the instance of the triangle. The return type is a
        Three.Vector3() which is perpendicular to the tangent plane of the triangle
    */
    normal() {
        var firstEdge = new THREE.Vector3().subVectors(this.p1, this.p3);
        var secondEdge = new THREE.Vector3().subVectors(this.p2, this.p3);

        return new THREE.Vector3().crossVectors(firstEdge, secondEdge).normalize();
    }
}
/*
    The material constructor receives a material array that contains its name, its
    ambience reflectance, its diffuse reflectance, its specular reflectance, and its 
    mirror reflectance, then constructs a material object from this parameters.
*/
class Material {
    // ka = ambience reflectance
    // kd = diffuse reflectance color
    // ks = specular reflectance color
    // kr = mirror reflectance 

    constructor(material) {
        this.name = material.name;
        this.ka = material.ka;
        this.kd = material.kd;
        this.ks = material.ks;
        this.kr = (material.kr == undefined) ? new THREE.Vector3(0, 0, 0) : material.kr;
        this.shininess = material.shininess;
    }
}

// Loads and "parses" the scene file at the given path
function loadSceneFile(filepath) {
    scene = Utils.loadJSON(filepath); //load the scene

    //TODO - set up camera
    camera = new Camera(scene.camera.fovy, scene.camera.aspect, scene.camera.eye, scene.camera.at, scene.camera.up)

    //TODO - set up surfaces
    surfaces = [];

    // Iterate over each surface in the surfaces array
    for (let i = 0; i < scene.surfaces.length; i++) {
        var transformed = new THREE.Matrix4();
        var surface = scene.surfaces[i];

        // If the surface has transformations precompute them and add them to the shape
        if (surface.hasOwnProperty("transforms")) {
            surface.transforms.forEach(function (tr) {
                if (tr[0] == "Translate") {
                    transformed.multiply(new THREE.Matrix4().makeTranslation(tr[1][0], tr[1][1], tr[1][2]));
                }

                if (tr[0] == "Rotate") {
                    var thetaX = toRadian(tr[1][0]);
                    var thetaY = toRadian(tr[1][1]);
                    var thetaZ = toRadian(tr[1][2]);

                    transformed.multiply(new THREE.Matrix4().makeRotationZ(thetaZ));
                    transformed.multiply(new THREE.Matrix4().makeRotationY(thetaY));
                    transformed.multiply(new THREE.Matrix4().makeRotationX(thetaX));
                }

                if (tr[0] == "Scale") {
                    transformed.multiply(new THREE.Matrix4().makeScale(tr[1][0], tr[1][1], tr[1][2]));
                }


            });
        }

        // If its shape is a sphere, add a new sphere
        if (surface.shape == "Sphere") {
            if (!surface.hasOwnProperty("transforms")) {
                transformed = null;
            }
            surfaces.push(new Sphere(
                surface.name,
                surface.shape,
                surface.center,
                surface.radius,
                scene.materials[surface.material],
                transformed
            ));
        }

        // If its shape is a triangle, add a new triangle
        if (surface.shape == "Triangle") {
            if (!surface.hasOwnProperty("transforms")) {
                transformed = null;
            }
            surfaces.push(new Triangle(
                surface.name,
                surface.shape,
                surface.p1,
                surface.p2,
                surface.p3,
                scene.materials[surface.material],
                transformed
            ));
        }
    }
    render(); //render the scene
}

// Renders the scene
function render() {
    var start = Date.now(); //for logging

    // This loop traces a ray for each pixel, the method checks for
    // intersections and calculates the color depending on its material
    // and the collision parameters.
    //TODO - fire a ray though each pixel
    for (let row = 0; row < camera.height / camera.pxHeight; row++) {
        for (let col = 0; col < camera.width / camera.pxWidth; col++) {
            // Sets the color of each pixel depending on the result of the ray tracing method
            // The raytracing is called with the value of the vector returned from the method
            // castRay, which has both the ray and its origin.
            setPixel(row, col, traceRay(camera.castRay(row, col)));
        }
    }

    //render the pixels that have been set
    context.putImageData(imageBuffer, 0, 0);

    var end = Date.now(); //for logging
    $('#log').html("rendered in: " + (end - start) + "ms");
    console.log("rendered in: " + (end - start) + "ms");
}

// This function receives a ray and its origin, received from casting a ray from the
// camero to the pixel in position x, y. Its return type is the color of the surface
// that is intersected by the ray. In case no intersections are detected it returns
// black, otherwise it returns the result of the reflectance function calculation.
function traceRay(rayVector) {
    var maxDistance = Number.MAX_SAFE_INTEGER;
    var closest = null;
    var lastSurface;

    for (let i = 0; i < surfaces.length; i++) {
        var surface = surfaces[i];

        // We only calculate and apply the surface transformations if the surface
        // contains any, otherwise there's no point calculating them.
        if (surface.transforms != null) {
            var transformInverse = new THREE.Matrix4().getInverse(surface.transforms);

            // Transformed direction of the ray, computed by applying the surface transformation to the new Vector4
            // this Vector4 contains the coordinates of the ray Vector3, and a 0 on its w
            var transformedDirection = new THREE.Vector4(
                rayVector.direction.x,
                rayVector.direction.y,
                rayVector.direction.z,
                0
            ).applyMatrix4(transformInverse);

            // Transformed origin, computed by applying the surface transformation to the new Vector4
            // this Vector4 contains the coordainates of the origin Vector3, and a 1 on its w 
            var transformedOrigin = new THREE.Vector4(
                rayVector.eye.x,
                rayVector.eye.y,
                rayVector.eye.z,
                1
            ).applyMatrix4(transformInverse);

            // Creates a transformed rayVector with the transformed origin as its eye
            // and the transformed direction as its direction
            var transformedRay = {
                "eye": transformedOrigin,           // origin of vector
                "direction": transformedDirection   // direction the vector is facing
            };

            // Calculates the intersection of the surface with the transformed ray.
            var intersection = surface.intersects(transformedRay);
        }

        // Just calculates normal intersection without any transformations.
        else {
            var intersection = surface.intersects(rayVector);
        }

        // If the intersection was not null then there is a collision with a surface
        if (intersection != null) {

            // If we had a transformation then we have to check the subVectors with the 
            // transformed origin
            if (surface.transforms != null) {
                var vector = new THREE.Vector3().subVectors(intersection, transformedRay.eye);
            }

            // Otherwise we use the original vector to calculate the subVector
            else {
                var vector = new THREE.Vector3().subVectors(intersection, rayVector.eye);
            }

            // If the length of the vector is less than the max safe distance, then
            // we set it to the vector's lenght and set the intersection to the closest
            // one, we also pass the last surface where it collided.
            if (vector.length() < maxDistance) {
                maxDistance = vector.length();
                closest = intersection;
                lastSurface = surface;
            }
        }
    }

    // No intersections detected, returns black RGB [0,0,0]
    if (closest == null) {
        return [0, 0, 0]
    }

    // Calculates the pixel color depending on its reflectance, the last 
    // collision and its surface are passed as parameters, as well as the
    // raytracing vector.
    else {
        return reflectance(rayVector, closest, lastSurface);
    }

}

// This function takes as input a light, an intersection vector, and a surface
// and calculates whether there is a shadow on the surface or not.
function traceShadow(lightSource, intersect, surface) {

    // For each of the surfaces on the scene, if the surface [s] parameter
    // isn't equal to the current surface iterated, then we check if there
    // was an intersection between the light ray and the intersection vector.
    for (var i = 0; i < surfaces.length; i++) {
        var s = surfaces[i];

        // Checks that they aren't the same surface
        if (s != surface) {
            var intersection = s.lightIntersects(lightSource, intersect);

            // If there is not an intersection vector, then we return false
            if (intersection != null) {
                return false;
            }
        }
    }

    // Otherwise return true
    return true;
}

// This function takes as parameters a ray (with origin and casted ray), an intersection vector, and a surface
// It calculates the color of the surface depending on its parameters, such as difuse reflectance, ambience reflectance,
// and specular reflectance, as well as the collisions with multiple light sources.
function reflectance(rayVector, intersection, surface) {
    var color = [0, 0, 0];

    // Adds ups the color depending on the ambience reflectance
    for (var i = 0; i < 3; i++) {
        var ambienceReflectance = surface.material.ka[i];
        color[i] = scene.lights[0].color[i] * ambienceReflectance;
    }

    // For each light source it checks if there is a shadow to trace
    for (var i = 1; i < scene.lights.length; i++) {
        var light = scene.lights[i];
        var lightSource = (light.source == "Point") ?
            new THREE.Vector3(light.position[0], light.position[1], light.position[2]).sub(intersection).normalize() :
            new THREE.Vector3(light.direction[0], light.direction[1], light.direction[2]).negate().normalize();

        // Calls the traceShadow method, which returns a boolean value
        var hasShadow = traceShadow(lightSource, intersection, surface);

        // If it has a shadow then it calculates the color based on the lightSource
        // and the reflectance of the material
        if (hasShadow) {
            var th = lightSource.add(rayVector.direction);
            var h = th.clone().divideScalar(th.length());

            for (let j = 0; j < 3; j++) {
                var difuseReflectance = surface.material.kd[j];
                color[j] += difuseReflectance * scene.lights[i].color[j] * Math.max(0, surface.normal(intersection, rayVector.direction).clone().dot(lightSource));

                // If the surface material has any shininess then it also adds to the color the calculation from
                // the light intensity, its specular reflectance, and its difuse component
                if (surface.material.shininess > 0) {
                    var intensity = scene.lights[i].color[j];
                    var specularReflectance = surface.material.ks[j];
                    var difuseComponent = Math.pow(Math.max(0, surface.normal(intersection, rayVector.direction).clone().dot(h)), surface.material.shininess);

                    // Adds up the product of its parameters to the calculated color
                    color[j] += specularReflectance * intensity * difuseComponent;
                }
            }
        }
    }

    // Returns its calculated color
    return color;
}

// Auxiliary function that takes degrees as its input and
// returns its conversion to Radians.
function toRadian(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

//sets the pixel at the given x,y to the given color
/**
 * Sets the pixel at the given screen coordinates to the given color
 * @param {int} x     The x-coordinate of the pixel
 * @param {int} y     The y-coordinate of the pixel
 * @param {float[3]} color A length-3 array (or a vec3) representing the color. Color values should floating point values between 0 and 1
 */
function setPixel(x, y, color) {
    var i = (y * imageBuffer.width + x) * 4;
    imageBuffer.data[i] = (color[0] * 255) | 0;
    imageBuffer.data[i + 1] = (color[1] * 255) | 0;
    imageBuffer.data[i + 2] = (color[2] * 255) | 0;
    imageBuffer.data[i + 3] = 255; //(color[3]*255) | 0; //switch to include transparency
}

//converts degrees to radians
function rad(degrees) {
    return degrees * Math.PI / 180;
}

//on document load, run the application
$(document).ready(function () {
    init();
    render();

    //load and render new scene
    $('#load_scene_button').click(function () {
        var filepath = 'assets/' + $('#scene_file_input').val() + '.json';
        loadSceneFile(filepath);
    });

    //debugging - cast a ray through the clicked pixel with DEBUG messaging on
    $('#canvas').click(function (e) {
        var x = e.pageX - $('#canvas').offset().left;
        var y = e.pageY - $('#canvas').offset().top;
        DEBUG = true;
        camera.castRay(x, y); //cast a ray through the point
        DEBUG = false;
    });
});
