// this is a dumbass way but it works.
// (Though it's fragile and selectors might need to be adjusted every time)
// A proper way perhaps will involve using google photos api.

// open highlights album in chrome
// enlarge first image
// !open file info panel
// run code in dev console (better keep tab open):

const names = []
setInterval(() => {
    const visibleFilename = Array.from(
        document.querySelectorAll('[aria-label^=Filename]')
    ).find(el => el.offsetWidth > 0 && el.offsetHeight > 0)
    const filename = visibleFilename.innerText

    const basename = filename.substring(0, filename.lastIndexOf('.'))

    if (!names.includes(basename)) names.push(basename)
    document.querySelectorAll('[role="button"][aria-label="View next photo"]')[0].click()
    console.log('Number of images:', names.length)
}, 1000)

// after the last image was reached:

copy(`[
    '${names.join(`',\n'`)}'
]`)

// Last image can be missing. Add it.

// Check the number of images
// names.length must be === Album size

// save to highlights_images_list.mjs