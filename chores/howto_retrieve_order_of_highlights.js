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

    if (!names.includes(filename)) names.push(filename)
    document.querySelectorAll('[role="button"][aria-label="View next photo"]')[0].click()
}, 1000)


// Last image can be missing. Add it.

// save to highlights_images_list.mjs