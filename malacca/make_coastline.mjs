import { map_bounds } from "./isomorphic_assets.mjs"

export const make_coastline = main_geojson => {

    // This is not yet a general-purpose coastline-creation function, it's for Melaka only, assuming that the coastline is rather horizontal and has no weird turns, and that sea is in the south.
    // It begins with finding the westmost point, which is kinda naive, it assumes that such point will necessarily belong to the main coastline and not to an island.
    // Islands could be created right in this function, taking all the lines that don't join the main coastline, but it feels a bit unreliable, so I chose to create islands in another layer by taking features with a 'place' property === 'island' or 'islet'.

    const coast_lines = main_geojson.filter(f => f.properties.natural === 'coastline')
    const main_coastline_points = []

    let westmost_lng = 180
    let westmost_line = null
    coast_lines.forEach(line => {
        line.geometry.coordinates.forEach(point => {
            if (point[0] < westmost_lng) {
                westmost_lng = point[0]
                westmost_line = line
            }
        })
    })

    main_coastline_points.push(...westmost_line.geometry.coordinates)
    coast_lines.splice(coast_lines.indexOf(westmost_line), 1)

    while (true) {
        const adjoining_line = coast_lines.find((maybe_adj_line, i) => {
            const last_joined_point = main_coastline_points[main_coastline_points.length - 1]
            const joining_point_index = maybe_adj_line.geometry.coordinates.findIndex(
                p => p[0] === last_joined_point[0] && p[1] === last_joined_point[1]
            )

            if (joining_point_index === 0) {
                main_coastline_points.push(...maybe_adj_line.geometry.coordinates)
                coast_lines.splice(i, 1)
                return true
            } else if (joining_point_index === maybe_adj_line.geometry.coordinates.length - 1) {
                main_coastline_points.push(...maybe_adj_line.geometry.coordinates.reverse())
                coast_lines.splice(i, 1)
                return true
            } else if (joining_point_index !== -1) {
                console.warn('Damn, the adjoining line joins with some middle point')
                process.exit()
            }
        })
        if (!adjoining_line) break
    }

    if (coast_lines.length > 0) {
        console.warn('Some coast_lines were not joined, are they all islands or is it a fuckup with main coastline? Unused points count: ', coast_lines.length)
    }

    // add 3 points to complete the polygon that extends to the very south of the map
    main_coastline_points.push(
        [
            main_coastline_points[main_coastline_points.length - 1][0],
            map_bounds[1] - 0.001 // south bound of the map, and a little further south
        ],
        [
            main_coastline_points[0][0],
            map_bounds[1] - 0.001
        ],
        main_coastline_points[0]
    )

    return [{
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Polygon',
            coordinates: [main_coastline_points]
        }
    }]
}
