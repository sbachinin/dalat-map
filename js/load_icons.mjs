import {
    WATER_TITLE_COLOR,
    BORING_SQUARE_COLOR,
    FRENCH_SELECTED_FILL_COLOR,
    DEAD_BUILDING_FILL_COLOR
} from "./common_drawing_layers/constants.mjs"

const icons_ids_to_commands = {
    'french_circle': (ctx) => {
        ctx.fillStyle = 'hsl(22, 100%, 60%)'
        ctx.beginPath()
        ctx.arc(32, 32, 30, 0, Math.PI * 2) // Center (32, 32), Radius 30
        ctx.fill()
    },

    'dead_circle': ctx => {
        ctx.fillStyle = DEAD_BUILDING_FILL_COLOR
        ctx.beginPath()
        ctx.arc(32, 32, 30, 0, Math.PI * 2)
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
    'black_square': (ctx) => {
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, 64, 64)
    },
    'pin': (ctx) => {
        const scale = 64 / 20
        ctx.translate(2 * scale, 2 * scale)
        ctx.scale(scale, scale)

        // --- Outer teardrop shape ---
        ctx.beginPath()
        ctx.moveTo(3.37892, 10.2236)
        ctx.lineTo(8, 16)
        ctx.lineTo(12.6211, 10.2236)
        ctx.bezierCurveTo(13.5137, 9.10788, 14, 7.72154, 14, 6.29266)
        ctx.lineTo(14, 6)
        ctx.bezierCurveTo(14, 2.68629, 11.3137, 0, 8, 0)
        ctx.bezierCurveTo(4.68629, 0, 2, 2.68629, 2, 6)
        ctx.lineTo(2, 6.29266)
        ctx.bezierCurveTo(2, 7.72154, 2.4863, 9.10788, 3.37892, 10.2236)
        ctx.closePath()

        // White fill with black border
        ctx.fillStyle = '#fff'
        ctx.strokeStyle = '#000'
        ctx.lineWidth = 0.4
        ctx.fill()
        ctx.stroke()

        // black circle
        ctx.beginPath()
        ctx.arc(8, 6, 3, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fillStyle = '#000'
        ctx.fill()

        // bright circle
        ctx.beginPath()
        ctx.arc(8, 6, 2, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fillStyle = FRENCH_SELECTED_FILL_COLOR
        ctx.fill()
    }
}



export const get_icon_as_ctx = (id, xy = [64, 64]) => {
    const canvas = document.createElement("canvas")
    canvas.width = xy[0]
    canvas.height = xy[1]
    const ctx = canvas.getContext("2d")
    icons_ids_to_commands[id](ctx)
    return ctx
}


export const load_icons = () => {

    window.dalatmap.on("styleimagemissing", (e) => {
        const id = e.id

        if (window.dalatmap.hasImage(id)) return

        const dimensions = [64, 64]

        const ctx = get_icon_as_ctx(id, dimensions)

        const imageData = ctx.getImageData(0, 0, ...dimensions)
        window.dalatmap.addImage(id, imageData, { pixelRatio: 2 })
    })

    window.dalatmap.fire('styleimagemissing', { id: 'pin' })
}