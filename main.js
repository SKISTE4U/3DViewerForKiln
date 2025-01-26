var canvas = document.getElementById("renderCanvas");

var last_user_activity = 0
var wireframe = true

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}
var cursor_x, cursor_y;
function onMouseUpdate(e) {
    cursor_x = e.pageX;
    cursor_y = e.pageY;
  }

document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
function rotate() {
    if ((Date.now() - last_user_activity) > idle_time){
        global_camera.alpha += .01
    }
}
function checker_thread() {
    for (let x = 0; x < SENSORS.length; x++) {
        const element = SENSORS[x];
        if(element['error']){
            go_error_sensor(element['sensor'])
        }
        else{
            go_okay_sensor(element['sensor'])
        }
    }
}
function error_line_thread() {
    lines = [
        [
            new BABYLON.Vector3(global_camera.position._x,global_camera.position._y,global_camera.position._z),
            new BABYLON.Vector3(SENSORS[0]['position'][0],SENSORS[0]['position'][1],SENSORS[0]['position'][2])
        ]
    ]
    BABYLON.MeshBuilder.CreateLineSystem(null, {instance: error_line, lines: lines})
}
function go_wireframe() {
    for (let x = 0; x < window.scene.meshes.length; x++) {
        try{
            console.log(wireframe)
            const element = window.scene.meshes[x];
            element.material.wireframe = wireframe
            element.material.wireframe = wireframe
        }
        catch{
            console.log('error')
        }
    }
    if(wireframe){wireframe=false}
    else{wireframe=true}
}
function reskin_sensors(type) {
    for (let x = 0; x < SENSORS.length; x++) {
        const element = SENSORS[x]['sensor'];
        if(type == 'default_material'){SENSORS[x]['error'] = false}
        else if(type == 'error_material'){SENSORS[x]['error'] = true}
    }
}
function go_error_sensor(sensor) {
    sensor.material = error_material
    sensor.renderingGroupId = 1
}
function go_okay_sensor(sensor){
    sensor.material = default_material
    sensor.renderingGroupId = 0
}
function remove_clickable() {
    for (let x = 0; x < window.meshes.length; x++) {
        const element = window.meshes[x];
        try{
            if(element.name.startsWith('sensor_')){}
            else{element.isPickable = false}
            
        }
        catch{}
    }
}

var global_camera = null
var default_material = null
var error_material = null
var error_line = null
var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
var createScene = function () {

    var scene = new BABYLON.Scene(engine);
    scene.createDefaultCameraOrLight(true, true, true);
    global_camera = scene.getCameraByID("default camera");
    // camera.lowerRadiusLimit = 10;
    // camera.upperRadiusLimit = 10;
    global_camera.position = new BABYLON.Vector3(70,50,0)
    global_camera.target = new BABYLON.Vector3(0,20,-10)

    if (FixedBetaAngle){
        global_camera.lowerBetaLimit = lowerBeta;
        global_camera.upperBetaLimit = lowerBeta;
    }
    else{
        global_camera.lowerBetaLimit = lowerBeta;
        global_camera.upperBetaLimit = upperBeta;
    }

    if(load_obj_from_pastebin){
        var base64_model_content = 'data:base64,'+ httpGet('https://raw.githubusercontent.com/ebustep/ZVD/refs/heads/main/ZVD.TXT')
    }
    else{
        var base64_model_content = 'data:base64,'+ZVD_obj
    }
    var raw_content = BABYLON.Tools.DecodeBase64(base64_model_content);
    var blob = new Blob([raw_content]);
    var url = URL.createObjectURL(blob);

    BABYLON.SceneLoader.Append("", url, scene, function () {
        scene.ArcRotateCamera(true, true, true);
        console.log('ff')
        const names = scene.meshes.map(mesh => mesh.name);
        console.log(names)
    }, undefined, undefined, ".glb");

    
    // scene.meshes[1].material = error_material
    var raw_content = BABYLON.Tools.DecodeBase64('data:base64,'+BG);
    var blob = new Blob([raw_content]);
    var url = URL.createObjectURL(blob);
    var layer = new BABYLON.Layer('',url, scene, true);


    setInterval(rotate,30)
    setInterval(checker_thread,checker_thread_time)
    // setInterval(error_line_thread,error_line_thread_time)

    // MATERIALS 
    default_material = new BABYLON.StandardMaterial(scene);
    default_material.alpha = 1;
    default_material.diffuseColor = new BABYLON.Color3(0, 0.9, 0);

    error_material = new BABYLON.StandardMaterial("", scene);
    error_material.emissiveColor = new BABYLON.Color3(0, 0.3, 0);
    error_material.disableLighting = true;

    for (let x = 0; x < SENSORS.length; x++) {
        const element = SENSORS[x];
        var sphere = BABYLON.MeshBuilder.CreateSphere(element['name'], {diameter: SensorsDiameter, segments: 6}, scene);
        sphere.position.x = element['position'][0]
        sphere.position.y = element['position'][1]
        sphere.position.z = element['position'][2]
        console.log(SENSORS[x])
        SENSORS[x]["sensor"] = sphere
        sphere.material = default_material
        sphere.isPickable = true
    }

    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                last_user_activity = Date.now()
                break;
        }
    });

    
    if (DEBUG_FOR_SAVE_COORDS){
        let vector = { x:'', y:'', z:'' };
            scene.onPointerDown = function (event, pickResult){
                //left mouse click
                if (pickResult.hit) {
                    if(pickResult.pickedMesh.name.startsWith('sensor_')){alert(pickResult.pickedMesh.name)}
                    console.log(pickResult)
                }
                if(event.button == 0){
                        vector = pickResult.pickedPoint;
                        console.log('left mouse click: ' + vector.x + ',' + vector.y + ',' + vector.z );
                }
                //right mouse click
                if(event.button == 2){
                        vector.x = pickResult.pickedPoint.x;
                        vector.y = pickResult.pickedPoint.y;
                        vector.z = pickResult.pickedPoint.z;
                        console.log('right mouse click: ' + vector.x + ',' + vector.y + ',' + vector.z );
                }
                //Wheel button or middle button on mouse click
                if(event.button == 1){
                        vector['x'] = pickResult.pickedPoint['x'];
                        vector['y'] = pickResult.pickedPoint['y'];
                        vector['z'] = pickResult.pickedPoint['z'];
                        console.log('middle mouse click: ' + vector.x + ',' + vector.y + ',' + vector.z );
                }
                // navigator.clipboard.writeText(`${vector['x']},${vector['y']},${vector['z']}`);
        }
    }

    setInterval(create_error_lines,error_line_thread_time)

    // Create blinking material
    var t = 0;
    scene.registerBeforeRender(() => {
        t += 0.05;
        var red = Math.cos(t) * 0.5 + 0.5;
        error_material.emissiveColor.r = red;
    });
    return scene;
};

function getInfoAboutSensor(text) {
    alert(text)
}

function create_error_lines() {
    let df = document.querySelector('#test')
    let offset = 0
    df.querySelector('svg').innerHTML = ''
    let temp = document.querySelectorAll('.sensor_error_button')
    for (let x = 0; x < temp.length; x++) {
        const element = temp[x];
        element.remove()
    }
    for (let x = 0; x < SENSORS.length; x++) {
        const element = SENSORS[x];
        if(element['error']){
            const pos = BABYLON.Vector3.Project(
                SENSORS[x]['sensor'].getAbsolutePosition(),
                BABYLON.Matrix.IdentityReadOnly,
                scene.getTransformMatrix(),
                global_camera.viewport.toGlobal(
                    engine.getRenderWidth(),
                    engine.getRenderHeight(),
                ),
            );
            let pos2 = {
                _x: window.screen.availWidth - 500,
                _y: window.screen.availHeight - 200
            }
            if(cursor_x >= pos2._x && cursor_x <= pos2._x+WidthLine && cursor_y >= pos2._y - offset - 40 && cursor_y <= pos2._y - offset){
                df.querySelector('svg').innerHTML = df.querySelector('svg').innerHTML + `
                <line  style="cursor:pointer" id="theline" x1="${pos._x}" y1="${pos._y}" x2="${pos2._x}" y2="${pos2._y-offset}" stroke="red" stroke-width="2"/>`
            }
            df.querySelector('svg').innerHTML = df.querySelector('svg').innerHTML + `
            <line  style="cursor:pointer" id="theline" x1="${pos2._x}" y1="${pos2._y-offset}" x2="${pos2._x+WidthLine}" y2="${pos2._y-offset}" stroke="red" stroke-width="2"/>
            `
            offset += offsetOfErrorLine
            let button = document.createElement('input')
            button.type = 'button'
            button.value = element.name.split('sensor_')[1] + ' | PIW: '+element['PIW']
            button.style.top = pos2._y-offset+'px'
            button.style.left = pos2._x+'px'
            button.style.width = WidthLine+'px'
            button.style.height = offsetOfErrorLine + 'px'
            button.classList.add('sensor_error_button')
            button.setAttribute('onclick',`alert('ff')`)
            document.body.appendChild(button)
        }
    }
    
    
}
window.initFunction = async function() {
    var asyncEngineCreation = async function() {
        try {
        return createDefaultEngine();
        } catch(e) {
        console.log("the available createEngine function failed. Creating the default engine instead");
        return createDefaultEngine();
        }
    }

    window.engine = await asyncEngineCreation();
    if (!engine) throw 'engine should not be null.';

    startRenderLoop(engine, canvas);

    window.scene = createScene();
};
initFunction().then(() => {sceneToRender = scene
    });

    // Resize
    window.addEventListener("resize", function () {
        engine.resize();
        // this.document.querySelector('#test').querySelector('svg').height = window.innerHeight
        // this.document.querySelector('#test').querySelector('svg').width = window.innerWidth
    });


