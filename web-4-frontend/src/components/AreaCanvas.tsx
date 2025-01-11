import { useEffect, useRef, useCallback } from 'react';
import { styled } from '@mui/material/styles';

// Константы
const CANVAS_CONFIG = {
  SIZE: 400,
  PADDING: 40,
  AXIS_MARGIN: 5,
  POINT_RADIUS: 4,
  SCALE_FACTOR: 2.4,
} as const;

const COLORS = {
  GRID: '#ddd',
  AREA: 'rgba(0, 0, 255, 0.2)',
  SUCCESS: '#4CAF50',
  ERROR: '#f44336',
  AXIS: '#000',
} as const;

// Стилизованные компоненты
const Canvas = styled('canvas')({
  border: '1px solid #ccc',
  borderRadius: '4px',
});

// Типы
interface Point {
  x: number;
  y: number;
  r: number;
  result: boolean;
}

interface AreaCanvasProps {
  points: Point[];
  currentR: number | null;
  onPointClick?: (x: number, y: number) => void;
}

// Вспомогательные функции
const getCenter = () => CANVAS_CONFIG.SIZE / 2;
const getScale = () => (CANVAS_CONFIG.SIZE - 2 * CANVAS_CONFIG.PADDING) / CANVAS_CONFIG.SCALE_FACTOR;

const AreaCanvas = ({ points, currentR, onPointClick }: AreaCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.strokeStyle = COLORS.GRID;
    ctx.lineWidth = 0.5;

    const step = (CANVAS_CONFIG.SIZE - 2 * CANVAS_CONFIG.PADDING) / 10;
    for (let i = CANVAS_CONFIG.PADDING; i <= CANVAS_CONFIG.SIZE - CANVAS_CONFIG.PADDING; i += step) {
      // Вертикальные линии
      ctx.moveTo(i, CANVAS_CONFIG.PADDING);
      ctx.lineTo(i, CANVAS_CONFIG.SIZE - CANVAS_CONFIG.PADDING);
      // Горизонтальные линии
      ctx.moveTo(CANVAS_CONFIG.PADDING, i);
      ctx.lineTo(CANVAS_CONFIG.SIZE - CANVAS_CONFIG.PADDING, i);
    }

    ctx.stroke();
  }, []);

  const drawAxis = (ctx: CanvasRenderingContext2D) => {
    const center = getCenter();
    ctx.beginPath();
    ctx.strokeStyle = COLORS.AXIS;
    ctx.lineWidth = 2;
    
    // Ось X
    ctx.moveTo(CANVAS_CONFIG.PADDING, center);
    ctx.lineTo(CANVAS_CONFIG.SIZE - CANVAS_CONFIG.PADDING, center);
    
    // Ось Y
    ctx.moveTo(center, CANVAS_CONFIG.SIZE - CANVAS_CONFIG.PADDING);
    ctx.lineTo(center, CANVAS_CONFIG.PADDING);
    
    // Стрелки
    ctx.moveTo(CANVAS_CONFIG.SIZE - CANVAS_CONFIG.PADDING, center);
    ctx.lineTo(CANVAS_CONFIG.SIZE - CANVAS_CONFIG.PADDING - CANVAS_CONFIG.AXIS_MARGIN, center - CANVAS_CONFIG.AXIS_MARGIN);
    ctx.moveTo(CANVAS_CONFIG.SIZE - CANVAS_CONFIG.PADDING, center);
    ctx.lineTo(CANVAS_CONFIG.SIZE - CANVAS_CONFIG.PADDING - CANVAS_CONFIG.AXIS_MARGIN, center + CANVAS_CONFIG.AXIS_MARGIN);
    
    ctx.moveTo(center, CANVAS_CONFIG.PADDING);
    ctx.lineTo(center - CANVAS_CONFIG.AXIS_MARGIN, CANVAS_CONFIG.PADDING + CANVAS_CONFIG.AXIS_MARGIN);
    ctx.moveTo(center, CANVAS_CONFIG.PADDING);
    ctx.lineTo(center + CANVAS_CONFIG.AXIS_MARGIN, CANVAS_CONFIG.PADDING + CANVAS_CONFIG.AXIS_MARGIN);
    
    ctx.stroke();

    // Добавляем метки, если R установлен
    if (currentR) {
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const r = currentR;

      // Метки оси X
      ctx.fillText(`${r}`, center + (CANVAS_CONFIG.SIZE - 2 * CANVAS_CONFIG.PADDING) / 2, center + 20);
      ctx.fillText(`${r/2}`, center + (CANVAS_CONFIG.SIZE - 2 * CANVAS_CONFIG.PADDING) / 4, center + 20);
      ctx.fillText(`-${r}`, center - (CANVAS_CONFIG.SIZE - 2 * CANVAS_CONFIG.PADDING) / 2, center + 20);
      ctx.fillText(`-${r/2}`, center - (CANVAS_CONFIG.SIZE - 2 * CANVAS_CONFIG.PADDING) / 4, center + 20);

      // Метки оси Y
      ctx.fillText(`${r}`, center - 20, CANVAS_CONFIG.PADDING + (CANVAS_CONFIG.SIZE - 2 * CANVAS_CONFIG.PADDING) / 8);
      ctx.fillText(`${r/2}`, center - 20, center - (CANVAS_CONFIG.SIZE - 2 * CANVAS_CONFIG.PADDING) / 4);
      ctx.fillText(`-${r}`, center - 20, CANVAS_CONFIG.SIZE - CANVAS_CONFIG.PADDING);
      ctx.fillText(`-${r/2}`, center - 20, center + (CANVAS_CONFIG.SIZE - 2 * CANVAS_CONFIG.PADDING) / 4);
    }
  };

  const drawAreas = (ctx: CanvasRenderingContext2D) => {
    const center = getCenter();
    const scale = getScale();

    ctx.fillStyle = COLORS.AREA;
    
    // Рисуем четверть круга в первом квадранте (x >= 0, y >= 0)
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, scale / 2, -Math.PI / 2, 0, false);
    ctx.closePath();
    ctx.fill();
    
    // Рисуем прямоугольник во втором квадранте (x <= 0, y >= 0)
    ctx.fillRect(center - scale, center - scale / 2, scale, scale / 2);
    
    // Рисуем треугольник в третьем квадранте (x <= 0, y <= 0)
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(center - scale, center);
    ctx.lineTo(center, center + scale);
    ctx.closePath();
    ctx.fill();

    // Рисуем фиксированные опорные точки в единичных координатах
    const drawReferencePoint = (x: number, y: number) => {
      const pointX = center + x * scale;
      const pointY = center - y * scale;
      ctx.beginPath();
      ctx.arc(pointX, pointY, CANVAS_CONFIG.POINT_RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = COLORS.AXIS;
      ctx.fill();
    };

    // Рисуем точки в позициях ±1 и ±0.5
    drawReferencePoint(-1, 0);  // позиция -R
    drawReferencePoint(1, 0);   // позиция R
    drawReferencePoint(-0.5, 0); // позиция -R/2
    drawReferencePoint(0.5, 0);  // позиция R/2
    drawReferencePoint(0, -1);  // позиция -R
    drawReferencePoint(0, 1);   // позиция R
    drawReferencePoint(0, -0.5); // позиция -R/2
    drawReferencePoint(0, 0.5);  // позиция R/2
  };

  const drawPoints = (ctx: CanvasRenderingContext2D) => {
    const center = getCenter();
    const scale = getScale();

    points.forEach(point => {
      // Масштабируем координаты точки относительно текущего R
      const scaledX = point.x / (currentR || 1);
      const scaledY = point.y / (currentR || 1);
      
      const x = center + scaledX * scale;
      const y = center - scaledY * scale;

      ctx.beginPath();
      ctx.arc(x, y, CANVAS_CONFIG.POINT_RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = point.result ? COLORS.SUCCESS : COLORS.ERROR;
      ctx.fill();
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!currentR || !onPointClick || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const center = getCenter();
    const scale = getScale();
    
    // Получаем координаты в единичном масштабе (-1 до 1)
    const unitX = (x - center) / scale;
    const unitY = (center - y) / scale;
    
    // Масштабируем координаты в соответствии с текущим R
    const coordX = unitX * currentR;
    const coordY = unitY * currentR;
    
    onPointClick(coordX, coordY);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_CONFIG.SIZE, CANVAS_CONFIG.SIZE);

    // Рисуем компоненты
    drawGrid(ctx);
    drawAxis(ctx);
    if (currentR) {
      drawAreas(ctx);
    }
    drawPoints(ctx);
  }, [points, currentR]);

  return (
    <Canvas
      ref={canvasRef}
      width={CANVAS_CONFIG.SIZE}
      height={CANVAS_CONFIG.SIZE}
      onClick={handleCanvasClick}
    />
  );
};

export default AreaCanvas; 