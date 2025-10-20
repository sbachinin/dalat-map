/* 

This is an attempt to organize layers by zoom level,
otherwise this logic tends to grow wildly,
and at some point I found it almost impossible to understand.
So the main rationale is
1) readability and maintainability, centralization of zoom level logic
2) enforcing the "zoom-first" development,
    as it seems critically important to have "the right set of features" at any given zoom
3) automated sorting of style layers based on zoom level.
    (unless drawing_importance tells that this specific layer has to disobey the zoom order)
    Features from the most "early" zoom levels appear later in the layers[].
    Basically this sorting problem doesn't seem too important...
    Because anyway I handpick the features for each zoom level,
        and so they shouldn't compete, and so the order of layers must be of no importance...
    But I think that handpicking shouldn't be the only instrument,
        and some minor mistakes in handpicking must be allowed, 
        and proper layers' order will compensate for these mistakes.



Why is this separation into zoom levels necessary at all?
(Maplibre gives many ways to manage the titles' priority
    so that important ones appeared first, and then,
    as you zoom in, less important pop up.
    So in theory, I could avoid setting any minzooms and just watch the magic).
My opinionated decision was not to delegate the zoom order to
maplibre's sorting algorithm because it generally tends to create a lot of mess,
titles competing for space, appearing and disappearing ad hoc, blinking etc.
So I manually choose what appears when.
Also, I don't want to show AS MUCH TITLES AS POSSIBLE at a given moment.
It's nice to have some free space sometimes.

*/

export const get_filter_by_fids = (...features_hmd) => ["any", ...features_hmd.map(f => ["==", ["id"], +f.id])]

export const zoom_order = {
    /*
    [zoom_level_float]: [
        {
            filter: [],

            what and how to draw for these features?
            (basically, maplibre style layers without "selector" and minzoom part)

            drawing_layers: [],

            maxzoom: number
        }
    ]
    */
}
