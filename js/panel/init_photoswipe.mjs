import PhotoSwipeLightbox from '../../photoswipe/dist/photoswipe-lightbox.esm.min.js';

let lightbox = null
export const init_photoswipe = () => {
    if (lightbox) {
        lightbox.destroy()
        lightbox = null
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
}