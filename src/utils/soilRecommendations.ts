// Ideal ranges for soil parameters
export const SOIL_IDEAL_RANGES = {
  ph: { min: 6.0, max: 7.5 },
  nitrogen: { min: 50, max: 150 },
  phosphorus: { min: 20, max: 60 },
  potassium: { min: 100, max: 250 },
  organicMatter: { min: 2, max: 5 },
  moisture: { min: 10, max: 30 }
};

interface SoilData {
  ph_level: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organic_matter: number;
  moisture: number;
  soil_type: string;
}

export const generateSoilRecommendations = (data: SoilData): string[] => {
  const recommendations: string[] = [];

  // pH Level
  if (data.ph_level < SOIL_IDEAL_RANGES.ph.min) {
    recommendations.push("Apply lime to neutralize acidity. This will improve nutrient availability.");
  } else if (data.ph_level > SOIL_IDEAL_RANGES.ph.max) {
    recommendations.push("Add organic matter or sulfur to lower pH. This will enhance micronutrient uptake.");
  }

  // Nitrogen
  if (data.nitrogen < SOIL_IDEAL_RANGES.nitrogen.min) {
    recommendations.push("Add nitrogen-rich fertilizers like urea or compost. Consider planting legumes for natural nitrogen fixation.");
  } else if (data.nitrogen > SOIL_IDEAL_RANGES.nitrogen.max) {
    recommendations.push("Reduce nitrogen fertilizers and consider crop rotation with non-legumes to balance nitrogen levels.");
  }

  // Phosphorus
  if (data.phosphorus < SOIL_IDEAL_RANGES.phosphorus.min) {
    recommendations.push("Apply superphosphate or rock phosphate. Maintain soil pH around 6.5 for optimal phosphorus availability.");
  } else if (data.phosphorus > SOIL_IDEAL_RANGES.phosphorus.max) {
    recommendations.push("Avoid phosphorus-rich fertilizers. Consider using cover crops to prevent phosphorus runoff.");
  }

  // Potassium
  if (data.potassium < SOIL_IDEAL_RANGES.potassium.min) {
    recommendations.push("Add potash fertilizers like muriate of potash. Consider incorporating wood ash for organic potassium.");
  } else if (data.potassium > SOIL_IDEAL_RANGES.potassium.max) {
    recommendations.push("Limit potassium fertilizers. Monitor calcium and magnesium levels as high potassium can interfere with their uptake.");
  }

  // Organic Matter
  if (data.organic_matter < SOIL_IDEAL_RANGES.organicMatter.min) {
    recommendations.push("Incorporate compost, manure, or green cover crops. Consider reduced tillage to preserve organic matter.");
  } else if (data.organic_matter > SOIL_IDEAL_RANGES.organicMatter.max) {
    recommendations.push("Improve drainage and reduce organic inputs. Monitor nitrogen release from organic matter decomposition.");
  }

  // Moisture
  if (data.moisture < SOIL_IDEAL_RANGES.moisture.min) {
    recommendations.push("Increase irrigation frequency and apply mulch to retain moisture. Consider drought-resistant crops.");
  } else if (data.moisture > SOIL_IDEAL_RANGES.moisture.max) {
    recommendations.push("Improve drainage through soil amendments or drainage systems. Avoid over-irrigation.");
  }

  // Soil Type Specific Recommendations
  switch (data.soil_type) {
    case 'Sandy':
      recommendations.push("Add organic matter to improve water retention. Consider more frequent but lighter irrigation.");
      break;
    case 'Clay':
      recommendations.push("Add gypsum or organic matter to improve drainage and soil structure.");
      break;
    case 'Loamy':
      recommendations.push("Maintain organic matter levels to preserve excellent soil structure.");
      break;
    case 'Peaty':
      recommendations.push("Monitor pH regularly as peaty soils tend to be acidic. Improve drainage if necessary.");
      break;
    case 'Chalky':
      recommendations.push("Choose plants tolerant of alkaline conditions. Add organic matter to improve nutrient retention.");
      break;
    case 'Silty':
      recommendations.push("Avoid overworking when wet. Add organic matter to improve structure and drainage.");
      break;
  }

  // If all parameters are within ideal ranges
  if (recommendations.length === 0) {
    recommendations.push("Soil is in optimal condition for planting. Continue current management practices.");
  }

  return recommendations;
};