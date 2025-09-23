interface MessengerUrlOptions {
  orderId?: string
  message?: string
  ref?: string
}

export function getMessengerUrl(options?: MessengerUrlOptions): string | null {
  const pageId = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID
  
  if (!pageId) {
    console.warn("Facebook page ID not configured. Set NEXT_PUBLIC_FACEBOOK_PAGE_ID environment variable.")
    return null
  }
  
  const baseUrl = `https://m.me/${pageId}`
  const params = new URLSearchParams()
  
  if (options?.orderId) {
    params.set("ref", options.ref || `order_${options.orderId}`)
    
    if (!options.message) {
      options.message = `Hi, I just placed order #${options.orderId} and would like to send the deposit payment.`
    }
  } else if (options?.ref) {
    params.set("ref", options.ref)
  }
  
  if (options?.message) {
    params.set("text", options.message)
  }
  
  const queryString = params.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}

export function isMessengerConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID
}