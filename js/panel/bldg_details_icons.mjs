import * as svg_icons from '../svg_icons.mjs'
import {
    is_mobile_device,
    is_mouse_device,
} from '../utils/frontend_utils.mjs'
import { RENDERABLES_NAMES } from '../constants.mjs'
import { current_city } from '../load_city.mjs'
import { panel } from './panel.mjs'
import { show_tooltip } from '../tooltip.mjs'
import { get_link_to_selected_bldg } from '../select_building.mjs'
import { try_fly_to_building } from '../bldg_details.mjs'
import { get_selected_building_id } from '../selected_building_id.mjs'
import { onclick_share } from './onclick_share.mjs'

function get_topmost_id(html_string) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html_string, 'text/html')
    const first_el = doc.body.firstElementChild
    return first_el?.id || null
}

const info_icons = [
    {
        if: (fid) => {
            return current_city.features_from_renderables_as_array.find(f => {
                return fid === f.id && f.properties?.renderable_id === RENDERABLES_NAMES.DEAD_BUILDINGS
            })
        },
        get_markup: fid => `<div id="building-info__dead">
                <img src="../auxiliary_images/skull.png">
            </div>`,
        tooltip_when: ['click', 'hover'],
        tooltip: {
            text: `This building was recently demolished`,
            textNoWrap: true,
            position: 'bottom'
        }
    },
    {
        if: fid => current_city.all_handmade_data[fid]?.doubt,
        get_markup: fid => `<div id="building-info__doubt">
            <img src="../auxiliary_images/question.png">
        </div>`,
        tooltip_when: ['click', 'hover'],
        tooltip: {
            text: `I don't have enough information or intuition to say whether it was built during the colonial period or later`,
            minWidth: 250,
            position: 'bottom',
            closeAfter: !is_mouse_device ? 5000 : undefined
        }
    }
]


const buttons_icons = [
    {
        if: fid => current_city.all_handmade_data[fid]?.wikipedia,
        get_markup: fid => `<div id="building-info__wikipedia">
            <a target="_blank" href="${current_city.all_handmade_data[fid]?.wikipedia}">
                <img src="../auxiliary_images/wikipedia.svg">
            </a>
        </div>`
    },
    {
        if: fid => current_city.all_handmade_data[fid]?.google,
        get_markup: fid => `<div id="building-info__google">
            <a target="_blank" href="${current_city.all_handmade_data[fid]?.google}">
                ${svg_icons.gmaps}
            </a>
        </div>`,
        tooltip_when: ['hover'],
        tooltip: {
            text: `Open in Google Maps`,
            textNoWrap: true,
            position: 'bottom'
        }
    },
    {
        if: () => true,
        get_markup: fid => `<div id="building-info__flyto" class="disabled">
            ${svg_icons.flyto}
        </div>`,
        tooltip_when: ['hover'],
        tooltip: {
            text: `Fly to this building`,
            textNoWrap: true,
            position: 'bottom'
        },
        onclick: (e) => {
            try_fly_to_building(get_selected_building_id(), { force: true })
        }
    },

    {
        if: () => is_mobile_device && navigator.share,
        get_markup: fid => `<div id="building-info__share" title="Share">
            ${svg_icons.share}
        </div>`,
        onclick: onclick_share
    },
    {
        if: () => !is_mobile_device && navigator.clipboard?.writeText,
        get_markup: fid => `<div id="building-info__copylink">
            ${svg_icons.copylink}
            <div id="copylink-message"></div>
        </div>`,
        tooltip_when: ['hover'],
        tooltip: {
            text: `Copy link to this building`,
            textNoWrap: true,
            position: 'bottom'
        },
        onclick: () => {
            const message_el = document.querySelector('#copylink-message')
            navigator.clipboard.writeText(
                get_link_to_selected_bldg())
                .then(() => {
                    message_el.innerText = 'Link copied!'
                    message_el.style.display = 'block'
                    setTimeout(() => {
                        message_el.style.display = 'none'
                    }, 1200);
                })
                .catch(err => {
                    message_el.innerText = 'Failed to copy link!'
                    message_el.style.display = 'block';
                    setTimeout(() => {
                        message_el.style.display = 'none'
                    }, 2000)
                })
        }
    }
]

const set_icons_listeners = () => {
    const all_icons = [...info_icons, ...buttons_icons]
        .map(i => ({
            ...i,
            root_el_id: get_topmost_id(i.get_markup()),
        }))

    const try_show_tooltip = (e_target, icons) => {
        icons.forEach(icon => {
            if (e_target.closest('#' + icon.root_el_id)) {
                show_tooltip({
                    ...icon.tooltip,
                    triggerEl: document.querySelector('#' + icon.root_el_id),
                    boundingEl: panel.wrapper_element,
                })
            }
        })
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#building-info__icons')) return
        try_show_tooltip(
            e.target,
            all_icons.filter(icon => icon.tooltip_when?.includes('click'))
        )
        all_icons
            .find(icon => icon.onclick && e.target.closest('#' + icon.root_el_id))
            ?.onclick(e)
    })

    document.addEventListener('mouseover', (e) => {
        if (!e.target.closest('#building-info__icons')) return
        try_show_tooltip(
            e.target,
            all_icons.filter(icon => icon.tooltip_when?.includes('hover'))
        )
    })
}



let listeners_were_set = false

export const make_icons = (fid) => {
    if (!listeners_were_set) {
        set_icons_listeners()
        listeners_were_set = true
    }

    return `<div id="building-info__icons">
        <div>
            ${info_icons.map(icon => icon.if(fid) ? icon.get_markup(fid) : '').join('\n')}
        </div>
        <div id=building-buttons>
            ${buttons_icons.map(icon => icon.if(fid) ? icon.get_markup(fid) : '').join('\n')}
        </div>
    </div>`
}

