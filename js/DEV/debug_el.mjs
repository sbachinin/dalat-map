import { create_element_from_Html } from "../utils/frontend_utils.mjs"

const debugel = create_element_from_Html(`
            <div style="position: fixed; z-index: 100">
                <div id="debug-zoom"></div>
                <div id="debug-other"></div>
                <a id="port-switcher"
                style="font-size: 50px; text-decoration: none; padding-left: 10px" 
                href="#"
                >
                +
                </a>
                <br>
                <button id="clear-ls">clear ls</button>
            </div>`)
document.body.append(debugel)

const port_switcher = debugel.querySelector('a#port-switcher')

port_switcher.remove() // !!!!!!!!!!!!! remove this line to get the switcher back

port_switcher.addEventListener('click', () => {
    // increment subdomain, if localhost
    if (!window.location.href.match('localhost')) {
        // if not localhost, then it's probably a bare ip address, when visiting from mobile
        // in such case, incrementing ip address leads to a puzzling blank screen
        return
    }
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

debugel.querySelector('#clear-ls').addEventListener('click', () => localStorage.clear())

export const write_to_debug_el = (text) => {
    if (debugel === null) return
    document.querySelector('#debug-other').innerHTML = text
}


const show_zoom = () => {
    document.querySelector('#debug-zoom').innerHTML = window.dalatmap.getZoom().toFixed(1)
}
window.dalatmap.on('moveend', show_zoom)
show_zoom()