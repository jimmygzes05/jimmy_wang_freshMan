let canvas = document.getElementById("renderCanvas")
let engine = new BABYLON.Engine(canvas, true);

let createScene = function () {
    let scene = new BABYLON.Scene(engine);
    //場景套用物理
    scene.enablePhysics(new BABYLON.Vector3(0,-20, 0), new BABYLON.CannonJSPlugin());

    let camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 0, -90), scene);
    camera.attachControl(canvas, true);

    //釘子位置設定
    let nails = {
        left:{
            mesh:[],
            num: 21,
            space: 4,
            x: -16,
            y: 10
        },
        bottom:{
            mesh:[],
            num: 38,
            x: -21,
            y: -19
        },
        bottomHigh:{
            mesh:[],
            num: 26,
            x: -15,
            y: -19
        },
        entrance:{
            mesh:[],
            num: 4,
            x: -3,
            y: -27
        },
        upEntrance:{
            mesh:[],
            num: 12,
            space: 4,
            x: 2,
            y: -16
        },
        rightPart1:{
            mesh:[],
            num: 21,
            space: 4,
            x: 16,
            y: 18
        }
    }

    //釘子顏色
    let nailColor = new BABYLON.StandardMaterial("nail", scene)
    nailColor.emissiveColor = new BABYLON.Color3.FromHexString("#4675A6");

    //中間環顏色
    let barrierColor = new BABYLON.StandardMaterial("barrier", scene);
    barrierColor.emissiveColor = new BABYLON.Color3.FromHexString("#1DD196");

    //入賞口顏色
    let winColor = new BABYLON.StandardMaterial("winColor",scene);
    winColor.emissiveColor = new BABYLON.Color3.FromHexString("#FF955F");

    //地板顏色
    let groundColor = new BABYLON.StandardMaterial("groundColor",scene);
    groundColor.emissiveColor = new BABYLON.Color3.FromHexString("#76AAE0");

    //鋼珠顏色
    let ballColor = new BABYLON.StandardMaterial("ballColor", scene);
    ballColor.emissiveColor = new BABYLON.Color3.FromHexString("#E4FFCE");

    //生成釘子開始
    for (let i = 0; i < nails.left.num; i++) {
        let space = nails.left.space;
        nails.left.mesh[i] = BABYLON.MeshBuilder.CreateCylinder("nailLeft",{diameter: 0.5, tessellation: 96, height: 5});
        nails.left.mesh[i].material = nailColor;
        nails.left.mesh[i].rotation.x = Math.PI / 2;
        if(i % 3 == 0){
            nails.left.mesh[i].position.x = nails.left.x;
            nails.left.mesh[i].position.y = (i / 3) * -space + nails.left.y;  
        }else{
            nails.left.mesh[i].position.x = (i % 3) * space + (nails.left.x - space - (space / 2));
            nails.left.mesh[i].position.y = Math.floor(i / 3) * -space + nails.left.y - (space / 2);
        }
        nails.left.mesh[i].physicsImpostor = new BABYLON.PhysicsImpostor(nails.left.mesh[i], BABYLON.PhysicsImpostor.CylinderImpostor, {mass: 0, restitution: 0.8}, scene);
    }

    for (let i = 1; i <= nails.bottom.num; i++) {
        if(i % 11 == 0 || (i - 1) % 11 == 0 || (i - 2) % 11 == 0){
            continue;
        }
        nails.bottom.mesh[i] = BABYLON.MeshBuilder.CreateCylinder("nailBottom",{diameter: 0.5, tessellation: 96, height: 5});
        nails.bottom.mesh[i].material = nailColor;
        nails.bottom.mesh[i].rotation.x = Math.PI / 2;
        nails.bottom.mesh[i].position.x = i * 0.4 + nails.bottom.x;
        nails.bottom.mesh[i].position.y = nails.bottom.y - i *0.2; 
        nails.bottom.mesh[i].physicsImpostor = new BABYLON.PhysicsImpostor(nails.bottom.mesh[i], BABYLON.PhysicsImpostor.CylinderImpostor, {mass: 0, restitution: 0.9, friction: 0}, scene);
    }
    for (let i = 1; i <= nails.bottomHigh.num; i++) {
        if(i % 11 == 0 || (i - 1) % 11 == 0 || (i - 2) % 11 == 0){
            continue;
        }
        nails.bottomHigh.mesh[i] = BABYLON.MeshBuilder.CreateCylinder("bottomHigh",{diameter: 0.5, tessellation: 96, height: 5});
        nails.bottomHigh.mesh[i].material = nailColor;
        nails.bottomHigh.mesh[i].rotation.x = Math.PI / 2;
        nails.bottomHigh.mesh[i].position.x = i * 0.4 + nails.bottomHigh.x;
        nails.bottomHigh.mesh[i].position.y = nails.bottomHigh.y - i *0.2; 
        nails.bottomHigh.mesh[i].physicsImpostor = new BABYLON.PhysicsImpostor(nails.bottomHigh.mesh[i], BABYLON.PhysicsImpostor.CylinderImpostor, {mass: 0, restitution: 0.9, friction: 0}, scene);
    }
    for (let i = 0; i < nails.entrance.num; i++) {
        nails.entrance.mesh[i] = BABYLON.MeshBuilder.CreateCylinder("entranceNail",{diameter: 0.5, tessellation: 96, height: 5});
        nails.entrance.mesh[i].material = nailColor;
        nails.entrance.mesh[i].rotation.x = Math.PI / 2;
        nails.entrance.mesh[i].position.x = i * 2 + nails.entrance.x;
        if(i % 3 == 0){
            nails.entrance.mesh[i].position.y = nails.entrance.y;  
        }else{
            nails.entrance.mesh[i].position.y = nails.entrance.y + 0.5;  
        }  
        nails.entrance.mesh[i].physicsImpostor = new BABYLON.PhysicsImpostor(nails.entrance.mesh[i], BABYLON.PhysicsImpostor.CylinderImpostor, {mass: 0, restitution: 0.7}, scene);
    }
    for (let i = 0; i < nails.upEntrance.num; i++) {
        let space = nails.upEntrance.space;
        nails.upEntrance.mesh[i] = BABYLON.MeshBuilder.CreateCylinder("upEntrance",{diameter: 0.5, tessellation: 96, height: 5});
        nails.upEntrance.mesh[i].material = nailColor;
        nails.upEntrance.mesh[i].rotation.x = Math.PI / 2;
        if(i % 3 == 0){
            nails.upEntrance.mesh[i].position.y = nails.upEntrance.y;
            nails.upEntrance.mesh[i].position.x = (i / 3) * -space + nails.upEntrance.x;  
        }else{
            nails.upEntrance.mesh[i].position.y = (i % 3) * space + (nails.upEntrance.y - space - (space / 2));
            nails.upEntrance.mesh[i].position.x = Math.floor(i / 3) * -space + nails.upEntrance.x - (space / 2);
        }
        nails.upEntrance.mesh[i].physicsImpostor = new BABYLON.PhysicsImpostor(nails.upEntrance.mesh[i], BABYLON.PhysicsImpostor.CylinderImpostor, {mass: 0, restitution: 0.8}, scene);
    }
    for (let i = 0; i < nails.rightPart1.num; i++) {
        let space = nails.rightPart1.space;
        nails.rightPart1.mesh[i] = BABYLON.MeshBuilder.CreateCylinder("nailRight",{diameter: 0.5, tessellation: 96, height: 5});
        nails.rightPart1.mesh[i].material = nailColor;
        nails.rightPart1.mesh[i].rotation.x = Math.PI / 2;
        if(i % 3 == 0){
            nails.rightPart1.mesh[i].position.x = nails.rightPart1.x;
            nails.rightPart1.mesh[i].position.y = (i / 3) * -space + nails.rightPart1.y;  
        }else{
            nails.rightPart1.mesh[i].position.x = (i % 3) * space + (nails.rightPart1.x - space - (space / 2));
            nails.rightPart1.mesh[i].position.y = Math.floor(i / 3) * -space + nails.rightPart1.y - (space / 2);
        }
        nails.rightPart1.mesh[i].physicsImpostor = new BABYLON.PhysicsImpostor(nails.rightPart1.mesh[i], BABYLON.PhysicsImpostor.CylinderImpostor, {mass: 0, restitution: 0.8}, scene);
    }
    //生成釘子結束
    
    //外殼大小
    let boxSize = 20;
    //背景顏色
    let background = new BABYLON.StandardMaterial("wood", scene);
    background.disableLighting = true;
    background.emissiveColor = new BABYLON.Color3.FromHexString("#FFBF5F");
    //牆壁顏色
    let wallColor = new BABYLON.StandardMaterial("wall", scene);
    wallColor.disableLighting = true;
    wallColor.emissiveColor = new BABYLON.Color3.FromHexString("#FFD79B");
    
    //洞的形狀
    let hole = BABYLON.MeshBuilder.CreateCylinder("cylinder",{diameter: 5, tessellation: 96, height: 2});
    hole.position.y = -35;
    //地板形狀
    let ground = BABYLON.MeshBuilder.CreateBox("ground",{width: 2 * boxSize, height: 5}, scene);
    ground.rotation.x = Math.PI / 2;
    ground.position.y = -1.75 * boxSize;
    ground.material = background
    //將地板減去洞的形狀
    let groundCSG = BABYLON.CSG.FromMesh(ground);
    groundCSG.subtractInPlace(BABYLON.CSG.FromMesh(hole));
    //生成有洞的地板
    let finalGround = groundCSG.toMesh("finalGround", ground.material, scene, true);
    finalGround.physicsImpostor = new BABYLON.PhysicsImpostor(finalGround, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, restitution: 0.5, friction: 0}, scene);
    finalGround.renderOverlay =true

    //右邊地上斜坡
    let endGroundRight = BABYLON.MeshBuilder.CreateBox("endGroundRight",{width: 17, height: 5, depth: 1}, scene);
    endGroundRight.rotation.z = Math.PI / 12;
    endGroundRight.addRotation(Math.PI / 2, 0, 0);
    endGroundRight.position.y = -32;
    endGroundRight.position.x = 11.5;
    endGroundRight.material = groundColor;
    endGroundRight.physicsImpostor = new BABYLON.PhysicsImpostor(endGroundRight, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.3}, scene);

    //左邊地上斜坡
    let endGroundLeft = BABYLON.MeshBuilder.CreateBox("endGroundLeft",{width: 17, height: 5, depth: 1}, scene);
    endGroundLeft.rotation.z = Math.PI / -12;
    endGroundLeft.addRotation(Math.PI / 2, 0, 0);
    endGroundLeft.position.y = -32;
    endGroundLeft.position.x = -11.5;
    endGroundLeft.material = groundColor;
    endGroundLeft.physicsImpostor = new BABYLON.PhysicsImpostor(endGroundLeft, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.3}, scene);

    //除地板以外的牆壁
    let wallLeft = BABYLON.MeshBuilder.CreatePlane("wallLeft", {width: 5, height:3.5 * boxSize, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
	wallLeft.rotation.y = -Math.PI/2;
    wallLeft.position.x = -boxSize;
    wallLeft.material = wallColor;
    wallLeft.physicsImpostor = new BABYLON.PhysicsImpostor(wallLeft, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
	
	let wallRight = BABYLON.MeshBuilder.CreatePlane("wallRight", {width: 5, height: 3.5 * boxSize, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
	wallRight.rotation.y = Math.PI/2;
    wallRight.position.x = boxSize;
    wallRight.material = wallColor;
    wallRight.physicsImpostor = new BABYLON.PhysicsImpostor(wallRight, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.8}, scene);
	
	let wallFront = BABYLON.MeshBuilder.CreatePlane("wallFront", {width: 2 * boxSize, height: 3.5 * boxSize}, scene);
	wallFront.rotation.y = Math.PI;
    wallFront.position.z = -boxSize / 8;
    wallFront.physicsImpostor = new BABYLON.PhysicsImpostor(wallFront, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
	
	let wallBack = BABYLON.MeshBuilder.CreatePlane("wallBack", {width: 2 * boxSize, height: 3.5 * boxSize, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
    wallBack.position.z = boxSize / 8;
    wallBack.material = background;
    wallBack.physicsImpostor = new BABYLON.PhysicsImpostor(wallBack, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.8}, scene);
	
	let roof = ground.clone("roof");
    roof.rotation.x = Math.PI /2;
    roof.position.y = 1.75 * boxSize;
    roof.material = background;
    roof.physicsImpostor = new BABYLON.PhysicsImpostor(roof, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.8}, scene);

    //各入賞口的得分區
    let startZone = BABYLON.MeshBuilder.CreateBox("startZone", {width:1, height: 4.99}, scene);
    startZone.rotation.x = Math.PI / 2;
    startZone.position.y = -30;
    startZone.checkCollisions = true;

    let changeZone = BABYLON.MeshBuilder.CreateBox("changeZone", {width:1, height: 4.99}, scene);
    changeZone.rotation.x = Math.PI / 2;
    changeZone.position.x = 6;
    changeZone.position.y = -22;
    changeZone.checkCollisions = true;

    let prizeZone = BABYLON.MeshBuilder.CreateBox("prizeZone", {width:1, height: 4.99}, scene);
    prizeZone.rotation.x = Math.PI / 2;
    prizeZone.position.x = 12;
    prizeZone.position.y = -13;
    prizeZone.checkCollisions = true;

    //建造六邊形的路徑
	let hexShape = [
        new BABYLON.Vector3(-1, Math.sqrt(3), 0),
        new BABYLON.Vector3(-2, 0, 0),
        new BABYLON.Vector3(-1, -Math.sqrt(3), 0),
        new BABYLON.Vector3(1, -Math.sqrt(3), 0),
        new BABYLON.Vector3(2, 0, 0),
        new BABYLON.Vector3(1, Math.sqrt(3), 0),		
    ];

    let hexPath = [
        new BABYLON.Vector3(0, 0, -2.5),
        new BABYLON.Vector3(0, 0, 2.5)
    ];

    //開始入賞口
    let startEntrance = BABYLON.MeshBuilder.ExtrudeShape("startEntrance", {shape: hexShape, path: hexPath, sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: false}, scene);
    startEntrance.position.y = -29;
    startEntrance.material = winColor;
    startEntrance.physicsImpostor = new BABYLON.PhysicsImpostor(startEntrance, BABYLON.PhysicsImpostor.MeshImpostor, {mass: 0, restitution: 0.8}, scene);
    //開始入賞口的蓋子
    let hexagonCap = BABYLON.MeshBuilder.CreateDisc("hexCap", {radius: 2, tessellation: 6,});
    hexagonCap.position.y = -29;
    hexagonCap.position.z = -2.5;
    hexagonCap.material = winColor;
    //確變入賞口
    let changeEntrance = startEntrance.clone("changeEntrance");
    changeEntrance.position.x = 12;
    changeEntrance.position.y = -13;
    //確變入賞口蓋子
    let changeCap = hexagonCap.clone("changeCap");
    changeCap.position.x = 12;
    changeCap.position.y = -13;
    changeCap.position.z = -2.5;

    let changeRoof = BABYLON.MeshBuilder.CreatePlane("changeRoof", {width: 2, height: 5, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
    changeRoof.rotation.x = Math.PI / 2;
    changeRoof.position.x = 12
    changeRoof.position.y = -13 + Math.sqrt(3);
    changeRoof.material = winColor;
    changeRoof.physicsImpostor = new BABYLON.PhysicsImpostor(changeRoof, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0.8});

    let changeRoofParent = BABYLON.MeshBuilder.CreatePlane("changeRoofParent", {width: 2, height: 5, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
    changeRoofParent.rotation.x = Math.PI / 2;
    changeRoofParent.position.x = 12
    changeRoofParent.position.y = -13 + Math.sqrt(3);
    changeRoofParent.material = winColor;

    //確變入賞口上方牆壁
    let changeWall = BABYLON.MeshBuilder.CreateBox("changeWall", {width: 0.1, height: 5, depth: 5}, scene);
    changeWall.rotation.x = Math.PI / 2;  
    changeWall.position.x = 11;
    changeWall.position.y = -8;
    changeWall.material = barrierColor;
    changeWall.physicsImpostor = new BABYLON.PhysicsImpostor(changeWall, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0.8}, scene);
    //大獎入賞口
    let prizeShape = [
        new BABYLON.Vector3(2, 2, 0),
        new BABYLON.Vector3(-2, 2, 0),
        new BABYLON.Vector3(-2, -2, 0),
        new BABYLON.Vector3(2, -2, 0)
    ]
    let prizeEntrance = BABYLON.MeshBuilder.ExtrudeShape("prizeEntrance",{
        shape:prizeShape,
        path:[new BABYLON.Vector3(0, 0, -2.5),new BABYLON.Vector3(0, 0, 2.5)],
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
    }, scene);
    prizeEntrance.position.x = 6;
    prizeEntrance.position.y = -21;
    prizeEntrance.material = winColor;
    prizeEntrance.physicsImpostor = new BABYLON.PhysicsImpostor(prizeEntrance, BABYLON.PhysicsImpostor.MeshImpostor, {mass: 0, restitution: 0.8}, scene);

    let prizeCap = BABYLON.MeshBuilder.CreatePlane("prizeCap",{size: 4, sideOrientation:BABYLON.Mesh.DOUBLESIDE}, scene);
    prizeCap.position.x = 6;
    prizeCap.position.y = -21;
    prizeCap.position.z = -2.5;
    prizeCap.material = winColor;

    //大獎入賞口開關
    let prizeSwitch = BABYLON.MeshBuilder.CreateBox("prizeSwitch", {width: 0.1, height: 4, depth:5, sideOrientation:BABYLON.Mesh.DOUBLESIDE}, scene);
    prizeSwitch.position.x = 8;
    prizeSwitch.position.y = -21;
    prizeSwitch.material = winColor;
    prizeSwitch.physicsImpostor = new BABYLON.PhysicsImpostor(prizeSwitch, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0.8}, scene);

    //實現動畫用的大獎入賞口開關
    let prizeSwitchParent = BABYLON.MeshBuilder.CreateBox("prizeSwitchParent", {width: 0.1, height: 4, depth:5, sideOrientation:BABYLON.Mesh.DOUBLESIDE}, scene);
    prizeSwitchParent.setPivotMatrix(BABYLON.Matrix.Translation(0, 2, 0), false);
    prizeSwitchParent.position.x = 8;
    prizeSwitchParent.position.y = -23;
    prizeSwitchParent.material = winColor;

    let rightTrack = BABYLON.MeshBuilder.CreateBox("rightTrack", {width: 10, height: 5, depth: 0.5});
    rightTrack.rotation.z = Math.PI / 6;
    rightTrack.addRotation(Math.PI / 2, 0, 0);
    rightTrack.position.x = 15.5;
    rightTrack.position.y = -21;
    rightTrack.material = groundColor;
    rightTrack.physicsImpostor = new BABYLON.PhysicsImpostor(rightTrack, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.8}, scene);

    let rightTrackUp = BABYLON.MeshBuilder.CreateBox("rightTrackUp", {width: 6, height: 5, depth: 0.5});
    rightTrackUp.rotation.z = Math.PI / 3;
    rightTrackUp.addRotation(Math.PI / 2, 0, 0);
    rightTrackUp.position.x = 9.37;
    rightTrackUp.position.y = -16.26;
    rightTrackUp.material = winColor;
    rightTrackUp.physicsImpostor = new BABYLON.PhysicsImpostor(rightTrackUp, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.8}, scene);

    //上方半圓的路徑
    let mySinus = [];
    for (let i = 0; i < 30; i++) {
        mySinus.push(new BABYLON.Vector3(20 * Math.cos(6 * i * Math.PI / 180), 20 * Math.sin(6 * i * Math.PI / 180), 0));
    }
    let mySinusCurve = new BABYLON.Curve3(mySinus);
    let path = mySinusCurve.getPoints();
    let shape = [new BABYLON.Vector3(0, 0, 0),new BABYLON.Vector3(5, 0, 0)];
    //上方半圓
    let track = BABYLON.MeshBuilder.ExtrudeShape("track", { shape: shape, path: path, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
    track.position.z = -2.5;
    track.position.y = 13;
    track.rotation.z = 0.018;
    track.material = barrierColor;
    track.physicsImpostor = new BABYLON.PhysicsImpostor(track, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, restitution: 0.7}, scene);

    // 中間圓形的路徑
    let mySinusCenter = [];
    for (let i = 0; i < 90; i++) {
        mySinusCenter.push(new BABYLON.Vector3(12 * Math.cos(6 * i * Math.PI / 180), 12 * Math.sin(6 * i * Math.PI / 180), 0));
    }
    let centerCurve = new BABYLON.Curve3(mySinusCenter);
    let shapeCenter = centerCurve.getPoints();
    let pathCenter = [new BABYLON.Vector3(0, 0, 0),new BABYLON.Vector3(0, 0, 5)];
    //中間圓形
    let trackCenter = BABYLON.MeshBuilder.ExtrudeShape("track", { shape: shapeCenter, path: pathCenter, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
    trackCenter.position.z = -2.5;
    trackCenter.position.y = 0;
    trackCenter.material = barrierColor;
    trackCenter.physicsImpostor = new BABYLON.PhysicsImpostor(trackCenter, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, restitution: 0.8}, scene)

    ground.dispose();
    hole.dispose();

    //遮住軸帶的方體
    let reelCover = BABYLON.MeshBuilder.CreateBox("reelCover", {width: 16, height: 3, depth: 5}, scene);
    reelCover.position.z = -2.51;
    reelCover.position.y = 2.6;

    let reelCover2 = reelCover.clone("reelCover2");
    reelCover2.position.y = -2.6;

    //軸帶上的數字
    let font = "bold 80px monospace";
    let tx = new BABYLON.DynamicTexture("wheeltx",{width: 120, height:720}, scene); 
    tx.wAng = Math.PI / 2;
    for (let i = 1; i < 10; i++) {
        if(i == 1){
           tx.drawText(`${i}`, 30, i * 80, font, "#5952B2", "#FF6E24", false);
           continue;
        }
        tx.drawText(`${i}`, 30, i * 80, font, "#5952B2", null, false);
        
    }
    
    //將數字轉為材質
    let wheelMat = new BABYLON.StandardMaterial("wheelMat", scene);
    wheelMat.emissiveTexture = tx;

    let prizeRoofAnimation = new BABYLON.Animation("prizeRoofAnimation", "position.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    let prizeRoofKeys = [];
    prizeRoofKeys.push(
        {frame: 0, value: 12},
        {frame: 15, value: 10},
        {frame: 30, value: 12}
    );
    prizeRoofAnimation.setKeys(prizeRoofKeys);
    changeRoofParent.animations.push(prizeRoofAnimation);
    // scene.beginAnimation(changeRoofParent, 0, 30, true);
    changeRoof.setParent(changeRoofParent);

    //確變入賞口的開關動畫
    let switchAnimation = new BABYLON.Animation("switchAnimation", "rotation.z", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    let keys = [];
    keys.push({frame: 0, value: 0});
    keys.push({frame: 15, value: -Math.PI / 2});
    keys.push({frame: 45, value: -Math.PI / 2});
    keys.push({frame: 60, value: 0});
    keys.push({frame: 90, value: 0});
    switchAnimation.setKeys(keys);
    prizeSwitchParent.animations.push(switchAnimation);
    prizeSwitch.setParent(prizeSwitchParent);

    //軸帶旋轉動畫
    let rotateAnime = new BABYLON.Animation("rotate", "rotation.x", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    let rotateKey = [];
    rotateKey.push(
        {frame: 0, value: 4.5}, 
        {frame: 6, value: 3.8},
        {frame: 12, value: 3.1},
        {frame: 18, value: 2.4},
        {frame: 24, value: 1.7},
        {frame: 30, value: 1}, 
        {frame: 36, value: 0.3}, 
        {frame: 42, value: -0.4}, 
        {frame: 48, value: -1.1});
    rotateAnime.setKeys(rotateKey);

    //生成軸帶
    let wheel = [];
    for (let i = 0; i < 3; i++) {  
        wheel[i] = BABYLON.MeshBuilder.CreateCylinder("wheel", {diameter: 8, height: 5, tessellation: 24}, scene);
        wheel[i].rotation.z = Math.PI / 2;
        wheel[i].rotation.x = -1.1
        wheel[i].position.z = -1;
        wheel[i].position.x = i * 5 - 5;
        wheel[i].animations = [];
        wheel[i].animations.push(rotateAnime);
        wheel[i].material = wheelMat; 
    }

    //裝鋼珠的陣列
    let balls = [];
    //初始鋼珠數量
    let ballNum = 1000;
    //發射數量
    let shootTimes = 0;

    //保留燈號的顏色
    let saveLightMat = new BABYLON.StandardMaterial("saveLightMat", scene);
    saveLightMat.emissiveColor = new BABYLON.Color3(1, 1, 0);

    let saveLight = [];
    for (let i = 0; i < 4; i++) {
        saveLight[i] = BABYLON.MeshBuilder.CreateBox("saveLight",{size: 2}, scene);
        saveLight[i].position.y = -6;
        saveLight[i].position.x = i * 4 - 6;
    }

    //柏青哥的三個階段
    let normalTime = true;
    let prizeTime = false;
    let specialTime = false;
    //st回數與大獎回合數
    let stRound = 0;
    let round = 4;
    // let round = 16;
    //進入大獎洞口的顆數
    let ballInPrize = 0;
    //存放軸帶旋轉動畫的陣列
    let rotateArr = [];
    let stRotateArr = [];
    let reelNum = [];
    let renderFrame = 0;
    let endFrame = []; 
    let startShoot = false;
    function endFrameCheck(){
        let rpt = false;
        do{
            for (let i = 0; i < 3; i++) {
                endFrame[i] = getRandom(1,9);
            }
            if(endFrame[0] == endFrame[1] && endFrame[1] == endFrame[2]){
                rpt = true;
            }else{
                rpt = false;
            }
        }while(rpt == true);
       
    }

    function rotateFunc(){
        if(normalTime){
            endFrameCheck();
            // let randomNum = getRandom(1, 99);
            let randomNum = 28
            console.log(randomNum)
            wheel.forEach((element, i) => {            
                randomNum == 28 ? reelNum[i] = endFrame[0] : reelNum[i] = 10 - endFrame[i];
                scene.beginAnimation(element, 0, 60, true, 1, () =>{
                    if(randomNum != 28){
                        scene.beginAnimation(element, 0, (endFrame[i] - 1) * 6, false, 1,() => {
                        if(i == 1){
                            rotateArr.splice(0, 1);
                            if(rotateArr.length > 0){
                                setTimeout(() => {
                                    if(!specialTime) {
                                        rotateArr[0]();
                                        if(rotateArr.length < 5){
                                            saveLight[rotateArr.length - 1].material = null;
                                            }
                                        }
                                    }, 1500);
                                }
                            }
                        });
                        
                    }else{
                        scene.beginAnimation(element, 0, (reelNum[0] - 1) * 6, false, 1,() => {
                            if(i == 1){
                                rotateArr.splice(0, 1);
                                if(rotateArr.length > 0){
                                    setTimeout(() => {
                                        if(!specialTime) {
                                            rotateArr[0]();
                                            if(rotateArr.length < 5){
                                                saveLight[rotateArr.length - 1].material = null;
                                            }
                                        }
                                    }, 1500);
                                }
                            }
                        });
                    }
                    
                });
                setTimeout(() => {
                    scene.stopAnimation(element);           
                }, 1500);
                
            });
            
            setTimeout(() => {
                if(reelNum[0] == reelNum[1] && reelNum[1] == reelNum[2]){
                    normalTime = false;
                    prizeTime = true;           
                    // stRound = 10;
                    stRound = 30;
                    round = 4;
                    // round = 16;
                    winTimes ++;
                    scene.beginAnimation(changeRoofParent, 0, 15, false);
                }
            }, 1000);
        }
        if(specialTime){
            stRound --;
            endFrameCheck();
            let stRandomNum = getRandom(1, 15);
            wheel.forEach((element, i) => {
                stRandomNum == 10 ? reelNum[i] = endFrame[0] : reelNum[i] = 10 - endFrame[i];
                scene.beginAnimation(element, 0, 60, true, 1, () =>{
                    if(stRandomNum != 10){     
                            scene.beginAnimation(element, 0, (endFrame[i] - 1) * 6, false, 1, () => {
                                if(i == 1){
                                    stRotateArr.splice(0, 1);
                                    if(stRotateArr.length > 0){
                                        setTimeout(() => {
                                        stRotateArr[0]();
                                        },1000);
                                    }
                                }
                            });
                        
                    }else{
                        scene.beginAnimation(element, 0, (reelNum[0] - 1) * 6, false, 1, () => {
                            if(i == 1){
                                stRotateArr.splice(0, 1);
                                if(stRotateArr.length > 0){
                                    setTimeout(() => {
                                    stRotateArr[0]();
                                    },1000);
                                }
                            }
                        });
                    }
                        
                });
                setTimeout(() =>{
                    scene.stopAnimation(element);
                }, 500)
            });
            if(reelNum[0] == reelNum[1] && reelNum[1] == reelNum[2]){
                prizeTime = true;
                specialTime = false;
                // stRound = 10;
                stRound = 30;
                round = 4;
                // round = 16;
                stRotateArr.length = 0;
                winTimes ++;
                scene.stopAnimation(prizeSwitchParent);
                scene.beginAnimation(changeRoofParent, 0, 15, false);
                prizeSwitchParent.rotation.z = 0;
            }
            if(stRound == 0) {
                specialTime = false;
                normalTime = true;
                stRotateArr.length = 0;
                stRoundText.isVisible = false;
                scene.stopAnimation(prizeSwitchParent);
                prizeSwitchParent.rotation.z = 0;
                if(rotateArr.length != 0) {
                    rotateArr[0]();
                    saveLight[rotateArr.length - 1].material = null;
                }
            }
           console.log(reelNum);
        }
        
    }

    scene.registerAfterRender(() => {
        balls.forEach((ball, i, arr) => {
            if(normalTime){
                if(startZone.intersectsMesh(ball)){
                    ballNum += 2;
                    if(rotateArr.length < 5){
                        rotateArr.push(rotateFunc);
                        if(rotateArr.length == 1){
                            rotateArr[0]();
                        };
                        if(rotateArr.length - 2 >= 0){
                            saveLight[rotateArr.length - 2].material = saveLightMat;
                            
                        }
                    }
               
                }
            }
            if(prizeTime){
                if(prizeZone.intersectsMesh(ball)){
                    ballInPrize ++;
                    ballNum += 10;
                    if(ballInPrize == 9){
                    // if(ballInPrize == 4){
                        ballInPrize = 0;
                        round --;
                        if(round == 0) {
                            prizeTime = false;
                            specialTime = true;
                            roundText.isVisible = false;
                            scene.beginAnimation(changeRoofParent, 15, 30, false);
                            scene.beginAnimation(prizeSwitchParent, 0, 90, true);
                        }
                    }
                }
            }
            if(specialTime){       
                if (changeZone.intersectsMesh(ball)) {
                    if(stRound > 0){
                        stRotateArr.push(rotateFunc);
                        if(stRotateArr.length == 1){
                            stRotateArr[0]();
                        }
                    }

                }
            }
            if(startZone.intersectsMesh(ball) || changeZone.intersectsMesh(ball) || prizeZone.intersectsMesh(ball)){
                ball.dispose();
                arr.splice(i, 1);
            }
            if(ball.position.y < -35){
                ball.dispose();
                arr.splice(i, 1);                   
            }
        });
        if(renderFrame % 30 == 0 && ballNum > 0 && startShoot == true){
            balls[shootTimes] = BABYLON.MeshBuilder.CreateSphere('sphere',{diameter: 1, segments:8}, scene);
            balls[shootTimes].position.y = 15;
            balls[shootTimes].position.x = -18;
            balls[shootTimes].material = ballColor;
            balls[shootTimes].physicsImpostor = new BABYLON.PhysicsImpostor(balls[shootTimes], BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.7}, scene);
            normalTime == true ?
            balls[shootTimes].physicsImpostor.setLinearVelocity(new BABYLON.Vector3(getRandom(1, 10), getRandom(1, 8), 0)) :
            balls[shootTimes].physicsImpostor.setLinearVelocity(new BABYLON.Vector3(getRandom(15, 20), getRandom(15, 20), 0));
            balls[shootTimes].checkCollisions = true;
            shootTimes ++;
            ballNum --;
        }
        prizeTime == true ? roundText.isVisible = true : roundText.isVisible = false;
        specialTime == true ? stRoundText.isVisible = true : stRoundText.isVisible = false;
        if(specialTime == true || prizeTime == true) {
            arrowText.isVisible = true;
            if(renderFrame % 60 >= 0 && renderFrame % 60 <= 30){
                arrowText.alpha = 0.5;
            }else{
                arrowText.alpha = 1;
            }
        }
        if(specialTime == false && prizeTime == false){
            arrowText.isVisible = false;
        }
        rightTrack.position.y = -21;
        gameInfo.text = 
            `鋼珠剩餘數量：${ballNum}\n消耗鋼珠：${shootTimes}\n淨勝鋼珠：${ballNum - 1000}\n中獎次數：${winTimes}`;
        stRoundText.text = `剩${stRound}回`;
        roundText.text = `${round}R`;
        renderFrame++;
    });

    let winTimes = 0;
    let gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("gui", true, scene);

    let stRoundText = new BABYLON.GUI.TextBlock("stRoundText");
    stRoundText.color = "#4182A1";
    stRoundText.width = "180px";
    stRoundText.height = "60px";
    stRoundText.top = "-130px";
    stRoundText.left = "-110px";
    stRoundText.fontSize = 24;
    stRoundText.isVisible = false;
    gui.addControl(stRoundText);

    let roundText = new BABYLON.GUI.TextBlock("roundText");
    roundText.color = "#4182A1";
    roundText.width = "180px";
    roundText.height = "60px";
    roundText.top = "-130px";
    roundText.left = "110px";
    roundText.fontSize = 24;
    roundText.isVisible = false;
    gui.addControl(roundText);
    
    let arrowText = new BABYLON.GUI.TextBlock("arrowText");
    arrowText.width = "180px";
    arrowText.height = "180px";
    arrowText.top = "-280px";
    arrowText.left = "50px";
    arrowText.fontSize = 50;
    arrowText.color = "red"
    arrowText.isVisible = false;
    arrowText.text = "━➤";
    gui.addControl(arrowText);

    let gameInfo = new BABYLON.GUI.TextBlock();
    gameInfo.color = "white";
    gameInfo.fontSize = 32;
    gameInfo.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    gameInfo.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    gui.addControl(gameInfo);

    let sliderPanel = new BABYLON.GUI.StackPanel("sliderPanel");
    sliderPanel.width = "220px";
    sliderPanel.height = "300px";
    sliderPanel.top = "100px";
    sliderPanel.left = "-50px";
    sliderPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
    sliderPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    gui.addControl(sliderPanel);

    let startButtonText = new BABYLON.GUI.TextBlock("startButtonText", "點擊開始/暫停");
    startButtonText.height = "45px";
    startButtonText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

    let startButton = BABYLON.GUI.Button.CreateSimpleButton("start");
    startButton.height = "60px";
    startButton.color = "#4D4D4D";
    startButton.background = "#74CDE3";
    startButton.onPointerClickObservable.add(() => {
        startShoot == true ? startShoot = false : startShoot = true;
    })
    
    startButton.addControl(startButtonText);
    sliderPanel.addControl(startButton);
    
    scene.debugLayer.show()
    return scene;
}

let scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});

function getRandom(min, max) {
    return Math.floor(Math.random()*(max-min+1))+min;
}