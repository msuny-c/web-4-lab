import { useEffect, useRef, useCallback } from 'react';
import { styled } from '@mui/material/styles';

// Constants
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

// Styled Components
const Canvas = styled('canvas')({
  border: '1px solid #ccc',
  borderRadius: '4px',
});

// Types
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

// Utility functions
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
      // Vertical lines
      ctx.moveTo(i, CANVAS_CONFIG.PADDING);
      ctx.lineTo(i, CANVAS_CONFIG.SIZE - CANVAS_CONFIG.PADDING);
      // Horizontal lines
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
    
    // X axis
    ctx.moveTo(CANVAS_CONFIG.PADDING, center);
    ctx.lineTo(CANVAS_CONFIG.SIZE - CANVAS_CONFIG.PADDING, center);
    
    // Y axis
    ctx.moveTo(center, CANVAS_CONFIG.SIZE - CANVAS_CONFIG.PADDING);
    ctx.lineTo(center, CANVAS_CONFIG.PADDING);
    
    // Arrows
    ctx.moveTo(CANVAS_CONFIG.SIZE - CANVAS_CONFIG.PADDING, center);
    ctx.lineTo(CANVAS_CONFIG.SIZE - CANVAS_CONFIG.PADDING - CANVAS_CONFIG.AXIS_MARGIN, center - CANVAS_CONFIG.AXIS_MARGIN);
    ctx.moveTo(CANVAS_CONFIG.SIZE - CANVAS_CONFIG.PADDING, center);
    ctx.lineTo(CANVAS_CONFIG.SIZE - CANVAS_CONFIG.PADDING - CANVAS_CONFIG.AXIS_MARGIN, center + CANVAS_CONFIG.AXIS_MARGIN);
    
    ctx.moveTo(center, CANVAS_CONFIG.PADDING);
    ctx.lineTo(center - CANVAS_CONFIG.AXIS_MARGIN, CANVAS_CONFIG.PADDING + CANVAS_CONFIG.AXIS_MARGIN);
    ctx.moveTo(center, CANVAS_CONFIG.PADDING);
    ctx.lineTo(center + CANVAS_CONFIG.AXIS_MARGIN, CANVAS_CONFIG.PADDING + CANVAS_CONFIG.AXIS_MARGIN);
    
    ctx.stroke();

    // Add labels if R is set
    if (currentR) {
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const r = currentR;

      // X axis labels
      ctx.fillText(`${r}`, center + (CANVAS_CONFIG.SIZE - 2 * CANVAS_CONFIG.PADDING) / 2, center + 20);
      ctx.fillText(`${r/2}`, center + (CANVAS_CONFIG.SIZE - 2 * CANVAS_CONFIG.PADDING) / 4, center + 20);
      ctx.fillText(`-${r}`, center - (CANVAS_CONFIG.SIZE - 2 * CANVAS_CONFIG.PADDING) / 2, center + 20);
      ctx.fillText(`-${r/2}`, center - (CANVAS_CONFIG.SIZE - 2 * CANVAS_CONFIG.PADDING) / 4, center + 20);

      // Y axis labels
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
      ctx.arc(pointX, pointY, CANVAS_CONFIG.POINT_RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = COLORS.AXIS;
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
    const center = getCenter();
    const scale = getScale();

    points.forEach(point => {
      // Scale the point coordinates relative to current R
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
    ctx.clearRect(0, 0, CANVAS_CONFIG.SIZE, CANVAS_CONFIG.SIZE);

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
      width={CANVAS_CONFIG.SIZE}
      height={CANVAS_CONFIG.SIZE}
      onClick={handleCanvasClick}
    />
  );
};

export default AreaCanvas; 