
const wait_for_1_image = img_element => {
    return new Promise((resolve, reject) => {
        if (img_element.complete) {
            if (img_element.naturalWidth > 0) {
                resolve(img_element)
            } else {
                reject(new Error('Image failed to load'))
            }
            return
        }

        img_element.addEventListener('load', () => {
            resolve(img_element)
        })

        img_element.addEventListener('error', () => {
            reject(new Error('Image failed to load'))
        })
    });
}

export const wait_for_sizeless_images_load = async imgs_node_list => {
    const imgs_without_explicit_size = [...imgs_node_list].filter(img => {
        const { width, height } = window.getComputedStyle(img)
        return (width === 'auto' || width === '' || height === 'auto' || height === '')
    })
    await Promise.allSettled(
        imgs_without_explicit_size.map(wait_for_1_image)
    )
}