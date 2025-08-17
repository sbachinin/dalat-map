import { BORING_BLDGS_POLYGONS_MINZOOM } from "../js/common_drawing_layers/constants.mjs"

const common_config = [
    {
        name: 'boring_building',
        minzoom: BORING_BLDGS_POLYGONS_MINZOOM,
    },
    {
        name: 'peaks',
        osm_feature_filter: f => f.properties.natural === 'peak',
        props_to_add_to_osm_features: [
            {
                name: 'title',
                get_value: (f, all_handmade_data) => {
                    if (all_handmade_data[f.id]?.title) {
                        return all_handmade_data[f.id].title + '\n' + (f.properties.ele || '')
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
    // merge the common props that aren't specified in the city's config item

    common_config.forEach(common_layer => {
        const city_layer = city_config.find(cl => common_layer.name === cl.name)
        if (!city_layer) return
        for (const key in common_layer) {
            city_layer[key] ??= common_layer[key]
        }
    })
}