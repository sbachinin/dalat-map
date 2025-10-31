import { get_id_from_current_url } from "./utils/frontend_utils.mjs"


window.addEventListener("popstate", () => update(get_id_from_current_url(), 'popstate'))

let subscriber = null

/* 
    A dumb version of window.history that just keeps a list of all visited ids, without removing them on back/forward.
    It's a (perhaps overengineered) alternative to having just one "previous_id" var.
    I preferred to do this because it's unclear at what moment it's safe to assign new to the previous
    (not doing it too early, so that some async code still had knowledge of what was before).
    In this implementation, I mean that switching to a next feature necessarily BEGINS from changing url,
    and all other code can safely assume that url contains id that should be reflected in map and panel, if not yet.
    It can also safely assume that previous id is a penultimate item in histoire.
    (Previous id is now necessary perhaps only to setFeatureState to unselect previous features).
    WHY everything must begin with a new url:
    because it necessarily begins with a new url in the 'popstate' case (it's fired with new url already in the address bar),
    and so I want the 'pushstate' case to follow the same scheme.
    []{
        id: string,
        cause: 'popstate' | 'pushstate'
    }
*/
const entries = []

export const histoire = {
    initialize: () => {
        entries.push({
            id: get_id_from_current_url(),
            cause: 'initialize_city'
        })
    },

    push: (id) => {
        if (id === get_id_from_current_url()) {
            console.log('Trying to push the same id to history! This will be ignored.')
        } else {
            const url = new URL(window.location)
            url.searchParams.set('id', id)
            history.pushState({}, "", url)
            update(id, 'pushstate')
        }
    },


    entries,



    onchange: cb => {
        if (subscriber !== null) {
            throw new Error(`already subscribed to histoire. For now it's disabled for simplicity`)
        } else {
            subscriber = cb
        }
    }
}

function update(id, cause) {
    histoire.entries.push({ id, cause })
    subscriber()
}
