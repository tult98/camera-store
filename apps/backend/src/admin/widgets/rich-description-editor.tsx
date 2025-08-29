import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Label, Button } from "@medusajs/ui"
import { useState, useEffect, useCallback, useRef } from "react"
import { RichTextEditor } from "../components/rich-text-editor"

interface Product {
  id: string
  description?: string
  title?: string
}

interface RichDescriptionWidgetProps {
  data: Product
}

interface UpdateProductRequest {
  description: string
}

interface ApiResponse {
  success: boolean
  message?: string
}

const RichDescriptionWidget = ({ 
  data 
}: RichDescriptionWidgetProps) => {
  const [description, setDescription] = useState<string>("")
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedDescription, setSavedDescription] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  const product = data

  useEffect(() => {
    if (product?.description) {
      const cleanDescription = product.description.trim()
      setDescription(cleanDescription)
      setSavedDescription(cleanDescription)
    }
  }, [product?.description])

  const handleSave = useCallback(async () => {
    if (!product?.id) {
      setError("Product ID is missing")
      return
    }
    
    setIsSaving(true)
    setError(null)
    
    try {
      const payload: UpdateProductRequest = {
        description: description.trim()
      }
      
      const response = await fetch(`/admin/products/${product.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to update product: ${response.status} ${errorText}`)
      }

      const result: ApiResponse = await response.json()
      
      if (result.success !== false) {
        setSavedDescription(description)
        setIsEditing(false)
        setError(null)
      } else {
        throw new Error(result.message || "Failed to save description")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      console.error("Save error:", err)
    } finally {
      setIsSaving(false)
    }
  }, [product?.id, description])

  const handleCancel = useCallback(() => {
    setDescription(savedDescription)
    setIsEditing(false)
    setError(null)
  }, [savedDescription])

  const hasChanges = description.trim() !== savedDescription.trim()
  const isValidDescription = description.trim().length > 0
  const canSave = hasChanges && isValidDescription && !isSaving

  // Keyboard shortcuts for save (Ctrl/Cmd + S) and cancel (Escape)
  useEffect(() => {
    if (!isEditing) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault()
        if (canSave) {
          handleSave()
        }
      } else if (event.key === 'Escape') {
        event.preventDefault()
        handleCancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isEditing, canSave, handleSave, handleCancel])

  const sanitizeHtml = (html: string): string => {
    // Basic HTML sanitization - remove script tags and dangerous attributes
    return html
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/javascript:/gi, '')
  }

  if (!product) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-center px-6 py-8">
          <p className="text-gray-500">Loading product data...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="font-sans font-medium h2-core">
            Rich Text Description
          </h2>
          <p className="txt-small txt-subtle">
            Edit your product description with rich formatting
          </p>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            size="small"
            variant="primary"
          >
            Edit Description
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleCancel}
              size="small"
              variant="secondary"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!canSave}
              size="small"
              variant="primary"
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        )}
      </div>
      
      <div className="px-6 py-4">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="rich-description" className="block">
                Description
              </Label>
              {isEditing && (
                <div className="text-xs text-gray-500">
                  <kbd className="px-1 py-0.5 bg-gray-100 border rounded text-xs">Ctrl+S</kbd> to save • <kbd className="px-1 py-0.5 bg-gray-100 border rounded text-xs">Esc</kbd> to cancel
                </div>
              )}
            </div>
            {isEditing ? (
              <div ref={editorRef}>
                <RichTextEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Enter your product description with rich formatting..."
                  disabled={isSaving}
                />
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                {savedDescription ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(savedDescription) }}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50 min-h-[100px] overflow-auto"
                  />
                ) : (
                  <p className="text-gray-500 italic p-4 border border-gray-200 rounded-lg bg-gray-50 min-h-[100px] flex items-center justify-center">
                    No description provided. Click "Edit Description" to add one.
                  </p>
                )}
              </div>
            )}
          </div>
          
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          {isEditing && hasChanges && !error && (
            <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-3">
              You have unsaved changes. Click "Save" to apply them.
            </div>
          )}
          
          {isEditing && !isValidDescription && description.length > 0 && (
            <div className="text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-md p-3">
              Description cannot be empty or contain only whitespace.
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.before",
})

export default RichDescriptionWidget