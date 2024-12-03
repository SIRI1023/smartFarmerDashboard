// Ideal ranges for soil parameters
export const SOIL_IDEAL_RANGES = {
  ph: { min: 6.0, max: 7.5 },
  nitrogen: { min: 50, max: 150 },
  phosphorus: { min: 20, max: 60 },
  potassium: { min: 100, max: 250 },
  organicMatter: { min: 2, max: 5 },
  moisture: { min: 10, max: 30 }
} as const;

export const SOIL_TYPES = [
  'Sandy',
  'Clay',
  'Loamy',
  'Peaty',
  'Chalky',
  'Silty'
] as const;