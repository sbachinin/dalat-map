import { french_buildings_titles } from "./drawing_layers.mjs";
import { SOURCES_NAMES } from "./sources.mjs";

export const zoom_order = {
    /*
    [zoom_level_float]: [
        {
            // what features to take, from what source and with what props?
            selector: {},

            // what and how to draw for these features?
            // (basically, maplibre style layers without "selector" and minzoom part)
            drawing_layers: []
        }
    ]
    */
    12.2: [
        {
            selector: {
                source: SOURCES_NAMES.BUILDING_TITLE,
                filter: ["==", ["get", "is_french"], true]
            },
            drawing_layers: [french_buildings_titles]
        }
    ]
}