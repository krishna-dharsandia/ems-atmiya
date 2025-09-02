/**
 * Format a time to a user-friendly format
 * @param time Date object or string
 * @returns Formatted time string
 */
export function formatTime(time: Date | string): string {
  const d = new Date(time);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}
