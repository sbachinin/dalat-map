import { SOURCES_NAMES } from "../sources.mjs"
import { MINOR_ROADS_MINZOOM } from "./constants.mjs"

const common_road_props = {
    "type": "line",
    "source": SOURCES_NAMES.DALAT_TILES,
    "layout": {
        "line-cap": "round",
        "line-join": "round",
    },
}








const minor_road_width_etc = {
    "line-width": [
        "interpolate",
        ["linear", 2],
        ["zoom"],
        13.7, 1,
        20, 2
    ],
    "line-color": minor_road_color,
    'line-blur': 1,
}

const minorRoad = {
    "id": "Minor road",
    ...common_road_props,
    "source-layer": "minor_roads",
    "minzoom": MINOR_ROADS_MINZOOM,
    "paint": {
        ...minor_road_width_etc,
    },
    filter: ["!=", "is_pedestrian_path", true]
}

const pedestrian_paths = {
    "id": "pedestrian paths",
    ...common_road_props,
    "source-layer": "minor_roads",
    "paint": {
        ...minor_road_width_etc,
        "line-dasharray": [2, 2]
    },
    filter: ["==", "is_pedestrian_path", true]
}

export default [
    minorRoad,
    pedestrian_paths,
    tertiaryRoad,
    majorRoadOutline,
    majorRoad,
]