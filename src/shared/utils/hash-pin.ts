export const hashPin = (pin: string): string => {
  let hash = 2166136261;

  for (let i = 0; i < pin.length; i++) {
    hash ^= pin.charCodeAt(i);
    hash = (hash * 16777619) >>> 0;
  }

  return hash.toString(16).padStart(8, '0');
};
