import React, { useEffect, useRef } from 'react';

interface NeuralCanvasProps {
  isFinale?: boolean;
}

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  pulseSpeed: number;
  pulsePhase: number;
  targetX?: number;
  targetY?: number;
  isLetterA?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

// Global firework trigger hookable from any component
let fireworkEmitter: ((x?: number, y?: number, count?: number) => void) | null = null;

export function triggerGlobalFireworks(x?: number, y?: number, count?: number) {
  if (fireworkEmitter) {
    fireworkEmitter(x, y, count);
  }
}

export const NeuralCanvas: React.FC<NeuralCanvasProps> = ({ isFinale = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 768;
    const nodeCount = isMobile ? 36 : 64;
    const nodes: NodePoint[] = [];
    const particles: Particle[] = [];

    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
      const r = Math.random() * 2 + 1.5;
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: r,
        baseRadius: r,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Coordinates for letter "A"
    const generateLetterAPoints = (w: number, h: number) => {
      const centerX = w / 2;
      const centerY = h * 0.38;
      const aHeight = Math.min(w * 0.45, 260);
      const aWidth = aHeight * 0.75;
      const points: { x: number; y: number }[] = [];

      const topX = centerX;
      const topY = centerY - aHeight / 2;
      const bLeftX = centerX - aWidth / 2;
      const bRightX = centerX + aWidth / 2;
      const bY = centerY + aHeight / 2;

      // Left leg (10 points)
      for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        points.push({
          x: topX + (bLeftX - topX) * t,
          y: topY + (bY - topY) * t,
        });
      }

      // Right leg (10 points)
      for (let i = 1; i <= 10; i++) {
        const t = i / 10;
        points.push({
          x: topX + (bRightX - topX) * t,
          y: topY + (bY - topY) * t,
        });
      }

      // Crossbar (7 points)
      const crossY = centerY + aHeight * 0.08;
      const leftCrossX = topX + (bLeftX - topX) * 0.58;
      const rightCrossX = topX + (bRightX - topX) * 0.58;
      for (let i = 1; i < 7; i++) {
        const t = i / 7;
        points.push({
          x: leftCrossX + (rightCrossX - leftCrossX) * t,
          y: crossY,
        });
      }

      return points;
    };

    let letterAPoints = generateLetterAPoints(width, height);

    // Resize handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      letterAPoints = generateLetterAPoints(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Fireworks generator
    const createFirework = (targetX?: number, targetY?: number, burstSize = 45) => {
      const px = targetX ?? width * 0.2 + Math.random() * width * 0.6;
      const py = targetY ?? height * 0.15 + Math.random() * height * 0.35;
      const colors = isFinale
        ? ['#FFD700', '#FDE047', '#00F0FF', '#FFFFFF', '#F59E0B']
        : ['#00F0FF', '#38BDF8', '#67E8F9', '#FFFFFF', '#FFD700'];

      for (let i = 0; i < burstSize; i++) {
        const angle = (Math.PI * 2 * i) / burstSize + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 4.5 + 1.5;
        particles.push({
          x: px,
          y: py,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 40 + Math.random() * 30,
          size: Math.random() * 2.5 + 1.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    fireworkEmitter = createFirework;

    let finaleTimer = 0;

    const render = () => {
      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#050B1F');
      bgGrad.addColorStop(0.5, '#071333');
      bgGrad.addColorStop(1, '#0B1F4D');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Radial subtle glow in center
      const centerGlow = ctx.createRadialGradient(
        width / 2,
        height * 0.4,
        20,
        width / 2,
        height * 0.4,
        width * 0.6
      );
      if (isFinale) {
        centerGlow.addColorStop(0, 'rgba(255, 215, 0, 0.08)');
        centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        centerGlow.addColorStop(0, 'rgba(0, 240, 255, 0.05)');
        centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, width, height);

      // Auto fireworks in finale
      if (isFinale) {
        finaleTimer++;
        if (finaleTimer % 45 === 0) {
          createFirework();
        }
      }

      // Update and draw nodes
      const maxDist = isMobile ? 85 : 120;

      // Assign target points for letter A if finale
      if (isFinale) {
        nodes.forEach((node, i) => {
          if (i < letterAPoints.length) {
            node.targetX = letterAPoints[i].x;
            node.targetY = letterAPoints[i].y;
            node.isLetterA = true;
          } else {
            node.isLetterA = false;
          }
        });
      }

      nodes.forEach((node) => {
        if (isFinale && node.isLetterA && node.targetX !== undefined && node.targetY !== undefined) {
          // Smooth spring-like lerp to letter A formation
          node.x += (node.targetX - node.x) * 0.05;
          node.y += (node.targetY - node.y) * 0.05;
        } else {
          node.x += node.vx;
          node.y += node.vy;

          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;
        }

        node.pulsePhase += node.pulseSpeed;
        node.radius = node.baseRadius + Math.sin(node.pulsePhase) * 0.8;
      });

      // Draw connection lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * (isFinale ? 0.35 : 0.22);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);

            if (isFinale && nodes[i].isLetterA && nodes[j].isLetterA) {
              ctx.strokeStyle = `rgba(255, 215, 0, ${alpha * 1.5})`;
              ctx.lineWidth = 1.6;
            } else {
              ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
              ctx.lineWidth = 0.8;
            }
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.max(1, node.radius), 0, Math.PI * 2);

        if (isFinale && node.isLetterA) {
          ctx.fillStyle = '#FFD700';
          ctx.shadowColor = '#FFD700';
          ctx.shadowBlur = 12;
        } else {
          ctx.fillStyle = '#00F0FF';
          ctx.shadowColor = '#00F0FF';
          ctx.shadowBlur = 6;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Update and draw fireworks particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06; // gravity
        p.vx *= 0.98; // air drag
        p.life -= 1 / p.maxLife;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      fireworkEmitter = null;
    };
  }, [isFinale]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      aria-hidden="true"
    />
  );
};
