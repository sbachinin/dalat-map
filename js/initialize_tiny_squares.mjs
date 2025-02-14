import { datanla_waterfall_layer } from "./layers/rivers.mjs"
import { get_geojson_source, get_image_url } from "./utils.mjs"

const loadImageAsync = url => {
    return new Promise((resolve) => {
        window.dalatmap.loadImage(url).then(resolve)
    })
}

export const initialize_tiny_squares = async () => {
    const [image2, image3, image4] = await Promise.all([
        loadImageAsync(get_image_url('tiny_non_french_square.png', '')),
        loadImageAsync(get_image_url('railway_tiny_square.png', '')),
        loadImageAsync(get_image_url('peak_triangle.png', ''))
    ])
    window.dalatmap.addImage('tiny_non_french_square', image2.data)
    window.dalatmap.addImage('railway_tiny_square', image3.data)
    window.dalatmap.addImage('peak_triangle', image4.data)
    window.dalatmap.addSource('datanla_waterfall', get_geojson_source(
        [{
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [108.4488444, 11.9011774]
            }
        }]
    ))
    window.dalatmap.addLayer(datanla_waterfall_layer)
}