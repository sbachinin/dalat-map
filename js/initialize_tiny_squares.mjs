import { french_buildings_tiny_squares_with_titles, shit_buildings_tiny_squares_with_titles } from "./layers/buildings.mjs"
import { buildings_centroids_with_titles_source } from "./sources.mjs"
import { get_image_url } from "./utils.mjs"

const loadImageAsync = url => {
    return new Promise((resolve) => {
        window.dalatmap.loadImage(url).then(resolve)
    })
}

export const initialize_tiny_squares = async () => {
    const [image1, image2, image3, image4] = await Promise.all([
        loadImageAsync(get_image_url('tiny_french_square.png', '')),
        loadImageAsync(get_image_url('tiny_non_french_square.png', '')),
        loadImageAsync(get_image_url('railway_tiny_square.png', '')),
        loadImageAsync(get_image_url('peak_triangle.png', ''))
    ])
    window.dalatmap.addImage('tiny_french_square', image1.data)
    window.dalatmap.addImage('tiny_non_french_square', image2.data)
    window.dalatmap.addImage('railway_tiny_square', image3.data)
    window.dalatmap.addImage('peak_triangle', image4.data)
    window.dalatmap.addSource('buildings_tiny_squares', buildings_centroids_with_titles_source)
    window.dalatmap.addLayer(french_buildings_tiny_squares_with_titles)
    window.dalatmap.addLayer(shit_buildings_tiny_squares_with_titles)
}