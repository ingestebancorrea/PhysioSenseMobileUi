export const formatDurationNumber = (minutes: number): string => {
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return '';
  }
  if (minutes < 60) {
    return `${minutes}`;
  }
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  const mm = String(rest).padStart(2, '0');
  return `${hours}:${mm}`;
};

export const durationSuffix = (minutes: number): string => (minutes >= 60 ? 'hr' : 'min');
