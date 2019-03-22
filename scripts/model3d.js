class Model3d extends HTMLElement{
    constructor(){
        super();

        let shadow = this.attachShadow({mode:'open'}); 
        //adds canvas to the component
        const cnv = document.createElement('canvas');
        cnv.setAttribute('id', 'renderCanvas');
        cnv.setAttribute('touch-action', 'none');
        cnv.style = "width: 100%; height: 100%; touch-action: none;";
        shadow.appendChild(cnv);

        let scene = null;
        let BJSloaded = false;

        //sets up the babylon environment for loading object into it
        function setUp3DEnvironment(){
            const engine = new BABYLON.Engine(cnv, true);

            let createScene = function () {
                var scene = new BABYLON.Scene(engine);
                scene.clearColor = new BABYLON.Color3(1, 1, 1);
                scene.createDefaultCameraOrLight(true, true, true);
                return scene;
            }

            scene = createScene();
            //starts the render loop
            engine.runRenderLoop(function () { 
                scene.render();
            });
            //manages resizing of container
            window.addEventListener("resize", function () {
                engine.resize();
            });
        }

        let loadBJS = new Promise((resolve, reject) => {
            try{
                const bjs = document.createElement('script');
                bjs.src = 'https://cdn.babylonjs.com/babylon.js';
                bjs.async = false;
                document.head.appendChild(bjs);
                const bjsloader = document.createElement('script');
                bjsloader.src = 'https://preview.babylonjs.com/loaders/babylonjs.loaders.min.js';
                bjsloader.async = false;
                document.head.appendChild(bjsloader);
                const pep = document.createElement('script');
                pep.src = 'https://code.jquery.com/pep/0.4.3/pep.js';
                pep.async = false;
                document.head.appendChild(pep);
                pep.addEventListener('load', function(){
                    BJSloaded = true;
                    resolve(true);
                    setUp3DEnvironment();
                });
            }
            catch(e){
                reject(e);
            }
        });

        this.getScene = function(){
            return scene;
        };

        /*LOAD 3D MODEL*/
        //method that loads a 3d model into the created scene
        let loadGLTFAux = function(file){
            scene.meshes.pop();
            const path = decodePath(file);
            var assetsManager = new BABYLON.AssetsManager(scene);
            const meshTask = assetsManager.addMeshTask('glb task', '', path[0], path[1]);
            meshTask.onSuccess = function (task){
                task.loadedMeshes[0].position = BABYLON.Vector3.Zero();
            }
            meshTask.onError = function(task, message, exception){
                console.log(message, exception);
            }

            assetsManager.load();
        };

        this.loadGLTF = function(file){
            loadBJS.then(function(fulfilled){
                loadGLTFAux(file);                
            })
            .catch(function (error){
                console.log(error.message);
            });
        };

        let changeBGColorAux = function(color){
            const s = scene;
            s.clearColor = new BABYLON.Color3.FromHexString(color);
        };

        this.changeBGColor = function(color){
            loadBJS.then(function(fulfilled){
                changeBGColorAux(color);                
            })
            .catch(function (error){
                console.log(error.message);
            });
        };

        //separates path from file name in given resource
        let decodePath = function(path){
            const fileStart = path.lastIndexOf('/') + 1;
            const fileName = path.substring(fileStart);
            const filePath = path.substring(0, fileStart);
            return [filePath, fileName];
        };
    }

    /*HANDLING ATTRIBUTES*/
    static get observedAttributes(){
        return ['src', 'background-color'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'src':
                console.log(`loading ${newValue}...` );    
                this.loadGLTF(newValue); 
                break;
            case 'background-color':
                console.log(`changing color to ${newValue} from ${oldValue}`);
                this.changeBGColor(newValue);                
                break;            
            default:
                break;
        }
    }

    get modelUrl(){
        return this.getAttribute('model-url');
    }

    get backgroundColor(){
        return this.getAttribute('background-color');
    }

    set modelUrl(newValue){
        this.setAttribute('model-url', newValue);
    }

    set backgroundColor(newValue){
        this.setAttribute('background-color', newValue);
    }
}

customElements.define('model-3d', Model3d);