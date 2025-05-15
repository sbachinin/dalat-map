const try_import = async (path) => {
    try {
        return await import(path)
    } catch (err) {
        console.error(`Failed to import ${path}:`, err)
        return null
    }
}

const filenames = [
    'isomorphic_assets.mjs',
    'zoom_order.mjs',
    'static_data/handmade_data.mjs',
    'renderables.mjs'
]
export const load_city = async (name) => {
    const [
        { value: isomorphic_assets},
        { value: zo },
        { value: hmd },
        { value: rnd }
    ] = await Promise.allSettled(filenames.map(n => try_import(`../${name}/${n}`)))

    current_city = {
        name,
        ...isomorphic_assets,
        zoom_order: zo?.zoom_order || {},
        all_handmade_data: hmd?.all_handmade_data || {},
        renderables: rnd?.renderables || []
    }

    current_city.intro_zoom = current_city.intro_zoom || 12
}

export let current_city = null