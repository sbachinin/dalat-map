import { panel } from './panel.mjs'

export const adjust_panel_on_resize = () => {

    // Prevents untidy movements when orientation changes on mobile while panel is open
    document.documentElement.setAttribute('window-was-just-resized', true)

    panel.content?.update_size()
    panel.wrapper_element.scrollTop = 0
    panel.wrapper_element.scrollLeft = 0
    panel.cache_content_breadth()

    panel.set_size(panel.is_at_least_partially_expanded() ? panel.content_breadth : 0)
    setTimeout(() => {
        document.documentElement.setAttribute('window-was-just-resized', false)
    }, 0)
}
