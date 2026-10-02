export function formatCompactNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A';
  if (value < 1000) return value.toString();
  
  if (value >= 1_000_000) {
    return (value / 1_000_000).toLocaleString('en-US', { maximumFractionDigits: 2 }) + 'M';
  }
  
  return (value / 1_000).toLocaleString('en-US', { maximumFractionDigits: 2 }) + 'K';
}
