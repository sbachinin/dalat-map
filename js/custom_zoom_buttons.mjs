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
} from "./utils/frontend_utils.mjs"

const zoomin_button = document.querySelector('.zoom-button.zoom-in')
const zoomout_button = document.querySelector('.zoom-button.zoom-out')


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
}