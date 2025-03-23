/* 
    Rationale
    These buttons are to zoom in/out with respect of the panel size.
    When the panel is expanded, default zooming to the map center looks weird
    because the visible center is elsewhere.
    Therefore it was necessary to manually call zoomIn / zoomOut with "offset" option.
*/

import { debounce, get_map_center_shift } from "./utils/utils.mjs"

const zoomin_button = document.querySelector('.zoom-button.zoom-in')
const zoomout_button = document.querySelector('.zoom-button.zoom-out')

const round_to_2_decimals = n => Math.round(n * 100) / 100

const undebounced_update_zoom_buttons = () => {
    const map = window.dalatmap
    const currentZoom = map.getZoom()

    const west_bound = round_to_2_decimals(map.getBounds().getWest())
    const east_bound = round_to_2_decimals(map.getBounds().getEast())
    const north_bound = round_to_2_decimals(map.getBounds().getNorth())
    const south_bound = round_to_2_decimals(map.getBounds().getSouth())

    const maxBounds = map.getMaxBounds()

    // either all available map lat is visible in viewport,
    // or all available lng
    const max_bounds_are_reached = (
        (
            west_bound <= maxBounds.getWest() &&
            east_bound >= maxBounds.getEast()
        ) || (
            south_bound <= maxBounds.getSouth() &&
            north_bound >= maxBounds.getNorth()
        )
    )

    zoomout_button.classList[max_bounds_are_reached ? 'add' : 'remove']('disabled')

    const max_zoom_is_reached = currentZoom === map.getMaxZoom()
    zoomin_button.classList[max_zoom_is_reached ? 'add' : 'remove']('disabled')
}

export const update_zoom_buttons = debounce(() => undebounced_update_zoom_buttons())

export const initialize_custom_zoom_buttons = () => {

    zoomin_button.addEventListener('click', () => {
        window.dalatmap.zoomIn({
            offset: get_map_center_shift()
        })
    })

    zoomout_button.addEventListener('click', () => {
        window.dalatmap.zoomOut({
            offset: get_map_center_shift()
        })
    })

    undebounced_update_zoom_buttons()
}