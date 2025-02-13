// Если делать датчики рядом, двигать на 0.5
var SENSORS = [
    {'name':'QE K1421','PIW':3443,'error':false,'position':[1.5,25.697701394557953,-5.621729564930854],'passport':'having_12.pdf','photo':'photo.jpg','blueprint':'blueprint.pdf'},
    {'name':'QE K1421','PIW':34543,'error':false,'position':[2.5,25.697701394557953,-5.621729564930854],'passport':'having_12.pdf','photo':'photo.jpg','blueprint':'blueprint.pdf'},
    {'name':'QE K1421','PIW':38794,'error':true,'position':[3.5,25.697701394557953,-5.621729564930854],'passport':'having_12.pdf','photo':'photo.jpg','blueprint':'blueprint.pdf'},
    {'name':'QE K1421','PIW':354,'error':false,'position':[4.5,25.697701394557953,-5.621729564930854],'passport':'having_12.pdf','photo':'photo.jpg','blueprint':'blueprint.pdf'},
    {'name':'QE K1421','PIW':34,'error':false,'position':[5.5,25.697701394557953,-5.621729564930854],'passport':'having_12.pdf','photo':'photo.jpg','blueprint':'blueprint.pdf'},
    {'name':'QE K1421','PIW':33454,'error':true,'position':[6.5,25.697701394557953,-5.621729564930854],'passport':'having_12.pdf','photo':'photo.jpg','blueprint':'blueprint.pdf'},
    {'name':'QE K1421','PIW':3124,'error':false,'position':[7.5,25.697701394557953,-5.621729564930854],'passport':'having_12.pdf','photo':'photo.jpg','blueprint':'blueprint.pdf'},
    {'name':'QE K1421','PIW':3454,'error':false,'position':[8.5,25.697701394557953,-5.621729564930854],'passport':'having_12.pdf','photo':'photo.jpg','blueprint':'blueprint.pdf'},
    {'name':'QE K1421','PIW':374,'error':false,'position':[9.5,25.697701394557953,-5.621729564930854],'passport':'having_12.pdf','photo':'photo.jpg','blueprint':'blueprint.pdf'},
    {'name':'QE K1421','PIW':32134,'error':false,'position':[10.5,25.697701394557953,-5.621729564930854],'passport':'having_12.pdf','photo':'photo.jpg','blueprint':'blueprint.pdf'},
    {'name':'QE K1421','PIW':38654,'error':true,'position':[11.5,25.697701394557953,-5.621729564930854],'passport':'having_12.pdf','photo':'photo.jpg','blueprint':'blueprint.pdf'},
    {'name':'QE K1421','PIW':35464,'error':false,'position':[12.5,25.697701394557953,-5.621729564930854],'passport':'having_12.pdf','photo':'photo.jpg','blueprint':'blueprint.pdf'},
    {'name':'QE K1421','PIW':34564,'error':false,'position':[13.5,25.697701394557953,-5.621729564930854],'passport':'having_12.pdf','photo':'photo.jpg','blueprint':'blueprint.pdf'},
    {'name':'QE K1421','PIW':31234,'error':false,'position':[14.5,25.697701394557953,-5.621729564930854],'passport':'having_12.pdf','photo':'photo.jpg','blueprint':'blueprint.pdf'},
    {'name':'QE K1421','PIW':38754,'error':false,'position':[15.5,25.697701394557953,-5.621729564930854],'passport':'having_12.pdf','photo':'photo.jpg','blueprint':'blueprint.pdf'},
    {'name':'QE K1421','PIW':34564,'error':false,'position':[16.5,25.697701394557953,-5.621729564930854],'passport':'having_12.pdf','photo':'photo.jpg','blueprint':'blueprint.pdf'},
    {'name':'QE K1421','PIW':31234,'error':false,'position':[17.5,25.697701394557953,-5.621729564930854],'passport':'having_12.pdf','photo':'photo.jpg','blueprint':'blueprint.pdf'},
    {'name':'QE K1421','PIW':3644,'error':false,'position':[18.5,25.697701394557953,-5.621729564930854],'passport':'having_12.pdf','photo':'photo.jpg','blueprint':'blueprint.pdf'},
    {'name':'QE K1421','PIW':34869,'error':false,'position':[19.5,25.697701394557953,-5.621729564930854],'passport':'having_12.pdf','photo':'photo.jpg','blueprint':'blueprint.pdf'},
    {'name':'QE K1421','PIW':34754,'error':true,'position':[20.5,25.697701394557953,-5.621729564930854],'passport':'having_12.pdf','photo':'photo.jpg','blueprint':'blueprint.pdf'},
    {'name':'QE K1421','PIW':32144,'error':false,'position':[21.5,25.697701394557953,-5.621729564930854],'passport':'having_12.pdf','photo':'photo.jpg','blueprint':'blueprint.pdf'},
    {'name':'QE K1421','PIW':3789454,'error':false,'position':[22.5,25.697701394557953,-5.621729564930854],'passport':'having_12.pdf','photo':'photo.jpg','blueprint':'blueprint.pdf'},
    {'name':'QE K1421','PIW':78234,'error':false,'position':[23.5,25.697701394557953,-5.621729564930854],'passport':'having_12.pdf','photo':'photo.jpg','blueprint':'blueprint.pdf'},
























    // красивая петля..
    {'name':'RENAME_ME','PIW':95213,'error':false,'position':[-8.500507035671276,19.571409640881257,-1.4487405562270617],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':20851,'error':false,'position':[5.082849374364429,34.096433130054244,-7.622506306938485],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':22756,'error':false,'position':[5.162713252807698,34.71933017232852,-7.290474678576622],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':67910,'error':false,'position':[5.077020019142719,35.436862102681246,-7.012477971812157],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':16429,'error':false,'position':[4.845543030339268,36.07910630257631,-6.795354523350966],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':35633,'error':false,'position':[4.522477756603887,36.823079440692865,-6.7272229306482885],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':40946,'error':false,'position':[4.267274160001709,37.293798008293216,-6.805513118442331],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':54317,'error':false,'position':[4.0259459277150995,38.030550603281114,-7.066464949559165],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':7088,'error':false,'position':[3.9676563957012903,38.75221696300919,-7.340663657516497],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':4945,'error':false,'position':[4.054191675669422,39.22599662876407,-7.632269366887506],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':70029,'error':false,'position':[4.250803978938098,39.561884126928405,-7.831573622757153],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':16952,'error':false,'position':[4.551281140172866,39.96978173696757,-7.921504195288215],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':22648,'error':false,'position':[4.916551845473412,40.45003621035755,-7.807630469645609],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':3905,'error':false,'position':[5.117974454348404,40.83078646022763,-7.556791900690465],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':48867,'error':false,'position':[5.141735362053308,41.333947008274535,-7.164198996158088],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':6722,'error':false,'position':[4.957751074168027,41.69910808419493,-6.872071103473161],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':77079,'error':false,'position':[4.632409466067209,42.171457817414705,-6.729494602572593],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':200,'error':false,'position':[4.316217665820393,42.65408934378782,-6.779352271000622],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':79627,'error':false,'position':[4.106662190318869,43.101857943692515,-6.941310410135725],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':71873,'error':false,'position':[3.9751942504517572,43.58878643544458,-7.228693572544055],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':93725,'error':false,'position':[4.015598576067239,44.1314081222273,-7.560066751924465],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':58490,'error':false,'position':[4.252512197906824,44.646236863488724,-7.832486684767941],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':62334,'error':false,'position':[4.547958728829689,45.11824351243169,-7.921176965828831],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':71675,'error':false,'position':[4.833503624405752,45.553586475150624,-7.856970908734712],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':66089,'error':false,'position':[5.054028633412331,45.880592671171044,-7.669403780577131],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':61797,'error':false,'position':[5.164698017343259,46.36488827902775,-7.310626300068462],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':6339,'error':false,'position':[5.095476598195197,46.818630878700986,-7.047007804466107],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':12034,'error':false,'position':[4.928497831043627,47.217791262873575,-6.848063584416733],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':99011,'error':false,'position':[4.701458501163978,47.7537478064365,-6.740083736404375],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':7457,'error':false,'position':[4.411519026857526,48.180948408234585,-6.745800321451135],'pdf':'RENAME_ME.pdf'},
    {'name':'RENAME_ME','PIW':70206,'error':false,'position':[4.151374679561723,48.46446184525002,-7.033696312676159],'pdf':'RENAME_ME.pdf'},

]