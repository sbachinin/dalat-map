import { DEFAULT_MAX_ZOOM, SOURCES_NAMES } from "../constants.mjs"
import { current_city } from "../load_city.mjs"
import { roads_common_config, roads_hierarchy } from "../roads_config.mjs"
import { DR_IM } from "./drawing_importance.mjs"
import { major_road_thicker_line, major_road_thinner_line, minor_road_color } from "./drawing_layers.mjs"

export const make_roads_layers = () => {
    const roads_config = {...roads_common_config, ...current_city.isomorphic_assets.roads_config}

    return Object.entries(roads_config).flatMap(([road_type_from, minzoom], i) => {

        if (roads_hierarchy.indexOf(road_type_from) <= 5) { // For now, all 6 most important road types are styled the same
            return [
                { ...major_road_thicker_line, 'source-layer': 'roads_' + i, minzoom: +minzoom },
                { ...major_road_thinner_line, 'source-layer': 'roads_' + i, minzoom: 12.5 },
            ]
        }

        // The following min_width calculation is nonsense but works for now.
        // min width is 2 for secondary roads and then goes down for lower-class roads
        const secondary_hier_i = roads_hierarchy.indexOf('secondary')
        let min_width = 1.6 * (1 - (roads_hierarchy.indexOf(road_type_from) - secondary_hier_i) * 0.16)
        min_width = Math.max(min_width, 1)

        const layer = {
            id: 'Roads from ' + road_type_from,
            type: 'line',
            source: SOURCES_NAMES.CITY_TILES,
            'source-layer': 'roads_' + i,
            minzoom: +minzoom,
            drawing_importance: DR_IM.ROADS,
            paint: {
                "line-width": [
                    "interpolate",
                    ["linear", 2],
                    ["zoom"],
                    +minzoom, min_width,
                    DEFAULT_MAX_ZOOM, min_width * 2,
                ],
                "line-color": minor_road_color
            },
        }

        if (roads_hierarchy.indexOf(road_type_from) >= roads_hierarchy.indexOf('footway')) {
            layer.paint["line-dasharray"] = [2, 2]
        }
        return [layer]

    }).reverse() // to make sure motorways are drawn on top (earlier in roads_config -> later in final style layers)
}