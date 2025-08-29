import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useEffect } from "react"

const InjectRichEditor = ({ 
  data 
}: { data: any }) => {
  const product = data

  useEffect(() => {
    const hideOriginalDescription = () => {
      // More specific selector for product description textarea
      const descriptionTextareas = document.querySelectorAll('textarea[name="description"]')
      descriptionTextareas.forEach(textarea => {
        // Find the form field container specifically for the description
        const fieldContainer = textarea.closest('[data-field="description"], .form-control, .field-wrapper')
        if (fieldContainer) {
          (fieldContainer as HTMLElement).style.display = 'none'
        } else {
          // Fallback: hide the immediate form group container
          const formGroup = textarea.closest('.flex-col, .form-group, .mb-4, .space-y-2')
          if (formGroup) {
            // Only hide if this is specifically the product description field
            const label = formGroup.querySelector('label')
            if (label && label.textContent?.toLowerCase().trim() === 'description') {
              (formGroup as HTMLElement).style.display = 'none'
            }
          }
        }
      })
    }
    
    // Add a small delay to ensure the DOM is fully loaded
    const timer = setTimeout(hideOriginalDescription, 100)
    
    const observer = new MutationObserver((mutations) => {
      let shouldCheck = false
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element
            if (element.querySelector('textarea[name="description"]') || 
                element.matches('textarea[name="description"]')) {
              shouldCheck = true
            }
          }
        })
      })
      
      if (shouldCheck) {
        setTimeout(hideOriginalDescription, 50)
      }
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
    
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [product])

  return null
}

export const config = defineWidgetConfig({
  zone: "product.details.before",
})

export default InjectRichEditor