import dead_buildings_json from '../data/static/dead_buildings_json.mjs'

const french_dead_color = 'hsl(300, 30%, 95%)'

export const add_dead_buildings = async () => {
    const image = await window.dalatmap.loadImage(`${window.location.origin}/dalat-map-images/skull.png`)
    window.dalatmap.addImage('skull-icon', image.data)
    window.dalatmap.addSource('dead-buildings', {
        type: 'geojson',
        data: dead_buildings_json
    })


    window.dalatmap.addLayer({
        "id": "Dead building fill",
        "type": "fill",
        "source": "dead-buildings",
        "minzoom": 14,
        "paint": {
            "fill-color": french_dead_color,
            "fill-antialias": true
        },
    })

    window.dalatmap.addLayer(
        {
            id: 'Dead building skull',
            type: 'symbol',
            source: 'dead-buildings',
            "minzoom": 15.5,
            layout: {
                'icon-image': 'skull-icon',
                'icon-size': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    12, 0.005,
                    18, 0.05
                ],
                'icon-allow-overlap': true
            },
        }
    )
}