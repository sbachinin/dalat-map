export const DEV_should_open_panel_on_pageload = true

export const DEV_skip_map_rendering = false
export const DEV_show_debug_el = true

// TODO this is useless now, panel is not rendered anyway

export const getters = {
    getWest: () => 0,
    getEast: () => 180,
    getNorth: () => 180,
    getSouth: () => 0
}

export const DEV_map_mock = {
    on: (e, cb) => {
        if (e === 'load') cb()
    },
    touchZoomRotate: { disableRotation: () => { } },
    addControl: () => { },
    getZoom: () => { },
    once: () => { },
    loadImage: () => Promise.resolve(''),
    addImage: () => { },
    addLayer: () => { },
    addSource: () => { },
    setCenter: () => { },
    setFeatureState: () => { },
    project: () => ({ x: 0, y: 0 }),
    unproject: () => ({ lng: 0, lat: 0 }),
    easeTo: () => { },
    getBounds: () => getters,
    getMaxBounds: () => getters,
    getMaxZoom: () => Infinity,
    transform: {_pixelPerMeter: 0.0001},
}