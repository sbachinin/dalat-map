import { is_feature_selectable } from "./utils/does_feature_have_details.mjs"
import { is_mouse_device } from "./utils/frontend_utils.mjs"

const click_tolerance = is_mouse_device ? 5 : 15 // smaller mistake tolerance for mouse because it's harder to miss with mouse

export const find_clickable_feat = (click_point) => {

    // PLAN:
    // if at point there is building with details, open it
    // if at point there are no buildings, try find them within reasonable distance
    // If they are found near, open the nearest

    const rfs_at_point = window.dalatmap.queryRenderedFeatures(click_point)
    const clickable_feat_at_point = rfs_at_point.find(f => f.id && is_feature_selectable(f.id))
    if (clickable_feat_at_point) {
        return clickable_feat_at_point
    }

    const bbox = [
        [click_point.x - click_tolerance, click_point.y - click_tolerance],
        [click_point.x + click_tolerance, click_point.y + click_tolerance]
    ]
    const rfs_around_point = window.dalatmap.queryRenderedFeatures(bbox)

    const clickable_feats_around_point = rfs_around_point.filter(f => f.id && is_feature_selectable(f.id))
    if (clickable_feats_around_point.length === 0) {
        return null
    }

    const geo_point = window.dalatmap.unproject(click_point)
    const click_point_as_arr = [geo_point.lng, geo_point.lat]

    let smallest_distance_to_click = Infinity
    let nearest_feat = null
    clickable_feats_around_point
        .filter(f => f.layer.type === 'fill'
            || f.layer.type === 'symbol'
        )
        .forEach(f => {
            let feat_nearest_point = null

            if (f.geometry.type === 'Point') {
                feat_nearest_point = f
            } else if (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon') {
                const pline = globalThis.turf.polygonToLine(f)
                feat_nearest_point = globalThis.turf.nearestPointOnLine(pline, click_point_as_arr)
            } else {
                return
            }

            const d = globalThis.turf.distance(
                click_point_as_arr,
                feat_nearest_point,
                { units: 'kilometers' }
            )

            if (d < smallest_distance_to_click) {
                smallest_distance_to_click = d
                nearest_feat = f
            }
        })

    return nearest_feat
}