const do_once_visible = (el, cb) => {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                cb()
                observer.unobserve(el)
            }
        })
    }, { threshold: 0.1 })
    observer.observe(el)
}

export const activate_image = (el) => {
    const img = el.querySelector('img')
    if (img.classList.contains('loaded')) return

    const loader = el.querySelector('.img-loader')
    img.src = img.dataset.src
    loader.style.display = 'block'

    img.oncontextmenu = e => e.preventDefault()

    img.addEventListener('load', function () {
        loader.style.display = 'none'
        img.classList.add('loaded')
    });
}

export const create_lazy_image = src => {
    const el = document.createElement('div')
    el.className = 'lazy-image-wrapper'
    el.innerHTML = `<div class="img-loader" style="display: none"></div>`
        + `<img data-src="${src}" class="lazy">`
    do_once_visible(el, () => activate_image(el))
    return el
}
