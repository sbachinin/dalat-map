import { SOURCES_NAMES } from "../sources.mjs";
import { BRIGHT_LAKE_COLOR, PALE_LAKE_COLOR } from "./constants.mjs";

export const water_areas_fill = {
    "id": "Primary Water",
    "type": "fill",
    "source": SOURCES_NAMES.CITY_TILES,
    "source-layer": "water_areas",
    "paint": {
        "fill-color": [
            "interpolate",
            ["linear", 2],
            ["zoom"],
            10, BRIGHT_LAKE_COLOR,
            13.7, PALE_LAKE_COLOR,
        ]
    }
}
