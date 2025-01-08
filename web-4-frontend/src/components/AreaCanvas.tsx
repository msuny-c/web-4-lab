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
    const center = size / 2;
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // X axis
    ctx.moveTo(padding, center);
    ctx.lineTo(size - padding, center);
    
    // Y axis
    ctx.moveTo(center, size - padding);
    ctx.lineTo(center, padding);
    
    // Arrows
    ctx.moveTo(size - padding, center);
    ctx.lineTo(size - padding - axisMargin, center - axisMargin);
    ctx.moveTo(size - padding, center);
    ctx.lineTo(size - padding - axisMargin, center + axisMargin);
    
    ctx.moveTo(center, padding);
    ctx.lineTo(center - axisMargin, padding + axisMargin);
    ctx.moveTo(center, padding);
    ctx.lineTo(center + axisMargin, padding + axisMargin);
    
    ctx.stroke();

    // Add labels if R is set
    if (currentR) {
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const r = currentR;

      // X axis labels
      ctx.fillText(`${r}`, center + (size - 2 * padding) / 2, center + 20);
      ctx.fillText(`${r/2}`, center + (size - 2 * padding) / 4, center + 20);
      ctx.fillText(`-${r}`, center - (size - 2 * padding) / 2, center + 20);
      ctx.fillText(`-${r/2}`, center - (size - 2 * padding) / 4, center + 20);

      // Y axis labels
      ctx.fillText(`${r}`, center - 20, padding + (size - 2 * padding) / 8);
      ctx.fillText(`${r/2}`, center - 20, center - (size - 2 * padding) / 4);
      ctx.fillText(`-${r}`, center - 20, size - padding);
      ctx.fillText(`-${r/2}`, center - 20, center + (size - 2 * padding) / 4);
    }
  };

  const drawAreas = (ctx: CanvasRenderingContext2D, r: number) => {
    const center = size / 2;
    const scale = (size - 2 * padding) / (2 * 5); // 5 is the max coordinate value

    ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
    
    // Draw circle in first quadrant (quarter of circle)
    ctx.beginPath();
    ctx.arc(center, center, r * scale / 2, 0, Math.PI / 2);
    ctx.lineTo(center, center);
    ctx.closePath();
    ctx.fill();
    
    // Draw rectangle in second quadrant
    ctx.fillRect(center - r * scale, center - r * scale / 2, r * scale, r * scale / 2);
    
    // Draw triangle in fourth quadrant
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(center + r * scale / 2, center);
    ctx.lineTo(center, center + r * scale);
    ctx.closePath();
    ctx.fill();
  };

  const drawPoints = (ctx: CanvasRenderingContext2D) => {
    const center = size / 2;
    const scale = (size - 2 * padding) / (2 * 5);

    points.forEach(point => {
      // Scale point coordinates according to current R value
      if (!currentR) return;
      const scaleFactor = currentR / point.r;
      const scaledX = point.x * scaleFactor;
      const scaledY = point.y * scaleFactor;

      const x = center + scaledX * scale;
      const y = center - scaledY * scale;

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