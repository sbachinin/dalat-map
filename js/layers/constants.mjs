export const FRENCH_SELECTED_FILL_COLOR = 'hsl(42, 97.80%, 53.50%)'

// TODO this one is actually outdated, purplish
export const FRENCH_TITLES_TEXT_COLOR = 'hsl(300, 20%, 25.40%)'

export const FRENCH_SELECTED_TITLE_HALO_COLOR = 'hsl(44, 98%, 77%)'
export const DARKER_FRENCH_FILL_COLOR = 'hsl(22, 97.80%, 87.50%)'
export const FRENCH_FILL_COLOR = 'hsl(22, 97.80%, 63.50%)'
export const FRENCH_DARK_BORDER_COLOR = 'hsl(340, 35.30%, 35.00%)'
export const FRENCH_LIGHTER_BORDER_COLOR = 'hsl(340, 0%, 50.00%)'
export const BORING_BLDG_FILL_COLOR = 'hsl(43, 15%, 92%)'
export const IMPORTANT_BORING_BLDG_FILL_COLOR = 'hsl(297, 24.70%, 89%)'

export const BRIGHT_LAKE_COLOR = 'hsl(193, 100%, 62.4%)'
export const PALE_LAKE_COLOR = 'hsl(193, 70%, 85%)'
export const LAKE_TITLE_COLOR = 'hsl(193, 100%, 32.4%)'

export const PEAK_TTTLE_COLOR = 'hsl(30, 40%, 40%)'

export const PALE_TITLES_COLOR = 'hsl(0, 0.00%, 40.40%)'
export const PALE_TITLES_SIZE = 11
export const GRASS_COLOR = 'hsl(70, 50%, 70%)'
export const INSTITUTION_FILL_COLOR = 'hsl(164, 20.30%, 85.00%)'
export const CEMETERY_FILL_COLOR = 'hsl(0, 0.00%, 88.20%)'
export const SQUARE_FILL_COLOR = 'hsl(308, 69.10%, 92.90%)'
export const RAILWAY_LINE_COLOR = "hsl(24, 34%, 54%)"


export const CITY_BULK_FULL_OPACITY_MAXZOOM = 12
export const CITY_BULK_DISAPPEARANCE_ZOOM = 14
export const CITY_BULK_FULL_COLOR = 'hsl(16, 66%, 82%)'
export const CITY_BULK_TITLE_COLOR = 'hsl(16, 66%, 70%)'

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

export const SECONDARY_BLDGS_MINZOOM = 13.3

export const SECONDARY_TITLES_MINZOOM = 15

// provides that normal titles appear early and second_rate only from z15
export const VARYING_TITLE_OPACITY = [
    "step",
    ["zoom"],
    ["case", ["get", "second_rate"], 0, 1],
    SECONDARY_TITLES_MINZOOM,
    1
]