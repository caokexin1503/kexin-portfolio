export function formatPhilosopherYear(year: number): string {
  return year < 0 ? `${Math.abs(year)} BCE` : `${year}`;
}

export function formatPhilosopherLifespan(birth: number, death?: number): string {
  const start = formatPhilosopherYear(birth);
  if (!death) return `b. ${start}`;
  const end = formatPhilosopherYear(death);
  return `${start} – ${end}`;
}
