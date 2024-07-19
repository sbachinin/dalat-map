const road_color = "hsl(30, 57%, 69%)"

const minorRoad = {
    "id": "Minor road",
    "type": "line",
    "source": "dalat-tiles",
    "source-layer": "highway",
    "minzoom": 12,
    "maxzoom": 24,
    "layout": {
        "line-cap": "butt",
        "line-join": "round",
        "visibility": "visible"
    },
    "paint": {
        "line-color": road_color, // `hsla(0, 0%, ${road_lum}, ${road_opa})`,
        "line-width": [
            "interpolate",
            [
                "linear",
                2
            ],
            [
                "zoom"
            ],


            12,
            [
                "match",
                [
                    "get",
                    "class"
                ],
                [
                    "tertiary"
                ],
                1.6,
                [
                    "minor",
                    "service",
                    "track"
                ],
                1,
                1
            ],
            16,
            [
                "match",
                [
                    "get",
                    "class"
                ],
                [
                    "tertiary"
                ],
                3.5,
                2
            ],
            20,
            [
                "match",
                [
                    "get",
                    "class"
                ],
                [
                    "tertiary"
                ],
                8,
                6
            ]
        ]
    },
    "metadata": {},
    "filter": [
        "all",
        [
            "any",
            [
                "!has",
                "brunnel"
            ],
            [
                "in",
                "brunnel",
                "bridge",
                "ford"
            ]
        ],
        [
            "any",
            [
                "!has",
                "class"
            ],
            [
                "in",
                "class",
                "bus_guideway",
                "busway",
                "courtyard",
                "minor",
                "path_construction",
                "raceway",
                "raceway_construction",
                "service",
                "storage_tank",
                "tertiary",
                "track"
            ]
        ]
    ]
}

export default [
    minorRoad
]