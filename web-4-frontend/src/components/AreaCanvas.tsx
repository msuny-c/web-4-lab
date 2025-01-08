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

  const drawAreas = (ctx: CanvasRenderingContext2D) => {
    const center = size / 2;
    const scale = (size - 2 * padding) / 2.4; // Scale for fixed areas, slightly smaller to extend axes

    ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
    
    // Draw quarter circle in first quadrant (x >= 0, y >= 0)
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, scale / 2, -Math.PI / 2, 0, false);
    ctx.closePath();
    ctx.fill();
    
    // Draw rectangle in second quadrant (x <= 0, y >= 0)
    ctx.fillRect(center - scale, center - scale / 2, scale, scale / 2);
    
    // Draw triangle in third quadrant (x <= 0, y <= 0)
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(center - scale, center);
    ctx.lineTo(center, center + scale);
    ctx.closePath();
    ctx.fill();

    // Draw fixed reference points at unit coordinates
    const drawReferencePoint = (x: number, y: number) => {
      const pointX = center + x * scale;
      const pointY = center - y * scale;
      ctx.beginPath();
      ctx.arc(pointX, pointY, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#000';
      ctx.fill();
    };

    // Draw points at ±1 and ±0.5 (fixed positions)
    drawReferencePoint(-1, 0);  // -R position
    drawReferencePoint(1, 0);   // R position
    drawReferencePoint(-0.5, 0); // -R/2 position
    drawReferencePoint(0.5, 0);  // R/2 position
    drawReferencePoint(0, -1);  // -R position
    drawReferencePoint(0, 1);   // R position
    drawReferencePoint(0, -0.5); // -R/2 position
    drawReferencePoint(0, 0.5);  // R/2 position
  };

  const drawPoints = (ctx: CanvasRenderingContext2D) => {
    const center = size / 2;
    const scale = (size - 2 * padding) / 2.4; // Use the same scale as areas

    points.forEach(point => {
      // Scale the point coordinates relative to current R
      const scaledX = point.x / (currentR || 1);
      const scaledY = point.y / (currentR || 1);
      
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
    const scale = (size - 2 * padding) / 2.4; // Use the same scale as areas
    
    // Get coordinates in unit scale (-1 to 1)
    const unitX = (x - center) / scale;
    const unitY = (center - y) / scale;
    
    // Scale coordinates according to current R
    const coordX = unitX * currentR;
    const coordY = unitY * currentR;
    
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
      drawAreas(ctx);
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