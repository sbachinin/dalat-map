const frenchColor = 'hsl(300, 100%, 55%)'

export default [

    {
        "id": "Plain building",
        "type": "fill",
        "source": "dalat-tiles",
        "source-layer": "building",
        "minzoom": 14,
        "paint": {
            "fill-color": 'hsl(43, 30%, 85%)',
            "fill-antialias": true,
            "fill-opacity": [
                "interpolate",
                ["linear", 2],
                ["zoom"],
                14, 0.5,
                16, 1
            ]
        },
        filter: [
            "all",
            ["!=", "building:architecture", "french_colonial"],
            ["!=", "name", "Big C"]
        ]
    },

    {
        "id": "French building",
        "type": "fill",
        "source": "dalat-tiles",
        "source-layer": "building",
        "minzoom": 14,
        "paint": {
            "fill-color": frenchColor,
            "fill-antialias": true,
        },
        filter: ["==", "building:architecture", "french_colonial"]
    },

    {
        'id': 'Colonial thickening outline',
        'type': 'line',
        "source": "dalat-tiles",
        "source-layer": "building",
        "minzoom": 14,
        'paint': {
            'line-color': frenchColor,
            'line-width': [
                "interpolate",
                ["linear"],
                ["zoom"],
                14,  // Zoom level at which opacity should start decreasing
                3,   // Opacity at zoom level 14
                16,  // Zoom level just above 14
                0    // Opacity at zoom level 15 and higher
            ]
        },
        filter: ["==", "building:architecture", "french_colonial"]
    },
]