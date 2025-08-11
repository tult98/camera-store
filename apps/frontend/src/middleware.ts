import { NextRequest, NextResponse } from "next/server"

/**
 * Simplified middleware for single-region store.
 * Just sets cache ID for Medusa compatibility.
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Set cache ID cookie if not present (required for Medusa)
  const cacheIdCookie = request.cookies.get("_medusa_cache_id")
  
  if (!cacheIdCookie) {
    const cacheId = crypto.randomUUID()
    response.cookies.set("_medusa_cache_id", cacheId, {
      maxAge: 60 * 60 * 24, // 24 hours
    })
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
