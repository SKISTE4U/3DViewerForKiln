var canvas = document.getElementById("renderCanvas");

var last_user_activity = 0
var wireframe = true
var error_buttons = []
var debug = true

var global_camera = null
var default_material = null
var error_material = null
var error_line = null
var engine = null;
var scene = null;
var sceneToRender = null;

// Добавление хоткеев
// document.addEventListener
//     (
//         'keydown',
//         (e) =>
//         {
//         if(e.keyCode == 87){isWPressed=true;}
//         if(e.keyCode == 65){isAPressed=true;}
//         if(e.keyCode == 83){isSPressed = true;}
//         if(e.keyCode == 68){isDPressed=true;}
//         }
//     );

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}


function change_debug_mode() {
    let temp = document.querySelectorAll('.debug_mode')
    if(debug){
        for (let x = 0; x < temp.length; x++) {
            const element = temp[x];
            element.style.display = 'none'
        }
        debug = false
    }
    else{
        for (let x = 0; x < temp.length; x++) {
            const element = temp[x];
            element.style.display = 'block'
        }
        debug = true
    }
}

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
    global_camera.wheelPrecision = wheelPrecision
    if(load_obj_from_pastebin){
        var base64_model_content = httpGet('https://raw.githubusercontent.com/ebustep/ZVD/refs/heads/main/ZVD.TXT')
    }
    else{
        var base64_model_content = ZVD_obj
    }

    const glbDataUri = "data:model/gltf-binary;base64,"+base64_model_content;
        BABYLON.SceneLoader.Append("", glbDataUri, scene, function (scene) {
            console.log("Модель успешно загружена!");
        }, undefined, function (error) {
            console.error("Ошибка загрузки модели:", error);
        }, ".glb");
    

    // Фон
    var raw_content = BABYLON.Tools.DecodeBase64('data:base64,'+BG);
    var blob = new Blob([raw_content]);
    var url = URL.createObjectURL(blob);
    var layer = new BABYLON.Layer('',url, scene, true);


    setInterval(rotate,rotate_thread_interval)
    setInterval(checker_thread,checker_thread_time)

    // Smoke

    // const particleSystem = new BABYLON.ParticleSystem("particles", 2000);
    // particleSystem.particleTexture = new BABYLON.Texture("files/smoke.png");
    // particleSystem.emitter = new BABYLON.Vector3(4.504145333060981,50.531755720584904,-7.312920189767313);
    // particleSystem.minLifeTime = 0.3;
    // particleSystem.maxLifeTime = 1.5;
    // particleSystem.emitRate = 20;
    // particleSystem.direction1 = new BABYLON.Vector3(0, 4, 0);
    // particleSystem.start();;

    const light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, 3, 0), scene);
    light.diffuse = new BABYLON.Color4(.2,0.2,0.2,1)

    // MATERIALS 
    default_material = new BABYLON.StandardMaterial(scene);
    default_material.alpha = 1;
    default_material.diffuseColor = new BABYLON.Color3(0, 0.9, 0);

    error_material = new BABYLON.StandardMaterial("", scene);
    error_material.emissiveColor = new BABYLON.Color3(0, 0.3, 0);
    error_material.disableLighting = true;
    error_material.emissiveColor.g = 0;
    error_material.hasAlpha = true

    // Добавление датчиков в 3D
    for (let x = 0; x < SENSORS.length; x++) {
        const element = SENSORS[x];
        var sphere = BABYLON.MeshBuilder.CreateSphere(element['name']+';'+element.PIW, {diameter: SensorsDiameter, segments: 6}, scene);
        sphere.position.x = element['position'][0]
        sphere.position.y = element['position'][1]
        sphere.position.z = element['position'][2]
        // console.log(SENSORS[x])
        sphere.material = default_material
        sphere.isPickable = true
        sphere.SKISTE_is_error = false
        SENSORS[x]["sensor"] = sphere
    }

    // Запоминание времени последнего ввода пользователя
    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                last_user_activity = Date.now()
                break;
        }
    });

    // Проверка, нажал ли пользователь на датчик или нет
    scene.onPointerDown = function (evt, pickResult1) {
        // We try to pick an object
    };

    document.getElementById("fps").innerHTML = engine.getFps().toFixed() + " fps";
        let vector = { x:'', y:'', z:'' };
            scene.onPointerDown = function (event, pickResult){
                try{
                    if (DEBUG_FOR_SAVE_COORDS){
                        //left mouse click
                        if(event.button == 0){
                            vector = pickResult.pickedPoint;
                            console.log('left mouse click: ' + vector.x + ',' + vector.y + ',' + vector.z );
                            let rand_int = randint(0,100000)
                            let text = `{'name':'sensor_RENAME_ME','PIW':${rand_int},'error':false,'position':[${vector['x']},${vector['y']},${vector['z']}],'pdf':'RENAME_ME.pdf'},`
                            unsecuredCopyToClipboard(text);

                            let sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {diameter: SensorsDiameter, segments: 6}, scene);
                            sphere.position.x = vector['x']
                            sphere.position.y = vector['y']
                            sphere.position.z = vector['z']
                            sphere.material = default_material
                            sphere.isPickable = true
                            show_popup(null,true,text='Датчик успешно скопирован в буфер обмена')
                        }
                        
                    }
                
                
                    // let pickResult = scene.pick(scene.pointerX, scene.pointerY);
                    if(pickResult.pickedMesh.name.startsWith('sensor_')){
                        show_popup(pickResult.pickedMesh,false,'')
                    }

                    const ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), global_camera);
                    const hits = scene.multiPickWithRay(ray);

                    if (hits.length > 0) {
                        console.log("Все меши под курсором:");
                        for (let x = 0; x < hits.length; x++) {
                            const element = hits[x];
                            if(element.pickedMesh.name.startsWith('sensor_') && element.pickedMesh.SKISTE_is_error){
                                show_popup(element.pickedMesh,false,'')
                                break
                            }
                            console.log("- Меш:", element.pickedMesh.name);
                        }
                    }
                }
                catch(error){
                    console.log(error)
                }

    }

    setInterval(create_error_lines,error_line_thread_time)

    setTimeout(function () {
        scene.animationGroups.forEach((animatioName)=>{
            const animationType = scene.getAnimationGroupByName(animatioName.name);
            // console.log(animatioName)
            animationType.start(true, 1.0, animationType.from, animationType.to, false)
        })
    },1000)

    // Create blinking material
    var t = 0;
    scene.registerBeforeRender(() => {
        t += 0.05;
        var red = Math.cos(t) * 0.5 + 0.5;
        var gr = Math.cos(t) * 0.5 - 0.5;
        error_material.emissiveColor.r = red;
        error_material.emissiveColor.g = gr*-1;
        light.direction = global_camera.position
    });
    return scene;
};

function unsecuredCopyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Unable to copy to clipboard', err);
    }
    document.body.removeChild(textArea);
  }

function getInfoAboutSensor(text) {
    alert(text)
}

function getSensorNumberByPIW(PIW) {
    for (let x = 0; x < SENSORS.length; x++) {
        const element = SENSORS[x];
        if (PIW == element.PIW) {
            return x
        }
    }
}

function getSensorInfo(num) {
//     alert(`Инфа про датчик:
// PIW - ${SENSORS[num].PIW}
// Название - ${SENSORS[num].name}
// Пдфка - ${SENSORS[num].pdf}
// Координаты - ${SENSORS[num].position}`)
    let pdf_path = window.location.origin+'/pdf/'+SENSORS[num]['pdf']
    window.open(pdf_path, '_blank').focus();
}

function create_error_lines() {
    let df = document.querySelector('#test')
    let offset = 0
    df.querySelector('svg').innerHTML = ''
    let temp = []
    let pos2 = {
        _x: document.body.offsetWidth - ErrorLineOffsetRight,
        _y: document.body.offsetHeight - ErrorLineOffsetBottom
    }
    for (let x = 0; x < SENSORS.length; x++) {
        const element = SENSORS[x];
        if(element['error']){
            temp.push(element.PIW)
            const pos = BABYLON.Vector3.Project(
                SENSORS[x]['sensor'].getAbsolutePosition(),
                BABYLON.Matrix.IdentityReadOnly,
                scene.getTransformMatrix(),
                global_camera.viewport.toGlobal(
                    engine.getRenderWidth(),
                    engine.getRenderHeight(),
                ),
            );
            
            if(cursor_x >= pos2._x && cursor_x <= pos2._x+WidthLine && cursor_y >= pos2._y - offset - offsetOfErrorLine && cursor_y <= pos2._y - offset){
                df.querySelector('svg').innerHTML = df.querySelector('svg').innerHTML + `
                <line  style="cursor:pointer" id="theline" x1="${pos._x}" y1="${pos._y}" x2="${pos2._x}" y2="${pos2._y-offset}" stroke="red" stroke-width="2" stroke-opacity="50%" />`
            }
            df.querySelector('svg').innerHTML = df.querySelector('svg').innerHTML + `
            <line  style="cursor:pointer" id="theline" x1="${pos2._x}" y1="${pos2._y-offset}" x2="${pos2._x+WidthLine}" y2="${pos2._y-offset}" stroke="red" stroke-width="2"/>
            `
            offset += offsetOfErrorLine
        }
    }
    if(!isArraysEqual(error_buttons, temp)){
        offset = offsetOfErrorLine
        let temp1 = document.querySelectorAll('.sensor_error_button')
        for (let x = 0; x < temp1.length; x++) {
            const element = temp1[x];
            // console.log(element)
            element.remove()
        }
        for (let x = 0; x < temp.length; x++) {
            let numb = getSensorNumberByPIW(temp[x]);
            const element = SENSORS[numb]
            let button = document.createElement('input')
            button.type = 'button'
            button.value = element.name.split('sensor_')[1] + ' | PIW: '+element['PIW']
            // button.innerHTML = element.name.split('sensor_')[1] + ' | PIW: '+element['PIW']
            button.style.top = pos2._y-offset+'px'
            button.style.left = pos2._x+'px'
            button.style.width = WidthLine+'px'
            button.style.height = offsetOfErrorLine + 'px'
            button.classList.add('sensor_error_button')
            button.setAttribute('onclick',`getSensorInfo(${numb})`)
            document.body.appendChild(button)
            offset += offsetOfErrorLine
        }
        // console.log(error_buttons)
        // console.log(temp)
        if(error_buttons != temp){console.log('no')}
        error_buttons = temp
        
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
        error_buttons = []
        // this.document.querySelector('#test').querySelector('svg').height = window.innerHeight
        // this.document.querySelector('#test').querySelector('svg').width = window.innerWidth
    });


