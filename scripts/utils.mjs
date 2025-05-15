import fs from 'fs'

export const parse_args = () => {
    const params = {};

    process.argv.slice(2)
        .forEach(arg => {
            if (arg.includes('=')) {
                const [key, value] = arg.split('=');
                params[key] = value;
            } else {
                params[arg] = true;
            }
        });

    return params;
}

export const mkdir = (path) => {
    try {
        fs.mkdirSync(path, { recursive: true })
    } catch (e) {
        console.log(e)
        process.exit(1)
    }
}

export const mkdir_if_needed = (path) => {
    if (!fs.existsSync(path)) {
        mkdir(path)
    }
}


export const maybe_import_default = async path => {
    try {
        const module = await import(path)
        return module.default
    } catch (e) {
        return null
    }
}