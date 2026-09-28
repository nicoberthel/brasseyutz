const WINDOW = 15 * 60 * 1000;
const MAX = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

export function allowLogin(ip: string): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || h.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW });
    return true;
  }
  h.count += 1;
  return h.count <= MAX;
}

export function resetRateLimitForTests(): void {
  hits.clear();
}
