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
    1) save all such geometries from osm for frontend during build, in a plain js object
    2) on frontend, from this object take all selectable ones,
        make polygon features for them in a separate geojson source,
        draw them from this source with a dedicated "selectable border" style layer.
        Having one source is cool because otherwise, if selectable features come from many sources, it will mean also multiplication of style layers, for they have to point to certain sources.
        (Therefore, the "normal features" CAN be unaware of being selectable,
        unless they want to style their selectability in some special way)
    3) once feature is selected, take its geometry from "osm props for frontend",
        put it as the only feature in a 'selected-building' source