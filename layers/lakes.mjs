export default [
    {
        "id": "Water",
        "type": "fill",
        "source": "dalat-tiles",
        "source-layer": "water",
        "layout": {
            "visibility": "visible"
        },
        "paint": {
            "fill-color": [
                // at low zoom levels show only main lakes
                "step",
                ["zoom"],
                [
                    "match",
                    ["get", "name"],
                    "Hồ Xuân Hương", 'RGB(77, 204, 241)',
                    "Hồ Tuyền Lâm", 'RGB(77, 204, 241)',
                    "Hồ Chiến Thắng", 'RGB(77, 204, 241)',
                    "Hồ Đa Thiện", 'RGB(77, 204, 241)',
                    'transparent'
                ],
                13.6,
                'RGB(77, 204, 241)'
            ]
        },
        "filter": [
            "all",
            [
                "!=",
                "intermittent",
                1
            ],
            [
                "!=",
                "brunnel",
                "tunnel"
            ]
        ]
    }
]