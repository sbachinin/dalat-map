export function add_missing_tiling_props(tile_layers_meta) {
    for (const single_layer_meta of tile_layers_meta) {
        if (single_layer_meta.name === 'peaks') {
            const peaks_common_props = {
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
                ]
            }
            for (const prop in peaks_common_props) {
                if (!single_layer_meta[prop]) {
                    single_layer_meta[prop] = peaks_common_props[prop]
                }
            }
        }
    }
}