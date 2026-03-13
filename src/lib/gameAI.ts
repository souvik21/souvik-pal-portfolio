export interface GamePoint {
  x: number;
  y: number;
}

export interface GameCycle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  trail: GamePoint[];
  alive: boolean;
}

const CELL_SIZE = 10;

export function createGameCycle(x: number, y: number, dx: number, dy: number): GameCycle {
  return { x, y, dx, dy, trail: [{ x, y }], alive: true };
}

const MAX_TRAIL = 500;

export function moveGameCycle(cycle: GameCycle): void {
  if (!cycle.alive) return;
  cycle.x += cycle.dx * CELL_SIZE;
  cycle.y += cycle.dy * CELL_SIZE;
  cycle.trail.push({ x: cycle.x, y: cycle.y });
  if (cycle.trail.length > MAX_TRAIL) cycle.trail.shift();
}

export function checkCollision(cycle: GameCycle, w: number, h: number, allTrails: GamePoint[][]): boolean {
  if (cycle.x < 0 || cycle.x >= w || cycle.y < 0 || cycle.y >= h) return true;

  const key = `${cycle.x},${cycle.y}`;
  for (const trail of allTrails) {
    for (let i = 0; i < trail.length - 1; i++) {
      if (`${trail[i].x},${trail[i].y}` === key) return true;
    }
  }
  return false;
}

// Build a Set of occupied trail positions for fast O(1) lookups
function buildTrailSet(allTrails: GamePoint[][]): Set<string> {
  const set = new Set<string>();
  for (const trail of allTrails) {
    for (const p of trail) {
      set.add(`${p.x},${p.y}`);
    }
  }
  return set;
}

export function updateAI(ai: GameCycle, player: GameCycle, w: number, h: number): void {
  if (!ai.alive) return;

  const trailSet = buildTrailSet([player.trail, ai.trail]);
  const options: [number, number][] = [];

  const dirs: [number, number][] = [[0, -1], [0, 1], [-1, 0], [1, 0]];
  for (const [dx, dy] of dirs) {
    if (dx === -ai.dx && dy === -ai.dy) continue;

    const nx = ai.x + dx * CELL_SIZE;
    const ny = ai.y + dy * CELL_SIZE;

    if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
    if (trailSet.has(`${nx},${ny}`)) continue;

    // Score this direction: prefer directions with more open space
    let openSpace = 0;
    let checkX = nx;
    let checkY = ny;
    for (let look = 0; look < 10; look++) {
      checkX += dx * CELL_SIZE;
      checkY += dy * CELL_SIZE;
      if (checkX < 0 || checkX >= w || checkY < 0 || checkY >= h) break;
      if (trailSet.has(`${checkX},${checkY}`)) break;
      openSpace++;
    }
    options.push([dx, dy]);
    for (let i = 0; i < openSpace; i++) {
      options.push([dx, dy]);
    }
  }

  if (options.length > 0 && (Math.random() < 0.05 || !options.some(([dx, dy]) => dx === ai.dx && dy === ai.dy))) {
    const pick = options[Math.floor(Math.random() * options.length)];
    ai.dx = pick[0];
    ai.dy = pick[1];
  }
}
