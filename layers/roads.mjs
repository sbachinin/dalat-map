const road_color = "hsl(30, 17%, 59%)"

const common_road_props = {
    "type": "line",
    "source": "dalat-tiles",
    "source-layer": "highway",
    "layout": {
        "line-cap": "round",
        "line-join": "round",
        "visibility": "visible"
    },
}

const tertiaryRoad = {
    id: 'Tertiary road',
    ...common_road_props,
    "minzoom": 10,
    "paint": {
        "line-color": road_color,
        "line-width": [
            "interpolate",
            ["linear", 2],
            ["zoom"],
            10, 1,
            12, 1.5,
            16, 2,
            20, 6
        ],
        "line-opacity": 0.55
    },
    "filter": [
        "all",
        ["in", "highway", "tertiary",]
    ]
}

const majorRoadOutline = {
    "id": "Major road outline",
    ...common_road_props,
    "minzoom": 10,
    "paint": {
        "line-color": road_color,
        "line-width": [
            "interpolate",
            ["linear", 2],
            ["zoom"],
            10, 3.5,
            12, 4,
            16, 5,
            20, 9
        ]
    },
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
    ...common_road_props,
    "minzoom": 10,
    "paint": {
        "line-color": '#fff',
        "line-width": [
            "interpolate",
            ["linear", 2],
            ["zoom"],
            10, 1.5,
            12, 2,
            16, 3,
            20, 7
        ]
    },
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
    ...common_road_props,
    "minzoom": 15,
    "paint": {
        "line-color": road_color,
        "line-width": [
            "interpolate",
            ["linear", 2],
            ["zoom"],
            15, 1.5,
            20, 6
        ]
    },
    "filter": [
        "all",
        [
            "any",
            ["!has", "brunnel"],
            [
                "in",
                "brunnel",
                "bridge",
                "ford"
            ]
        ],
        [
            "any",
            ["!has", "class"],
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