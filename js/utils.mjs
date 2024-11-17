export const is_landscape = () => window.matchMedia("(orientation: landscape)").matches

const get_css_var = (name) => {
    const cvar = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
    
    if (cvar === '') {
        console.warn('css var not set: ', name)
    }
    return cvar
}

export const get_css_var_num = (name) => {
    return parseInt(get_css_var(name))
}


export const set_css_num_var = (name, value, units) => {
    if (units === undefined) {
        console.warn('units not passed to set_css_num_var')
    }
    document.documentElement.style.setProperty(name, String(value) + units)
}

export const within = (number, min, max) => Math.max(min, Math.min(number, max));

export const debounce = (func, delay = 100) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func(...args);
        }, delay);
    };
};
