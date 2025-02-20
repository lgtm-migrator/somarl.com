import {NextFetchEvent, NextRequest, NextResponse} from 'next/server'


export function middleware (req: NextRequest, ev: NextFetchEvent) {
    const url = req.nextUrl.clone()
    const {pathname} = url
    const postSlug = pathname.replace(/^\/post\//, '')
    if (postSlug.includes('/')) {
        url.pathname = `/post/${postSlug.replace(/\//g, encodeURIComponent(encodeURIComponent('/')))}`
    }

    return NextResponse.rewrite(url)
}

export const config = {
    matcher: ['/post/:path*'],
}
