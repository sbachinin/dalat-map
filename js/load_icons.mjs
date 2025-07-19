import { WATER_TITLE_COLOR, BORING_SQUARE_COLOR, FRENCH_SELECTED_FILL_COLOR, SELECTED_BORDER_COLOR } from "./common_drawing_layers/constants.mjs"

const icons_ids_to_commands = {
    'french_circle': (ctx) => {
        ctx.fillStyle = 'hsl(22, 100%, 60%)'
        ctx.beginPath()
        ctx.arc(32, 32, 30, 0, Math.PI * 2) // Center (32, 32), Radius 30
        ctx.fill()
    },
    'water_square': (ctx) => {
        ctx.fillStyle = WATER_TITLE_COLOR
        ctx.fillRect(0, 0, 64, 64)
    },
    'peak_triangle': (ctx) => {
        ctx.fillStyle = "black"
        ctx.beginPath()
        ctx.moveTo(32, 8)
        ctx.lineTo(56, 56)
        ctx.lineTo(8, 56)
        ctx.closePath()
        ctx.fill()
    },
    'boring_square': (ctx) => {
        ctx.fillStyle = BORING_SQUARE_COLOR
        ctx.fillRect(0, 0, 64, 64)
    },
    'selected_square': (ctx) => {
        ctx.fillStyle = SELECTED_BORDER_COLOR
        ctx.fillRect(0, 0, 20, 20)
        ctx.fillStyle = FRENCH_SELECTED_FILL_COLOR
        ctx.fillRect(4, 4, 12, 12)
    },
    'black_square': (ctx) => {
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, 64, 64)
    },
}

export const get_icon_as_ctx = (id, xy = [64, 64]) => {
    const canvas = document.createElement("canvas")
    canvas.width = xy[0]
    canvas.height = xy[1]
    const ctx = canvas.getContext("2d")
    icons_ids_to_commands[id](ctx)
    return ctx
}


export const load_icons = async () => {

    window.dalatmap.on("styleimagemissing", (e) => {
        const id = e.id

        if (window.dalatmap.hasImage(id)) return

        const dimensions = id === 'selected_square' ? [20, 20] : [64, 64]

        const ctx = get_icon_as_ctx(id, dimensions)

        /* else (id === 'skull-icon') {
            window.dalatmap
                .loadImage(`../auxiliary_images/skull.png`)
                .then(image => window.dalatmap.addImage('skull-icon', image.data))
            return
        } */


        const imageData = ctx.getImageData(0, 0, ...dimensions)
        window.dalatmap.addImage(id, imageData, { pixelRatio: 2 })
    })
}