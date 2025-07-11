import { WATER_TITLE_COLOR, BORING_SQUARE_COLOR } from "./common_drawing_layers/constants.mjs"

export const load_icons = async () => {

    window.dalatmap.on("styleimagemissing", (e) => {
        const id = e.id

        if (window.dalatmap.hasImage(id)) return

        const canvas = document.createElement("canvas")
        canvas.width = 64
        canvas.height = 64
        const ctx = canvas.getContext("2d")

        if (id === 'french_circle') {
            ctx.fillStyle = 'hsl(22, 100%, 60%)'
            ctx.beginPath()
            ctx.arc(32, 32, 30, 0, Math.PI * 2) // Center (32, 32), Radius 30
            ctx.fill()
        } else if (id === 'water_square') {
            ctx.fillStyle = WATER_TITLE_COLOR
            ctx.fillRect(0, 0, 64, 64)
        } else if (id === 'peak_triangle') {
            ctx.fillStyle = "black"
            ctx.beginPath()
            ctx.moveTo(32, 8)
            ctx.lineTo(56, 56)
            ctx.lineTo(8, 56)
            ctx.closePath()
            ctx.fill()
        } else if (id === 'boring_square') {
            ctx.fillStyle = BORING_SQUARE_COLOR
            ctx.fillRect(0, 0, 64, 64)
        } else if (id === 'boring_square_selected') {
            ctx.fillStyle = 'hsla(187, 71.10%, 52.70%, 0.65)'
            ctx.fillRect(0, 0, 64, 64)
        } else if (id === 'skull-icon') {
            window.dalatmap
                .loadImage(`../auxiliary_images/skull.png`)
                .then(image => window.dalatmap.addImage('skull-icon', image.data))
            return
        }


        const imageData = ctx.getImageData(0, 0, 64, 64)
        window.dalatmap.addImage(id, imageData, { pixelRatio: 2 })
    })
}