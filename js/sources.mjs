import { get_geojson_source } from './utils/isomorphic_utils.mjs'
import { current_city } from './load_city.mjs'
import { SOURCES_NAMES } from './constants.mjs'
import { get_centroid } from './utils/isomorphic_utils.mjs'
import { does_feature_have_title, is_feature_selectable } from './utils/does_feature_have_details.mjs'


const get_centroids_as_features = () => Object.entries(current_city.features_generated_props_for_frontend).map(([feat_id, props]) => {
    return {
        "type": "Feature",
        id: feat_id,
        "geometry": {
            "type": "Point",
            "coordinates": props.centroid
        },
        properties: {
            ...props,
            has_title: does_feature_have_title(feat_id, current_city.all_handmade_data),
            is_selectable: is_feature_selectable(feat_id, current_city.all_handmade_data, current_city.fids_to_img_names)
        }
    }
})

export const get_main_sources = () => {
    if (!current_city) {
        throw new Error('current_city is undefined in get_main_sources, there is some mistake here')
    }

    const sources = {
        [SOURCES_NAMES.CITY_TILES]: {
            type: 'vector',
            tiles: [`${window.location.origin}/cities_tiles/${current_city.name}/tiles/{z}/{x}/{y}.pbf`],
            minzoom: 10,
        }
    }

    if (current_city.city_title_coords) {
        sources[SOURCES_NAMES.CITY_TITLE] = get_geojson_source(
            [{
                type: "Feature",
                properties: { title: current_city.name.charAt(0).toUpperCase() + current_city.name.slice(1) },
                geometry: {
                    type: "Point",
                    coordinates: current_city.city_title_coords
                },
            }]
        )
    }

    const features_from_renderables = current_city.renderables?.flatMap(r => {
        return r.get_features().map(f => {
            if (typeof f.id === 'undefined') {
                f.id = Math.floor(Math.random() * 10000000000000000)
            }

            if (f.geometry.type === 'Polygon' && is_feature_selectable(f.id, current_city.all_handmade_data, current_city.fids_to_img_names)) {
                current_city.features_generated_props_for_frontend[f.id] = {
                    centroid: get_centroid(f)
                }
            }

            return {
                ...f,
                properties: {
                    ...(f.properties || {}),
                    renderable_id: r.id
                }
            }
        })
    }) || []

    sources[SOURCES_NAMES.RENDERABLES] = get_geojson_source(features_from_renderables)

    sources.bldgs_centroids_points = get_geojson_source(
        get_centroids_as_features()
    )

    return sources
}
