const CHANGES = {
    'SKIPPath': '.visibility = 0.1',
    'SKIPObj': '.visibility = 0.5',
    'Cyl1': '.visibility = 0.1',
    'pipe1': '.visibility = 0.1',
    'pipe2': '.visibility = 0.1',
    'pipe3': '.visibility = 0.1',
    'pipe4': '.visibility = 0.1',
    'pipe5': '.visibility = 0.1',
    'pipe6': '.visibility = 0.1',
}

for (let x = 0; x < scene.meshes.length; x++) {
    const element = scene.meshes[x];
    if(CHANGES.hasOwnProperty(element.name)){
        eval('element'+CHANGES[element.name])
    }
}