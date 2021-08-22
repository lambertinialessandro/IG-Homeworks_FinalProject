"use strict";

var canvas;
var gl;

// CONSTANT ARRAYS
var texCoord = [
    //, 0, 1, 2, 3
    vec2(0.05, 0.05), // 0
    vec2(0.05, 0.45), // 1
    vec2(0.45, 0.45), // 2
    vec2(0.45, 0.05), // 3

    //, 4, 5, 6, 7
    vec2(0.55, 0.05), // 4
    vec2(0.55, 0.45), // 5
    vec2(0.95, 0.45), // 6
    vec2(0.95, 0.05), // 7

    //, 8, 9, 10, 11
    vec2(0.05, 0.55), // 8
    vec2(0.05, 0.95), // 9
    vec2(0.55, 0.95), // 10
    vec2(0.55, 0.55), // 11

    //, 12, 13, 14, 15
    vec2(0.55, 0.55), // 12
    vec2(0.55, 0.95), // 13
    vec2(0.95, 0.95), // 14
    vec2(0.95, 0.55), // 15

    //, 16, 17, 18, 19
    vec2(0.0, 0.0), // 16
    vec2(0.0, 1.0), // 17
    vec2(1.0, 1.0), // 18
    vec2(1.0, 0.0), // 19
];
var vertexColors = [
    vec4(0.0, 0.0, 0.0, 1.0),  // 0 black
    vec4(1.0, 0.0, 0.0, 1.0),  // 1 red
    vec4(1.0, 1.0, 0.0, 1.0),  // 2 yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // 3 green
    vec4(0.0, 0.0, 1.0, 1.0),  // 4 blue
    vec4(1.0, 0.0, 1.0, 1.0),  // 5 magenta
    vec4(0.0, 1.0, 1.0, 1.0),  // 6 cyan
    vec4(1.0, 1.0, 1.0, 1.0),  // 7 white (cylinder)
    vec4(0.5, 0.5, 0.5, 1.0),  // 8 lightGray

    vec4(0.7, 0.7, 0.7, 1.0),  // 9 gray
    vec4(0.7, 0.2, 0.2, 1.0),  // 10 light red (my shape)
    vec4(0.5, 0.7, 0.5, 1.0),  // 11 light green
    vec4(0.5, 0.5, 0.7, 1.0),  // 12 light blue (backgroun)
];
   // CYLINDER VERTICES
var verticesCylinder = [
    vec4(0.0, -0.5, 0.0, 1.0),     // 0
    vec4(0.25, -0.5, 0.25, 1.0),   // 1
    vec4(0.35, -0.5, 0.0, 1.0),    // 2
    vec4(0.25, -0.5, -0.25, 1.0),  // 3
    vec4(0.0, -0.5, -0.35, 1.0),   // 4
    vec4(-0.25, -0.5, -0.25, 1.0), // 5
    vec4(-0.35, -0.5, 0.0, 1.0),   // 6
    vec4(-0.25, -0.5, 0.25, 1.0),  // 7
    vec4(0.0, -0.5, 0.35, 1.0),    // 8

    vec4(0.0, 0.5, 0.0, 1.0),     // 9
    vec4(0.25, 0.5, 0.25, 1.0),   // 10
    vec4(0.35, 0.5, 0.0, 1.0),    // 11
    vec4(0.25, 0.5, -0.25, 1.0),  // 12
    vec4(0.0, 0.5, -0.35, 1.0),   // 13
    vec4(-0.25, 0.5, -0.25, 1.0), // 14
    vec4(-0.35, 0.5, 0.0, 1.0),   // 15
    vec4(-0.25, 0.5, 0.25, 1.0),  // 16
    vec4(0.0, 0.5, 0.35, 1.0),    // 17
];
   // MY SHAPE VERTICES
var verticesMyShape = [
    vec4(0.0, 0.2, 0.25, 1.0),    // 0
    vec4(0.15, 0.5, 0.0, 1.0),    // 1
    vec4(0.65, 0.3, 0.0, 1.0),    // 2
    vec4(0.65, -0.3, 0.0, 1.0),   // 3
    vec4(0.325, -0.45, 0.0, 1.0), // 4
    vec4(0.0, -0.6, 0.0, 1.0),    // 5
    vec4(-0.325, -0.45, 0.0, 1.0),// 6
    vec4(-0.65, -0.3, 0.0, 1.0),  // 7
    vec4(-0.65, 0.3, 0.0, 1.0),   // 8
    vec4(-0.15, 0.5, 0.0, 1.0),   // 9
    vec4(0.0, -0.4, 0.25, 1.0),   // 10
    vec4(0.3, -0.2, 0.25, 1.0),   // 11
    vec4(0.3, 0.15, 0.25, 1.0),   // 12
    vec4(0.0, 0.0, 0.25, 1.0),    // 13 
    vec4(-0.3, 0.15, 0.25, 1.0),  // 14
    vec4(-0.3, -0.2, 0.25, 1.0),  // 15 

    vec4(0.0, 0.2, -0.25, 1.0),   // 16
    vec4(0.0, -0.4, -0.25, 1.0),  // 17
    vec4(0.3, -0.2, -0.25, 1.0),  // 18
    vec4(0.3, 0.15, -0.25, 1.0),  // 19
    vec4(0.0, 0.0, -0.25, 1.0),   // 20
    vec4(-0.3, 0.15, -0.25, 1.0), // 21
    vec4(-0.3, -0.2, -0.25, 1.0), // 22
];

// BUMPMAP FUNCTIONS
function createBumpMap(w, h, d) {
    var data = new Array()
    for (var i = 0; i <= w; i++) {
        data[i] = new Array();
        for (var j = 0; j <= h; j++) {
            data[i][j] = (Math.round(Math.random() * 255.0) % 2);
        }
    }

    for (var i = 0; i < w; i++) {
        for (var j = h / 2; j < h; j++) {
            for (var k = 0; k < d; k++) {
                data[i][j] = 0.0;
            }
        }
    }

    for (var i = w / 2; i < w; i++) {
        for (var j = 0; j < h; j++) {
            for (var k = 0; k < d; k++) {
                data[i][j] = 0.0;
            }
        }
    }

    var normalst = new Array()
    for (var i = 0; i < w; i++) {
        normalst[i] = new Array();
        for (var j = 0; j < h; j++) {
            normalst[i][j] = new Array();

            normalst[i][j][0] = data[i][j] - data[i + 1][j];
            normalst[i][j][1] = data[i][j] - data[i][j + 1];
            normalst[i][j][2] = 1;

            var app = 0;
            for (k = 0; k < d; k++) {
                app += normalst[i][j][k] * normalst[i][j][k];
            }
            app = Math.sqrt(app);
            for (k = 0; k < d; k++) {
                normalst[i][j][k] = 0.5 * normalst[i][j][k] / app + 0.5;
            }
        }
    }

    var normals = new Uint8Array(3 * w * h);
    for (var i = 0; i < w; i++) {
        for (var j = 0; j < h; j++) {
            for (var k = 0; k < d; k++) {
                normals[d * w * i + d * j + k] = 255 * normalst[i][j][k];
            }
        }
    }

    return normals;
}
function configureBumpMap(image, w, h) {
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, w, h, 0, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
}

// UTILITY FUNCTIONS
function norm(v) {
    return Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
}
function divV3(v, n){
    return vec3(v[0]/n, v[1]/n, v[2]/n)
}
function mulV3(v, n){
    return vec3(v[0]*n, v[1]*n, v[2]*n)
}

// FUNCTIONS USED TO COMPUTE THE BARYCENTER
function triBary(shape, a, b, c, coords){
    var t1 = subtract(shape.vertices[a], shape.vertices[b]);
    var t2 = subtract(shape.vertices[b], shape.vertices[c]);

    shape.baryPos.push( divV3(add(add(shape.vertices[a],shape.vertices[b]),shape.vertices[c]), 3.0) );
    shape.baryWei.push( 0.5*norm(cross(t1, t2)) );

    tri(shape, a, b, c, coords);
}
function quadBary(shape, a, b, c, d, coords){
    var t1 = subtract(shape.vertices[a], shape.vertices[b]);
    var t2 = subtract(shape.vertices[b], shape.vertices[c]);
    var t3 = subtract(shape.vertices[d], shape.vertices[b]);
    var t4 = subtract(shape.vertices[d], shape.vertices[c]);

    shape.baryPos.push( divV3(add(add(shape.vertices[a],shape.vertices[b]),add(shape.vertices[c], shape.vertices[d])), 4.0) );
    shape.baryWei.push( 0.5*norm(cross(t1, t2)) + 0.5*norm(cross(t3, t4)));

    quad(shape, a, b, c, d, coords);
}

// FUNCTIONS USED TO BUILD A TRIANGLES AND QUADS
function tri(shape, a, b, c, coords) {
    shape.numPositions += 3;
    var t1 = subtract(shape.vertices[b], shape.vertices[a]);
    var t2 = subtract(shape.vertices[c], shape.vertices[b]);
    var normal = normalize(cross(t1, t2));
    normal = vec4(normal[0], normal[1], normal[2], 0.0);
    var tangent = vec4(t1[0], t1[1], t1[2], 0.0);

    shape.positionsArray.push(shape.vertices[a]);
    shape.normalsArray.push(normal);
    shape.colorsArray.push(shape.color);
    shape.texCoordsArray.push(shape.texCoord[coords[0]]);
    shape.tangentsArray.push(tangent);

    shape.positionsArray.push(shape.vertices[b]);
    shape.normalsArray.push(normal);
    shape.colorsArray.push(shape.color);
    shape.texCoordsArray.push(shape.texCoord[coords[1]]);
    shape.tangentsArray.push(tangent);

    shape.positionsArray.push(shape.vertices[c]);
    shape.normalsArray.push(normal);
    shape.colorsArray.push(shape.color);
    shape.texCoordsArray.push(shape.texCoord[coords[2]]);
    shape.tangentsArray.push(tangent);
}
function quad(shape, a, b, c, d, coords) {
    shape.numPositions += 6;
    var t1 = subtract(shape.vertices[b], shape.vertices[a]);
    var t2 = subtract(shape.vertices[c], shape.vertices[b]);
    var normal = normalize(cross(t1, t2));
    normal = vec4(normal[0], normal[1], normal[2], 0.0);
    var tangent = vec4(t1[0], t1[1], t1[2], 0.0);

    shape.positionsArray.push(shape.vertices[a]);
    shape.normalsArray.push(normal);
    shape.colorsArray.push(shape.color);
    shape.texCoordsArray.push(shape.texCoord[coords[0]]);
    shape.tangentsArray.push(tangent);

    shape.positionsArray.push(shape.vertices[b]);
    shape.normalsArray.push(normal);
    shape.colorsArray.push(shape.color);
    shape.texCoordsArray.push(shape.texCoord[coords[1]]);
    shape.tangentsArray.push(tangent);

    shape.positionsArray.push(shape.vertices[c]);
    shape.normalsArray.push(normal);
    shape.colorsArray.push(shape.color);
    shape.texCoordsArray.push(shape.texCoord[coords[2]]);
    shape.tangentsArray.push(tangent);

    shape.positionsArray.push(shape.vertices[a]);
    shape.normalsArray.push(normal);
    shape.colorsArray.push(shape.color);
    shape.texCoordsArray.push(shape.texCoord[coords[0]]);
    shape.tangentsArray.push(tangent);

    shape.positionsArray.push(shape.vertices[c]);
    shape.normalsArray.push(normal);
    shape.colorsArray.push(shape.color);
    shape.texCoordsArray.push(shape.texCoord[coords[2]]);
    shape.tangentsArray.push(tangent);

    shape.positionsArray.push(shape.vertices[d]);
    shape.normalsArray.push(normal);
    shape.colorsArray.push(shape.color);
    shape.texCoordsArray.push(shape.texCoord[coords[3]]);
    shape.tangentsArray.push(tangent);
}

// FUNCTIONS USED TO BUILD A CYLINDER
var construcCylinderF = function construcCylinder(shape) {
    var triCoords = [4, 5, 6];
    var quadCoords = [4, 5, 6, 7];
    tri(shape, 0, 1, 8, triCoords);
    tri(shape, 0, 2, 1, triCoords);
    tri(shape, 0, 3, 2, triCoords);
    tri(shape, 0, 4, 3, triCoords);
    tri(shape, 0, 5, 4, triCoords);
    tri(shape, 0, 6, 5, triCoords);
    tri(shape, 0, 7, 6, triCoords);
    tri(shape, 0, 8, 7, triCoords);

    tri(shape, 9, 10, 17, triCoords);
    tri(shape, 9, 11, 10, triCoords);
    tri(shape, 9, 12, 11, triCoords);
    tri(shape, 9, 13, 12, triCoords);
    tri(shape, 9, 14, 13, triCoords);
    tri(shape, 9, 15, 14, triCoords);
    tri(shape, 9, 16, 15, triCoords);
    tri(shape, 9, 17, 16, triCoords);

    quad(shape, 8, 17, 10, 1, quadCoords);
    quad(shape, 1, 10, 11, 2, quadCoords);
    quad(shape, 2, 11, 12, 3, quadCoords);
    quad(shape, 3, 12, 13, 4, quadCoords);
    quad(shape, 4, 13, 14, 5, quadCoords);
    quad(shape, 5, 14, 15, 6, quadCoords);
    quad(shape, 6, 15, 16, 7, quadCoords);
    quad(shape, 7, 16, 17, 8, quadCoords);
}
// FUNCTIONS USED TO BUILD MY SHAPE
var constructMyShapeF = function constructMyShape(shape) {
    var triCoords = [0, 1, 2];
    var quadCoords = [0, 1, 2, 3];
    triBary(shape, 0, 12, 1, triCoords);
    triBary(shape, 12, 2, 1, triCoords);
    triBary(shape, 2, 12, 3, triCoords);
    triBary(shape, 3, 12, 11, triCoords);
    triBary(shape, 3, 11, 4, triCoords);
    triBary(shape, 4, 11, 10, triCoords);
    triBary(shape, 5, 4, 10, triCoords);
    triBary(shape, 10, 6, 5, triCoords);
    triBary(shape, 10, 15, 6, triCoords);
    triBary(shape, 6, 15, 7, triCoords);
    triBary(shape, 7, 15, 14, triCoords);
    triBary(shape, 7, 14, 8, triCoords);
    triBary(shape, 14, 9, 8, triCoords);
    triBary(shape, 9, 14, 0, triCoords);
    triBary(shape, 14, 13, 0, triCoords);
    triBary(shape, 0, 13, 12, triCoords);

    triBary(shape, 0, 16, 9, triCoords);
    triBary(shape, 0, 1, 16, triCoords);

    triBary(shape, 16, 1, 19, triCoords);
    triBary(shape, 1, 2, 19, triCoords);
    triBary(shape, 2, 3, 19, triCoords);
    triBary(shape, 3, 18, 19, triCoords);
    triBary(shape, 3, 4, 18, triCoords);
    triBary(shape, 4, 17, 18, triCoords);
    triBary(shape, 5, 17, 4, triCoords);
    triBary(shape, 5, 6, 17, triCoords);
    triBary(shape, 6, 22, 17, triCoords);
    triBary(shape, 6, 7, 22, triCoords);
    triBary(shape, 7, 21, 22, triCoords);
    triBary(shape, 7, 8, 21, triCoords);
    triBary(shape, 8, 9, 21, triCoords);
    triBary(shape, 9, 16, 21, triCoords);
    triBary(shape, 21, 16, 20, triCoords);
    triBary(shape, 16, 19, 20, triCoords);

    quadBary(shape, 19, 18, 11, 12, quadCoords);
    quadBary(shape, 18, 17, 10, 11, quadCoords);
    quadBary(shape, 17, 22, 15, 10, quadCoords);
    quadBary(shape, 22, 21, 14, 15, quadCoords);
    quadBary(shape, 21, 20, 13, 14, quadCoords);
    quadBary(shape, 20, 19, 12, 13, quadCoords);

    var appBaryPos = vec3(0.0, 0.0, 0.0);
    for(var i in shape.baryPos){
        appBaryPos = add(appBaryPos, mulV3(shape.baryPos[i], shape.baryWei[i]));
    }
    shape.finalBaryPos = vec4(appBaryPos[0], appBaryPos[1], appBaryPos[2], 1.0);
}

// USEFUL CLASSES
class Shape {
    numPositions = 0;

    positionsArray = [];
    normalsArray = [];
    colorsArray = [];
    texCoordsArray = [];
    tangentsArray = [];

    baryPos = [];
    baryWei = [];
    finalBaryPos = vec4(0.0, 0.0, 0.0, 1.0);

    vertices = [];
    texCoord = [];
    color;
    emission;

    constructFunction;

    movePoints(position, rotation) {
        var rotationMatrix = mat4();
        rotationMatrix = mult(rotationMatrix, rotate(rotation[0], vec3(1, 0, 0)));
        rotationMatrix = mult(rotationMatrix, rotate(rotation[1], vec3(0, 1, 0)));
        rotationMatrix = mult(rotationMatrix, rotate(rotation[2], vec3(0, 0, 1)));
        rotationMatrix[0][3] = position[0];
        rotationMatrix[1][3] = position[1];
        rotationMatrix[2][3] = position[2];
        rotationMatrix[3][3] = 1.0;

        for(var i in this.positionsArray){
            this.positionsArray[i] = mult(rotationMatrix, this.positionsArray[i]);
        }
        this.finalBaryPos = mult(rotationMatrix, this.finalBaryPos);
    }

    constructor(vertices, texCoord, color, constructFunction, position, rotation, emission) {
        this.vertices = vertices;
        this.texCoord = texCoord;
        this.color = color;
        this.constructFunction = constructFunction

        this.emission = emission;

        this.constructFunction(this);
        this.movePoints(position, rotation);
    }
}
class Light {
    position;
    ambient;
    diffuse;
    specular;

    constructor(position, ambient, diffuse, specular) {
        this.position = position;
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
    }
}
class Material {
    ambient;
    diffuse;
    specular;
    shininess;

    constructor(ambient, diffuse, specular, shininess) {
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.shininess = shininess;
    }
}
class Scene {
    shapes = [];
    materials = [];
    lights = [];

    addShape(shape) {
        this.shapes.push(shape);
    }
    addMaterial(material) {
        this.materials.push(material);
    }
    addLight(light) {
        this.lights.push(light);
    }

    constructBuffers() {
        numPositions = 0;
        var colorsArray = [];
        var texCoordsArray = [];
        var emissionsArray = [];
        var positionsArray = [];
        var normalsArray = [];
        var tangentsArray = [];

        for (var i in this.shapes) {
            numPositions += this.shapes[i].numPositions;

            for (var j in this.shapes[i].colorsArray) {
                colorsArray.push(this.shapes[i].colorsArray[j]);

                emissionsArray.push(this.shapes[i].emission);
            }
            for (var j in this.shapes[i].texCoordsArray) {
                texCoordsArray.push(this.shapes[i].texCoordsArray[j]);
            }
    
            for (var j in this.shapes[i].positionsArray) {
                positionsArray.push(this.shapes[i].positionsArray[j]);
            }
            for (var j in this.shapes[i].normalsArray) {
                normalsArray.push(this.shapes[i].normalsArray[j]);
            }
            for (var j in this.shapes[i].tangentsArray) {
                tangentsArray.push(this.shapes[i].tangentsArray[j]);
            }
        }

        var cBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);
        var colorLoc = gl.getAttribLocation(program, "aColor");
        gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(colorLoc);

        var tBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);
        var texCoordLoc = gl.getAttribLocation(program, "aTexCoord");
        gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(texCoordLoc);

        var eBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, eBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(emissionsArray), gl.STATIC_DRAW);
        var emissionLoc = gl.getAttribLocation(program, "aEmissions");
        gl.vertexAttribPointer(emissionLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(emissionLoc);

        var vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);
        var positionLoc = gl.getAttribLocation(program, "aPosition");
        gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLoc);

        var nBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);
        var normalLoc = gl.getAttribLocation(program, "aNormal");
        gl.vertexAttribPointer(normalLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(normalLoc);

        var sBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(tangentsArray), gl.STATIC_DRAW);
        var tangentLoc = gl.getAttribLocation(program, "aTangent");
        gl.vertexAttribPointer(tangentLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(tangentLoc);
    }

    setMaterialsAndLights() {
        gl.uniform4fv(gl.getUniformLocation(program, "uLightPositions1"), flatten(this.lights[0].position));
        gl.uniform4fv(gl.getUniformLocation(program, "uLightPositions2"), flatten(this.lights[1].position));
        gl.uniform4fv(gl.getUniformLocation(program, "uLightPositions3"), flatten(this.lights[1].position));

        gl.uniform4fv(gl.getUniformLocation(program, "uAmbientProducts"), flatten(mult(this.lights[0].ambient, this.materials[0].ambient)));
        gl.uniform4fv(gl.getUniformLocation(program, "uDiffuseProducts"), flatten(mult(this.lights[0].diffuse, this.materials[0].diffuse)));
        gl.uniform4fv(gl.getUniformLocation(program, "uSpecularProducts"), flatten(mult(this.lights[0].specular, this.materials[0].specular)));

        gl.uniform1f(gl.getUniformLocation(program, "uShininess"), this.materials[0].shininess);

        gl.uniform1i(gl.getUniformLocation(program, "uLightsFlag"), lightsFlag);
        gl.uniform1i(gl.getUniformLocation(program, "uTextureFlag"), textureFlag);
    }
}

//DEFINE THE SCENE
var numPositions = 0;
var aScene = new Scene();

//DEFINE THE CYLINDER
var cylinderPosition = vec4(0.0, 0.0, 2.5, 1.0);
var cylinderRotation = vec3(0.0, 0.0, 0.0);
var cylinderEmission = vec4(5.0, 5.0, 5.0, 1.0);
var cylinder = new Shape(verticesCylinder, texCoord, vertexColors[9],
    construcCylinderF, cylinderPosition, cylinderRotation, cylinderEmission);

//DEFINE MY SHAPE
var myShapePosition = vec4(0.0, 0.0, 0.0, 1.0);
var myShapeRotation = vec3(0.0, 0.0, 0.0);
var myShapeEmission = vec4(1.0, 1.0, 1.0, 1.0);
var myShape = new Shape(verticesMyShape, texCoord, vertexColors[10],
    constructMyShapeF, myShapePosition, myShapeRotation, myShapeEmission);

//DEFINE LIGHTS
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var Light1 = new Light(add(cylinder.finalBaryPos, vec4(0.0, 0.5, 0.0, 1.0)),
                    lightAmbient, lightDiffuse, lightSpecular);
var Light2 = new Light(cylinder.finalBaryPos,
                    lightAmbient, lightDiffuse, lightSpecular);
var Light3 = new Light(add(cylinder.finalBaryPos, vec4(0.0, -0.5, 0.0, 1.0)),
                    lightAmbient, lightDiffuse, lightSpecular);

//DEFINE MATERIAL
var material = new Material(vec4(0.2, 0.2, 0.2, 1.0),
    vec4(0.7, 0.7, 0.7, 1.0),
    vec4(0.7, 0.7, 0.7, 1.0),
    2000.0);

// ADD SHAPES, MATERIAL AND LIGHTS TO THE SCENE
aScene.addShape(myShape);
aScene.addShape(cylinder);

aScene.addMaterial(material);
aScene.addLight(Light1);
aScene.addLight(Light2);
aScene.addLight(Light3);

//DEFINE CONSTANTS
    //model view
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

    //prospective
var near;
var far;
var radius;
var theta;
var phi;
var fovy;
var aspect;

    //light flag
var lightsFlag = true;

    //texture
var texSize = 64;
var textureFlag = false;
var w = texSize * 2;
var h = texSize * 2;

    //my shape rotation
var rotateXFlag = false;
var rotateYFlag = false;
var rotateZFlag = false;

var rMyShape = vec3(0.0, 0.0, 0.0);
var stepMyShape = vec3(0.0, 0.0, 0.0);
var positionMyShape = vec3(0.0, 0.0, 0.0);

    //switch program
var switchProgram = false;
var program;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");


    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.5, 0.5, 0.7, 1.0);

    gl.enable(gl.DEPTH_TEST);

    program = initShaders(gl, "PV-vertex-shader", "PV-fragment-shader");
    gl.useProgram(program);

    document.getElementById("switchProgram").onclick = function () {
        switchProgram = !switchProgram;
        if (switchProgram) {
            program = initShaders(gl, "PF-vertex-shader", "PF-fragment-shader");
            document.getElementById("switchProgramSpan").innerHTML = "Fragment";
        } else {
            program = initShaders(gl, "PV-vertex-shader", "PV-fragment-shader");
            document.getElementById("switchProgramSpan").innerHTML = "Vertex";
        }
        gl.useProgram(program);
        aScene.constructBuffers();
        aScene.setMaterialsAndLights();
    };

    configureBumpMap(createBumpMap(w, h, 3), w, h);

    near = parseFloat(document.getElementById("zNearSlider").value);
    far = parseFloat(document.getElementById("zFarSlider").value);
    radius = parseFloat(document.getElementById("radiusSlider").value);
    theta = parseFloat(document.getElementById("thetaSlider").value) * Math.PI / 180.0;
    phi = parseFloat(document.getElementById("phiSlider").value) * Math.PI / 180.0;
    fovy = parseFloat(document.getElementById("fovSlider").value);
    aspect = parseFloat(document.getElementById("aspectSlider").value);
    document.getElementById("zNearSlider").onchange = function (event) { near = parseFloat(event.target.value); };
    document.getElementById("zFarSlider").onchange = function (event) { far = parseFloat(event.target.value); };
    document.getElementById("radiusSlider").onchange = function (event) { radius = parseFloat(event.target.value); };
    document.getElementById("thetaSlider").onchange = function (event) { theta = parseFloat(event.target.value) * Math.PI / 180.0; };
    document.getElementById("phiSlider").onchange = function (event) { phi = parseFloat(event.target.value) * Math.PI / 180.0; };
    document.getElementById("fovSlider").onchange = function (event) { fovy = parseFloat(event.target.value); };
    document.getElementById("aspectSlider").onchange = function (event) { aspect = parseFloat(event.target.value); };

    document.getElementById("lightsFlag").onclick = function () {
        lightsFlag = !lightsFlag;
        gl.uniform1i(gl.getUniformLocation(program, "uLightsFlag"), lightsFlag);
        switchButton(document.getElementById("lightsFlagSpan"), lightsFlag);
    };
    document.getElementById("textureFlag").onclick = function () {
        textureFlag = !textureFlag;
        gl.uniform1i(gl.getUniformLocation(program, "uTextureFlag"), textureFlag);
        switchButton(document.getElementById("textureFlagSpan"), textureFlag);
    };

    stepMyShape[0] = parseFloat(document.getElementById("rMyShapeX").value);
    stepMyShape[1] = parseFloat(document.getElementById("rMyShapeY").value);
    stepMyShape[2] = parseFloat(document.getElementById("rMyShapeZ").value);
    positionMyShape[0] = parseFloat(document.getElementById("pMyShapeX").value);
    positionMyShape[1] = parseFloat(document.getElementById("pMyShapeY").value);
    positionMyShape[2] = parseFloat(document.getElementById("pMyShapeZ").value);
    document.getElementById("rMyShapeX").onchange = function (event) {
        stepMyShape[0] = parseFloat(event.target.value);
    };
    document.getElementById("rMyShapeY").onchange = function (event) {
        stepMyShape[1] = parseFloat(event.target.value);
    };
    document.getElementById("rMyShapeZ").onchange = function (event) {
        stepMyShape[2] = parseFloat(event.target.value);
    };
    document.getElementById("pMyShapeX").onchange = function (event) {
        positionMyShape[0] = parseFloat(event.target.value);
    };
    document.getElementById("pMyShapeY").onchange = function (event) {
        positionMyShape[1] = parseFloat(event.target.value);
    };
    document.getElementById("pMyShapeZ").onchange = function (event) {
        positionMyShape[2] = parseFloat(event.target.value);
    };

    document.getElementById("rotateXFlag").onclick = function (event) {
        rotateXFlag = event.target.checked;
    };
    document.getElementById("rotateYFlag").onclick = function (event) {
        rotateYFlag = event.target.checked;
    };
    document.getElementById("rotateZFlag").onclick = function (event) {
        rotateZFlag = event.target.checked;
    };

    aScene.constructBuffers();
    aScene.setMaterialsAndLights();

    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    eye = vec3(radius * Math.sin(phi),
        radius * Math.sin(theta),
        radius * Math.cos(phi));

    var modelViewMatrix = lookAt(eye, at, up);
    var projectionMatrix = perspective(fovy, aspect, near, far);
    var nMatrix = normalMatrix(modelViewMatrix, true);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModelViewMatrix"), false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "uProjectionMatrix"), false, flatten(projectionMatrix));
    gl.uniformMatrix3fv(gl.getUniformLocation(program, "uNormalMatrix"), false, flatten(nMatrix));

    var rotationMatrixC = mat4();
    var rotationMatrixH = mat4();
    if(rotateXFlag){
        rMyShape[0] = (rMyShape[0] + 0.01 * (stepMyShape[0])) % (360);
    } else {
        rMyShape[0] = stepMyShape[0];
    }
    if(rotateYFlag){
        rMyShape[1] = (rMyShape[1] + 0.01 * (stepMyShape[1])) % (360);
    } else {
        rMyShape[1] = stepMyShape[1];
    }
    if(rotateZFlag){
        rMyShape[2] = (rMyShape[2] + 0.01 * (stepMyShape[2])) % (360);
    } else {
        rMyShape[2] = stepMyShape[2];
    }

    rotationMatrixH = mult(rotationMatrixH, rotate(rMyShape[0], vec3(1, 0, 0)));
    rotationMatrixH = mult(rotationMatrixH, rotate(rMyShape[1], vec3(0, 1, 0)));
    rotationMatrixH = mult(rotationMatrixH, rotate(rMyShape[2], vec3(0, 0, 1)));
    rotationMatrixH[0][3] = positionMyShape[0];
    rotationMatrixH[1][3] = positionMyShape[1];
    rotationMatrixH[2][3] = positionMyShape[2];
    rotationMatrixH[3][3] = 1.0;
    
    rotationMatrixH = mult(translate(myShape.finalBaryPos[0], myShape.finalBaryPos[1], myShape.finalBaryPos[2]), rotationMatrixH);
    rotationMatrixH = mult(rotationMatrixH, translate(-myShape.finalBaryPos[0], -myShape.finalBaryPos[1], -myShape.finalBaryPos[2]));

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "uRotationMatrix"), false, flatten(rotationMatrixH));
    gl.drawArrays(gl.TRIANGLES, 0, myShape.numPositions);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "uRotationMatrix"), false, flatten(rotationMatrixC));
    gl.drawArrays(gl.TRIANGLES, myShape.numPositions, numPositions);

    requestAnimationFrame(render);
}

// UTILITY FUNCTIONS
function switchButton(element, flag) {
    if(flag){
        element.innerHTML = "✔";
        element.classList = "flagTrue";
    } else {
        element.innerHTML = "🗙";
        element.classList = "flagFalse";
    }
}
function resetSlider(eName, eValue) {
    var elem = document.getElementById(eName);
    elem.value = eValue;
    elem.dispatchEvent(new Event('change', { value: eValue, bubbles: true }));
}
function resetRotationMyShape() {
    resetSlider('rMyShapeX', 0.0);
    resetSlider('rMyShapeY', 0.0);
    resetSlider('rMyShapeZ', 0.0);
    rMyShape = vec3(0.0, 0.0, 0.0);
    stepMyShape = vec3(0.0, 0.0, 0.0);
}
function resetPositionMyShape() {
    resetSlider('pMyShapeX', 0.0);
    resetSlider('pMyShapeY', 0.1);
    resetSlider('pMyShapeZ', -1.0);
    positionMyShape = vec3(0.0, 0.1, -1.0);
}
function resetView() {
    resetSlider('zNearSlider', 1);
    resetSlider('zFarSlider', 12);
    resetSlider('radiusSlider', 4);
    resetSlider('thetaSlider', 20);
    resetSlider('phiSlider', 0);
    resetSlider('fovSlider', 45);
    resetSlider('aspectSlider', 1);
}
