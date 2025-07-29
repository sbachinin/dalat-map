import { BORING_BLDGS_POLYGONS_MINZOOM } from "../js/common_drawing_layers/constants.mjs"

const common_config = [
    {
        name: 'boring_building',
        feature_props_to_preserve: ['building', 'building:architecture'],
        minzoom: BORING_BLDGS_POLYGONS_MINZOOM,
    },
    {
        name: 'peaks',
        feature_filter: f => f.properties.natural === 'peak',
        feature_props_to_preserve: ['ele'],
        added_props: [
            {
                name: 'title',
                get_value: (f, all_handmade_data) => {
                    if (all_handmade_data[f.id]?.title) {
                        return all_handmade_data[f.id].title + '\n' + f.properties.ele
                    }
                    return f.properties.ele
                }
            },
        ],
        minzoom: 11
    }
]

export function add_missing_tiling_props(city_config) { // [ { name: 'peaks', ... }, {} ]

    // if a city has config for "peaks",
    // or any other layer that has some "common" props listed above,
    // merge these common props into city config
    // add common props that don't exist in the city config

    common_config.forEach(common_layer => {
        const city_layer = city_config.find(cl => common_layer.name === cl.name)
        if (!city_layer) return
        for (const common_layer_prop_name in common_layer) {
            if (city_layer.getFeatures && common_layer_prop_name === 'feature_filter') continue

            if (!city_layer[common_layer_prop_name]) {
                city_layer[common_layer_prop_name] = common_layer[common_layer_prop_name]
            }
        }
    })
}