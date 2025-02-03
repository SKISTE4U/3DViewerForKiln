
// Постоянное обновление позиции курсора
var cursor_x, cursor_y;
function onMouseUpdate(e) {
    cursor_x = e.pageX;
    cursor_y = e.pageY;
}
document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);


// Экран загрузки
setTimeout(function() {
    let temp = document.querySelector('.reklama')
    temp.style.animation = 'opacity_low 1s ease-in-out forwards'
    temp.querySelector('.logo').style.animation = 'remove 1s ease-in-out forwards'
},reklama_time)
setTimeout(function() {
    let temp = document.querySelector('.reklama')
    temp.style.display = 'none'
},reklama_time+1000)

// GET запрос для оперативной загрузки модели из гитхаб
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

// Прокрутка камеры пока пользователь афк
function rotate() {
    if ((Date.now() - last_user_activity) > idle_time){
        global_camera.alpha += .005
    }
}

// Поток, который раз в N секунд проверяет датчики на их ошибку и перекрашивает их
function checker_thread() {
    for (let x = 0; x < SENSORS.length; x++) {
        const element = SENSORS[x];
        if(element['error']){
            if(element['error'] != element.sensor.SKISTE_is_error){
                go_error_sensor(element['sensor'])
            }
        }
        else{
            if(element['error'] != element.sensor.SKISTE_is_error){
                go_okay_sensor(element['sensor'])
            }
        }
    }
}

// Перекрашивание датчика на модели
function go_error_sensor(sensor) {
    sensor.material = error_material
    sensor.renderingGroupId = 1
    sensor.SKISTE_is_error = true
}
function go_okay_sensor(sensor){
    sensor.material = default_material
    sensor.renderingGroupId = 0
    sensor.SKISTE_is_error = false
}

// Случайное число
function randint(min, max) {
    return parseInt(Math.random() * (max - min) + min)
}

// Равны ли два массива
function isArraysEqual(firstArray, secondArray) {
    return firstArray.toString() === secondArray.toString();
}

// Перевести модель в wireframe режим
function go_wireframe() {
    for (let x = 0; x < window.scene.meshes.length; x++) {
        try{
            // console.log(wireframe)
            const element = window.scene.meshes[x];
            element.material.wireframe = wireframe
            element.material.wireframe = wireframe
        }
        catch{
            // console.log('error')
        }
    }
    if(wireframe){wireframe=false}
    else{wireframe=true}
}

// Перевод всех датчиков в ошибку или обратно
function reskin_sensors(type) {
    for (let x = 0; x < SENSORS.length; x++) {
        const element = SENSORS[x]['sensor'];
        if(type == 'default_material'){SENSORS[x]['error'] = false}
        else if(type == 'error_material'){SENSORS[x]['error'] = true}
    }
}

// Открыть меню датчиков
function show_settings_sensors(){
    let zone = document.querySelector('.sensors_zone').querySelector('.sensors')
    zone.innerHTML = ''
    document.querySelector('.sensors_zone').style.display = 'block'
    for (let x = 0; x < SENSORS.length; x++) {
        const element = SENSORS[x];
        let div = document.createElement('div')
        div.classList.add('one_sensor')
        let color = 'white'
        if(element.error){
            color = 'rgba(247, 90, 90, 0.55)'
        }
        else{
            color = 'rgba(90, 247, 150, 0.55)'
        }
        div.innerHTML = `
        <div class="name">${element.name.split('sensor_')[1]}</div>
                    <div class="piw">${element.PIW}</div>
                    <div class="pdf_file">${element.pdf}</div>
                    <div class="error">
                        <input type="button" style='background:${color};' value="ошибка" onclick="change_sensor_status(this,${x})">
                    </div>`
        zone.appendChild(div)
    }
}

// Поменять статус датчика из меню датчиков
function change_sensor_status(elem,num) {
    if(SENSORS[num].error){
        SENSORS[num].error = false;
        elem.style.background = 'rgba(90, 247, 150, 0.55)';
    }
    else{
        SENSORS[num].error = true
        elem.style.background = 'rgba(247, 90, 90, 0.55)';
    }
}

// Показать уведомление при нажатии на датчик
function show_popup(sensor) {
    console.log('show_popup')
    let div = document.createElement('div')
    div.classList.add('popup')
    div.style.top = cursor_y - (popup_size[1]+20) + 'px'
    div.style.left = cursor_x - (popup_size[0]/2) +'px'
    div.style.width = popup_size[0] + 'px'
    div.style.height = popup_size[1] + 'px'
    let name = sensor.name.split('sensor_')[1].split(';')[0]
    let piw = sensor.name.split('sensor_')[1].split(';')[1]
    div.innerHTML = '<div class="name">'+name+'<br>PIW: '+piw+'</div><div class="triangle"></div>'
    div.style.animation = 'show_popup .5s ease-in-out forwards'
    let interval = setInterval(function () {
        const pos = BABYLON.Vector3.Project(
            sensor.getAbsolutePosition(),
            BABYLON.Matrix.IdentityReadOnly,
            scene.getTransformMatrix(),
            global_camera.viewport.toGlobal(
                engine.getRenderWidth(),
                engine.getRenderHeight(),
            ),
        );
        div.style.left = pos._x - (popup_size[0]/2) +'px'
        div.style.top = pos._y - (popup_size[1]+20) + 'px'
    },popup_moving_thread_time)
    setTimeout(function () {
        div.style.animation = 'close_popup .5s ease-in-out forwards'
    },popup_livetime)
    setTimeout(function () {
        clearInterval(interval)
        div.remove()
    },popup_livetime+500)
    document.body.append(div)
}

// Придать всем датчикам рендер поверх всего
function show_all_sensors(elem,showOrNot) {
    if(showOrNot){
        elem.setAttribute('onclick','show_all_sensors(this,false)')
        for (let x = 0; x < SENSORS.length; x++) {
            const element = SENSORS[x];
            element.sensor.renderingGroupId = 1
        }
    }
    else{
        elem.setAttribute('onclick','show_all_sensors(this,true)')
        for (let x = 0; x < SENSORS.length; x++) {
            const element = SENSORS[x];
            element.sensor.renderingGroupId = 0
        }
    }
}

// Кнопка выдвижения настроек
function show_settings(elem,isShowing) {
    if(isShowing){
        elem.setAttribute('onclick','show_settings(this,false)')
        document.querySelector('.close_button').querySelector('img').style.animation = 'open_settings_button .5s ease-in-out forwards'
        document.querySelector('.settings').style.animation = 'show_settings .5s ease-in-out forwards'
    }
    else{
        elem.setAttribute('onclick','show_settings(this,true)')
        document.querySelector('.close_button').querySelector('img').style.animation = 'closing_settings_button .5s ease-in-out forwards'
        document.querySelector('.settings').style.animation = 'close_settings .5s ease-in-out forwards'
    }
}