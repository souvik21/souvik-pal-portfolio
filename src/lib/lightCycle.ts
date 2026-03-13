export interface Point {
  x: number;
  y: number;
}

export interface LightCycleState {
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
  glowColor: string;
  trail: Point[];
  maxTrail: number;
  speed: number;
  turnCooldown: number;
}

const GRID_SIZE = 40;
const DIRECTIONS: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];

export function createLightCycle(
  w: number,
  h: number,
  color: string,
  glowColor: string,
  maxTrail = 160
): LightCycleState {
  const dir = DIRECTIONS[Math.floor(Math.random() * 4)];
  return {
    x: Math.floor(Math.random() * w / GRID_SIZE) * GRID_SIZE,
    y: Math.floor(Math.random() * h / GRID_SIZE) * GRID_SIZE,
    dx: dir[0],
    dy: dir[1],
    color,
    glowColor,
    trail: [],
    maxTrail: maxTrail + Math.floor(Math.random() * 60),
    speed: 3.5,
    turnCooldown: 0,
  };
}

export function updateLightCycle(
  cycle: LightCycleState,
  w: number,
  h: number,
  allCycles?: LightCycleState[],
  dt = 1
): void {
  cycle.x += cycle.dx * cycle.speed * dt;
  cycle.y += cycle.dy * cycle.speed * dt;
  cycle.turnCooldown -= dt;

  cycle.trail.push({ x: cycle.x, y: cycle.y });
  if (cycle.trail.length > cycle.maxTrail) cycle.trail.shift();

  const onGridX = Math.abs(cycle.x % GRID_SIZE) < cycle.speed + 1;
  const onGridY = Math.abs(cycle.y % GRID_SIZE) < cycle.speed + 1;

  if (onGridX && onGridY && cycle.turnCooldown <= 0) {
    // Collision avoidance — check ahead
    let shouldTurn = Math.random() < 0.12;

    if (allCycles) {
      const lookAhead = GRID_SIZE * 3;
      const futureX = cycle.x + cycle.dx * lookAhead;
      const futureY = cycle.y + cycle.dy * lookAhead;

      for (const other of allCycles) {
        if (other === cycle) continue;
        const dist = Math.hypot(other.x - futureX, other.y - futureY);
        if (dist < GRID_SIZE * 2) {
          shouldTurn = true;
          break;
        }
      }
    }

    if (shouldTurn) {
      if (cycle.dx !== 0) {
        cycle.dy = Math.random() < 0.5 ? 1 : -1;
        cycle.dx = 0;
      } else {
        cycle.dx = Math.random() < 0.5 ? 1 : -1;
        cycle.dy = 0;
      }
      cycle.x = Math.round(cycle.x / GRID_SIZE) * GRID_SIZE;
      cycle.y = Math.round(cycle.y / GRID_SIZE) * GRID_SIZE;
      cycle.turnCooldown = GRID_SIZE / cycle.speed;
    }
  }

  // Wrap
  const margin = 50;
  if (cycle.x < -margin) cycle.x = w + margin;
  if (cycle.x > w + margin) cycle.x = -margin;
  if (cycle.y < -margin) cycle.y = h + margin;
  if (cycle.y > h + margin) cycle.y = -margin;
}

// ── Background line-art light cycle sprite ───────────────────────────────────
// Minimal stroked outlines with neon glow.
function drawCycleSprite(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  dx: number, dy: number,
  color: string,
  p: number   // scale unit
): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.atan2(dy, dx));

  ctx.shadowColor = color;
  ctx.shadowBlur = 8 * (p / 3);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5 * (p / 3);

  // Body outline
  ctx.beginPath();
  ctx.moveTo(-20 * (p / 3), 0);
  ctx.lineTo(-12 * (p / 3), -6 * (p / 3));
  ctx.lineTo(10 * (p / 3), -5 * (p / 3));
  ctx.lineTo(22 * (p / 3), -1 * (p / 3));
  ctx.lineTo(24 * (p / 3), 0);
  ctx.lineTo(22 * (p / 3), 1 * (p / 3));
  ctx.lineTo(10 * (p / 3), 5 * (p / 3));
  ctx.lineTo(-12 * (p / 3), 6 * (p / 3));
  ctx.closePath();
  ctx.stroke();

  // Rear wheel
  ctx.beginPath();
  ctx.arc(-16 * (p / 3), 0, 5 * (p / 3), 0, Math.PI * 2);
  ctx.stroke();

  // Front wheel
  ctx.beginPath();
  ctx.arc(16 * (p / 3), 0, 3.5 * (p / 3), 0, Math.PI * 2);
  ctx.stroke();

  // Cockpit
  ctx.beginPath();
  ctx.moveTo(-2 * (p / 3), -3 * (p / 3));
  ctx.lineTo(6 * (p / 3), -2 * (p / 3));
  ctx.lineTo(7 * (p / 3), 0);
  ctx.lineTo(6 * (p / 3), 2 * (p / 3));
  ctx.lineTo(-2 * (p / 3), 3 * (p / 3));
  ctx.closePath();
  ctx.stroke();

  // Rider dot
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(2 * (p / 3), 0, 1.5 * (p / 3), 0, Math.PI * 2);
  ctx.fill();

  // Handlebars
  ctx.beginPath();
  ctx.moveTo(0, -6 * (p / 3));
  ctx.lineTo(0, -9 * (p / 3));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 6 * (p / 3));
  ctx.lineTo(0, 9 * (p / 3));
  ctx.stroke();

  ctx.restore();
}

export function drawLightCycle(ctx: CanvasRenderingContext2D, cycle: LightCycleState): void {
  if (cycle.trail.length < 2) return;

  // Set shadow once for the entire trail
  ctx.shadowColor = cycle.color;
  ctx.shadowBlur = 8;
  ctx.strokeStyle = cycle.color;
  ctx.lineWidth = 1;
  ctx.fillStyle = cycle.color;

  // Draw in alpha buckets to reduce draw calls
  const bucketCount = 4;
  const len = cycle.trail.length;

  for (let b = 0; b < bucketCount; b++) {
    const startIdx = Math.max(1, Math.floor(b / bucketCount * len));
    const endIdx = Math.floor((b + 1) / bucketCount * len);
    const midT = ((startIdx + endIdx) / 2) / len;
    const alpha = midT * 0.8;

    // Top rail
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    for (let i = startIdx; i < endIdx && i < len; i++) {
      const prev = cycle.trail[i - 1];
      const cur = cycle.trail[i];
      if (Math.abs(cur.x - prev.x) > GRID_SIZE * 2 || Math.abs(cur.y - prev.y) > GRID_SIZE * 2) continue;
      const dx = cur.x - prev.x, dy = cur.y - prev.y;
      const segLen = Math.sqrt(dx * dx + dy * dy) || 1;
      const nx = -dy / segLen * 3, ny = dx / segLen * 3;
      ctx.moveTo(prev.x + nx, prev.y + ny);
      ctx.lineTo(cur.x + nx, cur.y + ny);
    }
    ctx.stroke();

    // Bottom rail
    ctx.beginPath();
    for (let i = startIdx; i < endIdx && i < len; i++) {
      const prev = cycle.trail[i - 1];
      const cur = cycle.trail[i];
      if (Math.abs(cur.x - prev.x) > GRID_SIZE * 2 || Math.abs(cur.y - prev.y) > GRID_SIZE * 2) continue;
      const dx = cur.x - prev.x, dy = cur.y - prev.y;
      const segLen = Math.sqrt(dx * dx + dy * dy) || 1;
      const nx = -dy / segLen * 3, ny = dx / segLen * 3;
      ctx.moveTo(prev.x - nx, prev.y - ny);
      ctx.lineTo(cur.x - nx, cur.y - ny);
    }
    ctx.stroke();

    // Glow fill between rails
    ctx.globalAlpha = alpha * 0.15;
    ctx.beginPath();
    for (let i = startIdx; i < endIdx && i < len; i++) {
      const prev = cycle.trail[i - 1];
      const cur = cycle.trail[i];
      if (Math.abs(cur.x - prev.x) > GRID_SIZE * 2 || Math.abs(cur.y - prev.y) > GRID_SIZE * 2) continue;
      const dx = cur.x - prev.x, dy = cur.y - prev.y;
      const segLen = Math.sqrt(dx * dx + dy * dy) || 1;
      const nx = -dy / segLen * 3, ny = dx / segLen * 3;
      ctx.moveTo(prev.x + nx, prev.y + ny);
      ctx.lineTo(cur.x + nx, cur.y + ny);
      ctx.lineTo(cur.x - nx, cur.y - ny);
      ctx.lineTo(prev.x - nx, prev.y - ny);
      ctx.closePath();
    }
    ctx.fill();
  }

  // Head — pixel-art top-down bike sprite (p=3 for ambient scale)
  ctx.globalAlpha = 0.85;
  ctx.shadowBlur = 0;
  drawCycleSprite(ctx, cycle.x, cycle.y, cycle.dx, cycle.dy, cycle.color, 3);
  ctx.globalAlpha = 1;
}

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  scrollOffset = 0,
  pulsePhase = 0
): void {
  const offsetY = (scrollOffset * 0.1) % GRID_SIZE;

  // Perspective tilt — subtle
  ctx.save();
  const vanishY = h * 0.3;
  const perspectiveStrength = 0.00015;

  // Vertical lines with perspective convergence
  for (let x = 0; x <= w; x += GRID_SIZE) {
    const normalizedX = (x - w / 2) / (w / 2);
    const perspX = x + normalizedX * vanishY * perspectiveStrength * h;

    // Data pulse brightness
    const pulseDistance = Math.abs(x - pulsePhase * w);
    const pulseBrightness = Math.max(0, 1 - pulseDistance / (w * 0.15));

    const baseAlpha = 0.05 + pulseBrightness * 0.12;
    ctx.strokeStyle = `rgba(0, 240, 255, ${baseAlpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(perspX, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = -GRID_SIZE + offsetY; y <= h + GRID_SIZE; y += GRID_SIZE) {
    const pulseDistance = Math.abs(y - pulsePhase * h);
    const pulseBrightness = Math.max(0, 1 - pulseDistance / (h * 0.15));
    const baseAlpha = 0.05 + pulseBrightness * 0.12;

    ctx.strokeStyle = `rgba(0, 240, 255, ${baseAlpha})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Intersection dots
  ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
  for (let x = 0; x <= w; x += GRID_SIZE) {
    for (let y = -GRID_SIZE + offsetY; y <= h + GRID_SIZE; y += GRID_SIZE) {
      ctx.fillRect(x - 1, y - 1, 2, 2);
    }
  }

  ctx.restore();
}
