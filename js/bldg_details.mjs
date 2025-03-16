import { panel, PANEL_CONTENT_TYPES } from './panel/panel.mjs'
import { all_handmade_data } from '../data/static/handmade_data.mjs'
import { set_selected_feature_state, selected_building_id } from './select_building.mjs'
import { create_panel_thumbs_list } from './panel/panel_thumbs_list.mjs'
import { update_panel_thumbs_list_size_variables } from './panel/panel_thumbs_list_size_manager.mjs'
import { coords_are_in_view, create_element_from_Html, div, get_image_url, get_map_center_shift, push_to_history } from './utils.mjs'
import { centroids_etc } from '../data/for_runtime/centroids_etc.mjs'
import { does_building_have_details } from './does_building_have_details.mjs'


const update_size_variables = () => {
    update_panel_thumbs_list_size_variables({
        max_width_ratio: 40 // TODO just copied from highlights but need to think
    })
}


const set_panel_content = (id) => {
    const details_el = div({ id: 'building-details' })

    const thumbs_list_el = create_panel_thumbs_list({
        images_names: all_handmade_data[id].images
    })

    const title = all_handmade_data[id].title
        ? `<div id="building-info__title">${all_handmade_data[id].title}</div>`
        : ''

    const subtitle = all_handmade_data[id].subtitle
        ? `<div id="building-info__subtitle">${all_handmade_data[id].subtitle}</div>`
        : ''


    const wikipedia = all_handmade_data[id].wikipedia
        ? `<div id="building-info__wikipedia">
                    <a target="_blank" href="${all_handmade_data[id].wikipedia}">
                        <img src="${get_image_url('wikipedia.svg', '')}">
                    </a>
                </div>`
        : ''

    const google = all_handmade_data[id].google
        ? `<div id="building-info__google">
                    <a target="_blank" href="${all_handmade_data[id].google}">
                        <img src="${get_image_url('gmaps.svg', '')}">
                    </a>
                </div>`
        : ''

    const flyto = `<div id="building-info__flyto">
        <img title="Fly to this building" src="${get_image_url('flyto.svg', '')}">
    </div>`

    const copylink = `<div id="building-info__copylink">
        <img title="Copy link to this building" src="${get_image_url('copylink.svg', '')}">
    </div>`

    const info_other = `<div id="building-info__other">
            ${wikipedia}
            ${google}
            ${flyto}
            ${copylink}
        </div>`

    const year = all_handmade_data[id].year
        ? `<div id="building-info__year">Built in ${all_handmade_data[id].year}</div>`
        : ''

    const links = all_handmade_data[id].links?.length
        ? `<div id="building-info__links">
            ${all_handmade_data[id].links.map(link => {
                return `<a target="_blank" href="${link.url}">${link.description || link.url}</a>`
        }).join('')}
        </div>`
        : ''

    const info_el = create_element_from_Html(`
        <div id="building-info">
            ${title}
            ${subtitle}
            ${info_other}
            ${year}
            ${links}
        </div >
    `)
    details_el.appendChild(info_el)
    details_el.appendChild(thumbs_list_el)

    panel.set_content({
        update_size: update_size_variables,
        element: details_el,
        type: PANEL_CONTENT_TYPES.BUILDING
    })
}

export const try_open_building = async (
    id,
    should_push_history = false,
    should_try_to_fly = false
) => {
    if (id === selected_building_id) {
        panel.resize_to_content()
        return
    }

    if (does_building_have_details(id)) {
        set_panel_content(id)
        set_selected_feature_state(id)
        if (should_push_history) {
            push_to_history({ id }, `?id=${id}${window.location.hash}`)
        }
    }

    panel.once(
        'new breadth was set',
        'fly to newly opened building',
        () => {
            if (should_try_to_fly) fly_to_building(id)
        })
}

export const fly_to_building = (
    id,
    { force = false } = {}
) => {
    const feature_center_arr = centroids_etc[id].centroid
    const feature_screen_xy = window.dalatmap.project(feature_center_arr)
    const map_zoom = window.dalatmap.getZoom()
    if (force
        || !coords_are_in_view(feature_screen_xy)
        || map_zoom < 15.5
    ) {
        window.dalatmap.easeTo({
            /* I used to get center from get_center_for_bldg_with_offset(id)
             and avoid passing offset
             but in case of changing zooming this smart offset value was wrong
             for it was calculated for initial zoom level
            */
            center: centroids_etc[id]?.centroid,
            offset: get_map_center_shift(),
            zoom: Math.max(15.5, map_zoom),
            duration: 1600
        })
    }
}