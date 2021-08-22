"use strict";

var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;
var rotationMatrix;
var nMatrix;
var instanceMatrix;

var modelViewMatrixLoc;
var rotationMatrixLoc;

var eyeModelView = vec3(0.0, 0.0, 0.0);
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var near;
var far;
var radius;
var thetas;
var phi;
var fovy;
var aspect;

var mouseRot = [0.0, 0.0];

var vertices = [
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0)
];

var bodyPos = [0, 5.2, 0];

var torsoId = 0;
var torso1Id = 0;
var torso2Id = 1;
var torso3Id = 2;
var headId = 3;
var head1Id = 3;
var head2Id = 4;
var head3Id = 5;

var leftUpperArmId = 6;
var leftLowerArmId = 7;
var rightUpperArmId = 8;
var rightLowerArmId = 9;
var leftUpperLegId = 10;
var leftLowerLegId = 11;
var rightUpperLegId = 12;
var rightLowerLegId = 13;

var tailId = 14;

var fence1Id = 15;
var fence2Id = 16;
var fence3Id = 17;
var fence4Id = 18;
var fence5Id = 19;
var fence6Id = 20;
var fence7Id = 21;

var grassId = 22;

var lightId = 23;

var torsoDim = [5.0, 5.0, 10.0];
var headDim = [3.0, 3.0, 3.0];

var upperArmDim = [2.0, 3.5, 2.0];
var upperLegDim = [2.0, 3.5, 2.0];

var lowerArmDim = [1.65, 2.75, 1.65];
var lowerLegDim = [1.65, 2.75, 1.65];

var tailDim = [1.25, 2.0, 1.25];

var fenceStickDim = [2.5, 10.0, 2.5];
var fenceWallDim = [2.0, 7.5, 20.5];

var grassDim = [120.0, 0.1, 120.0];

var lightDim = [7.5, 7.5, 7.5];

var numNodes = 24;

var theta = [
    0      /*0 torso1Id*/,         0      /*1 torso2Id*/,         0      /*2 torso3Id*/,
    0      /*3 headId*/,           0      /*4 head2Id*/,          0      /*5 head3Id*/,
    -180   /*6 leftUpperArmId*/,   0      /*7 leftLowerArmId*/,
    -180   /*8 rightUpperArmId*/,  0      /*9 rightLowerArmId*/,
    -180   /*10 leftUpperLegId*/,  0      /*11 leftLowerLegId*/,
    -180   /*12 rightUpperLegId*/, 0      /*13 rightLowerLegId*/,
    0      /*14 tailId*/,

    0  /*15 fence1Id*/, 0  /*16 fence2Id*/, 0  /*17 fence3Id*/, 0  /*18 fence4Id*/,
    0  /*19 fence5Id*/, 0  /*20 fence6Id*/, 0  /*21 fence7Id*/
];

var stack = [];
var figure = [];

for (var i = 0; i < numNodes; i++) figure[i] = createNode(null, null, null, null);

var pointsArray = [];
var texCoordsArray = [];
var normalsArray = [];
var tangentsArray = [];

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

function configureTexture(image, name, num) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.uniform1i(gl.getUniformLocation(program, name), num);
    return texture
}

var lightPosition = vec4(20.0, 40.0, 40.0, 1.0);
var lightAmbient = vec4(1.4, 1.4, 1.4, 1.0);
var lightDiffuse = vec4(1.4, 1.4, 1.4, 1.0);
var lightSpecular = vec4(0.0, 0.0, 0.0, 1.0);

var materialAmbient = vec4(0.3, 0.3, 0.3, 1.0);
var materialDiffuse = vec4(0.8, 0.8, 0.8, 1.0);
var materialSpecular = vec4(0.1, 0.1, 0.1, 1.0);
var materialShininess = 2.0;

var animationInterval;

function scale4(a, b, c) {
    var result = mat4();
    result[0] = a;
    result[5] = b;
    result[10] = c;
    return result;
}

function createNode(transform, render, sibling, child) {
    var node = {
        transform: transform,
        render: render,
        sibling: sibling,
        child: child,
    };
    return node;
}

function initNodes(Id) {
    var appMat = mat4();

    switch (Id) {
        case torsoId:
        case torso1Id:
        case torso2Id:
        case torso3Id:
            appMat = translate(bodyPos[0], bodyPos[1], bodyPos[2]);
            appMat = mult(appMat, rotate(theta[torso1Id], vec3(1, 0, 0)));
            appMat = mult(appMat, rotate(theta[torso2Id], vec3(0, 1, 0)));
            appMat = mult(appMat, rotate(theta[torso3Id], vec3(0, 0, 1)));
            figure[torsoId] = createNode(appMat, torso, null, headId);
            break;

        case headId:
        case head1Id:
        case head2Id:
        case head3Id:
            appMat = appMat = translate(0.0, torsoDim[0] + 0.2*headDim[1], 0.5*torsoDim[2] + 0.1*headDim[2]);
            appMat = mult(appMat, rotate(theta[head1Id], vec3(1, 0, 0)));
            appMat = mult(appMat, rotate(theta[head2Id], vec3(0, 1, 0)));
            appMat = mult(appMat, rotate(theta[head3Id], vec3(0, 0, 1)));
            appMat = mult(appMat, translate(0.0, -0.5 * headDim[1], 0.0));
            figure[headId] = createNode(appMat, head, leftUpperArmId, null);
            break;

        case leftUpperArmId:
            appMat = translate(-0.5*torsoDim[0] + 0.6*upperArmDim[0], 0.2*upperArmDim[1], 0.5*torsoDim[2] - 0.7*upperArmDim[2]);
            appMat = mult(appMat, rotate(theta[leftUpperArmId], vec3(1, 0, 0)));
            figure[leftUpperArmId] = createNode(appMat, leftUpperArm, rightUpperArmId, leftLowerArmId);
            break;

        case rightUpperArmId:
            appMat = translate(0.5*torsoDim[0] - 0.6*upperArmDim[0], 0.2 * upperArmDim[1], 0.5*torsoDim[2] - 0.7*upperArmDim[2]);
            appMat = mult(appMat, rotate(theta[rightUpperArmId], vec3(1, 0, 0)));
            figure[rightUpperArmId] = createNode(appMat, rightUpperArm, leftUpperLegId, rightLowerArmId);
            break;

        case leftUpperLegId:
            appMat = translate(-0.5*torsoDim[0] + 0.6*upperLegDim[0], 0.2*upperLegDim[1], -0.5*torsoDim[2] + 0.7*upperLegDim[2]);
            appMat = mult(appMat, rotate(theta[leftUpperLegId], vec3(1, 0, 0)));
            figure[leftUpperLegId] = createNode(appMat, leftUpperLeg, rightUpperLegId, leftLowerLegId);
            break;

        case rightUpperLegId:
            appMat = translate(0.5*torsoDim[0] - 0.6*upperLegDim[0], 0.2 * upperLegDim[1], -0.5*torsoDim[2] + 0.7*upperLegDim[2]);
            appMat = mult(appMat, rotate(theta[rightUpperLegId], vec3(1, 0, 0)));
            figure[rightUpperLegId] = createNode(appMat, rightUpperLeg, tailId, rightLowerLegId);
            break;

        case leftLowerArmId:
            appMat = translate(0.0, 0.9*upperArmDim[1], 0.0);
            appMat = mult(appMat, rotate(theta[leftLowerArmId], vec3(1, 0, 0)));
            figure[leftLowerArmId] = createNode(appMat, leftLowerArm, null, null);
            break;

        case rightLowerArmId:
            appMat = translate(0.0,  0.9*upperArmDim[1], 0.0);
            appMat = mult(appMat, rotate(theta[rightLowerArmId], vec3(1, 0, 0)));
            figure[rightLowerArmId] = createNode(appMat, rightLowerArm, null, null);
            break;

        case leftLowerLegId:
            appMat = translate(0.0,  0.9*upperLegDim[1], 0.0);
            appMat = mult(appMat, rotate(theta[leftLowerLegId], vec3(1, 0, 0)));
            figure[leftLowerLegId] = createNode(appMat, leftLowerLeg, null, null);
            break;

        case rightLowerLegId:
            appMat = translate(0.0,  0.9*upperLegDim[1], 0.0);
            appMat = mult(appMat, rotate(theta[rightLowerLegId], vec3(1, 0, 0)));
            figure[rightLowerLegId] = createNode(appMat, rightLowerLeg, null, null);
            break;
        
        case tailId:
            appMat = translate(0.0, 0.5*torsoDim[1], -0.5*torsoDim[2]);
            appMat = mult(appMat, rotate(theta[tailId], vec3(1, 0, 0)));
            figure[tailId] = createNode(appMat, tail, null, null);
            break;
        
        case fence1Id:
            appMat = translate(0.0, 0.0, (1.5*fenceWallDim[2] + fenceStickDim[2]));
            figure[fence1Id] = createNode(appMat, fence1, fence2Id, null);
            break;

        case fence2Id:
            appMat = translate(0.0, 0.0, (fenceWallDim[2] + 0.5*fenceStickDim[2]));
            figure[fence2Id] = createNode(appMat, fence2, fence3Id, null);
            break;
        
        case fence3Id:
            appMat = translate(0.0, 0.0, 0.5*(fenceWallDim[2] + fenceStickDim[2]));
            figure[fence3Id] = createNode(appMat, fence3, fence4Id, null);
            break;
        
        case fence4Id:
            appMat = translate(0.0, 0.0, 0.0);
            figure[fence4Id] = createNode(appMat, fence4, fence5Id, null);
            break;
        
        case fence5Id:
            appMat = translate(0.0, 0.0, -0.5*(fenceWallDim[2] + fenceStickDim[2]));
            figure[fence5Id] = createNode(appMat, fence5, fence6Id, null);
            break;
        
        case fence6Id:
            appMat = translate(0.0, 0.0, -(fenceWallDim[2] + 0.5*fenceStickDim[2]));
            figure[fence6Id] = createNode(appMat, fence6, fence7Id, null);
            break;
        
        case fence7Id:
            appMat = translate(0.0, 0.0, -(1.5*fenceWallDim[2] + fenceStickDim[2]));
            figure[fence7Id] = createNode(appMat, fence7, null, null);
            break;
        
        case grassId:
            appMat = translate(0.0, 0.0, 0.0);
            figure[grassId] = createNode(appMat, grass, null, null);
            break;

        case lightId:
            appMat = translate(0.0, 0.0, 0.0);
            figure[lightId] = createNode(appMat, light, null, null);
            break;
    }
}

var rotMat = mat4();
function traverse(Id) {
    if (Id == null) return;
    stack.push(rotMat);
    rotMat = mult(rotMat, figure[Id].transform);
    figure[Id].render();
    if (figure[Id].child != null) traverse(figure[Id].child);
    rotMat = stack.pop();
    if (figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function torso() {
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapWoolFlag"), true);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapHeadFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapFenceFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapGrassFlag"), false);

    instanceMatrix = mult(rotMat, translate(0.0, 0.5*torsoDim[1], 0.0));
    instanceMatrix = mult(instanceMatrix, scale(torsoDim[0], torsoDim[1], torsoDim[2]));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function head() {
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapFenceFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapGrassFlag"), false);

    instanceMatrix = mult(rotMat, translate(0.0, 0.5*headDim[1], 0.0));
    instanceMatrix = mult(instanceMatrix, scale(headDim[0], headDim[1], headDim[2]));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));

    gl.uniform1f( gl.getUniformLocation(program, "uTexMapWoolFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapHeadFlag"), true);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    gl.uniform1f( gl.getUniformLocation(program, "uTexMapWoolFlag"), true);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapHeadFlag"), false);
    for (var i = 1; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function leftUpperArm() {
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapWoolFlag"), true);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapHeadFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapFenceFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapGrassFlag"), false);

    instanceMatrix = mult(rotMat, translate(0.0, 0.5*upperArmDim[1], 0.0));
    instanceMatrix = mult(instanceMatrix, scale(upperArmDim[0], upperArmDim[1], upperArmDim[2]));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function leftLowerArm() {
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapWoolFlag"), true);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapHeadFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapFenceFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapGrassFlag"), false);

    instanceMatrix = mult(rotMat, translate(0.0, 0.5*lowerArmDim[1], 0.0));
    instanceMatrix = mult(instanceMatrix, scale(lowerArmDim[0], lowerArmDim[1], lowerArmDim[2]));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function rightUpperArm() {
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapWoolFlag"), true);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapHeadFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapFenceFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapGrassFlag"), false);

    instanceMatrix = mult(rotMat, translate(0.0, 0.5*upperArmDim[1], 0.0));
    instanceMatrix = mult(instanceMatrix, scale(upperArmDim[0], upperArmDim[1], upperArmDim[2]));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function rightLowerArm() {
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapWoolFlag"), true);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapHeadFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapFenceFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapGrassFlag"), false);

    instanceMatrix = mult(rotMat, translate(0.0, 0.5*lowerArmDim[1], 0.0));
    instanceMatrix = mult(instanceMatrix, scale(lowerArmDim[0], lowerArmDim[1], lowerArmDim[2]));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function leftUpperLeg() {
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapWoolFlag"), true);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapHeadFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapFenceFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapGrassFlag"), false);

    instanceMatrix = mult(rotMat, translate(0.0, 0.5 * upperLegDim[1], 0.0));
    instanceMatrix = mult(instanceMatrix, scale(upperLegDim[0], upperLegDim[1], upperLegDim[2]));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function leftLowerLeg() {
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapWoolFlag"), true);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapHeadFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapFenceFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapGrassFlag"), false);

    instanceMatrix = mult(rotMat, translate(0.0, 0.5 * lowerLegDim[1], 0.0));
    instanceMatrix = mult(instanceMatrix, scale(lowerLegDim[0], lowerLegDim[1], lowerLegDim[2]));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function rightUpperLeg() {
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapWoolFlag"), true);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapHeadFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapFenceFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapGrassFlag"), false);

    instanceMatrix = mult(rotMat, translate(0.0, 0.5 * upperLegDim[1], 0.0));
    instanceMatrix = mult(instanceMatrix, scale(upperLegDim[0], upperLegDim[1], upperLegDim[2]));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function rightLowerLeg() {
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapWoolFlag"), true);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapHeadFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapFenceFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapGrassFlag"), false);

    instanceMatrix = mult(rotMat, translate(0.0, 0.5 * lowerLegDim[1], 0.0));
    instanceMatrix = mult(instanceMatrix, scale(lowerLegDim[0], lowerLegDim[1], lowerLegDim[2]));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function tail() {
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapWoolFlag"), true);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapHeadFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapFenceFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapGrassFlag"), false);

    instanceMatrix = mult(rotMat, translate(0.0, 0.5 * torsoDim[1], 0.0));
    instanceMatrix = mult(instanceMatrix, scale(tailDim[0], tailDim[1], tailDim[2]));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function fence1() {
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapWoolFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapHeadFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapFenceFlag"), true);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapGrassFlag"), false);

    instanceMatrix = mult(rotMat, translate(0.0, 0.5 * fenceStickDim[1], 0.0));
    instanceMatrix = mult(instanceMatrix, scale(fenceStickDim[0], fenceStickDim[1], fenceStickDim[2]));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function fence2() {
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapWoolFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapHeadFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapFenceFlag"), true);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapGrassFlag"), false);

    instanceMatrix = mult(rotMat, translate(0.0, 0.5 * fenceWallDim[1], 0.0));
    instanceMatrix = mult(instanceMatrix, scale(fenceWallDim[0], fenceWallDim[1], fenceWallDim[2]));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function fence3() {
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapWoolFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapHeadFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapFenceFlag"), true);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapGrassFlag"), false);

    instanceMatrix = mult(rotMat, translate(0.0, 0.5 * fenceStickDim[1], 0.0));
    instanceMatrix = mult(instanceMatrix, scale(fenceStickDim[0], fenceStickDim[1], fenceStickDim[2]));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function fence4() {
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapWoolFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapHeadFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapFenceFlag"), true);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapGrassFlag"), false);

    instanceMatrix = mult(rotMat, translate(0.0, 0.5 * fenceWallDim[1], 0.0));
    instanceMatrix = mult(instanceMatrix, scale(fenceWallDim[0], fenceWallDim[1], fenceWallDim[2]));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function fence5() {
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapWoolFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapHeadFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapFenceFlag"), true);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapGrassFlag"), false);

    instanceMatrix = mult(rotMat, translate(0.0, 0.5 * fenceStickDim[1], 0.0));
    instanceMatrix = mult(instanceMatrix, scale(fenceStickDim[0], fenceStickDim[1], fenceStickDim[2]));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function fence6() {
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapWoolFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapHeadFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapFenceFlag"), true);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapGrassFlag"), false);

    instanceMatrix = mult(rotMat, translate(0.0, 0.5 * fenceWallDim[1], 0.0));
    instanceMatrix = mult(instanceMatrix, scale(fenceWallDim[0], fenceWallDim[1], fenceWallDim[2]));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function fence7() {
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapWoolFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapHeadFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapFenceFlag"), true);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapGrassFlag"), false);

    instanceMatrix = mult(rotMat, translate(0.0, 0.5 * fenceStickDim[1], 0.0));
    instanceMatrix = mult(instanceMatrix, scale(fenceStickDim[0], fenceStickDim[1], fenceStickDim[2]));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function grass() {
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapWoolFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapHeadFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapFenceFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapGrassFlag"), true);

    instanceMatrix = mult(rotMat, translate(0.0, -0.06, 0.0));
    instanceMatrix = mult(instanceMatrix, scale(grassDim[0], grassDim[1], grassDim[2]));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
}

function light(){
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapWoolFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapHeadFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapFenceFlag"), false);
    gl.uniform1f( gl.getUniformLocation(program, "uTexMapGrassFlag"), false);

    instanceMatrix = mult(rotMat, translate(lightPosition[0], lightPosition[1], lightPosition[2]));
    instanceMatrix = mult(instanceMatrix, scale(lightDim[0], lightDim[1], lightDim[2]));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function quad(a, b, c, d) {
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = normalize(cross(t1, t2));
    normal = vec4(normal[0], normal[1], normal[2], 0.0);
    var tangent = vec4(t1[0], t1[1], t1[2], 0.0);

    pointsArray.push(vertices[a]);
    texCoordsArray.push(texCoord[0]);
    normalsArray.push(normal);
    tangentsArray.push(tangent);

    pointsArray.push(vertices[b]);
    texCoordsArray.push(texCoord[1]);
    normalsArray.push(normal);
    tangentsArray.push(tangent);

    pointsArray.push(vertices[c]);
    texCoordsArray.push(texCoord[2]);
    normalsArray.push(normal);
    tangentsArray.push(tangent);

    pointsArray.push(vertices[d]);
    texCoordsArray.push(texCoord[3]);
    normalsArray.push(normal);
    tangentsArray.push(tangent);
}

function cube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) { alert("WebGL 2.0 isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.5, 0.75, 1.0, 1.0);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);

    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    rotationMatrixLoc = gl.getUniformLocation(program, "uRotationMatrix");

    var textureWool = configureTexture(document.getElementById("imageWool"), "uTexMapWool", 0);
    var textureHead = configureTexture(document.getElementById("imageHead"), "uTexMapHead", 1);
    var textureFence = configureTexture(document.getElementById("imageFence"), "uTexMapFence", 2);
    var textureGrass = configureTexture(document.getElementById("imageGrass"), "uTexMapGrass", 3);

    var bumpWool = configureTexture(document.getElementById("imageWoolBump"), "uBumpMapWool", 4);
    var bumpGrass = configureTexture(document.getElementById("imageGrassBump"), "uBumpMapGrass", 5);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureWool);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textureHead);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, textureFence);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, textureGrass);

    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_2D, bumpWool);
    gl.activeTexture(gl.TEXTURE5);
    gl.bindTexture(gl.TEXTURE_2D, bumpGrass);

    cube();

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);
    var texCoordLoc = gl.getAttribLocation(program, "aTexCoord");
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);

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

    gl.uniform4fv(gl.getUniformLocation(program, "uLightPositions"), flatten(lightPosition));
    gl.uniform4fv(gl.getUniformLocation(program, "uAmbientProducts"), flatten(mult(lightAmbient, materialAmbient)));
    gl.uniform4fv(gl.getUniformLocation(program, "uDiffuseProducts"), flatten(mult(lightDiffuse, materialDiffuse)));
    gl.uniform4fv(gl.getUniformLocation(program, "uSpecularProducts"), flatten(mult(lightSpecular, materialSpecular)));
    gl.uniform1f(gl.getUniformLocation(program, "uShininess"), materialShininess);

    var animationStart = false;
    document.getElementById("Start").onclick = function (event) {
        if (!animationStart){
            animationInterval = setInterval(function () {
                animation();
            }, 75);
            animationStart = true;
        }
    };
    document.getElementById("Stop").onclick = function (event) {
        clearInterval(animationInterval);
        animationStart = false;
    };
    document.getElementById("Reset").onclick = function (event) {
        window.location.reload();
    };

    for (i = 0; i < numNodes; i++) initNodes(i);

    near = parseFloat(document.getElementById("zNearSlider").value);
    far = parseFloat(document.getElementById("zFarSlider").value);
    radius = parseFloat(document.getElementById("radiusSlider").value);
    mouseRot[1] = parseFloat(document.getElementById("thetaSlider").value) * Math.PI / 180.0;
    mouseRot[0] = parseFloat(document.getElementById("phiSlider").value) * Math.PI / 180.0;
    fovy = parseFloat(document.getElementById("fovSlider").value);
    aspect = parseFloat(document.getElementById("aspectSlider").value);
    document.getElementById("zNearSlider").onchange = function (event) { near = parseFloat(event.target.value); };
    document.getElementById("zFarSlider").onchange = function (event) { far = parseFloat(event.target.value); };
    document.getElementById("radiusSlider").onchange = function (event) { radius = parseFloat(event.target.value); };
    document.getElementById("thetaSlider").onchange = function (event) { mouseRot[1] = parseFloat(event.target.value) * Math.PI / 180.0; };
    document.getElementById("phiSlider").onchange = function (event) { mouseRot[0] = parseFloat(event.target.value) * Math.PI / 180.0; };
    document.getElementById("fovSlider").onchange = function (event) { fovy = parseFloat(event.target.value); };
    document.getElementById("aspectSlider").onchange = function (event) { aspect = parseFloat(event.target.value); };

    var isMoving = false;
    var x = 0;
    var y = 0;
    canvas.addEventListener('mousedown', e => {
        x = e.offsetX;
        y = e.offsetY;
        isMoving = true;
    });
    canvas.addEventListener('mousemove', e => {
        if (isMoving === true) {
            mouseRot[0] = (mouseRot[0] - (e.offsetX - x)/100);
            mouseRot[1] = (mouseRot[1] + (e.offsetY - y)/100);

            if (mouseRot[0] > Math.PI)
                mouseRot[0] = -Math.PI;
            else if (mouseRot[0] < -Math.PI)
                mouseRot[0] = Math.PI;
            
            if (mouseRot[1] > 0.5*Math.PI)
                mouseRot[1] = 0.5*Math.PI;
            else if (mouseRot[1] < -0.5*Math.PI)
                mouseRot[1] = -0.5*Math.PI;
            
            document.getElementById("thetaSlider").value = mouseRot[1] * 180.0 / Math.PI;
            document.getElementById("phiSlider").value = mouseRot[0] * 180.0 / Math.PI;
            x = e.offsetX;
            y = e.offsetY;
        }
    });
    canvas.addEventListener('mouseup', e => {
        isMoving = false;
    });

    canvas.addEventListener("wheel", event => {
        radius += event.deltaY/30;
        if (radius > 120)
            radius = 120;
        else if (radius < 1)
            radius = 1;
        document.getElementById("radiusSlider").value = radius;
    });

    render();
}

var loop = 1;
var jump = 0;
var walk = 0;

var angle = 0;
var angleJump = 0;

var rotUpperLegJSlow = 5;
var rotUpperLegJfast = 8;
var rotUpperLeg = 10;
var rotLowerLeg = 15;

bodyPos[0] = 35 * Math.cos(angle);
bodyPos[2] = 20 * Math.sin(angle);
theta[torso2Id] = (angle) * 180 / Math.PI;

function animation() {
    angle = (angle + 0.04) % (2 * Math.PI);

    bodyPos[0] = 35 * Math.cos(angle);
    bodyPos[2] = 20 * Math.sin(angle);

    theta[torso2Id] = (angle) * 180 / Math.PI;
    initNodes(torsoId);

    if(loop == 0){
        bodyPos[1] = 15 * Math.sin(angleJump) + 5.5
        initNodes(torso1Id);
        angleJump = (angleJump - 0.15) % (Math.PI)-Math.PI

        if (jump == 0) {
            if (angleJump <= -5/4*Math.PI) {
                jump = 1;
            }

            theta[leftUpperArmId] += rotUpperLegJfast;
            initNodes(leftUpperArmId);
            theta[rightUpperArmId] += rotUpperLegJfast;
            initNodes(rightUpperArmId);

            theta[leftLowerArmId] -= rotLowerLeg;
            initNodes(leftLowerArmId);
            theta[rightLowerArmId] -= rotLowerLeg;
            initNodes(rightLowerArmId);

            theta[rightUpperLegId] -= rotUpperLegJfast;
            initNodes(rightUpperLegId);
            theta[leftUpperLegId] -= rotUpperLegJfast;
            initNodes(leftUpperLegId);

        } else if (jump == 1) {
            if (angleJump <= -7/4*Math.PI) {
                jump = 2;
            }

        } else if (jump == 2) {
            if (angleJump > -7/4*Math.PI) {
                jump = 3;
            }
            theta[leftUpperArmId] -= rotUpperLegJSlow;
            initNodes(leftUpperArmId);
            theta[rightUpperArmId] -= rotUpperLegJSlow;
            initNodes(rightUpperArmId);

            theta[leftLowerArmId] += rotLowerLeg;
            initNodes(leftLowerArmId);
            theta[rightLowerArmId] += rotLowerLeg;
            initNodes(rightLowerArmId);

            theta[rightUpperLegId] += rotUpperLegJSlow;
            initNodes(rightUpperLegId);
            theta[leftUpperLegId] += rotUpperLegJSlow;
            initNodes(leftUpperLegId);
        } else if(jump == 3){
            loop = 1;
            jump = 0;
            theta[leftUpperArmId] = -180;
            initNodes(leftUpperArmId);
            theta[rightUpperArmId] = -180;
            initNodes(rightUpperArmId);
    
            theta[leftLowerArmId] = 0;
            initNodes(leftLowerArmId);
            theta[rightLowerArmId] = 0;
            initNodes(rightLowerArmId);
    
            theta[rightUpperLegId] = -180;
            initNodes(rightUpperLegId);
            theta[leftUpperLegId] = -180;
            initNodes(leftUpperLegId);

            angleJump = 0;
            theta[torso1Id] = 0
            initNodes(torso1Id);
        }
    } else if(loop == 1){
        if((angle >= 11/8*Math.PI && angle <= 12/8*Math.PI) || (angle >= 3/8*Math.PI && angle <= 4/8*Math.PI)){
            walk = 3;
        }
        if(walk == 0){
            if (theta[leftUpperArmId] < -205) {
                walk = 1;
            }
            theta[leftUpperArmId] -= rotUpperLeg;
            initNodes(leftUpperArmId);
            theta[rightUpperLegId] -= rotUpperLeg;
            initNodes(rightUpperLegId);

            theta[rightUpperArmId] += rotUpperLeg;
            initNodes(rightUpperArmId);
            theta[leftUpperLegId] += rotUpperLeg;
            initNodes(leftUpperLegId);
            
            if(theta[leftLowerArmId] < 0)
                theta[leftLowerArmId] += rotLowerLeg;
            initNodes(leftLowerArmId);

            if(theta[rightLowerArmId] > -50)
                theta[rightLowerArmId] -= rotLowerLeg;
            initNodes(rightLowerArmId);
        } else if (walk == 1){
            if (theta[leftUpperArmId] > -155) {
                walk = 0;
            }
            theta[leftUpperArmId] += rotUpperLeg;
            initNodes(leftUpperArmId);
            theta[rightUpperLegId] += rotUpperLeg;
            initNodes(rightUpperLegId);
    
            theta[rightUpperArmId] -= rotUpperLeg;
            initNodes(rightUpperArmId);
            theta[leftUpperLegId] -= rotUpperLeg;
            initNodes(leftUpperLegId);
            
            if(theta[leftLowerArmId] > -50)
                theta[leftLowerArmId] -= rotLowerLeg;
            initNodes(leftLowerArmId);
    
            if(theta[rightLowerArmId] < 0)
                theta[rightLowerArmId] += rotLowerLeg;
            initNodes(rightLowerArmId);
        } else if (walk == 3){
            loop = 0;
            walk = 0;
            jump = 0;

            theta[leftUpperArmId] = -180;
            initNodes(leftUpperArmId);
            theta[rightUpperArmId] = -180;
            initNodes(rightUpperArmId);

            theta[leftLowerArmId] = 0;
            initNodes(leftLowerArmId);
            theta[rightLowerArmId] = 0;
            initNodes(rightLowerArmId);

            theta[rightUpperLegId] = -180;
            initNodes(rightUpperLegId);
            theta[leftUpperLegId] = -180;
            initNodes(leftUpperLegId);
        }
    }
}

var render = function () {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eyeModelView = vec3(radius * Math.sin(mouseRot[0]),
                        radius * Math.sin(mouseRot[1]),
                        radius * Math.cos(mouseRot[0]));

    modelViewMatrix = lookAt(eyeModelView, at, up);
    projectionMatrix = perspective(fovy, aspect, near, far);
    nMatrix = normalMatrix(modelViewMatrix, true);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModelViewMatrix"), false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "uProjectionMatrix"), false, flatten(projectionMatrix));
    gl.uniformMatrix3fv(gl.getUniformLocation(program, "uNormalMatrix"), false, flatten(nMatrix));

    traverse(torsoId);
    traverse(fence1Id);
    traverse(grassId);
    traverse(lightId);
    requestAnimationFrame(render);
}

function resetSlider(eName, eValue) {
    var elem = document.getElementById(eName);
    elem.value = eValue;
    elem.dispatchEvent(new Event('change', { value: eValue, bubbles: true }));
}
function resetView() {
    resetSlider('zNearSlider', 0.1);
    resetSlider('zFarSlider', 1000);
    resetSlider('radiusSlider', 80);
    resetSlider('thetaSlider', 20);
    resetSlider('phiSlider', 0);
    resetSlider('fovSlider', 65);
    resetSlider('aspectSlider', 1);
}