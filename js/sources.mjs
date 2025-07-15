import { get_geojson_source } from './utils/isomorphic_utils.mjs'
import { current_city } from './load_city.mjs'
import { SOURCES_NAMES } from './constants.mjs'


const get_centroids_as_features = () => Object.entries(current_city.centroids_etc).map(([feat_id, data]) => {
    return {
        "type": "Feature",
        id: feat_id,
        "geometry": {
            "type": "Point",
            "coordinates": data.centroid
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
        },
        bldgs_centroids_points: get_geojson_source(get_centroids_as_features())
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

    return sources
}
