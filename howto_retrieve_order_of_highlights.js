// this is a dumbass way but it works.
// A proper way perhaps will involve using google photos api.

// open highlights album in chrome
// enlarge first image
// run code in dev console:

const names = []
setInterval(() =>{
    names.push(document.querySelectorAll('[aria-label^=Filename]')[3].innerText) // get filename
    setTimeout(() => {
        document.querySelectorAll('div.SxgK2b.Cwtbxf')[1].click() // navigate to next photo
    }, 500)
}, 1000)

// names in the end will contain duplicates of 1st and last entry. Manually remove dupes.
// Last image name will be missing. Add it.