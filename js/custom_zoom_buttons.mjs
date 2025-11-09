/* 
    Rationale
    These buttons are to zoom in/out with respect of the panel size.
    When the panel is expanded, default zooming to the map center looks weird
    because the visible center is elsewhere.
    Therefore it was necessary to manually call zoomIn / zoomOut with "offset" option.
*/

import {
    get_map_center_shift_px,
    get_panel_shown_breadth,
    get_root_html_attribute,
    throttle
} from "./utils/frontend_utils.mjs"

const zoomin_button = document.querySelector('.zoom-button.zoom-in')
const zoomout_button = document.querySelector('.zoom-button.zoom-out')


const undebounced_update_zoom_buttons = () => {
    const map = window.dalatmap
    const currentZoom = map.getZoom()

    const max_bounds_are_reached = get_root_html_attribute('min-zoom-reached')
    zoomout_button.classList[max_bounds_are_reached ? 'add' : 'remove']('disabled')

    const max_zoom_is_reached = currentZoom === map.getMaxZoom()
    zoomin_button.classList[max_zoom_is_reached ? 'add' : 'remove']('disabled')
}

export const update_zoom_buttons = throttle(() => undebounced_update_zoom_buttons(), 100, true)

export const initialize_custom_zoom_buttons = () => {

    zoomin_button.addEventListener('click', () => {
        window.dalatmap.zoomIn({
            offset: get_map_center_shift_px(get_panel_shown_breadth())
        })
    })

    zoomout_button.addEventListener('click', () => {
        window.dalatmap.zoomOut({
            offset: get_map_center_shift_px(get_panel_shown_breadth())
        })
    })

    undebounced_update_zoom_buttons()
}