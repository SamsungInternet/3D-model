const canvas = document.getElementById("renderCanvas"); // Get the canvas element 
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

const createScene = function () {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(1, 1, 1);
    scene.createDefaultCameraOrLight(true, true, true);
    return scene;
}
const scene = createScene(); //Call the createScene function
engine.runRenderLoop(function () { //starts the render loop
    scene.render();
});
window.addEventListener("resize", function () { //manages resizing of browser
    engine.resize();
});

// SCENE CREATED

let loadGLTF = function(scn, folder, file){
    var assetsManager = new BABYLON.AssetsManager(scn);
    let meshTask = assetsManager.addMeshTask("glb task", "", folder, file);
    meshTask.onSuccess = function (task){
        task.loadedMeshes[0].position = BABYLON.Vector3.Zero();
    }
    meshTask.onError = function(task, message, exception){
        console.log(message, exception);
    }
    assetsManager.load();
};

