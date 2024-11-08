let root = document.documentElement

const SCALE_RIGHT_OFFSET = 40; // offset where the scale labels can protrude and slowly fade in/out
document.documentElement.style.setProperty('--scale-right-offset', SCALE_RIGHT_OFFSET + 'px');

const possible_steps = [
    1, 2, 5, 10, 25, 50, 100, 250, 500, 1000, 2000, 5000
]

const scale_item_labels = []

const MIN_SCALE_ITEM_WIDTH = 60
const MAX_SCALE_ITEMS_COUNT = 6

const fullwidth_scale_wr = document.querySelector('.fullwidth-scale-wrapper')
let fullwidth_scale_width, items_viewport_limit, max_scale_items_count

const measure_base_values = () => {
    fullwidth_scale_width = fullwidth_scale_wr.getBoundingClientRect().width - SCALE_RIGHT_OFFSET // fullwidth_scale_wr.clientWidth // clientWidth doesn't include padding, it's important for precision
    items_viewport_limit = Math.ceil(fullwidth_scale_width / MIN_SCALE_ITEM_WIDTH)
    max_scale_items_count = Math.min(items_viewport_limit, MAX_SCALE_ITEMS_COUNT)
}

measure_base_values()

const update_scale = () => {
    if (fullwidth_scale_wr.style.visibility !== 'visible') {
        fullwidth_scale_wr.style.visibility = 'visible'
    }

    const mPerPx = 1 / window.map.transform._pixelPerMeter
    // if scale element is wide, it might be necessary to increase min value:
    const min_scale_item_width = Math.max(MIN_SCALE_ITEM_WIDTH, fullwidth_scale_width / max_scale_items_count)
    const min_step_value = mPerPx * min_scale_item_width

    const total_scale_value = mPerPx * fullwidth_scale_width

    let step_value = possible_steps.find((s, i) => {
        if (possible_steps[i + 1] > total_scale_value) { // if next value is wider than scale element, then take the current value even if it's too narrow
            return true
        }
        return s > min_step_value
    })

    const visible_steps_count = Math.max(1, total_scale_value / step_value)
    const step_width = fullwidth_scale_width / visible_steps_count

    root.style.setProperty('--scale-step-width', step_width + 'px')

    scale_item_labels.forEach((l, i) => {
        const value = step_value * (i + 1)

        if (
            (i > (visible_steps_count - 1))
            || (value > 1000 && value % 500 > 0) // drop stuff like 1250
        ) {
            l.parentElement.classList.add('hidden')
            return
        }

        l.parentElement.classList.remove('hidden')

        const num = value >= 1000 ? value / 1000 : value
        const units = value >= 1000 ? 'km' : 'm'

        let text = String(num) + `&#8201;` + units

        if (text !== l.innerText) {
            l.innerHTML = text
        }
    })
}


const create_scale_item = (i) => {
    const scale_item_el = document.createElement('div')
    scale_item_el.classList.add('scale-item')

    const scale_item_label_el = document.createElement('div')
    scale_item_label_el.classList.add('scale-item-label')

    scale_item_el.appendChild(scale_item_label_el)
    scale_item_labels.push(scale_item_label_el)

    return scale_item_el
}


export const create_scale = () => {
    for (let i = 0; i < MAX_SCALE_ITEMS_COUNT; i++) {
        fullwidth_scale_wr.firstElementChild.appendChild(create_scale_item(i))
    }

    window.map.once('render', () => {
        const handle_resize = debounce(() => {
            measure_base_values()
            update_scale()
        })
        window.map.on('zoom', update_scale);
        new ResizeObserver(handle_resize).observe(fullwidth_scale_wr)
    })
}


function debounce(func, timeout = 100) {
    let timer
    return () => {
        clearTimeout(timer)
        timer = setTimeout(
            () => { func() },
            timeout
        )
    }
}