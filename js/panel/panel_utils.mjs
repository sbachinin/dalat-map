import { is_landscape } from '../utils.mjs'

export const get_panel_el = () => document.querySelector('#panel')

export const get_panel_intrinsic_size = (_is_landscape) => { // height/width with scrollbar
    _is_landscape = _is_landscape ?? is_landscape()
    return get_panel_el()[_is_landscape ? 'offsetWidth' : 'offsetHeight']
}