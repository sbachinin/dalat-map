import { create_element_from_Html } from "../utils/frontend_utils.mjs"

let debugel = null

if (window.location.hostname.endsWith('localhost')
    || window.location.hostname.match('192.168')
) {
    debugel = create_element_from_Html(`
            <div style="position: fixed; z-index: 100">
                <div id="debug-zoom"></div>
                <div id="debug-other"></div>
                <a id="port-switcher"
                style="font-size: 50px; text-decoration: none; padding-left: 10px" 
                href="#"
                >
                +
                </a>
            </div>`)
    document.body.append(debugel)

    const port_switcher = debugel.querySelector('a#port-switcher')
    port_switcher.addEventListener('click', () => {
        const parsedUrl = new URL(window.location.href)
        const subdomains = parsedUrl.hostname.split('.')
        if (!isNaN(Number(subdomains[0]))) {
            subdomains[0] = Number(subdomains[0]) + 1
        } else {
            subdomains.unshift(1)
        }
        parsedUrl.hostname = subdomains.join('.')
        port_switcher.href = parsedUrl.toString()
    })
}

export const handle_zoom_to_show_in_debug_el = () => {
    if (debugel === null) return

    const show_zoom = () => {
        document.querySelector('#debug-zoom').innerHTML = window.dalatmap.getZoom().toFixed(1)
    }
    window.dalatmap.on('moveend', show_zoom)
    show_zoom()
}

export const write_to_debug_el = (text) => {
    if (debugel === null) return
    document.querySelector('#debug-other').innerHTML = text
}
