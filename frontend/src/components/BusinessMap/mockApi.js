// src/components/BusinessMap/mockApi.js

// Mock data for competitor coffee shops
const competitors = [
  { id: 'comp1', name: 'Starbucks', type: 'Chain', coordinates: [72.835, 19.065] },
  { id: 'comp2', name: 'Blue Tokai Coffee', type: 'Specialty', coordinates: [72.831, 19.062] },
  { id: 'comp3', name: 'Third Wave Coffee', type: 'Chain', coordinates: [72.839, 19.068] },
  { id: 'comp4', name: 'Local Brews', type: 'Independent', coordinates: [72.828, 19.071] },
];

// Mock data for Points of Interest (POIs)
const pointsOfInterest = [
    { id: 'poi1', name: 'Bandra Station', type: 'Transport', coordinates: [72.840, 19.059] },
    { id: 'poi2', name: 'City Park', type: 'Recreation', coordinates: [72.830, 19.069] },
    { id: 'poi3', name: 'National College', type: 'Education', coordinates: [72.836, 19.061] }
];

// Mock data for population density (as GeoJSON FeatureCollection)
const demographicData = {
  type: 'FeatureCollection',
  features: Array.from({ length: 200 }).map((_, i) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      // Randomly scatter points around a central area for demonstration
      coordinates: [
        72.835 + (Math.random() - 0.5) * 0.05,
        19.065 + (Math.random() - 0.5) * 0.03,
      ],
    },
    properties: {
      // Assign a random density value
      density: Math.random(),
    },
  })),
};

// Simulate an API call
export const fetchBusinessData = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        competitors,
        pointsOfInterest,
        demographicData
      });
    }, 500); // 0.5 second delay
  });
};