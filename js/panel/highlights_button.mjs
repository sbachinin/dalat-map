import { panel, PANEL_CONTENT_TYPES } from "./panel.mjs"

const highlights_opener = document.getElementById('highlights-opener')

export const initialize_highlights_button = () => {

    //  set disabled depending on initial panel content

    highlights_opener.classList.remove('invisible')

    panel.on(
        'content will be set',
        'highlights button',
        new_content => {
            const should_dim = new_content.type === PANEL_CONTENT_TYPES.HIGHLIGHTS
            highlights_opener.classList[should_dim ? 'add' : 'remove']('disabled')
        }
    )

    panel.on(
        'new breadth was set',
        'highlights button',
        (breadth, full_breadth) => {
            if (breadth === 0) {
                highlights_opener.classList.remove('disabled')
            }
            if (breadth === full_breadth) {
                if (panel.content.type === PANEL_CONTENT_TYPES.HIGHLIGHTS) {
                    highlights_opener.classList.add('disabled')
                }
            }
        }
    )
}