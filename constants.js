const DEBUG_FOR_SAVE_COORDS = false         // Режим сохранения координат
const load_obj_from_pastebin = false        // Загружать завод с pastebin
const pastebin_url = ''
// const hotkey_for_debug = 'h'                // Alt+Shift+Эта кнопка показывает кнопки управления

const idle_time = 7000                      // Время после которого модель начнет крутиться (в МС)
const checker_thread_time = 1000            // Перерыв через сколько будут проверятся датчики
const error_line_thread_time = 25           // Как часто будет обновляться полоска ошибки к датчику

const FixedBetaAngle = false                 // Фиксированный угол поворота, если да, то берет нижний предел, если нет, то берет оба
const lowerBeta = .5                         // Минимальный угол вертикального поворота камеры
const upperBeta = 1.8                        // Максимальный угол вертикального поворота камеры

const wheelPrecision = 2                     // Zoom Scale
const offsetOfErrorLine = 40                 // Высота линий ошибок
const WidthLine = 200                        // Ширина линий ошибок
const SensorsDiameter = .5                   // Диаметр создаваемых сфер

const ErrorLineOffsetRight = 250             // Отступ линий ошибок справа
const ErrorLineOffsetBottom = 50             // Отступ линий ошибок снизу
