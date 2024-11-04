export default [
    {
        "id": "Primary Water",
        "type": "fill",
        "source": "dalat-tiles",
        "source-layer": "lake",
        "paint": {
            "fill-color": [
                "interpolate",
                ["linear", 2],
                ["zoom"],
                10, 'hsl(193.5, 100%, 62.4%)',
                13.7, 'hsl(193.5, 70%, 75%)',
            ]
        }
    },
]
