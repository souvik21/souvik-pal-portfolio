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

export function moveGameCycle(cycle: GameCycle): void {
  if (!cycle.alive) return;
  cycle.x += cycle.dx * CELL_SIZE;
  cycle.y += cycle.dy * CELL_SIZE;
  cycle.trail.push({ x: cycle.x, y: cycle.y });
}

export function checkCollision(cycle: GameCycle, w: number, h: number, allTrails: GamePoint[][]): boolean {
  if (cycle.x < 0 || cycle.x >= w || cycle.y < 0 || cycle.y >= h) return true;

  for (const trail of allTrails) {
    // Skip last point (current position)
    for (let i = 0; i < trail.length - 1; i++) {
      if (trail[i].x === cycle.x && trail[i].y === cycle.y) return true;
    }
  }
  return false;
}

export function updateAI(ai: GameCycle, player: GameCycle, w: number, h: number): void {
  if (!ai.alive) return;

  // Look ahead for obstacles
  const allTrails = [player.trail, ai.trail];
  const options: [number, number][] = [];

  // Possible directions (exclude reverse)
  const dirs: [number, number][] = [[0, -1], [0, 1], [-1, 0], [1, 0]];
  for (const [dx, dy] of dirs) {
    // Don't reverse
    if (dx === -ai.dx && dy === -ai.dy) continue;

    const nx = ai.x + dx * CELL_SIZE;
    const ny = ai.y + dy * CELL_SIZE;

    // Check bounds
    if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;

    // Check trail collision
    let blocked = false;
    for (const trail of allTrails) {
      for (const p of trail) {
        if (p.x === nx && p.y === ny) {
          blocked = true;
          break;
        }
      }
      if (blocked) break;
    }

    if (!blocked) {
      // Score this direction: prefer directions with more open space
      let openSpace = 0;
      let checkX = nx;
      let checkY = ny;
      for (let look = 0; look < 10; look++) {
        checkX += dx * CELL_SIZE;
        checkY += dy * CELL_SIZE;
        if (checkX < 0 || checkX >= w || checkY < 0 || checkY >= h) break;
        let hit = false;
        for (const trail of allTrails) {
          for (const p of trail) {
            if (p.x === checkX && p.y === checkY) { hit = true; break; }
          }
          if (hit) break;
        }
        if (hit) break;
        openSpace++;
      }
      options.push([dx, dy]);
      // Weight: store extra copies for more space
      for (let i = 0; i < openSpace; i++) {
        options.push([dx, dy]);
      }
    }
  }

  // Random chance to turn even if current direction is safe
  if (options.length > 0 && (Math.random() < 0.05 || !options.some(([dx, dy]) => dx === ai.dx && dy === ai.dy))) {
    const pick = options[Math.floor(Math.random() * options.length)];
    ai.dx = pick[0];
    ai.dy = pick[1];
  }
}
