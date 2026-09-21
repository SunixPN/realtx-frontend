const CDN_ORIGINAL_RE = /^https:\/\/cdn\.realt\.by\/img\/([0-9a-f-]+)$/

function withSize(url: string, size: number): string {
    const m = CDN_ORIGINAL_RE.exec(url)
    if (!m) return url
    return `https://cdn.realt.by/img/${size}/${m[1]}`
}

export const getMainPhoto = (url: string) => withSize(url, 80)

export const getThumbPhoto = (url: string) => withSize(url, 40)
