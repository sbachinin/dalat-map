import { getMainReveal, mainOpacityReveal } from './mainReveal.mjs'

const french_color = 'hsl(300, 70%, 70%)'
const french_highlighted_color = 'hsl(35, 97.80%, 63.50%)'
const frenchBorderColor = 'hsl(0, 0.00%, 48.20%)'
const darkerBoringBuildingColor = 'hsl(43, 15%, 65%)'
const boringBuildingColor = 'hsl(43, 15%, 90%)'

export const boring_building_layers = [

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
    }
]

export const french_building_layers = [
    {
        "id": "French building",
        "type": "fill",
        "source": "dalat-tiles",
        "source-layer": "french_building",
        "minzoom": mainOpacityReveal[3],
        "paint": {
            "fill-color": [
                'case',
                ['==', ['feature-state', 'selected'], true],
                french_highlighted_color,
                french_color,
            ],
            "fill-antialias": true,
            "fill-opacity": mainOpacityReveal
        },
    },

    {
        'id': 'French thickening outline',
        'type': 'line',
        "source": "dalat-tiles",
        "source-layer": "french_building",
        "minzoom": mainOpacityReveal[3],
        'paint': {
            'line-color': french_color,
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
        'id': 'French has-details outline',
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
    {
        "id": "French building titles",
        "type": "symbol",
        "source": "buildings_titles",
        "layout": {
            "text-field": ["get", "title"],
            "text-size": 12,
            "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
            "text-anchor": "top",
            "text-offset": [0, 0.2],
            
        },
        "paint": {
            "text-color": "#000000",
            "text-halo-color": "rgba(255, 255, 255, 0.5)",
            "text-halo-width": 2,
            "text-halo-blur": 1
        }
    }
]