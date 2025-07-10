import { is_feature_selectable } from "./utils/does_feature_have_details.mjs"
import { polygonToLine } from 'https://esm.sh/@turf/polygon-to-line'
import { nearestPointOnLine } from 'https://esm.sh/@turf/nearest-point-on-line'
import { distance } from 'https://esm.sh/@turf/distance'

export const find_clickable_feat = (click_point) => {

    // PLAN:
    // if at point there is building with details, open it
    // if at point there are no buildings, try find them within reasonable distance, and open the nearest of them

    const rfs_at_point = window.dalatmap.queryRenderedFeatures(click_point)
    const clickable_feat_at_point = rfs_at_point.find(f => f.id && is_feature_selectable(f.id))
    if (clickable_feat_at_point) {
        return clickable_feat_at_point
    }

    const clickable_extra_thickness = 20
    const bbox = [
        [click_point.x - clickable_extra_thickness, click_point.y - clickable_extra_thickness],
        [click_point.x + clickable_extra_thickness, click_point.y + clickable_extra_thickness]
    ]
    const rfs_around_point = window.dalatmap.queryRenderedFeatures(bbox)

    const clickable_feats_around_point = rfs_around_point.filter(f => f.id && is_feature_selectable(f.id))
    if (clickable_feats_around_point.length === 0) {
        return null
    }

    const geo_point = window.dalatmap.unproject(click_point)
    const arr_point = [geo_point.lng, geo_point.lat]

    let smallest_distance_to_click = Infinity
    let nearest_feat = null
    clickable_feats_around_point
        .filter(f => f.layer.type === 'fill')
        .forEach(f => {
            const pline = polygonToLine(f)
            const nearest_point = nearestPointOnLine(pline, arr_point)
            const d = distance(arr_point, nearest_point, { units: 'kilometers' })
            if (d < smallest_distance_to_click) {
                smallest_distance_to_click = d
                nearest_feat = f
            }
        })

    return nearest_feat
}