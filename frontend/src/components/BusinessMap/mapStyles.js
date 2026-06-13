// src/components/BusinessMap/mapStyles.js

// Style for the population density heatmap
export const heatmapLayerStyle = {
  id: 'population-heatmap',
  type: 'heatmap',
  paint: {
    // Increase the heatmap weight based on the 'density' property
    'heatmap-weight': ['interpolate', ['linear'], ['get', 'density'], 0, 0, 1, 1],
    // Adjust the heatmap intensity based on zoom level
    'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 10, 1, 15, 3],
    // Color ramp for the heatmap
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0, 'rgba(33,102,172,0)',
      0.2, 'rgb(103,169,207)',
      0.5, 'rgb(253,219,199)',
      0.8, 'rgb(239,138,98)',
      1, 'rgb(178,24,43)'
    ],
    // Adjust the radius of the heatmap points at different zoom levels
    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 10, 15, 15, 40],
    // Fade out the heatmap at high zoom levels to see the underlying map
    'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 14, 1, 15, 0],
  },
};

// Style for the underlying data points of the heatmap (optional, but good for debugging)
export const heatmapPointLayerStyle = {
    id: 'population-points',
    type: 'circle',
    paint: {
        'circle-radius': 3,
        'circle-color': '#003366',
        'circle-opacity': ['interpolate', ['linear'], ['zoom'], 14, 0, 15, 1], // Fade in when heatmap fades out
    }
};