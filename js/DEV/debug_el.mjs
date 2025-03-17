import { create_element_from_Html } from "../utils.mjs"

let debugel = null

if (window.location.hostname === 'localhost'
    || window.location.hostname.match('192.168')
) {
    debugel = create_element_from_Html(`
            <div style="position: fixed; z-index: 100; background: white;">
            <a href="#" onclick="this.href = window.location.protocol + '//' + 
            window.location.hostname + ':' + 
            (parseInt(window.location.port || '80') + 1)">
                PORT++
            </a>
                <div id="debug-zoom"></div>
                <div id="debug-other"></div>
            </div>`)
    document.body.append(debugel)
}

export const handle_zoom_to_show_in_debug_el = () => {
    if (debugel === null) return

    const show_zoom = () => {
        document.querySelector('#debug-zoom').innerHTML = window.dalatmap.getZoom()
    }
    window.dalatmap.on('moveend', show_zoom)
    show_zoom()
}

export const write_to_debug_el = (text) => {
    if (debugel === null) return
    document.querySelector('#debug-other').innerHTML = text
}
