import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Select, Input, Label, Switch, Toaster, toast } from "@medusajs/ui"
import { useState, useEffect } from "react"

type AttributeDefinition = {
  key: string
  label: string
  type: "text" | "number" | "select" | "boolean"
  options?: string[]
  option_group?: string
  required: boolean
  display_order: number
  unit?: string
  default_value?: any
}

type AttributeTemplate = {
  id: string
  name: string
  code: string
  attribute_definitions: AttributeDefinition[]
  is_active: boolean
}

type ProductAttribute = {
  id?: string
  product_id: string
  template_id: string
  attribute_values: Record<string, any>
}

const ProductAttributesWidget = ({ data }: { data: { id: string } }) => {
  const [templates, setTemplates] = useState<AttributeTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<AttributeTemplate | null>(null)
  const [productAttributes, setProductAttributes] = useState<ProductAttribute | null>(null)
  const [attributeValues, setAttributeValues] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [optionGroups, setOptionGroups] = useState<Record<string, any>>({})
  const [resolvedOptions, setResolvedOptions] = useState<Record<string, any[]>>({})

  const productId = data.id

  useEffect(() => {
    fetchData()
    fetchOptionGroups()
  }, [productId])
  
  // Re-resolve options when template or option groups change
  useEffect(() => {
    if (selectedTemplate && Object.keys(optionGroups).length > 0) {
      const resolved: Record<string, any[]> = {}
      
      selectedTemplate.attribute_definitions.forEach(attr => {
        if (attr.type === "select") {
          if (attr.option_group && optionGroups[attr.option_group]) {
            resolved[attr.key] = optionGroups[attr.option_group].options.map((opt: any) => ({
              value: opt.value,
              label: opt.value // Use value as label since label field doesn't exist
            }))
          } else if (attr.options) {
            resolved[attr.key] = attr.options.map(opt => ({ value: opt, label: opt }))
          }
        }
      })
      
      setResolvedOptions(resolved)
    }
  }, [selectedTemplate, optionGroups])

  const fetchData = async () => {
    try {
      // Fetch templates
      const templatesResponse = await fetch("/admin/attribute-templates")
      const templatesData = await templatesResponse.json()
      const activeTemplates = templatesData.attribute_templates?.filter((t: AttributeTemplate) => t.is_active) || []
      setTemplates(activeTemplates)

      // Fetch existing product attributes
      const productAttrsResponse = await fetch(`/admin/product-attributes?product_id=${productId}`)
      const productAttrsData = await productAttrsResponse.json()
      
      if (productAttrsData.product_attributes?.length > 0) {
        const existingAttr = productAttrsData.product_attributes[0]
        setProductAttributes(existingAttr)
        setAttributeValues(existingAttr.attribute_values || {})
        
        // Find and set the selected template
        const template = activeTemplates.find((t: AttributeTemplate) => t.id === existingAttr.template_id)
        if (template) {
          setSelectedTemplate(template)
        }
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }
  
  const fetchOptionGroups = async () => {
    try {
      const response = await fetch("/admin/attribute-options/groups")
      const data = await response.json()
      
      // Convert array to lookup object by group_code
      const groupsMap: Record<string, any> = {}
      data.option_groups?.forEach((group: any) => {
        groupsMap[group.group_code] = group
      })
      setOptionGroups(groupsMap)
    } catch (error) {
      console.error("Failed to fetch option groups:", error)
    }
  }

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    setSelectedTemplate(template || null)
    
    // Initialize attribute values with defaults and resolve options
    if (template) {
      const initialValues: Record<string, any> = {}
      const resolved: Record<string, any[]> = {}
      
      template.attribute_definitions.forEach(attr => {
        if (attr.default_value !== undefined) {
          initialValues[attr.key] = attr.default_value
        }
        
        // Resolve options for select attributes
        if (attr.type === "select") {
          if (attr.option_group && optionGroups[attr.option_group]) {
            resolved[attr.key] = optionGroups[attr.option_group].options.map((opt: any) => ({
              value: opt.value,
              label: opt.value // Use value as label since label field doesn't exist
            }))
          } else if (attr.options) {
            resolved[attr.key] = attr.options.map(opt => ({ value: opt, label: opt }))
          }
        }
      })
      
      setAttributeValues(initialValues)
      setResolvedOptions(resolved)
    } else {
      setAttributeValues({})
      setResolvedOptions({})
    }
  }

  const handleAttributeValueChange = (key: string, value: any) => {
    setAttributeValues(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    if (!selectedTemplate) return

    setSaving(true)
    
    try {
      const payload = {
        product_id: productId,
        template_id: selectedTemplate.id,
        attribute_values: attributeValues,
      }

      const url = productAttributes?.id 
        ? `/admin/product-attributes/${productAttributes.id}`
        : "/admin/product-attributes"
      
      const method = productAttributes?.id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const data = await response.json()
        setProductAttributes(data.product_attribute)
        // Show success message
        toast.success("Success", {
          description: "Product attributes saved successfully!"
        })
      } else {
        throw new Error("Failed to save attributes")
      }
    } catch (error) {
      console.error("Failed to save attributes:", error)
      toast.error("Error", {
        description: "Failed to save attributes. Please try again."
      })
    } finally {
      setSaving(false)
    }
  }

  const renderAttributeInput = (attr: AttributeDefinition) => {
    const value = attributeValues[attr.key] || ""

    switch (attr.type) {
      case "text":
        return (
          <Input
            value={value}
            onChange={(e) => handleAttributeValueChange(attr.key, e.target.value)}
          />
        )

      case "number":
        return (
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={value}
              onChange={(e) => handleAttributeValueChange(attr.key, parseFloat(e.target.value) || 0)}
            />
            {attr.unit && <span className="text-sm text-gray-500">{attr.unit}</span>}
          </div>
        )

      case "select":
        const options = resolvedOptions[attr.key] || []
        return (
          <Select value={value || undefined} onValueChange={(val) => handleAttributeValueChange(attr.key, val)}>
            <Select.Trigger>
              <Select.Value placeholder="Select an option" />
            </Select.Trigger>
            <Select.Content>
              {options.map((option: any) => (
                <Select.Item key={option.value} value={option.value}>
                  {option.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        )

      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={Boolean(value)}
              onCheckedChange={(checked) => handleAttributeValueChange(attr.key, checked)}
            />
            <span className="text-sm">{value ? "Yes" : "No"}</span>
          </div>
        )

      default:
        return null
    }
  }

  if (loading) {
    return <div className="p-4">Loading attributes...</div>
  }

  return (
    <Container>
      <Toaster />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Heading level="h3">Product Attributes</Heading>
          {selectedTemplate && (
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Attributes"}
            </Button>
          )}
        </div>

        {/* Template Selection */}
        <div>
          <Label htmlFor="template">Attribute Template</Label>
          <Select
            value={selectedTemplate?.id || undefined}
            onValueChange={handleTemplateChange}
          >
            <Select.Trigger>
              <Select.Value placeholder="Select a template" />
            </Select.Trigger>
            <Select.Content>
              {templates.map((template) => (
                <Select.Item key={template.id} value={template.id}>
                  {template.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>

        {/* Attribute Fields */}
        {selectedTemplate && (
          <div className="space-y-4">
            <h4 className="font-medium">Attributes</h4>
            
            {selectedTemplate.attribute_definitions
              .sort((a, b) => a.display_order - b.display_order)
              .map((attr) => (
                <div key={attr.key} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={attr.key}>
                      {attr.label}
                      {attr.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                  </div>
                  
                  {renderAttributeInput(attr)}
                </div>
              ))}
          </div>
        )}

        {templates.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No attribute templates available.</p>
            <p className="text-sm">Create templates to start adding attributes to products.</p>
          </div>
        )}
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductAttributesWidget