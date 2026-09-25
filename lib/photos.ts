// Deterministic placeholder photography for this prototype.
// Uses Picsum Photos (https://picsum.photos), a free placeholder image service —
// no API key, no licensing risk, and each seed always resolves to the same image
// so photos stay stable across renders instead of changing on every reload.
// Swap `photoUrl()` for real STAGEGRID brand photography before production.

export function photoUrl(seed: string, width: number, height: number): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}
