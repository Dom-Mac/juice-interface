import { NextRequest, NextResponse } from 'next/server'

// get the handle name from a URL path
const HANDLE_REGEX = new RegExp(/\/@([^/]+).*/)

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/@')) return

  // If request is for a handle id, add the search param with `isHandle`.
  const handle = request.nextUrl.pathname.match(HANDLE_REGEX)?.[1]
  if (!handle) return

  const handleDecoded = decodeURI(handle)

  const trailingPath = request.nextUrl.pathname.split('/').slice(2).join('/')

  console.info('Project middleware request', {
    pathname: request.nextUrl.pathname,
    handle: handleDecoded,
  })

  let projectId
  try {
    projectId = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/juicebox/project/${handleDecoded}`,
    )
      .then(r => r.json())
      .then(r => r.projectId)
  } catch (e) {
    console.error('Failed to query projects', e)
    throw e
  }

  const url = request.nextUrl

  if (!projectId) {
    console.info('Page not found', {
      originalPathname: request.nextUrl.pathname,
      newPathname: '/404',
      handle: handleDecoded,
    })
    url.pathname = '/404'
    return NextResponse.rewrite(url)
  }

  url.pathname = `/v2/p/${projectId}${trailingPath ? `/${trailingPath}` : ''}`

  console.info('Rewriting to project route', {
    originalPathname: request.nextUrl.pathname,
    newPathname: url.pathname,
    handle: handleDecoded,
  })
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/@:handle*', '/@:handle*/:rest*'],
}
