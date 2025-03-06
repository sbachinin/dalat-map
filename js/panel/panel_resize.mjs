import { panel } from './panel.mjs'

export const adjust_panel_on_resize = () => {
    panel.wrapper_element.classList.add('notransition')
    panel.content?.update_size()
    panel.wrapper_element.scrollTop = 0
    panel.wrapper_element.scrollLeft = 0
    panel.cache_full_size()

    Promise.all([panel.is_rather_expanded(), panel.full_size_promise])
        .then(([was_expanded, full_size]) => {
            panel.set_size(was_expanded ? full_size : 0)
            panel.wrapper_element.classList.remove('notransition')
        })
}
