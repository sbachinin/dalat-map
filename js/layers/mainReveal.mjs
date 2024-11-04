// at some stage of zooming a lot of stuff has to fade in slowly
export const getMainReveal = (start, end) => ([
    "interpolate",
    ["linear", 2],
    ["zoom"],
    14, start,
    14.3, end
])

export const mainOpacityReveal = getMainReveal(0, 1)