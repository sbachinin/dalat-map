/* 
    modules is an array of [
        name - returned name (result[name]),
        path - path to module (!! relative path from the project root, like "./hue/...")
        prop - name of a property to take from imported module
    ]
*/
export const load_build_only_modules = async (modules) => {
    if (typeof window !== 'undefined') {
        return {}
    }

    const path = await import('path')
    const result = {}
    for (const [name, dir, prop = 'default'] of modules) {
        const module = await import(path.join('..', dir))
        result[name] = module[prop]
    }
    return result
}