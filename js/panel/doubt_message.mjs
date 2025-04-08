import { hide_tooltip, show_tooltip } from "../tooltip.mjs"
import { is_mouse_device } from "../utils/utils.mjs"
import { panel } from "./panel.mjs"

let close_timeout = null

export const handle_doubt_click = () => {
    const doubt_main_el = document.querySelector('#building-info__doubt')

    show_tooltip({
        parentEl: doubt_main_el,
        boundingEl: panel.body_element,
        text: `I don't have enough information or intuition to say whether it was built during the colonial period or later`,
        minWidth: 250,
        position: 'bottom',
        hide_when_parent_clicked: false
    })

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