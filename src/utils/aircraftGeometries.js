import * as THREE from 'three';

// Общие настройки выдавливания (делают вид литого пластика с фаской)
const EXTRUDE_SETTINGS = {
  depth: 0.04,          // Толщина пластиковой фишки
  bevelEnabled: true,   // Включаем фаску по краям (блики света будут красивее)
  bevelThickness: 0.01, // Высота фаски
  bevelSize: 0.01,      // Ширина фаски
  bevelSegments: 2,     // Сглаживание фаски
};

// 1. Геометрия ИСТРЕБИТЕЛЯ (острый нос, стреловидные крылья)
function createFighterGeometry() {
  const shape = new THREE.Shape();

  // Рисуем половину или весь контур по точкам (X - ширина, Y - длина от хвоста к носу)
  shape.moveTo(0, 0.42);       // Острый нос
  shape.lineTo(0.06, 0.15);    // Правый борт фюзеляжа до крыла
  shape.lineTo(0.38, -0.05);   // Законцовка правого крыла
  shape.lineTo(0.38, -0.14);   // Задняя кромка правого крыла
  shape.lineTo(0.06, -0.10);   // Правый борт после крыла
  shape.lineTo(0.05, -0.28);   // Переход к хвостовому оперению
  shape.lineTo(0.18, -0.38);   // Правый стабилизатор (хвост)
  shape.lineTo(0.18, -0.42);   // Задняя кромка хвоста
  shape.lineTo(0, -0.36);      // Выемка в центре хвоста (сопло)

  // Зеркально повторяем левую сторону
  shape.lineTo(-0.18, -0.42);
  shape.lineTo(-0.18, -0.38);
  shape.lineTo(-0.05, -0.28);
  shape.lineTo(-0.06, -0.10);
  shape.lineTo(-0.38, -0.14);
  shape.lineTo(-0.38, -0.05);
  shape.lineTo(-0.06, 0.15);
  shape.closePath();           // Замыкаем контур в носу

  const geometry = new THREE.ExtrudeGeometry(shape, EXTRUDE_SETTINGS);
  
  // Кладем фишку плашмя на стол (по умолчанию Shape рисуется в вертикальной плоскости XY)
  geometry.rotateX(-Math.PI / 2);
  
  // Центрируем геометрию, чтобы вращение на 90° происходило ровно вокруг центра клетки
  geometry.center(); 
  return geometry;
}

// 2. Геометрия БОМБАРДИРОВЩИКА (широкий размах крыльев, тупой нос, 2 двигателя)
function createBomberGeometry() {
  const shape = new THREE.Shape();

  shape.moveTo(0, 0.40);       // Центр носа
  shape.lineTo(0.07, 0.36);    // Закругленный нос
  shape.lineTo(0.08, 0.16);    // Фюзеляж
  shape.lineTo(0.45, 0.04);    // Длинное широкое крыло (передняя кромка)
  shape.lineTo(0.45, -0.08);   // Законцовка крыла
  shape.lineTo(0.08, -0.08);   // Задняя кромка крыла
  shape.lineTo(0.06, -0.30);   // Хвостовая балка
  shape.lineTo(0.22, -0.38);   // Широкий хвост
  shape.lineTo(0.22, -0.43);
  shape.lineTo(0, -0.40);

  // Левая сторона
  shape.lineTo(-0.22, -0.43);
  shape.lineTo(-0.22, -0.38);
  shape.lineTo(-0.06, -0.30);
  shape.lineTo(-0.08, -0.08);
  shape.lineTo(-0.45, -0.08);
  shape.lineTo(-0.45, 0.04);
  shape.lineTo(-0.08, 0.16);
  shape.lineTo(-0.07, 0.36);
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, EXTRUDE_SETTINGS);
  geometry.rotateX(-Math.PI / 2);
  geometry.center();
  return geometry;
}

// Экспортируем готовые инстансы геометрий
export const FIGHTER_GEOMETRY = createFighterGeometry();
export const BOMBER_GEOMETRY = createBomberGeometry();