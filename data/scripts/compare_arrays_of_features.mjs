export const compare_arrays_of_features = (geojson1, geojson2) => {
    const geojson1_ids = new Set(geojson1.map(f => f.id));
    const geojson2_ids = new Set(geojson2.map(f => f.id));

    const new_bldgs_count = [...geojson2_ids].filter(id => !geojson1_ids.has(id)).length;
    const disappeared_bldgs_count = [...geojson1_ids].filter(id => !geojson2_ids.has(id)).length;

    console.log(`🆕 New french buildings count: ${new_bldgs_count}`);
    console.log(`❌ Disappeared french buildings count: ${disappeared_bldgs_count}`);
};
