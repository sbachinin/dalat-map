export const handle_resize = (panel) => {

    const onresize = () => {
        panel.content.update()
        panel.element.scrollTop = 0
        panel.element.scrollLeft = 0
        const was_expanded = panel.is_expanded()
        setTimeout(() => {  // after content has surely resized...
            const full_size = panel.set_full_size()
            // can just always collapse panel after resize, if it simplifies:
            panel.set_size(was_expanded ? full_size : 0)
        }, 1)
    }

    window.addEventListener('resize', onresize)
    window.addEventListener('orientationchange', onresize)
}

