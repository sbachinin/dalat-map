import { get_geojson_source } from "../../js/utils/utils.mjs";

// made because one of the endpoints mysteriously disappeared
// and it looked like a tiling problem, geojson source fixed it
// TODO: Ideally this has to be updated from fresh osm data but I was lazy and I think this data is unlikely to change
export const cable_car_endpoints_source = get_geojson_source([
    {
        "type": "Feature",
        "id": 357447234,
        "geometry": {
            "type": "Point",
            "coordinates": [
                108.4369496,
                11.9041084
            ]
        }
    },
    {
        "type": "Feature",
        "id": 357447237,
        "geometry": {
            "type": "Point",
            "coordinates": [
                108.4434298,
                11.9230389
            ]
        }
    }
])