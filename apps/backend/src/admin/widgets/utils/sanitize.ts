export const sanitizeHtml = (html: string): string => {
  // Allow iframes only from trusted video sources
  const allowedVideoHosts = [
    'youtube.com',
    'youtube-nocookie.com',
    'youtu.be',
    'vimeo.com',
    'player.vimeo.com'
  ];
  
  // First, remove dangerous scripts and event handlers
  let sanitized = html
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '');
  
  // Process iframes: only keep those from allowed video hosts
  sanitized = sanitized.replace(/<iframe([^>]*)>(.*?)<\/iframe>/gi, (match, attrs) => {
    // Extract src attribute
    const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
    if (!srcMatch) return ''; // Remove iframe if no src
    
    const src = srcMatch[1];
    
    // Check if src is from an allowed host
    const isAllowed = allowedVideoHosts.some(host => 
      src.includes(host)
    );
    
    if (isAllowed) {
      // Ensure iframe has safe attributes
      const safeAttrs = attrs
        .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
        .replace(/javascript:/gi, ''); // Remove javascript: protocol
      
      return `<iframe${safeAttrs}></iframe>`;
    }
    
    return ''; // Remove non-video iframes
  });
  
  return sanitized;
};