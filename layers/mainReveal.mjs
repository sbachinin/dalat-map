export const getMainReveal = (start, end) => ([
    "interpolate",
    ["linear", 2],
    ["zoom"],
    13.7, start,
    14.3, end
])

export const mainOpacityReveal = getMainReveal(0, 1)