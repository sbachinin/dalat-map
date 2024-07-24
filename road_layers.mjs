const road_color = "hsl(30, 7%, 49%)"


const tertiaryRoad = {
    id: 'Tertiary road',
    "type": "line",
    "source": "dalat-tiles",
    "source-layer": "highway",
    "minzoom": 6,
    "maxzoom": 24,
    "layout": {
        "line-cap": "round",
        "line-join": "round",
        "visibility": "visible"
    },
    "paint": {
        "line-color": road_color, // `#EF8DD0`,
        "line-width": [
            "interpolate",
            ["linear", 2],
            ["zoom"],
            10,
            1,
            12,
            1.5,
            16,
            2,
            20,
            6
        ],
        "line-opacity": 0.55
    },
    "metadata": {},
    "filter": [
        "all",
        [
            "in",
            "highway",
            "tertiary",
        ]
    ]
}

const majorRoadOutline = {
    "id": "Major road outline",
    "type": "line",
    "source": "dalat-tiles",
    "source-layer": "highway",
    "minzoom": 6,
    "maxzoom": 24,
    "layout": {
        "line-cap": "round",
        "line-join": "round",
        "visibility": "visible"
    },
    "paint": {
        "line-color": road_color, // `#EF8DD0`,
        "line-width": [
            "interpolate",
            ["linear", 2],
            ["zoom"],
            10,
            3.5,
            12,
            4,
            16,
            5,
            20,
            9
        ]
    },
    "metadata": {},
    "filter": [
        "all",
        [
            "in",
            "highway",
            "primary",
            "primary_link",
            "secondary",
            "trunk"
        ]
    ]
}

const majorRoad = {
    "id": "Major road",
    "type": "line",
    "source": "dalat-tiles",
    "source-layer": "highway",
    "minzoom": 6,
    "maxzoom": 24,
    "layout": {
        "line-cap": "round",
        "line-join": "round",
        "visibility": "visible"
    },
    "paint": {
        "line-color": '#fff', // `#EF8DD0`,
        "line-width": [
            "interpolate",
            ["linear", 2],
            ["zoom"],
            10,
            1.5,
            12,
            2,
            16,
            3,
            20,
            7
        ]
    },
    "metadata": {},
    "filter": [
        "all",
        [
            "in",
            "highway",
            "primary",
            "primary_link",
            "secondary",
            "trunk"
        ]
    ]
}

const minorRoad = {
    "id": "Minor road",
    "type": "line",
    "source": "dalat-tiles",
    "source-layer": "highway",
    "minzoom": 14,
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
                "track"
            ]
        ]
    ]
}

export default [
    tertiaryRoad,
    majorRoadOutline,
    majorRoad,
    minorRoad
]