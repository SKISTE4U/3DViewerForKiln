import sys
from traceback import print_exc
import pyrender
import trimesh
from PyQt5.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QPushButton, QLabel, QWidget, QMenu
from PyQt5.QtCore import Qt
from pynput import mouse
import numpy as np

class P3DViewer():
    def __init__(self, obj_file,scale_factor):
        self.obj_file = obj_file
        self.scale_factor = scale_factor
        self.scene = None
        self.viewer = None
        self.sensors = [
            {"name": "Sensor1", "position": (0, 2, 0), "status": "OK"},
            {"name": "Sensor2", "position": (1, 3, -1), "status": "Error"},
        ]

        self.init_scene()

    def init_scene(self):
        """Инициализация сцены с 3D-моделью и датчиками."""
        # Загружаем 3D-модель из файла
        try:
            mesh = trimesh.load(self.obj_file)
            mesh.apply_scale(self.scale_factor)
            render_mesh = pyrender.Mesh.from_trimesh(mesh)

            # Создаем сцену
            self.scene = pyrender.Scene(bg_color=(50,50,50,0))
            self.scene.add(render_mesh)

            # Добавляем датчики как сферы
            for sensor in range(0,len(self.sensors)):
                self.sensors[sensor].update({'node':self.add_sensor_to_scene(self.sensors[sensor])})
                

            # Устанавливаем камеру
            camera = pyrender.PerspectiveCamera(yfov=np.pi / 3.0)
            camera_node = pyrender.Node(camera=camera, matrix=np.eye(4))
            self.scene.add_node(camera_node)

            # Добавляем источник света
            light = pyrender.DirectionalLight(color=np.ones(3), intensity=3.0)
            self.scene.add(light)

            # Инициализируем рендеринг
            self.viewer = pyrender.Viewer(self.scene, use_raymond_lighting=True, run_in_thread=True)

        except Exception as e:
            print(f"Ошибка при загрузке модели: {e}")
            print_exc()

    def add_sensor_to_scene(self, sensor):
        """Добавление визуализации датчика в сцену."""
        position = sensor["position"]
        sphere = trimesh.creation.icosphere(subdivisions=3, radius=0.1)
        material = pyrender.MetallicRoughnessMaterial(
            baseColorFactor=(1.0, 0.0, 0.0, 1.0) if sensor["status"] == "Error" else (0.0, 1.0, 0.0, 1.0)
        )
        sensor_mesh = pyrender.Mesh.from_trimesh(sphere, material=material)

        # Добавляем сферу в сцену
        sensor_node = pyrender.Node(mesh=sensor_mesh, translation=position)
        self.scene.add_node(sensor_node)
        return sensor_node

    def project_to_screen(self, position):
        """Проецирует 3D-координаты на экран."""
        # Пример упрощенной проекции (можно заменить более точной)
        return position[:2]

    def contextMenuEvent(self, x,y):
        """Контекстное меню только для датчиков."""
        # Переводим координаты клика в сцену
        click_position = np.array([x,y])
        print('click_positions:')
        print(click_position)
        for sensor in self.sensors:
            print('Proverka')
            # Проверка, попадает ли клик на датчик
            node = sensor["node"]
            sensor_pose = self.scene.get_pose(node)
            sensor_position = sensor_pose[:3, 3]
            print(sensor_position)

            # Вычисляем расстояние между кликом и датчиком (упрощенно)
            screen_position = self.project_to_screen(sensor_position)
            print(screen_position)
            distance = np.linalg.norm(click_position - screen_position)
            print(distance)

            if distance < 10:  # Если расстояние небольшое
                print('popal', sensor)
                return


def on_click(x, y, button, pressed):
    if pressed and str(button) == "Button.left":
        viewer.contextMenuEvent(x,y)

if __name__ == "__main__":
    # Укажите путь к вашему .obj файлу
    obj_file_path = "obj/cat1/cat.obj"
    scale = 0.1
    viewer = P3DViewer(obj_file_path, scale)
    with mouse.Listener(on_click = on_click) as listener:
        print('lalala')
        listener.join()
    

    # app = QApplication(sys.argv)
    # window = Sensor3DApp(obj_file_path)
    # window.show()
    # sys.exit(app.exec_())
