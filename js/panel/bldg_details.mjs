import { panel, PANEL_CONTENT_TYPES } from './panel.mjs'
import { select_building } from '../select_building.mjs'
import { get_selected_building_id } from '../selected_building_id.mjs'
import { create_panel_thumbs_list } from './panel_thumbs_list.mjs'
import { update_panel_thumbs_list_size_variables } from './panel_thumbs_list_size_manager.mjs'
import {
    create_element_from_Html,
    div,
    get_map_center_shift_px,
    get_minimal_zoom_on_building_select,
    panel_is_vertical,
    parse_markdown_links,
    push_to_history,
} from '../utils/frontend_utils.mjs'
import { is_feature_selectable } from '../utils/does_feature_have_details.mjs'
import { current_city } from '../load_city.mjs'
import { make_icons } from './bldg_details_icons.mjs'
import { get_icon_as_ctx } from '../load_icons.mjs'
import { activate_image } from '../lazy-image.mjs'

const update_size_variables = () => {
    update_panel_thumbs_list_size_variables({
        max_width_ratio: 40 // TODO just copied from highlights but need to think
    })
}


const set_panel_content = (id) => {
    const feat_hmd = current_city.all_handmade_data[id]
    const feat_img_names = current_city.fids_to_img_names[id]

    const details_el = div({ id: 'building-details' })

    const thumbs_list_el = feat_img_names?.length
        ? create_panel_thumbs_list({
            images_basenames: feat_img_names
        })
        : '';

    thumbs_list_el && [...thumbs_list_el.querySelectorAll('a.lazy-image-wrapper')].slice(0, 2).forEach(img => {
        activate_image(img)
    })

    const dead_square = current_city.features_generated_props_for_frontend[id]?.is_dead
        ? `<img id="bldg-title-dead-square" src="${get_icon_as_ctx('black_square').canvas.toDataURL()}"> `
        : ''

    const title = feat_hmd?.title
        ? `<div id="building-info__title">${dead_square}${feat_hmd.title}</div>`
        : ''

    const subtitle = feat_hmd?.subtitle
        ? `<div id="building-info__subtitle">
            ${parse_markdown_links(feat_hmd.subtitle).replace(/\n/g, '<p class="tiny-paragraph"></p>')}
        </div>`
        : ''

    const year = feat_hmd?.year
        ? `<div id="building-info__year">Built in ${feat_hmd.year}</div>`
        : ''

    const links = feat_hmd?.links?.length
        ? `<div id="building-info__links">
            ${feat_hmd.links.map(link => {
            return `<a target="_blank" href="${link.url}">${link.description || link.url}</a>`
        }).join('')}
        </div>`
        : ''

    const info_el = create_element_from_Html(`
        <div id="building-info">
            ${title}
            ${subtitle}
            ${make_icons(id)}
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
    {
        should_push_history = false,
        should_expand_panel = true,
        should_try_to_fly = false,
        should_preserve_zoom = false
    } = {}
) => {
    if (id === get_selected_building_id()) {
        panel.resize_to_content() // meaning, expand the panel if it was collapsed
        return
    }

    if (is_feature_selectable(id)) {

        select_building(id)

        if (document.fonts && !document.fonts.check('italic normal 400 1em Merriweather')) {
            const merriweather = new FontFaceObserver('Merriweather', { weight: 'normal', style: 'italic' })
            await merriweather.load()
        }
        set_panel_content(id)

        if (should_push_history) {
            push_to_history(`?id=${id}${window.location.hash}`)
        }

        // wait for flight to end or to be cancelled right away
        await new Promise(resolve => {
            if (!should_try_to_fly) {
                resolve()
            }
            panel.once(
                'new content breadth',
                'fly to newly opened building',
                async () => {
                    if (should_try_to_fly) {
                        await try_fly_to_building(id, { should_preserve_zoom })
                    }
                    resolve()

                    if (should_expand_panel) {
                        panel.resize_to_content()
                    }
                }
            )
        })

        // after flight ends, or doesn't happen

        window.dalatmap.setFilter('Selected feature pin', ['==', ["id"], id])
    }
}


const distance2d = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))

const coords_will_be_in_view = (
    coords,
    padding = 40,
    panel_wil_be_expanded = true
) => {

    let left_bound = padding
    let bottom_bound = window.innerHeight - padding
    if (panel_wil_be_expanded) {
        if (panel_is_vertical()) {
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
    {
        force = false,
        should_preserve_zoom = false
    } = {}
) => {
    return new Promise((resolve) => {
        const feature_center_arr = current_city.features_generated_props_for_frontend[id]?.centroid
        if (feature_center_arr === undefined) {
            console.warn(`no centroid for ${id}, perhaps need to regenerate?`)
            resolve()
            return
        }
        const feature_screen_xy = window.dalatmap.project(feature_center_arr)
        const map_zoom = window.dalatmap.getZoom()

        const target_zoom = should_preserve_zoom
            ? map_zoom
            : Math.max(get_minimal_zoom_on_building_select(id), map_zoom)

        if (
            coords_will_be_in_view(feature_screen_xy)
            && target_zoom <= map_zoom // need not zoom
            && !force
        ) {
            resolve()
            return
        }



        const map_el = document.querySelector('#maplibregl-map')
        const distance_from_center = distance2d(
            feature_screen_xy.x,
            feature_screen_xy.y,
            map_el.offsetWidth / 2,
            map_el.offsetHeight / 2
        )

        let duration = distance_from_center
        const zoom_diff = Math.abs(map_zoom - target_zoom)
        duration += (zoom_diff * 400) // longer if zoom change

        const mindur = 700
        const maxdur = 2000
        duration = Math.min(Math.max(duration, mindur), maxdur)

        // ###5
        window.dalatmap.flyTo({
            center: current_city.features_generated_props_for_frontend[id]?.centroid,
            offset: get_map_center_shift_px(panel.content_breadth),
            zoom: target_zoom,
            duration,
            curve: 0.1
        })

        // Here map.on('moveend') was used instead of setTimeout.
        // It looked cooler but failed on my gpu-deficient desktop
        // where easeTo wasn't really animated and moveend wasn't fired.
        // It's a very marginal case but still setTimeout looks more reliable.
        // Besides, moveend, in case of its failure, will be fired as a surprise in the end of any subsequent map swipe - super ugly
        setTimeout(resolve, duration)

    })

}
