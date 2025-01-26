const DEBUG_FOR_SAVE_COORDS = false // Режим сохранения координат
const load_obj_from_pastebin = true // Загружать завод с pastebin
const pastebin_url = ''

const idle_time = 7000 // Время после которого модель начнет крутиться (в МС)
const checker_thread_time = 1000 // Перерыв через сколько будут проверятся датчики
const error_line_thread_time = 10 // Как часто будет обновляться полоска ошибки к датчику

const FixedBetaAngle = false // Фиксированный угол поворота, если да, то берет нижний предел, если нет, то берет оба
const lowerBeta = .5 // Минимальный угол вертикального поворота камеры
const upperBeta = 1.8 // Максимальный угол вертикального поворота камеры

const SensorsDiameter = .5 // Диаметр создаваемых сфер