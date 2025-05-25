const files = [
    {
        filename: 'isomorphic_assets.mjs',
        propname: 'isomorphic_assets',
        extractor: d => d,
    },
    {
        filename: 'zoom_order.mjs',
        propname: 'zoom_order',
        extractor: d => d.zoom_order,
    },
    {
        filename: 'static_data/handmade_data.mjs',
        propname: 'all_handmade_data',
        extractor: d => d.all_handmade_data,
    },
    {
        filename: 'renderables.mjs',
        propname: 'renderables',
        extractor: d => d.renderables,
    },

    {
        filename: 'generated_for_runtime/centroids_etc.mjs',
        propname: 'centroids_etc',
        extractor: d => d.centroids_etc,
    },
    {
        filename: 'constants.mjs',
        propname: 'constants',
        extractor: d => d.constants,
    },

    {
        filename: 'static_data/highlights_images_names.mjs',
        propname: 'highlights_images_names',
        extractor: d => d.highlights_images_names,
    }
]
export const load_city = async (name) => {

    // The following "import" creates uncaught error and blank map if file is not found
    // This necessitates having all files in city folder.
    // It's potentially inconvenient but one obvious alternative proved worse:
    // I tried to try/catch and fallback to default empty values for not-found module.
    // This worked alright but created a nasty silent fail with renderables.mjs.
    // If I accidentally add a frontend-breaking import in this file (it's easy to forget), 
    // An error was also swallowed by try/catch and it was hard to debug.
    // So I went back to explicit errors and blank map in order to see what happens

    const results = await Promise.all(files.map(f => import(`../${name}/${f.filename}`)))

    const results_obj = {}

    files.forEach((f, i) => {
        results_obj[f.propname] = f.extractor(results[i])
    })

    current_city = {
        name,
        ...results_obj,
        ...results_obj.isomorphic_assets
    }

    current_city.intro_zoom = current_city.intro_zoom || 12
}

export let current_city = null