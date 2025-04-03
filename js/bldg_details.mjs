import { panel, PANEL_CONTENT_TYPES } from './panel/panel.mjs'
import { all_handmade_data } from '../data/static/handmade_data.mjs'
import { select_building, selected_building_id } from './select_building.mjs'
import { create_panel_thumbs_list } from './panel/panel_thumbs_list.mjs'
import { update_panel_thumbs_list_size_variables } from './panel/panel_thumbs_list_size_manager.mjs'
import * as svg_icons from './svg_icons.mjs'
import {
    create_element_from_Html,
    debounce,
    div,
    get_image_url,
    get_map_center_shift,
    get_visible_map_center_px,
    is_landscape,
    is_mobile_device,
    push_to_history
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
                    ${svg_icons.question}
                    <div id="doubt-message">I have serious doubts about whether this building belongs to the colonial period</div>
            </div>`
        : ''

    const google = all_handmade_data[id].google
        ? `<div id="building-info__google">
                    <a target="_blank" href="${all_handmade_data[id].google}">
                        ${svg_icons.gmaps}
                    </a>
                </div>`
        : ''

    const flyto = `<div id="building-info__flyto" title="Fly to this building">
        ${svg_icons.flyto}
    </div>`




    let copylink_or_share = ''
    if (is_mobile_device && navigator.share) {
        copylink_or_share = `<div id="building-info__share" title="Share">
            ${svg_icons.share}
        </div>`
    } else if (!is_mobile_device && navigator.clipboard?.writeText) {
        copylink_or_share = `<div id="building-info__copylink"  title="Copy link to this building" >
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
        false
    )
    update_flyto_button()
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
        () => {
            if (should_try_to_fly) {
                try_fly_to_building(id).then(panel.resize_to_content)
            } else {
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
        } else  {
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

            window.dalatmap.easeTo({
                /* I used to get center from get_center_for_bldg_with_offset(id)
                 and avoid passing offset
                 but in case of changing zooming this smart offset value was wrong
                 for it was calculated for initial zoom level
                */
                center: centroids_etc[id]?.centroid,
                offset: get_map_center_shift(panel.content_breadth),
                zoom: target_zoom,
                duration: Math.max(distance_from_center, 500) * (zoom_diff + 1)
            })

            window.dalatmap.once('moveend', resolve)

        } else {
            resolve()
        }
    })

}


export const update_flyto_button = debounce(() => {
    const but_el = document.querySelector('#building-info__flyto')
    if (!but_el) return

    const cntr = get_visible_map_center_px()

    const selected_bldg_in_center = window.dalatmap
        .queryRenderedFeatures([
            [cntr[0] - 15, cntr[1] - 15],
            [cntr[0] + 15, cntr[1] + 15]
        ])
        .find(feat => {
            return (feat.id === Number(selected_building_id))
        })
    if (selected_bldg_in_center) {
        but_el.classList.add('disabled')
    } else {
        but_el.classList.remove('disabled')
    }
}, 500)