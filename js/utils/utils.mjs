import { shit_ids } from '../../data/for_runtime/bldgs_ids.mjs'
import { centroids_etc } from '../../data/for_runtime/centroids_etc.mjs'
import { bldgs_handmade_data } from '../../data/static/bldgs_handmade_data.mjs'
import { map_bounds } from '../layers/constants.mjs'
import { is_french_building } from './isomorphic_utils.mjs'

export const is_landscape = () => window.matchMedia("(orientation: landscape)").matches

export const is_mouse_device = window.matchMedia("(pointer: fine)").matches

export const is_mobile_device = (() => {
    let check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
})()

export const div = ({ id, class_name }) => {
    const el = document.createElement('div')
    if (class_name) {
        el.className = class_name
    }
    if (id) {
        el.id = id
    }
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

export function get_visible_map_center_px() {
    const map_el = document.querySelector('#maplibregl-map')
    const center_x = map_el.clientWidth / 2 + get_map_center_shift()[0]
    const center_y = map_el.clientHeight / 2 + get_map_center_shift()[1]
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


export const extract_extension_from_src = (src) => {
    const url = new URL(src);
    const pathname = url.pathname;
    return pathname.substring(pathname.lastIndexOf('.') + 1);
}

export function get_image_file_from_element(img_element, filename, quality = 0.9) {
    return new Promise((resolve, reject) => {
        try {
            if (!img_element.complete) {
                img_element.onload = () => create_file_from_image();
                img_element.onerror = () => reject(new Error("Image failed to load"));
            } else {
                create_file_from_image();
            }

            function create_file_from_image() {
                const canvas = document.createElement('canvas');
                canvas.width = img_element.naturalWidth;
                canvas.height = img_element.naturalHeight;

                const extension = extract_extension_from_src(img_element.src);

                filename = filename || 'image.' + extension

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img_element, 0, 0);

                let mime_type = 'image/jpeg';
                switch (extension) {
                    case 'png': mime_type = 'image/png'; break;
                    case 'gif': mime_type = 'image/gif'; break;
                    case 'webp': mime_type = 'image/webp'; break;
                }

                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error("Canvas to Blob conversion failed"));
                        return;
                    }

                    const file = new File([blob], filename, { type: mime_type });
                    resolve(file);
                }, mime_type, quality);
            }
        } catch (error) {
            reject(error);
        }
    });
}


export const can_share_files = () => {
    const file = new File([new Blob()], 'test.txt', { type: 'text/plain' })
    return navigator.canShare && navigator.canShare({ files: [file] })
}

export const get_full_map_center = () => {
    return [
        map_bounds[0] + (map_bounds[2] - map_bounds[0]) / 2,
        map_bounds[1] + (map_bounds[3] - map_bounds[1]) / 2
    ]
}


export const deep_merge_objects = (target, source) => {
    const result = { ...target };

    for (const key in source) {
        if (source.hasOwnProperty(key) &&
            typeof source[key] === 'object' &&
            source[key] !== null &&
            !Array.isArray(source[key])) {
            result[key] = deep_merge_objects(result[key] || {}, source[key]);
        } else {
            result[key] = source[key];
        }
    }

    return result;
}