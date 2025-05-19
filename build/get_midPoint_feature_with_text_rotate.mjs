export const get_midPoint_feature_with_text_rotate = (coords1, coords2) => {
    const midpoint_feat = turf.midpoint(coords1, coords2)

    const westest = coords1[0] < coords2[0] ? coords1 : coords2
    const eastest = coords1[0] > coords2[0] ? coords1 : coords2

    // Calculate the angle between the two points for text rotation
    const angle_rad = Math.atan2(
        eastest[1] - westest[1],
        eastest[0] - westest[0]
    )

    const angle_deg = (angle_rad * 180) / Math.PI

    midpoint_feat.properties.text_rotate = -angle_deg

    return midpoint_feat
}