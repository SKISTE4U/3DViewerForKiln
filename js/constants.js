var DEBUG_FOR_SAVE_COORDS = false           // Режим сохранения координат
var isDeveloper = false                    // Режим разработчика
const load_obj_from_pastebin = false        // Загружать завод с pastebin
const pastebin_url = ''
// const hotkey_for_debug = 'h'             // Alt+Shift+Эта кнопка показывает кнопки управления

const camera_alpha = 0.0015                 // Угол насколько камера поворачивается, лучшее 0.005, при интервале в 30мс
const rotate_thread_interval = 10            // в МС, насколько часто будет обновлятся поворот камеры

const idle_time = 7000                      // Время после которого модель начнет крутиться (в МС)
const checker_thread_time = 1000            // Перерыв через сколько будут проверятся датчики
const error_line_thread_time = 25           // Как часто будет обновляться полоска ошибки к датчику

const FixedBetaAngle = false                // Фиксированный угол поворота, если да, то берет нижний предел, если нет, то берет оба
const lowerBeta = .5                        // Минимальный угол вертикального поворота камеры
const upperBeta = 1.8                       // Максимальный угол вертикального поворота камеры

const wheelPrecision = 2                    // Zoom Scale
const offsetOfErrorLine = 30                // Высота линий ошибок
const WidthLine = 200                       // Ширина линий ошибок
const SensorsDiameter = .5                  // Диаметр создаваемых сфер

const ErrorLineOffsetRight = 250            // Отступ линий ошибок справа
const ErrorLineOffsetBottom = 50            // Отступ линий ошибок снизу

// const reklama_time = 1500                   // Время рекламы в МС

const popup_size = [150,80]                 // Размер уведомления при нажатии на датчик
const popup_livetime = 2000                 // Время жизни уведомления
const popup_moving_thread_time = 5          // Время в МС сколько раз будет обновляться позиция уведомления

const work_dir = 'C:\\Users\\MZ_Penka\\Desktop\\3DViewerForKiln\\3DViewerForKiln'  // Костыль для того чтоб отображение пдф корректно работало

const window_size = [600,800]               // Размер окна при запуске в режиме --app

const running_row_time = 20                 // Время анимации бегущей строки, в секундах