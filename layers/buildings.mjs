const frenchColor = 'hsl(300, 70%, 70%)'
const frenchBorderColor = 'hsl(300, 70%, 30%)'


export default [

    {
        "id": "Boring building",
        "type": "fill",
        "source": "dalat-tiles",
        "source-layer": "boring_building",
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
        filter: ["!=", "name", "Big C"]
    },


    {
        "id": "French building",
        "type": "fill",
        "source": "dalat-tiles",
        "source-layer": "french_building",
        "minzoom": 14,
        "paint": {
            "fill-color": frenchColor,
            "fill-antialias": true,
        },
    },

    {
        'id': 'Colonial thickening outline',
        'type': 'line',
        "source": "dalat-tiles",
        "source-layer": "french_building",
        "minzoom": 14,
        'paint': {
            'line-color': frenchColor,
            'line-width': [
                "interpolate",
                ["linear"],
                ["zoom"],
                14,  // Zoom level at which opacity should start decreasing
                2,   // Opacity at zoom level 14
                16,  // Zoom level just above 14
                0    // Opacity at zoom level 15 and higher
            ]
        },
    },

    
    {
        'id': 'Colonial has-details outline',
        'type': 'line',
        "source": "dalat-tiles",
        "source-layer": "french_building",
        "minzoom": 14,
        'paint': {
            'line-color': [
                'case',
                ['boolean', ['feature-state', 'hasDetails'], false],
                frenchBorderColor,
                'transparent',
            ],
            'line-width': [
                "interpolate",
                ["linear", 2],
                ["zoom"],
                14, 0.5,
                16, 2
            ]
        },
    },


]