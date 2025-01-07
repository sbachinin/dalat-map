export const is_landscape = () => window.matchMedia("(orientation: landscape)").matches

export const is_mouse_device = () => window.matchMedia("(pointer: fine)").matches

export const div = (class_name) => {
    const el = document.createElement('div')
    el.className = class_name
    return el
}

const get_css_var = (name, element = document.documentElement) => {
    const cvar = getComputedStyle(element)
        .getPropertyValue(name)
    
    if (cvar === '') {
        console.warn('css var not set: ', name)
    }
    return cvar
}

export const get_css_var_num = (name, element = document.documentElement) => {
    return parseInt(get_css_var(name, element))
}


export const set_css_num_var = (name, value, units, element = document.documentElement) => {
    if (units === undefined) {
        console.warn('units not passed to set_css_num_var')
    }
    element.style.setProperty(name, String(value) + units)
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

export const wrap = (num, min, max) => {
    const range = max - min + 1
    return ((num - min) % range + range) % range + min
}

export const get_image_url = (name, folder) => {
    return `${window.location.origin}/dalat-map-images/${folder}/${name.replace('HEIC', 'jpg')}`
    // return `https://sbachinin.github.io/dalat-map-images/${folder}/${name.replace('HEIC', 'jpg')}`
}

export const do_n_times = (n, fn) => {
    for (let i = 0; i <= n; i++) {
        fn(i)
    }
}

export const toggle_class = (el, class_name, condition) => {
    if (condition) {
        el.classList.add(class_name)
    } else {
        el.classList.remove(class_name)
    }
}