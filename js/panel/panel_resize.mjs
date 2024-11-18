export const handle_resize = (panel) => {

    const onresize = () => {
        panel.element.classList.add('notransition')
        panel.content.update()
        panel.element.scrollTop = 0
        panel.element.scrollLeft = 0
        panel.cache_full_size()

        Promise.all([panel.is_expanded(), panel.full_size_promise])
            .then(([was_expanded, full_size]) => {
                panel.set_size(was_expanded ? full_size : 0)
                panel.element.classList.remove('notransition')
            })
    }

    window.addEventListener('resize', onresize)
    window.addEventListener('orientationchange', onresize)
}

