// Opens a browser's standard dialog to save file to whatever location

export function save_string_to_file(string, filename) {
    const blob = new Blob([string], { type: 'application/javascript' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()

    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}
