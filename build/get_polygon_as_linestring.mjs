export const get_polygon_as_linestring = (f) => {
    return {
        type: 'Feature',
        properties: f.properties,
        geometry: {
            type: 'LineString',
            coordinates: f.geometry.coordinates[0],
        }
    }
}