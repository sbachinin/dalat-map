export const FRENCH_SELECTED_FILL_COLOR = 'hsl(42, 97.80%, 53.50%)'
export const DARKER_FRENCH_FILL_COLOR = 'hsl(22, 97.80%, 87.50%)'
export const FRENCH_FILL_COLOR = 'hsl(22, 97.80%, 63.50%)'
export const FRENCH_BORDER_COLOR = 'hsl(340, 35.30%, 35.00%)'
export const BORING_BLDG_FILL_COLOR = 'hsl(43, 15%, 90%)'
export const IMPORTANT_BORING_BLDG_FILL_COLOR = 'hsl(55, 30%, 75%)'

export const BRIGHT_LAKE_COLOR = 'hsl(193, 100%, 62.4%)'
export const PALE_LAKE_COLOR = 'hsl(193, 70%, 85%)'
export const LAKE_TITLE_COLOR = 'hsl(193, 100%, 32.4%)'

export const PEAK_TTTLE_COLOR = 'hsl(30, 40%, 40%)'

export const PALE_TITLES_COLOR = 'hsl(0, 0.00%, 40.40%)'
export const PALE_TITLES_SIZE = 11
export const GRASS_COLOR = 'hsl(70, 50%, 70%)'
export const INSTITUTION_FILL_COLOR = 'hsl(164, 20.30%, 85.00%)'
export const CEMETERY_FILL_COLOR = 'hsl(0, 0.00%, 88.20%)'
export const SQUARE_FILL_COLOR = 'hsl(54, 80.10%, 87.00%)'

export const CITY_BULK_FULL_OPACITY_MAXZOOM = 12
export const CITY_BULK_DISAPPEARANCE_ZOOM = 14

export const AREA_TYPES = {
    INSTITUTION: 'institution',
    CEMETERY: 'cemetery',
    SQUARE: 'square'
}
export const TITLES_PRIORITY = {
    VERY_HIGH: 9,
    HIGH: 10,
    LOW: 11,
    VERY_LOW: 12
}

export const FIRST_DETAILS_MINZOOM = 12.2
export const SECONDARY_TITLES_MINZOOM = 15

// provides that normal titles appear early and second_rate only from z15
export const VARYING_TITLE_OPACITY = [
    "step",
    ["zoom"],
    ["case", ["get", "second_rate"], 0, 1],
    SECONDARY_TITLES_MINZOOM,
    1
]