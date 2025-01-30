export const FRENCH_FILL_COLOR = 'hsl(340, 35.30%, 60.00%)'
export const FRENCH_SELECTED_FILL_COLOR = 'hsl(35, 97.80%, 63.50%)'
export const FRENCH_BORDER_COLOR = 'hsl(340, 35.30%, 35.00%)'
export const BORING_BLDG_FILL_COLOR = 'hsl(43, 15%, 90%)'
export const IMPORTANT_BORING_BLDG_FILL_COLOR = 'hsl(43, 25%, 65%)'

export const PALE_TITLES_COLOR = 'hsl(0, 0.00%, 40.40%)'
export const PALE_TITLES_SIZE = 11
export const GRASS_COLOR = 'hsl(70, 50%, 70%)'
export const INSTITUTION_FILL_COLOR = 'hsl(164, 20.30%, 85.00%)'
export const AREA_TYPES = {
    INSTITUTION: 'institution'
}
export const TITLES_PRIORITY = {
    VERY_HIGH: 9,
    HIGH: 10,
    LOW: 11,
    VERY_LOW: 12
}

export const SECONDARY_TITLES_MINZOOM = 15

// provides that normal titles appear early and second_rate only from z15
export const VARYING_TITLE_OPACITY = [
    "step",
    ["zoom"],
    ["case", ["get", "second_rate"], 0, 1],
    SECONDARY_TITLES_MINZOOM,
    1
]