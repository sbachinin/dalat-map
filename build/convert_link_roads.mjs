/* 
PROBLEM:
When displaying only most important roads at low zoom levels,
link roads create a difficult visual problem:
a) if rendered together with their "parent" roads (e.g., "primary_link" together with "primary"),
    links will show up as ugly "fingers", until the linked lower-class roads are displayed at higher z.
    And when lower-class roads finally appear, they look visually distinct from the "links".

    The only way to make them look nice is to ensure that they
    1) appear at the same time as linked lower-class roads and
    2) have the same look as linked lower-class roads

    It (in theory) could be solved in osm data by making the links "belong" to the lower-class roads
        - but this is against osm rules.
        - plus, they already belong to higher-class roads, and changing this would be hard.

    Not rendering link roads also doesn't seem possible, because they are often an important part of the landscape.
        + there can be smaller "dependent roads

    So the only solution that I see is to tweak ("preprocess") the osm data to switch link roads
        to the lower-class types to which link roads are connected

SOLUTION
    It's complicated too, because of many possible ways in which links can be connected to other roads,
    So I tried this and that and left a solution that brough ok results and is short.
    In Melaka it looks almost flawless, though caveats are apparent:
    First of all, when there are series of adjacent _links, god knows what happens
    Anyway, for now, I just find all non-link roads that connect to the _link at its endpoints;
        -> from them, I take the one that is of the highest class of all that are lower in class than the current _link
        (There could be no such matching road, and in such case the "...link" class of current _link is left intact)
*/

import { roads_hierarchy } from "../js/roads_config.mjs"

export const convert_link_roads = (all_osm_feats) => {
    const highways = all_osm_feats.filter(feat => feat.properties.highway)
    const links = highways.filter(feat => feat.properties.highway?.endsWith('_link'))

    links.forEach(this_link => {
        const end_A = this_link.geometry.coordinates[0]
        const end_B = this_link.geometry.coordinates[this_link.geometry.coordinates.length - 1]

        const candidate_indexes = highways
            .filter(hw => {
                return !hw.properties.highway.endsWith('_link')
                    && hw.geometry.coordinates.some(c => {
                        return c[0] === end_A[0] && c[1] === end_A[1]
                            || c[0] === end_B[0] && c[1] === end_B[1]
                    })
            })
            .map(hw => roads_hierarchy.indexOf(hw.properties.highway))
            .filter(i => i !== -1)
            .filter(i => i > roads_hierarchy.indexOf(this_link.properties.highway)) // less important than this_link
            .sort((a, b) => a - b)

        candidate_indexes[0] && (this_link.properties.highway = roads_hierarchy[candidate_indexes[0]])

        return

        /* older messier solution here: */

        const adjoining_roads_at_end_A = highways.filter(hw => {
            return !hw.properties.highway.endsWith('_link')
                && hw.geometry.coordinates.some(c => c[0] === end_A[0] && c[1] === end_A[1])
        })
        /* 
                if (adjoining_roads_at_start.length === 1) {
                    const joining_link = adjoining_roads_at_start
                        .find(hw => hw.properties.highway?.endsWith('_link'))
        
                    if (joining_link) {
                        console.log('this links joins ONLY another link' + this_link.id + ' -> ' + joining_link.properties.highway)
                    }
                }
         */

        const most_important_index_at_end_A = Math.min(
            ...adjoining_roads_at_end_A
                .map(hw => roads_hierarchy.indexOf(hw.properties.highway))
                .filter(i => i !== -1)
        )

        const adjoining_roads_at_end_B = highways.filter(hw => {
            return !hw.properties.highway.endsWith('_link')
                && hw.geometry.coordinates.some(c => c[0] === end_B[0] && c[1] === end_B[1])
        })

        const most_important_index_at_end_B = Math.min(
            ...adjoining_roads_at_end_B
                .map(hw => roads_hierarchy.indexOf(hw.properties.highway))
                .filter(i => i !== -1)
        )

        const lower_class_parent_road_type = roads_hierarchy[
            Math.max(most_important_index_at_end_A, most_important_index_at_end_B)
        ]

        console.log(this_link.id + ' ' + this_link.properties.highway + ' -> ' + lower_class_parent_road_type)
    })
}
