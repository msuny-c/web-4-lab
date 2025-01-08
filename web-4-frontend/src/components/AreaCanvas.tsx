import { useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';

const Canvas = styled('canvas')({
  border: '1px solid #ccc',
  borderRadius: '4px',
});

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

const AreaCanvas = ({ points, currentR, onPointClick }: AreaCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const size = 400;
  const padding = 40;
  const axisMargin = 5;

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.5;

    // Draw vertical grid lines
    for (let x = padding; x <= size - padding; x += (size - 2 * padding) / 10) {
      ctx.moveTo(x, padding);
      ctx.lineTo(x, size - padding);
    }

    // Draw horizontal grid lines
    for (let y = padding; y <= size - padding; y += (size - 2 * padding) / 10) {
      ctx.moveTo(padding, y);
      ctx.lineTo(size - padding, y);
    }

    ctx.stroke();
  };

  const drawAxis = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // X axis
    ctx.moveTo(padding, size / 2);
    ctx.lineTo(size - padding, size / 2);
    
    // Y axis
    ctx.moveTo(size / 2, padding);
    ctx.lineTo(size / 2, size - padding);
    
    // Arrows
    ctx.moveTo(size - padding, size / 2);
    ctx.lineTo(size - padding - axisMargin, size / 2 - axisMargin);
    ctx.moveTo(size - padding, size / 2);
    ctx.lineTo(size - padding - axisMargin, size / 2 + axisMargin);
    
    ctx.moveTo(size / 2, padding);
    ctx.lineTo(size / 2 - axisMargin, padding + axisMargin);
    ctx.moveTo(size / 2, padding);
    ctx.lineTo(size / 2 + axisMargin, padding + axisMargin);
    
    ctx.stroke();
  };

  const drawAreas = (ctx: CanvasRenderingContext2D, r: number) => {
    const center = size / 2;
    const scale = (size - 2 * padding) / (2 * 5); // 5 is the max coordinate value

    ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
    
    // Draw circle in first quadrant
    ctx.beginPath();
    ctx.arc(center, center, r * scale, 0, Math.PI / 2);
    ctx.lineTo(center, center);
    ctx.closePath();
    ctx.fill();
    
    // Draw rectangle in second quadrant
    ctx.fillRect(center - r * scale, center - r * scale, r * scale, r * scale);
    
    // Draw triangle in fourth quadrant
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(center + r * scale, center);
    ctx.lineTo(center, center + r * scale);
    ctx.closePath();
    ctx.fill();
  };

  const drawPoints = (ctx: CanvasRenderingContext2D) => {
    const center = size / 2;
    const scale = (size - 2 * padding) / (2 * 5);

    points.forEach(point => {
      const x = center + point.x * scale;
      const y = center - point.y * scale;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = point.result ? '#4CAF50' : '#f44336';
      ctx.fill();
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!currentR || !onPointClick || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const center = size / 2;
    const scale = (size - 2 * padding) / (2 * 5);
    
    const coordX = (x - center) / scale;
    const coordY = (center - y) / scale;
    
    onPointClick(coordX, coordY);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw components
    drawGrid(ctx);
    drawAxis(ctx);
    if (currentR) {
      drawAreas(ctx, currentR);
    }
    drawPoints(ctx);
  }, [points, currentR]);

  return (
    <Canvas
      ref={canvasRef}
      width={size}
      height={size}
      onClick={handleCanvasClick}
    />
  );
};

export default AreaCanvas; 