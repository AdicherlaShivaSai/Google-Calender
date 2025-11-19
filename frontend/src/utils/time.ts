// Convert pixel Y position to minutes of the day
// totalHeight = height of full 24-hour column
export function yToMinutes(y: number, totalHeight: number) {
  const minutes = (y / totalHeight) * 1440; // 24 * 60
  const snapped = Math.round(minutes / 15) * 15; // snap to 15 min
  return Math.max(0, Math.min(1440, snapped)); // clamp between 0–1440
}

export function minutesToTimeString(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
