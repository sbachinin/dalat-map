import booleanOverlap from '@turf/boolean-overlap'
import booleanWithin from '@turf/boolean-within'
import { map_bounds } from './isomorphic_assets.mjs'
import { all_assets as dalat_assets } from '../dalat/all_assets.mjs'
import { is_one_of } from '../js/utils/isomorphic_utils.mjs'

const dalat_layers_to_use_in_hue = [
    'major_roads',
    'minor_roads',
    'railway',
    'peaks',
    'river',
]

const hue_bulk_polygon = (await import('../hue/static_data/city_bulk_geometry.mjs')).default

export const all_assets = {
    map_bounds,
    html_title: 'Map of colonial architecture in Hue',
    unimportant_buildings_filter: feat => {
        return feat.properties['building:architecture'] !== 'french_colonial'
    },

    tile_layers: dalat_assets.tile_layers
        .filter(tl => is_one_of(tl.name, dalat_layers_to_use_in_hue))
        .concat([
            {
                name: 'lake',
                feature_filter: f => {
                    if (f.id === 217518615) return false // some ugly river in the north
                    if (f.id === 4928340932566945) return true // lagoon
                    if (f.properties.natural !== 'water') return false
                    if (f.properties.water === 'river') return true
                    if (
                        f.geometry.type === 'Polygon'
                        && (booleanWithin(f, hue_bulk_polygon) || booleanOverlap(f, hue_bulk_polygon))
                    ) return true
                }
            },
            {
                name: 'french_building',
                feature_filter: f => f.properties['building:architecture'] === 'french_colonial'
                    || f.id === 1384219085,
                added_props: ['is_selectable', 'has_title']
            }

        ])
}
