class Model3d extends HTMLElement{
    constructor(){
        super();

        // attaches shadow dom
        let shadow = this.attachShadow({mode:'open'});
        
        //adds babylon
        let bjs = document.createElement('script');
        bjs.src = 'https://cdn.babylonjs.com/babylon.js';
        bjs.async = false;
        document.head.appendChild(bjs);
        let bjsloader = document.createElement('script');
        bjsloader.src = 'https://preview.babylonjs.com/loaders/babylonjs.loaders.min.js';
        bjsloader.async = false;
        document.head.appendChild(bjsloader);
        let pep = document.createElement('script');
        pep.src = 'https://code.jquery.com/pep/0.4.3/pep.js';
        pep.async = false;
        document.head.appendChild(pep);
        
        //adds canvas to the component
        let cnv = document.createElement('canvas');
        cnv.setAttribute('id', 'renderCanvas');
        cnv.setAttribute('touch-action', 'none');
        shadow.appendChild(cnv);

        document.addEventListener('DOMContentLoaded', function() {
            window.setTimeout(function(){const engine = new BABYLON.Engine(cnv, true);}, 2000);

        });

        


        const model_shell = `

        <style>
            #renderCanvas {
                width: 300px;
                height: 300px;
                touch-action: none;
                background-color:yellow;
            }
        </style>
        
        <script>
        //
            let sroot = this.shadowRoot; 
            const canvas = sroot.querySelector("#renderCanvas"); // Get the canvas element
            const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
            
            const createScene = function () {
                var scene = new BABYLON.Scene(engine);
                //scene.clearColor = new BABYLON.Color3(1, 1, 1);
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

            loadGLTF(scene, '/models/', 'origami-frog.glb')
        </script>
        `;
       
    }
}
customElements.define('model-3d', Model3d);