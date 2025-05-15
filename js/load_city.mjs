const try_import = async (path) => {
    try {
        return await import(path)
    } catch (err) {
        return null
    }
}

const files = [
    {
        name: 'isomorphic_assets.mjs',
        propname: 'isomorphic_assets',
        extractor: d => d,
        default_val: {}
    },
    {
        name: 'zoom_order.mjs',
        propname: 'zoom_order',
        extractor: d => d.zoom_order,
        default_val: {}
    },
    {
        name: 'static_data/handmade_data.mjs',
        propname: 'all_handmade_data',
        extractor: d => d.all_handmade_data,
        default_val: {}
    },
    {
        name: 'renderables.mjs',
        propname: 'renderables',
        extractor: d => d.renderables,
        default_val: []
    },

    {
        name: 'generated_for_runtime/centroids_etc.mjs',
        propname: 'centroids_etc',
        extractor: d => d.centroids_etc,
        default_val: {}
    }
]
export const load_city = async (name) => {
    const results = await Promise.all(files.map(f => try_import(`../${name}/${f.name}`)))

    const results_obj = {}
    
    files.forEach((f, i) => {
        results_obj[f.propname] = results[i] ? f.extractor(results[i]) : f.default_val
    })
    
    current_city = {
        name,
        ...results_obj,
        ...results_obj.isomorphic_assets
    }

    current_city.intro_zoom = current_city.intro_zoom || 12
}

export let current_city = null