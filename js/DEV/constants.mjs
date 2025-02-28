export const DEV_should_open_panel = true
export const DEV_skip_map_rendering = false

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
}