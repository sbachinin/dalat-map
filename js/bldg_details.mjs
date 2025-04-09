import { panel, PANEL_CONTENT_TYPES } from './panel/panel.mjs'
import { all_handmade_data } from '../data/static/handmade_data.mjs'
import { select_building, selected_building_id } from './select_building.mjs'
import { create_panel_thumbs_list } from './panel/panel_thumbs_list.mjs'
import { update_panel_thumbs_list_size_variables } from './panel/panel_thumbs_list_size_manager.mjs'
import * as svg_icons from './svg_icons.mjs'
import {
    create_element_from_Html,
    div,
    get_image_url,
    get_map_center_shift_px,
    is_landscape,
    is_mobile_device,
    push_to_history,
    throttle
} from './utils/utils.mjs'
import { centroids_etc } from '../data/generated_for_runtime/centroids_etc.mjs'
import { does_feature_have_details } from './utils/does_feature_have_details.mjs'


const update_size_variables = () => {
    update_panel_thumbs_list_size_variables({
        max_width_ratio: 40 // TODO just copied from highlights but need to think
    })
}


const set_panel_content = (id) => {
    const details_el = div({ id: 'building-details' })

    const thumbs_list_el = all_handmade_data[id].images?.length
        ? create_panel_thumbs_list({
            images_names: all_handmade_data[id].images
        })
        : ''

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

    const doubt = all_handmade_data[id].doubt
        ? `<div id="building-info__doubt">
                <img src="${get_image_url('question.png', '')}">
            </div>`
        : ''

    const google = all_handmade_data[id].google
        ? `<div id="building-info__google">
                    <a target="_blank" href="${all_handmade_data[id].google}">
                        ${svg_icons.gmaps}
                    </a>
                </div>`
        : ''

    const flyto = `<div id="building-info__flyto" class="disabled">
        ${svg_icons.flyto}
    </div>`




    let copylink_or_share = ''
    if (is_mobile_device && navigator.share) {
        copylink_or_share = `<div id="building-info__share" title="Share">
            ${svg_icons.share}
        </div>`
    } else if (!is_mobile_device && navigator.clipboard?.writeText) {
        copylink_or_share = `<div id="building-info__copylink">
            ${svg_icons.copylink}
            <div id="copylink-message"></div>
        </div>`
    }


    const info_other = `<div id="building-info__other">
            ${doubt}
            ${wikipedia}
            ${google}
            ${flyto}
            ${copylink_or_share}
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
    thumbs_list_el && details_el.appendChild(thumbs_list_el)

    panel.set_content(
        {
            update_size: update_size_variables,
            element: details_el,
            type: PANEL_CONTENT_TYPES.BUILDING
        },
        {
            should_resize_immediately: panel.is_rather_expanded()
        }
    )
}

export const try_open_building = async (
    id,
    should_push_history = false,
    should_try_to_fly = false,
    should_expand_panel = true
) => {
    if (id === selected_building_id) {
        panel.resize_to_content()
        return
    }

    if (does_feature_have_details(id)) {
        if (document.fonts && !document.fonts.check('italic normal 400 1em Merriweather')) {
            const merriweather = new FontFaceObserver('Merriweather', { weight: 'normal', style: 'italic' })
            await merriweather.load()
        }
        set_panel_content(id)
        select_building(id)
        if (should_push_history) {
            push_to_history({ id }, `?id=${id}${window.location.hash}`)
        }
    }

    panel.once(
        'new content breadth',
        'fly to newly opened building',
        async () => {
            if (should_try_to_fly) {
                await try_fly_to_building(id)
            }
            if (should_expand_panel) {
                panel.resize_to_content()
            }
        })
}

const distance2d = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))

export const coords_will_be_in_view = (
    coords,
    padding = 40,
    panel_wil_be_expanded = true
) => {

    let left_bound = padding
    let bottom_bound = window.innerHeight - padding
    if (panel_wil_be_expanded) {
        if (is_landscape()) {
            left_bound += panel.content_breadth
        } else {
            bottom_bound -= panel.content_breadth
        }
    }
    return coords.x > left_bound
        && coords.x < (window.innerWidth - padding)
        && coords.y > padding
        && coords.y < bottom_bound
}

export const try_fly_to_building = (
    id,
    { force = false } = {}
) => {
    return new Promise((resolve) => {
        const feature_center_arr = centroids_etc[id].centroid
        const feature_screen_xy = window.dalatmap.project(feature_center_arr)
        const map_zoom = window.dalatmap.getZoom()
        if (force
            || !coords_will_be_in_view(feature_screen_xy)
            || map_zoom < 15.5
        ) {
            const map_el = document.querySelector('#maplibregl-map')
            const distance_from_center = distance2d(
                feature_screen_xy.x,
                feature_screen_xy.y,
                map_el.offsetWidth / 2,
                map_el.offsetHeight / 2
            )

            const target_zoom = Math.max(15.5, map_zoom)
            const zoom_diff = Math.abs(map_zoom - target_zoom)
            const duration = Math.max(distance_from_center, 500) * (zoom_diff + 1)

            window.dalatmap.easeTo({
                /* I used to get center from get_center_for_bldg_with_offset(id)
                 and avoid passing offset
                 but in case of changing zooming this smart offset value was wrong
                 for it was calculated for initial zoom level
                */
                center: centroids_etc[id]?.centroid,
                offset: get_map_center_shift_px(panel.content_breadth),
                zoom: target_zoom,
                duration: Math.max(distance_from_center, 500) * (zoom_diff + 1)
            })

            // Here map.on('moveend') was used instead of setTimeout.
            // It looked cooler but failed on my gpu-deficient desktop
            // where easeTo wasn't really animated and moveend wasn't fired.
            // It's a very marginal case but still setTimeout looks more reliable.
            // Besides moveend, in case of its failure, will be fired as a surprise in the end of any subsequent map swipe - super ugly
            setTimeout(resolve, duration)

        } else {
            resolve()
        }
    })

}


export const update_flyto_button = throttle(() => {
    const but_el = document.querySelector('#building-info__flyto')
    if (!but_el) return

    // Previous solution utilized queryRenderedFeatures
    // But it was unstable because relied on what is actually rendered atm
    // So I switched to comparing centoid with map viewport's lngLat bounds, and this doesn't depend on network or anything.
    // TODO: this doesn't consider the panel. So, when feature is covered by panel, it won't enable the button
    const { _ne: { lng: e_bound, lat: n_bound }, _sw: { lng: w_bound, lat: s_bound } } = dalatmap.getBounds()
    const cntrd = centroids_etc[selected_building_id].centroid
    const selected_bldg_is_visible = (
        cntrd[0] > w_bound
        && cntrd[0] < e_bound
        && cntrd[1] > s_bound
        && cntrd[1] < n_bound
    )    

    if (selected_bldg_is_visible) {
        but_el.classList.add('disabled')
    } else {
        but_el.classList.remove('disabled')
    }
}, 200, true)