###1 About thumbs size

    All thumbs images files are as high as THUMB_INTRINSIC_HEIGHT.
    Thumbs' intrinsic width is variable, derived from THUMB_INTRINSIC_HEIGHT and the original image's aspect ratio.

    Therefore, when they are displayed in the bottom 1-row panel-thumbs-list,
        they can be displayed as they are, without size adjustment.
        (such list simply takes the height of THUMB_INTRINSIC_HEIGHT.
        All thumbs naturally occupy all this height,
        unless they are shrunk for some reason -
        e.g., to become narrow enough to fit into the viewport, if they are intrinsically too wide.)

    "Ideal thumb" is vertical 3x4.
    It has THUMB_INTRINSIC_HEIGHT and width that is easily derived.
    As much pictures as possible should be taken, or edited, to have this ratio intrinsically.
    This will ensure that they fit nicely into the layout, without being shrunk and without leaving white space.
    Also, having most images in this ratio provides much less disturbing experience when sliding the large images.

    Concept of ideal thumb allows to make decisions about the side panel width
        (its max-width will be 1 or 2 rows of "ideal thumbs" - 1 or 2 depending on amount of thumbs and viewport size)

    In 1-column sidebar, the displayed widths of all thumbs are limited to 1 "ideal thumb width".
    Therefore, wider thumbs will become quite short vertically.
    It means that a lot of their intrinsic quality will be wasted.
    But I think optimizing this (perhaps building smaller image files for this case) will certainly be hard and unproductive,
    since 1-column side panel doesn't seem to be a very popular case.

    In 2-column sidebar, the displayed width of each thumbs is limited to the full 2-column width.
    In such sidebar, "ideal thumbs" will form an even 2-column layout.
    Wider thumbs will certainly disrupt this order, taking more width than an ideal thumb.
    Such thumbs, except some extremely wide ones, will be displayed in their full intrinsic size,
        and certainly only 1 such thumb per row.




###2 How selectable and selected geometries are being drawn (highlighted)
    Basically, selected and selectable stuff CAN be completely detached from drawing "normal features",
    for reasons of code simplicity and uniformity
        - no need to handle each kind of selectable buildings individually to ensure it's highlighted once selected,
        no need to search for a selected feature across many sources.
    1) save all such geometries to a dedicated tile layer
    2) on frontend, draw all features from "selectable_polygons" source-layer with a dedicated "selectable border" style layer.
        Having one source is cool because otherwise, if selectable features come from many sources, it will mean also multiplication of style layers, for they have to point to certain sources.
        (Therefore, the "normal features" CAN be unaware of being selectable,
        unless they want to style their selectability in some special way)
    3) once feature is selected,
        - highlight geometries: setFilter on all "style layers for selected feature", including pin.
        - add pin icon for low Z: it's drawn from bldgs_centroids_points source, filtered also via setFilter, but this setFilter is delayed until the end of flight, to avoid blinking of the new pin
        - highlight titles: setFeatureState "selected" in TTTLES_MAIN_TILE_LAYER (and hopefully titles of all kinds will get highlighted without extra setup because in build_layers I add bunch of conditional halo props to each textual style layer)

    *** a previous solution involved not having a separate tile layer for selectable features, but saving their geometries in a js object for frontend to access. On frontend I made a geojson source from these geometries. It worked almost ok but unpleasant aspect was that runtime-generated geojson geometries slightly differed from those tiled geometries of "normal" features. (Difference btw tippecanoe and maplibre's built-in geojson-vt). And so a selectable border didn't match the bounds of normal fill layers. So I chose to use only 1 tiling mechanism, and it was certainly a build-stage solution, not frontend, because accessing "all selectable geometries" on frontend is quite a task.

###3
    Deadness of a building is determined by its presence in custom_features_for_tiling/dead_buildings.mjs
    To get dead geometries on a map, it must be enough to have them in this file.
    Handmade data is assigned to dead buildings just as a regular item in buildings_handmade_data, without any attrs like "is_dead".
    "is_dead" is generated as part of features_generated_props_for_frontend.
    Style layers for dead buildings are included automatically in build_layers.
    Minzoom for "dead buildings circles" for now is taken from a "global" (city-ignorant) const, 
        but it'd be better to be able to redefine this const for a particular city.


###5
    flyTo instead of easeTo because:
    it seems to be the only way to avoid the cinematic curve.
    Curve is bad because
    1) I just don't like how it looks
    2) Curve will break near the map bounds.
    EaseTo in theory must be less curvy but in practice it still curves,
    and in some cases it's not pretty.
    I'm not sure if there's a way to cancel curviness for easeTo,
    but I found such a way for flyTo ({curve: 0.1})
    ({curve: 0} for some reason didn't work, map froze on mobile, I was lazy to debug, and 0.1 works ok)
    ------
    offset is passed as an option,
    however, this option is known to be quite buggy.
    A more reliable solution would be to incorporate offset into the
    calculation of "center" option.
    But it was a bit cumbersome because offset must be
    calculated for the target zoom, not the current one.

###5.1 Yet unsloved PROBLEM (small but eventually to be solved)
    : map bounds are not respected when calculating the flight destination: center, zoom & offset
    Current calculation is naive and acts as if map wasn't constrained.
    This, in theory, can lead to having some newly selected buildings invisible behind the panel.
    It's of course more likely when such features are near the bounds.
    But it can also occur due to having very low z, for features located almost anywhere on the map.
    The problem showed up when I tried to implement back/forward WITHOUT changing z. (It was a fun feature, looked cool but not sure how useful is).
    With "preserved zoom", when zoom was near-minimal (and thus map had almost no space for maneuver at current z),
        it was often decided that "A flight is needed to prevent a building from being covered by panel",
        -> a flight actually happened, but only on one useless axis, whereas on an important axis there was no space.
        -> It looked like a tiny useless move, and that "something is going wrong"
    This forced me to rollback this "preserved zoom" feature,
        because without this feature the likelyhood of the described problem is much lower:
        If on building select I ALWAYS ZOOM IN TO THE BUILDING, then the problem is negligible
            and scoped only to the near-bounds buildings, which might be covered by the panel in some rare situations.
    But, however unlikely this problem is, it shall be eventually solved,
    because the amount of near-bounds features is potentially infinite, and the problem is real, though tiny.
    When solution for this is found,
        I then can entertain myself by re-introducing the "preserve zoom on B/F" behaviour, if it still looks interesting.
            (It looked interesting indeed, providing a "bird-eye view" of previously selected locations,
            but it's unclear if it's likely to be used by many users, for it's only observable on back/forward)




###6 Why, if there was second touch during panel swipe, the panel is collapsed on touchend?
    This is to mitigate (but perhaps not to solve completely) the ugly blinking-jumping panel movements,
        occuring when
            1) first finger landed on the panel and started dragging it;
            2) second finger landed ... anywhere? (most likely because user tries to pinch the map but touches the panel's draggable parts with first finger)
            (* when panel is touched by the SECOND finger, the panel swipe is prevented easily and reliably, and there is no problem).
        Therefore, the panel dragging possibly already began but the user actually meant a different thing.
        (this happened to me in practice).
        in such situation it seems necessary to return the panel to the original pre-swipe condition with as little fuss as possible.
        So,
            1) while swipe is in process, and the second touch is detected, stop swiping (leave the panel where it is at the moment).
            2) on swipe end, collapse panel
                This, in theory, is not necessarily the "minimal fuss" strategy -
                    what if panel was expanded initially?
                    But I think it's a very unlikely case, if possible at all.
                    It seems more likely (and the only thing that happened for me) is that user pinches "inwards" (from the corners to the center),
                    and the panel is collapsed - in such case panel can expand undesirably, and this I think sums up the problem. - There can be other possible misbehaviours here but I haven't encountered them yet.
                    So, for simplicity, I ignore the multitude of possibilities and just always collapse the panel.
                    It can be delusional, and perhaps later will need a better solution, but for now I prefer not to overengineer.
                    Efficiency of current solution is difficult to test, but at least a very ugly "trembling" stuff has gone for sure.



###\\\\\\\\\\\\\\     How custom land areas CAN be made, such as unesco sites in Hue
    1. Get features for tiling using assets_for_build:
        specify a dedicated tile layer, get_custom_features from wherever you want,
            e.g. .mjs file in [city]/static_data folder
        * within custom geojson, it's possible to provide props for a polygon's title,
            such as "title" and "title_side", and they will be processed just as same props from handmade data.
    2. Draw these features from a dedicated tile layer using dedicated style layers,
        pushed into style.layers by for example including them into zoom_order


###7 Why "allow_different_title_source"
    If a title-rendering style layer (from zoom order) wants to utilize source-layer other than the "shared" one
    , it needs to ask for permission, by specifying a prop "allow_different_title_source".
    This limitation is introduced because it's very desirable to use a single source-layer for all titles.
        (and the limitation makes it difficult to forget about this stuff).
        Keeping all titles in a single layer allows to apply some shared rules to all titles.
        (Such as "use reduced opacity for non-selectable titles")
    Currently, this restriction on source-layer applies only to style layers introduced via zoom_order.
    Potentially there can be other sources of style layers and thus possibility of mess.
    So allow_different_title_source restriction reduces the risks but not to 0.

###8 First SLOW panel exand for a new user (pristine panel)
    If a user never visited ANY city before,
    no matter if he visits a city's root url, or a building id, or whatever,
    expand the panel slowly (and with a slight delay) the first time.
    (For a new user, it certainly will be expanded).
    'pristine' means that special CSS duration and delay are applied to panel expander element.
    Until 'pristine' is unset, certain actions (such as swipe) are disabled to avoid ugliness.
        