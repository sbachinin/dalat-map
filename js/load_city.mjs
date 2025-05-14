export const load_city = async (name) => {
    const [
        isomorphic_assets,
        { zoom_order },
        { all_handmade_data },
        { renderables }
    ] = await Promise.all([
        import(`../${name}/isomorphic_assets.mjs`),
        import(`../${name}/zoom_order.mjs`),
        import(`../${name}/static_data/handmade_data.mjs`),
        import(`../${name}/renderables.mjs`)
    ])

    current_city = {
        name,
        ...isomorphic_assets,
        zoom_order,
        all_handmade_data,
        renderables
    }

    current_city.intro_zoom = current_city.intro_zoom || 12
}

export let current_city = null