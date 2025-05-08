export const load_city = async (name) => {
    const [isomorphic_assets, hmd] = await Promise.all([
        import(`../${name}/isomorphic_assets.mjs`),
        import(`../${name}/static_data/handmade_data.mjs`)
    ])

    current_city = { name }
    current_city.map_bounds = isomorphic_assets.map_bounds
    current_city.intro_zoom = isomorphic_assets.intro_zoom || 12

    current_city.all_handmade_data = hmd.all_handmade_data
}

export let current_city = null