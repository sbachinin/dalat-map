import {
    PALE_TITLES_COLOR,
    PALE_TITLES_SIZE,
    WATER_TITLE_COLOR
} from "../js/layers/constants.mjs";

export const renderables = [
    {
        id: 'Cable_car_label',
        get_features: (all_features) => {

            const cable_car_stations = all_features.filter(f => f.properties.aerialway === 'station')
            const coords1 = cable_car_stations[0].geometry.coordinates
            const coords2 = cable_car_stations[1].geometry.coordinates

            const midpoint_feat = turf.midpoint(coords1, coords2)

            // Calculate the angle between the two points for text rotation
            const angle_rad = Math.atan2(
                coords2[1] - coords1[1],
                coords2[0] - coords1[0]
            )

            const angle_deg = (angle_rad * 180) / Math.PI

            midpoint_feat.properties.text_rotate = -angle_deg

            return [midpoint_feat]
        },
        style_layer: {
            minzoom: 12,
            type: 'symbol',
            "layout": {
                "text-field": "Cable car",
                "text-font": ["Lato Regular"],
                "text-size": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    12, 10,
                    16, 14
                ],
                'text-rotate': ["get", "text_rotate"],
                "text-letter-spacing": 0.1,
                "text-anchor": "bottom",
                "text-offset": [0, -0.1],
                "text-allow-overlap": true
            },
            "paint": {
                "text-color": PALE_TITLES_COLOR,
            },
        }
    },





    {
        id: 'Datanla_waterfall',
        get_features: () => {
            return [{
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [108.4488444, 11.9011774]
                }
            }]
        },
        style_layer: {
            type: 'symbol',
            minzoom: 12,
            layout: {
                "icon-image": "water_square",
                "icon-size": 0.12,
                "text-field": "Datanla\nwaterfall",
                "text-anchor": "top",
                "text-offset": [0, 0.2],
                'text-size': PALE_TITLES_SIZE,
                'text-font': ['Lato Regular'],
                "symbol-sort-key": 1,
            },
            paint: {
                'text-color': WATER_TITLE_COLOR
            },
        }
    }


]