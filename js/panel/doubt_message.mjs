import { hide_tooltip, is_tooltip_open, show_tooltip } from "../tooltip.mjs"
import { is_mouse_device } from "../utils/utils.mjs"

let close_timeout = null

export const handle_doubt_click = () => {
    const doubt_main_el = document.querySelector('#building-info__doubt')

    if (is_tooltip_open(doubt_main_el)) {
        hide_tooltip()
    } else {
        show_tooltip(
            doubt_main_el,
            `I don't have enough information or intuition to say whether it was built during the colonial period or later`,
            150,
            'bottom'
        )

        if (is_mouse_device) {
            doubt_main_el.addEventListener(
                'mouseleave',
                hide_tooltip,
                { once: true })
        } else {
            clearTimeout(close_timeout)
            close_timeout = setTimeout(hide_tooltip, 5000)
        }
    }

}