
// Постоянное обновление позиции курсора
var cursor_x, cursor_y;
function onMouseUpdate(e) {
    cursor_x = e.pageX;
    cursor_y = e.pageY;
}
document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);

// GET запрос для оперативной загрузки модели из гитхаб
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function pdf_zone_event() {
    let pdf_zone = document.querySelector('.pdf_zone')
    pdf_zone.addEventListener('onmouseup',(e) => {console.log(e)})
}

function onContentLoaded() {
    console.log('onContentLoaded init')
    pdf_zone_event()
}

// Копирование текста, которое обходит CORS
// function unsecuredCopyToClipboard(text) {
//     const textArea = document.createElement("textarea");
//     textArea.value = text;
//     document.body.appendChild(textArea);
//     textArea.focus();
//     textArea.select();
//     try {
//       document.execCommand('copy');
//     } catch (err) {
//       console.error('Unable to copy to clipboard', err);
//     }
//     document.body.removeChild(textArea);
//     canvas.focus()
//   }

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
  
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
  
    document.body.removeChild(textArea);
  }
function unsecuredCopyToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function() {
        console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
  }

// Прокрутка камеры пока пользователь афк
function rotate() {
    if ((Date.now() - last_user_activity) > idle_time){
        global_camera.alpha += camera_alpha
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
function reskin_sensors(type = 'default_material') {
    if(isDeveloper){
        if(type == 'default_material'){
            show_popup(null,true,'Все датчики - ОК')
            for (let x = 0; x < SENSORS.length; x++) {
                SENSORS[x]['error'] = false
            }
        }
        else if(type == 'error_material'){
            show_popup(null,true,'Все датчики - Ошибка')
            for (let x = 0; x < SENSORS.length; x++) {
                SENSORS[x]['error'] = true
            }
        }
    }else{
        show_popup(null,true,'Вы не в режиме разработчика', 4000)
    }
}

// Открыть меню датчиков
function show_settings_sensors(remove=false){
    if(remove){
        document.querySelector('.sensors_zone').style.display = 'none'
        return
    }
    if(isDeveloper){
        let zone = document.querySelector('.sensors_zone').querySelector('.sensors')
        zone.innerHTML = ''
        if(document.querySelector('.sensors_zone').style.display == 'block'){
            document.querySelector('.sensors_zone').style.display = 'none'
            return
        }
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
            <div class="name">${element.name}</div>
                        <div class="piw">${element.PIW}</div>
                        <div class="pdf_file">${element.pdf}</div>
                        <div class="error">
                            <input type="button" style='background:${color};' value="ошибка" onclick="change_sensor_status(this,${x})">
                        </div>`
            zone.appendChild(div)
        }
    }else{
        show_popup(null,true,'Вы не в режиме разработчика', 4000)
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
function show_popup(sensor = null, justPopup = false,text = 'EDIT ME',life_time = popup_livetime) {
    console.log('show_popup')
    let div = document.createElement('div')
    div.classList.add('popup')
    // div.style.top = cursor_y - (popup_size[1]+20) + 'px'
    // div.style.left = cursor_x - (popup_size[0]/2) +'px'
    div.style.top = '10px'
    div.style.left = '50px'
    div.style.width = popup_size[0] + 'px'
    div.style.minHeight = popup_size[1] + 'px'
    div.style.animation = 'show_popup .5s ease-in-out forwards'

    if(!justPopup){
        let name = sensor.name.split('sensor_')[1].split(';')[0]
        let piw = sensor.name.split('sensor_')[1].split(';')[1]
        div.innerHTML = '<div class="name">'+name+'<br><br>PIW: '+piw+'</div><div class="triangle"></div>'
        var interval = setInterval(function () {
            // console.log(div.offsetHeight)
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
            div.style.top = pos._y - (div.offsetHeight+20) + 'px'
        },popup_moving_thread_time)
    }
    else{
        div.innerHTML = '<div class="name">'+text+'</div>'
    }
    setTimeout(function () {
        div.style.animation = 'close_popup .5s ease-in-out forwards'
    },life_time)
    setTimeout(function () {
        try{clearInterval(interval)}
        catch (error){console.log(error)}
        div.remove()
    },life_time+500)
    document.body.append(div)
}

// Придать всем датчикам рендер поверх всего
function show_all_sensors(elem,showOrNot) {
    if(isDeveloper){
        if(showOrNot){
            elem.setAttribute('onclick','show_all_sensors(this,false)')
            show_popup(null,true,'Теперь вы видите все датчики насквозь')
            for (let x = 0; x < SENSORS.length; x++) {
                const element = SENSORS[x];
                element.sensor.renderingGroupId = 1
            }
        }
        else{
            elem.setAttribute('onclick','show_all_sensors(this,true)')
            show_popup(null,true,'Теперь вы видите датчики как обычно')
            for (let x = 0; x < SENSORS.length; x++) {
                const element = SENSORS[x];
                element.sensor.renderingGroupId = 0
            }
        }
    }else{
        show_popup(null,true,'Вы не в режиме разработчика', 4000)
    }
}

// Кнопка выдвижения настроек
function show_settings(elem,isShowing) {
    if(isShowing){
        elem.setAttribute('onclick','show_settings(this,false)')
        document.querySelector('.close_button').querySelector('img').style.animation = 'open_settings_button .5s ease-in-out forwards'
        document.querySelector('.settings').style.animation = 'show_settings .5s ease-in-out forwards'
        document.querySelector('.close_button').style.opacity = '1'
    }
    else{
        elem.setAttribute('onclick','show_settings(this,true)')
        document.querySelector('.close_button').querySelector('img').style.animation = 'closing_settings_button .5s ease-in-out forwards'
        document.querySelector('.close_button').style.opacity = '.1'
        document.querySelector('.settings').style.animation = 'close_settings .5s ease-in-out forwards'
    }
}

// Перейти в режим добавления датчиков
function adding_sensors_mode() {
    if(isDeveloper){
        if(DEBUG_FOR_SAVE_COORDS){
            DEBUG_FOR_SAVE_COORDS = false
            show_popup(null,true,'Вы вышли из режима добавления датчиков')
        }
        else{
            DEBUG_FOR_SAVE_COORDS = true
            show_popup(null,true,'Вы перешли в режим добавления дачтиков, попрошу заметить, что нужно добавлять в файл из буфера обмена',5000)
        }
    }else{
        show_popup(null,true,'Вы не в режиме разработчика', 4000)
    }
}

// Перейти в режим разработчика
function goDeveloper(elem) {
    if(isDeveloper){
        removeIfNotDeveloper()
        isDeveloper = false
        elem.querySelector('img').src = 'public/developer_white.png'
        show_popup(null,true,'Вы вышли из режима разработчика, обратная связь снова подключена', 4000)
    }
    else{
        isDeveloper = true
        elem.querySelector('img').src = 'public/developer_green.png'
        show_popup(null,true,'Вы вошли в режим разработчика, в этом режиме не работает обратная связь с датчиков', 4000)

    }
}

// Выключение всех режимов при выходе из режима разработчика
function removeIfNotDeveloper(){
    let dummy_div = document.createElement('div')
    DEBUG_FOR_SAVE_COORDS = false
    show_all_sensors(dummy_div,false)
    show_settings_sensors(true)
    reskin_sensors()
}

// Перевернуть пдф
function rotate_pdf(elem,isRotate) {
    let pdf_zone = document.querySelector('.pdf_zone')
    if(isRotate){
        elem.setAttribute('onclick','rotate_pdf(this,false)')
        pdf_zone.style.width = 100 + 'vw'
        pdf_zone.style.left = 0
    }
    else{
        elem.setAttribute('onclick','rotate_pdf(this,true)')
        pdf_zone.style.width = 'calc(calc(100vh / 16) * 9)'
        pdf_zone.style.left = 'calc(50vw - calc(calc(calc(100vh / 16) * 9) / 2))'
    }
}

// Закрыть пдф
function close_pdf(e = null) {
    if(e){
        let target = e.currentTarget
        console.log(e)
    }
    let pdf_zone = document.querySelector('.pdf_zone')
    let images = pdf_zone.querySelectorAll('img')
    let temp = 0
    for (let x = 0; x < images.length; x++) {
        const element = images[x];
        element.style.opacity = '1'
        element.style.animation = 'pdf_remove .5s ease-in-out forwards'
        element.style.animationDelay = temp+'s'
        setTimeout(function () {
            element.style.opacity = '0'
        },temp*1000)
        temp+= .1
    }
    setTimeout(function(){
        document.querySelector('.pdf_zone').style.animation = 'pdf_remove ease-in-out .5s forwards'
        setTimeout(function(){
            document.querySelector('.pdf_zone').style.display = 'none'
        },500)
    },temp*1000)
    
}

// Открыть окно pdf
function openSensorPDF(num) {
    //     alert(`Инфа про датчик:
    // PIW - ${SENSORS[num].PIW}
    // Название - ${SENSORS[num].name}
    // Пдфка - ${SENSORS[num].pdf}
    // Координаты - ${SENSORS[num].position}`)
    // let pdf_path = window.location.origin+'/pdf/'+SENSORS[num]['pdf']
    // let pdf_path = work_dir+'/pdf/'+SENSORS[num]['pdf']
    let pdf_zone = document.querySelector('.pdf_zone')

    pdf_zone.style.animation = 'pdf_show .5s ease-in-out forwards'

    pdf_zone.querySelector('.name').querySelector('span').innerHTML = SENSORS[num]['name']
    pdf_zone.style.display = 'flex'
    let temp = 0
    let images = pdf_zone.querySelectorAll('img')
    for (let x = 0; x < images.length; x++) {
        const element = images[x];
        element.style.opacity = '0'
        element.style.animation = 'pdf_show .5s ease-in-out forwards'
        element.style.animationDelay = temp+'s'
        setTimeout(function () {
            element.style.opacity = '1'
        },temp*1000)
        temp+= .2
    }
    // console.log(images)
    images[0].setAttribute('onclick',`pdf_open_photo('${SENSORS[num]['photo']}')`)
    images[1].setAttribute('onclick',`pdf_open_blueprint('${SENSORS[num]['blueprint']}')`)
    images[2].setAttribute('onclick',`pdf_open_passport('${SENSORS[num]['passport']}')`)
    // pdf_zone.style.animation = 'from_up ease-in-out .5s forwards'
}
function pdf_open_passport(name) {
    alert('WIP\n'+name)
}
function pdf_open_photo(name) {
    alert('WIP\n'+name)
}
function pdf_open_blueprint(name) {
    alert('WIP\n'+name)
}
// Открыть в отдельном окне pdf
function openDirectlyPDF() {
    window.open(document.querySelector('.pdf_zone').querySelector('iframe').src, '_blank').focus();
}

// Выключить отображения инструментов разработчика
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

// Создать анимацию для блоков ошибки
function CalcRunningRow() {
    let style_block = document.querySelector('.keyframes_generator')
    // style_block.classList.add('keyframes_generator')
    let sensors = document.querySelectorAll('.sensor_error_button')
    style_block.innerHTML = ''
    for (let x = 0; x < sensors.length; x++) {
        const element = sensors[x];
        let width = element.querySelector('span').offsetWidth - popup_size[0] - 40
        let dur = width / (WidthLine/4)
        if(parseInt(dur) < 1){
            dur = 1
        }
        else{
            dur = parseInt(dur)
        }
        style_block.innerHTML = style_block.innerHTML +`
        .running_span_${x}{
            animation: none;
        }
        .running_span_${x}:hover{
            animation: running_span_${x} ${dur}s linear infinite;
        }
        @keyframes running_span_${x} {
    0%{
        transform: translateX(0);
    }
    30%{
        transform: translateX(-${width}px);
    }
    50%{
        transform: translateX(-${width}px);
    }
    80%{
        transform: translateX(0);
    }
    100%{
        transform: translateX(0);
    }
}
        `
        element.querySelector('span').classList.add(`running_span_${x}`)
        // element.querySelector('span').style.animation = `running_span_${x} ${dur}s linear infinite`
        // element.querySelector('span').style.setProperty('animation','running_span ${dur}s linear infinite')
        // console.log(width)
    }
}

document.addEventListener('DOMContentLoaded',onContentLoaded)