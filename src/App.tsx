import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const ship = {
      x: canvasRef.current.width / 2,
      y: canvasRef.current.height / 2,
      size: 40,
      angle: 0,
      rotationSpeed: Math.PI / 30,
      moveSpeed: 5,
    };

    if (!ctx) return;

    let animationFrameId: unknown;

    const animate = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Сохраняем текущее состояние контекста
      ctx.save();

      // Перемещаем начало координат в позицию треугольника
      ctx.translate(ship.x, ship.y);

      // Поворачиваем контекст на текущий угол
      ctx.rotate(ship.angle);

      // Начинаем рисовать треугольник (острием вперед)
      ctx.beginPath();
      ctx.moveTo(ship.size, 0); // Острый конец (перед)
      ctx.lineTo(-ship.size / 2, -ship.size / 2); // Левая задняя точка
      ctx.lineTo(-ship.size / 2, ship.size / 2); // Правая задняя точка
      ctx.closePath();

      // Устанавливаем стили и рисуем
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.fillStyle = "#999";
      ctx.fill();
      ctx.stroke();

      // Восстанавливаем состояние контекста
      ctx.restore();
      animationFrameId = requestAnimationFrame(animate);
    };

    const move = (direction) => {
      // Вычисляем вектор движения на основе текущего угла
      const dx = Math.cos(ship.angle) * direction * ship.moveSpeed;
      const dy = Math.sin(ship.angle) * direction * ship.moveSpeed;

      // Обновляем позицию
      ship.x += dx;
      ship.y += dy;

      // Проверяем границы canvas
      ship.x = Math.max(ship.size, Math.min(canvas.width - ship.size, ship.x));
      ship.y = Math.max(ship.size, Math.min(canvas.height - ship.size, ship.y));
    };

    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          ship.angle -= ship.rotationSpeed; // Поворот влево
          break;
        case "ArrowRight":
          ship.angle += ship.rotationSpeed; // Поворот вправо
          break;
        case "ArrowUp":
          move(1); // Движение вперед
          break;
        case "ArrowDown":
          move(-1); // Движение назад
          break;
      }
    });

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  return (
    <main>
      <canvas ref={canvasRef} width={800} height={600}></canvas>
    </main>
  );
}

export default App;
