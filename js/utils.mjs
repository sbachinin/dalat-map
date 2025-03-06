import { french_ids, shit_ids } from '../data/for_runtime/bldgs_ids.mjs'
import { centroids_etc } from '../data/for_runtime/centroids_etc.mjs'
import { bldgs_handmade_data } from '../data/static/bldgs_handmade_data.mjs'

export const is_landscape = () => window.matchMedia("(orientation: landscape)").matches

export const is_mouse_device = window.matchMedia("(pointer: fine)").matches

export const div = (class_name) => {
    const el = document.createElement('div')
    el.className = class_name
    return el
}

const get_css_var = (name, element = document.documentElement) => {
    const cvar = getComputedStyle(element)
        .getPropertyValue(name)

    if (cvar === '') {
        console.warn('css var not set: ', name)
    }
    return cvar
}

export const get_css_var_num = (name, element = document.documentElement) => {
    return parseInt(get_css_var(name, element))
}


export const set_css_num_var = (name, value, units, element = document.documentElement) => {
    if (units === undefined) {
        console.warn('units not passed to set_css_num_var')
    }
    element.style.setProperty(name, String(value) + units)
}

export const within = (number, min, max) => Math.max(min, Math.min(number, max));

export const debounce = (func, delay = 100) => {
    let timeout
    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            func(...args)
        }, delay)
    }
}

export const wrap = (num, min, max) => {
    const range = max - min + 1
    return ((num - min) % range + range) % range + min
}

export const get_image_url = (name, folder) => {
    const folder_part = folder ? `${folder}/` : ''
    return `${window.location.origin}/dalat-map-images/${folder_part}${name.replace('HEIC', 'jpg')}`
    // return `https://sbachinin.github.io/dalat-map-images/${folder}/${name.replace('HEIC', 'jpg')}`
}

export const do_n_times = (n, fn) => {
    for (let i = 0; i <= n; i++) {
        fn(i)
    }
}

export const toggle_class = (el, class_name, condition) => {
    if (condition) {
        el.classList.add(class_name)
    } else {
        el.classList.remove(class_name)
    }
}

export const create_element_from_Html = htmlString => {
    if (typeof htmlString !== 'string') {
        console.warn('create_element_from_Html expects an html string, instead got: ', htmlString)
        return document.createElement('div')
    }

    const div = document.createElement('div')
    div.innerHTML = htmlString.trim()
    if (!div.firstElementChild) {
        console.warn(`create_element_from_Html: failed to create an element from string: "${htmlString}"`)
        return document.createElement('div')
    }
    return div.firstElementChild
}

export const push_to_history = (state, url) => {
    if (JSON.stringify(history.state) === JSON.stringify(state)) {
        console.log('state did not change, skip writing to history')
        return
    }
    history.pushState(state, "", url)
}


export const get_panel_current_breadth = () => get_css_var_num('--panel-breadth')


// it's about "target" dimensions - these of a fully expanded panel
const get_panel_dimensions = () => {
    return [
        is_landscape() ? get_panel_current_breadth() : 0,
        !is_landscape() ? get_panel_current_breadth() : 0
    ]
}

// center of portion of the map not covered by the panel
export const get_map_center_shift = () => {
    return [
        get_panel_dimensions()[0] / 2,
        -get_panel_dimensions()[1] / 2
    ]
}

// Are coords within map "viewport" and not covered by panel?
export const coords_are_in_view = (coords, padding = 40) => {
    return coords.x > (get_panel_dimensions()[0] + padding)
        && coords.x < (window.innerWidth - padding)
        && coords.y > padding
        && coords.y < (window.innerHeight - get_panel_dimensions()[1] - padding)
}

export const get_lnglat_per_px = () => {
    return {
        lng_per_px: dalatmap.unproject([1, 0]).lng - dalatmap.unproject([0, 0]).lng,
        lat_per_px: dalatmap.unproject([0, 1]).lat - dalatmap.unproject([0, 0]).lat,
    }
}

export const add_disposable_transitionend_handler = (el, fn) => {
    const handle_transition_end = _ => {
        fn()
        el.removeEventListener('transitionend', handle_transition_end)
    }
    el.addEventListener('transitionend', handle_transition_end)
}

export const wait_once_for_transitionend = (el) => {
    return new Promise(resolve => add_disposable_transitionend_handler(el, resolve))
}

export const get_geojson_source = (features) => {
    return {
        type: "geojson",
        data: {
            "type": "FeatureCollection",
            features
        }
    }
}

export const is_french_building = fid => french_ids.includes(fid)
export const is_shit_building = fid => shit_ids.includes(fid)

export const is_a_building = fid => {
    return is_french_building(fid) || is_shit_building(fid)
}


export function get_center_for_bldg_with_offset(id) {
    const cntrd = centroids_etc[id]?.centroid
    if (!cntrd) {
        console.warn(`no centroid for ${id}`)
        return
    }
    const { lng_per_px, lat_per_px } = get_lnglat_per_px()
    const center_x = cntrd[0] - lng_per_px * get_map_center_shift()[0]
    const center_y = cntrd[1] - lat_per_px * get_map_center_shift()[1]
    return [center_x, center_y]
}

export const find_bldg_id_by_image_filename = (filename) => {
    const [bldg_id] = Object.entries(bldgs_handmade_data).find(([feat_id, feat]) => {
        return feat.images?.includes(filename)
    }) || [null]
    return bldg_id
}

export const observe_dom_mutations = (selector, cb) => {

    const container = document.querySelector(selector)
    const observer = new MutationObserver((...args) => cb(...args))

    observer.observe(container, {
        childList: true,
        subtree: true
    })
    return observer
}

export const wait_1frame = () => new Promise(resolve => requestAnimationFrame(resolve))