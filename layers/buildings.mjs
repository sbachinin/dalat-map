import { getMainReveal, mainOpacityReveal } from './mainReveal.mjs'

const frenchColor = 'hsl(300, 70%, 70%)'
const frenchBorderColor = 'hsl(300, 70%, 30%)'
const darkerBoringBuildingColor = 'hsl(43, 15%, 65%)'
const boringBuildingColor = 'hsl(43, 15%, 90%)'

export default [

    {
        "id": "Boring building",
        "type": "fill",
        "source": "dalat-tiles",
        "source-layer": "boring_building",
        "minzoom": mainOpacityReveal[3],
        "paint": {
            "fill-color": getMainReveal(darkerBoringBuildingColor, boringBuildingColor),
            "fill-antialias": true,
            "fill-opacity": mainOpacityReveal
        },
        filter: ["!=", "name", "Big C"]
    },


    {
        "id": "French building",
        "type": "fill",
        "source": "dalat-tiles",
        "source-layer": "french_building",
        "minzoom": mainOpacityReveal[3],
        "paint": {
            "fill-color": frenchColor,
            "fill-antialias": true,
            "fill-opacity": mainOpacityReveal
        },
    },

    {
        'id': 'Colonial thickening outline',
        'type': 'line',
        "source": "dalat-tiles",
        "source-layer": "french_building",
        "minzoom": mainOpacityReveal[3],
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
            ],
            "line-opacity": mainOpacityReveal
        },
    },

    
    {
        'id': 'Colonial has-details outline',
        'type': 'line',
        "source": "dalat-tiles",
        "source-layer": "french_building",
        "minzoom": mainOpacityReveal[3],
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
            ],
            "line-opacity": mainOpacityReveal
        },
    },


]