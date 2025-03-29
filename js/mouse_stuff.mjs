import { panel } from './panel/panel.mjs'
import { display_highlights } from './highlights.mjs'
import { fly_to_building, try_open_building } from './bldg_details.mjs'
import { CURSOR_POINTER_MINZOOM } from './layers/constants.mjs'
import {
    can_share_files,
    find_bldg_id_by_image_filename,
    get_image_file_from_element,
    is_mouse_device
} from './utils/utils.mjs'
import { lightbox, PSWP_HIDE_ANIMATION_DURATION } from './panel/init_photoswipe.mjs'
import { initialize_custom_zoom_buttons } from './custom_zoom_buttons.mjs'
import { does_feature_have_details } from './utils/does_feature_have_details.mjs'
import { get_link_to_selected_bldg, selected_building_id } from './select_building.mjs'
import { bldgs_handmade_data } from '../data/static/bldgs_handmade_data.mjs'



export const add_mouse_stuff = () => {
    const map = window.dalatmap

    map.on('click', (e) => {
        navigator?.clipboard?.writeText?.(
            `[${e.lngLat.lng}, ${e.lngLat.lat}]`
            // map.queryRenderedFeatures(e.point)?.[0]?.id
        )
        const rfs = map.queryRenderedFeatures(e.point)
        const clickable_feat = rfs.find(f => does_feature_have_details(f.id))
        if (clickable_feat) {
            try_open_building(clickable_feat.id, true, true)
        } else {
            panel.set_size(0)
        }
    })

    // ADD & REMOVE CURSOR POINTER ON BUILDINGS WITH DETAILS
    // potentially_clickable_layers.forEach(layer => {
    map.on('mousemove', (e) => {
        if (map.getZoom() > CURSOR_POINTER_MINZOOM
            && map.queryRenderedFeatures(e.point)
                .find(f => f.layer.type === 'fill' && does_feature_have_details(f.id))
        ) {
            map.getCanvas().style.cursor = 'pointer'
        } else {
            map.getCanvas().style.cursor = 'auto'
        }
    })






    document.querySelector('#non-panel #highlights-opener').addEventListener('click', () => {
        display_highlights(true)
    })





    // On click on any .bldg-link (in slider or thumbs-list), go to a bldg that owns the image
    document.body.addEventListener('click', async (e) => {

        if (e.target.closest('.bldg-link')) {
            const img_src = e.target.getAttribute('img-src')
            if (!img_src) {
                console.warn(`handling click on .bldg-link, img-src attr is empty, it's not normal`)
                return
            }
            const img_name = img_src.split('/').pop()
            const bldg_id = find_bldg_id_by_image_filename(decodeURIComponent(img_name))

            const open_building_delay = is_mouse_device
                ? 0 // because pswp has no closing animation on desktop
                : PSWP_HIDE_ANIMATION_DURATION + 200
            setTimeout(
                () => try_open_building(bldg_id, true, true),
                open_building_delay
            )
            lightbox?.pswp?.close()


        } else if (e.target.closest('#building-info__doubt')) {
            document.querySelector('#doubt-message').style.display = 'block'
            setTimeout(() => {
                document.querySelector('#doubt-message').style.display = 'none'
            }, 5000)


        } else if (e.target.closest('#building-info__flyto')) {
            fly_to_building(selected_building_id, { force: true })



        } else if (e.target.closest('#building-info__copylink')) {
            const message_el = document.querySelector('#copylink-message')
            navigator.clipboard.writeText(
                get_link_to_selected_bldg())
                .then(() => {
                    message_el.innerText = 'Link copied!'
                    message_el.style.display = 'block';
                    setTimeout(() => {
                        message_el.style.display = 'none';
                    }, 1200);
                })
                .catch(err => {
                    message_el.innerText = 'Failed to copy link!'
                    message_el.style.display = 'block';
                    setTimeout(() => {
                        message_el.style.display = 'none';
                    }, 2000);
                });



        } else if (e.target.closest('#building-info__share')) {

            const bldg_data = bldgs_handmade_data[selected_building_id]

            let files = undefined // shouldn't pass files if sharing of files is not supported

            const img = document.querySelector('#building-details #panel-thumbs-list .slide-wrapper:first-child img');

            if (img && can_share_files()) {
                try {
                    const file = await get_image_file_from_element(img)
                    files = [file]
                } catch (error) {
                    // TODO (Think. Basically if file fails, it doesn't prevent me from sharing other stuff)
                    console.warn('Failed to get image file', error)
                }
            }

            let text = 'Map of French architecture of Da Lat'
            if (bldg_data?.title) {
                text += ` - ${bldg_data?.title}`
            }

            try {
                await navigator.share({
                    title: 'Map of French architecture of Da Lat',
                    url: get_link_to_selected_bldg(),
                    text,
                    files
                });
            } catch (error) {
                // Could show a "Fail" popup message or something BUT...
                // this catch is executed not only when smth bad happens
                // but also when you change your mind and close the share dialog
                // In such case no feedback is necessary
                // I don't want to investigate different kinds of failure
            }

        }
    })

    initialize_custom_zoom_buttons()

}
