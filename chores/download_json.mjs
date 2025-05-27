export function download_json(data) {

    const code = `export const fids_to_img_names = ${JSON.stringify(data, null, 4)}`

    const blob = new Blob([code], { type: 'application/javascript' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'fids_to_img_names.mjs'
    document.body.appendChild(a)
    a.click()

    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}
