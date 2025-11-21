export function getMonday(date: Date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 (Sun) → 6 (Sat)
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

export function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}
