import PhotoSwipeLightbox from '../../photoswipe/dist/photoswipe-lightbox.esm.min.js';

let lightbox = null
export const init_photoswipe = () => {
    if (lightbox) {
        lightbox.init()
        return
    }

    lightbox = new PhotoSwipeLightbox({
        gallery: '#panel-thumbs-list',
        children: 'a',
        pswpModule: () => import('../../photoswipe/dist/photoswipe.esm.min.js'),
        wheelToZoom: true,
        zoom: false,
        counter: false
    })

    lightbox.init()

    lightbox.on('closingAnimationStart', () => {
        const bldg_links = document.querySelectorAll('.bldg-link')
        bldg_links.forEach(bldg_link => {
            bldg_link.style.opacity = 0
        })
    })


    // lightbox.on('change', () => {
    //     document.querySelector('#panel-thumbs-list').scrollLeft = lightbox.currIndex * 100
    // })
}
