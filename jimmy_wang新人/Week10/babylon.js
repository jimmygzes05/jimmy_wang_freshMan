let canvas = document.getElementById("renderCanvas")
let engine = new BABYLON.Engine(canvas, true);

let createScene = function () {
    let scene = new BABYLON.Scene(engine);
    let camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(0, -6.5, -130), scene);
    camera.angularSensibility = 800;
    camera.checkCollisions = true;
    camera.applyGravity = true;
    camera.ellipsoid = new BABYLON.Vector3(1, 1.7, 1);
    camera.inertia = 0.1;
    camera.speed = 15;
    camera.keysUp.push(87);
    camera.keysDown.push(83);
    camera.keysRight.push(68);
    camera.keysLeft.push(65);
    camera.attachControl(canvas, true);

    let light0 = new BABYLON.DirectionalLight("Omni", new BABYLON.Vector3(-2, -5, 2), scene);
    let light1 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(2, -5, -2), scene);

    let ground = BABYLON.Mesh.CreatePlane("ground", 400, scene);
    let groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/Playground/textures/ground.jpg", scene);
    groundMaterial.diffuseTexture.uScale = 24;
    groundMaterial.diffuseTexture.vScale = 24;
    groundMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
    groundMaterial.backFaceCulling = false;
    ground.material = groundMaterial;
    ground.position = new BABYLON.Vector3(5, -10, -15);
    ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);

    let skybox = BABYLON.Mesh.CreateBox("skybox", 400, scene);
    let skyboxMaterial = new BABYLON.StandardMaterial("skybox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    skybox.position = ground.position;

    let mat = new BABYLON.StandardMaterial("Mat", scene);
    mat.diffuseTexture = new BABYLON.Texture("textures/target.jpg", scene);
    // mat.diffuseTexture.hasAlpha = true;

    let targets = [];
    for (let i = 0; i < 10; i++) {
        let zone = -150 + (i * 30)
        targets[i] = BABYLON.MeshBuilder.CreateBox("crate", {
            width: 4,
            height: 8,
            depth: 1
        }, scene);
        targets[i].material = mat;
        targets[i].position = new BABYLON.Vector3(Math.floor(Math.random() * 25) + zone, -1 + Math.random() * 20, -10 + Math.random() * 20);
        targets[i].checkCollisions = true;
        targets[i].num = i;
    }

    scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
    scene.collisionsEnabled = true;
    ground.checkCollisions = true;


    function addGunSight(scene) {
        if (scene.activeCameras.length == 0) {
            scene.activeCameras.push(scene.activeCamera);
        }
        let secondCamera = new BABYLON.FreeCamera("gunSightCamera", new BABYLON.Vector3(0, 0, -50), scene);
        secondCamera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        secondCamera.layerMask = 0x20000000;
        scene.activeCameras.push(secondCamera);

        let meshes = [];
        let h = 250;
        let w = 250;

        let y = BABYLON.Mesh.CreateBox("y", h * 0.2, scene);
        y.scaling = new BABYLON.Vector3(0.05, 1, 1);
        y.position = new BABYLON.Vector3(0, 0, 0);
        meshes.push(y);

        let x = BABYLON.Mesh.CreateBox("x", h * 0.2, scene);
        x.scaling = new BABYLON.Vector3(1, 0.05, 1);
        x.position = new BABYLON.Vector3(0, 0, 0);
        meshes.push(x);

        let lineTop = BABYLON.Mesh.CreateBox("lineTop", w * .8, scene);
        lineTop.scaling = new BABYLON.Vector3(1, 0.005, 1);
        lineTop.position = new BABYLON.Vector3(0, h * 0.5, 0);
        meshes.push(lineTop);

        let lineBottom = BABYLON.Mesh.CreateBox("lineBottom", w * .8, scene);
        lineBottom.scaling = new BABYLON.Vector3(1, 0.005, 1);
        lineBottom.position = new BABYLON.Vector3(0, h * -0.5, 0);
        meshes.push(lineBottom);

        let lineLeft = BABYLON.Mesh.CreateBox("lineLeft", h, scene);
        lineLeft.scaling = new BABYLON.Vector3(0.010, 1, 1);
        lineLeft.position = new BABYLON.Vector3(w * -.4, 0, 0);
        meshes.push(lineLeft);

        let lineRight = BABYLON.Mesh.CreateBox("lineRight", h, scene);
        lineRight.scaling = new BABYLON.Vector3(0.010, 1, 1);
        lineRight.position = new BABYLON.Vector3(w * .4, 0, 0);
        meshes.push(lineRight);

        let gunSight = BABYLON.Mesh.MergeMeshes(meshes);
        gunSight.name = "gunSight";
        gunSight.layerMask = 0x20000000;
        gunSight.freezeWorldMatrix();

        let mat = new BABYLON.StandardMaterial("sightMat", scene);
        mat.checkReadyOnlyOnce = true;
        mat.emissiveColor = new BABYLON.Color3(0, 1, 0);
        gunSight.material = mat;
    }
    addGunSight(scene);
    BABYLON.SceneLoader.OnPluginActivatedObservable.addOnce(loader => {
        loader.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.NONE;
    });

    let mesh = BABYLON.AbstractMesh;
    let manager = new BABYLON.AssetsManager(scene);

    let fileTask = manager.addMeshTask(name + '__MeshTask', '', 'https://raw.githubusercontent.com/TiagoSilvaPereira/simple-3d-fps/master/public/assets/models/weapons/rifle/rifle.gltf');

    fileTask.onSuccess = (task) => {
        mesh = task.loadedMeshes[0];
        mesh.animationGroups = task.loadedAnimationGroups;

        mesh.animationGroups.forEach(function (animationGroup) {
            animationGroup.normalize(0, 160 / 30);
            animationGroup.stop();

        });
        let transformNode = new BABYLON.TransformNode('weapon', scene);
        transformNode.parent = camera;
        transformNode.scaling = new BABYLON.Vector3(3.5, 3.5, 3.5);
        transformNode.position = new BABYLON.Vector3(0.7, -0.45, 1.1);
        mesh.parent = transformNode;

    }

    manager.load();

    let alpha = 0;
    let bulletsCount = 0;
    let startTime = Date.now();
    let gameOver = false;
    let passTime;

    let gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    let bulletsCountText = new BABYLON.GUI.TextBlock();
    bulletsCountText.color = "#171545";
    bulletsCountText.text = `使用子彈：${bulletsCount}`;
    bulletsCountText.fontSize = 32;
    bulletsCountText.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    bulletsCountText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    gui.addControl(bulletsCountText);

    canvas.addEventListener("click", bulletEvent);

    function bulletEvent() {
        if (engine.isPointerLock) {

            mesh.animationGroups.forEach(function (animationGroup) {
                animationGroup.start(false, 1, 0 / 30, 10 / 30);
            });
            bulletsCount++;
            bulletsCountText.text = `使用子彈：${bulletsCount}`;
            let bullet = BABYLON.MeshBuilder.CreateSphere('bullet', {
                diameterX: 0.01,
                diameterY: 0.01,
                diameterZ: 80
            }, scene);
            bullet.position = camera.position.clone();
            bullet.rotation = camera.rotation.clone();
            bullet.speed = 5;
            bullet.material = new BABYLON.StandardMaterial('texture', scene);
            bullet.checkCollisions = true;
            bullet.material.diffuseColor = new BABYLON.Color3(3, 2, 0);
            // console.log(bullets[bulletId].checkCollisions)
            let cameraView = new BABYLON.Matrix();
            camera.getViewMatrix().invertToRef(cameraView);
            let direction = BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(0, 0, 75), cameraView);
            let bulletAnimation = scene.onBeforeRenderObservable.add(() => {
                bullet.position.addInPlace(direction);
                targets.some((element, index, arr) => {
                    if (bullet.intersectsMesh(arr[index], true)) {
                        targets[index].dispose();
                        bullet.dispose();
                        targets.splice(index, 1);
                        console.log(`hit ${element.num}`);
                        console.log(bullet);
                        return;
                    }
                });
                if (targets.length == 0) {
                    engine.isPointerLock = false;
                    // scene.onBeforeRenderObservable.remove(bulletAnimation);
                    let endTime = Date.now();
                    console.log((endTime - startTime) / 1000);
                    passTime = (endTime - startTime) / 1000;
                    gameOverScene(bulletsCount, passTime)
                    gameOver = true;

                }

            });
        } else {
            canvas.requestPointerLock();
            engine.isPointerLock = true;
        }

    }

    scene.registerBeforeRender(() => {
        alpha += 0.05;
        for (let i = 0; i < targets.length; i++) {
            if (targets[i].num % 2 == 0) {
                targets[i].position.x += Math.cos(alpha) / 2;
            } else {
                targets[i].position.y += Math.cos(alpha) / 4;
            }

        }
    })

    window.onkeydown = function (ev) {
        if (ev.keyCode == 82) { // r
            mesh.animationGroups.forEach(function (animationGroup) {
                animationGroup.start(false, 1, 11 / 30, 72 / 30);
            });
        }

    };

    let endScene = new BABYLON.Scene(engine);
    let endCamera = new BABYLON.ArcRotateCamera("endCamera", -Math.PI / 2, Math.PI / 2, 5, BABYLON.Vector3.Zero(), endScene);
    endCamera.attachControl(canvas, true);
    let endGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("endUI", true, endScene);
    let endText = new BABYLON.GUI.TextBlock();



    function gameOverScene(bulletsCount, passTime) {
        endText.text = `Game Over!\n使用子彈：${bulletsCount}\n花費時間：${passTime}`;
        endText.color = "white";
        endText.fontSize = "36";
        endGUI.addControl(endText);
        document.exitPointerLock();
        canvas.removeEventListener("click", bulletEvent);
        let restartBtn = BABYLON.GUI.Button.CreateSimpleButton("btn", "Restart");
        restartBtn.width = 0.2;
        restartBtn.height = "40px";
        restartBtn.color = "white";
        restartBtn.background = "#259B36";
        restartBtn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        restartBtn.isHitTestVisible = true;
        endGUI.addControl(restartBtn);
        restartBtn.onPointerClickObservable.add(() => {
            location.reload()
        });

    }



    engine.runRenderLoop(() => {
        if (gameOver == true) {
            endScene.render();
        } else {
            scene.render();
        }
    })



    scene.createDefaultEnvironment();

    return scene;
}


/******* End of the create scene function ******/

let scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
// engine.runRenderLoop(function () {

// });

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});