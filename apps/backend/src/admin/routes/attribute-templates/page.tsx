import { defineRouteConfig } from "@medusajs/admin-sdk"
import { PencilSquare, Plus, Trash } from "@medusajs/icons"
import { Container, Heading, Button, Table, usePrompt, toast } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

type AttributeTemplate = {
  id: string
  name: string
  code: string
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

const AttributeTemplateList = () => {
  const [templates, setTemplates] = useState<AttributeTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const prompt = usePrompt()

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/admin/attribute-templates")
      const data = await response.json()
      setTemplates(data.attribute_templates || [])
    } catch (error) {
      console.error("Failed to fetch templates:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (template: AttributeTemplate) => {
    const confirmed = await prompt({
      title: "Delete attribute template",
      description: `Are you sure you want to delete "${template.name}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    })

    if (!confirmed) return

    try {
      const response = await fetch(`/admin/attribute-templates/${template.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setTemplates(templates.filter(t => t.id !== template.id))
        toast.success(`Attribute template "${template.name}" has been deleted successfully.`)
      } else {
        throw new Error("Failed to delete template")
      }
    } catch (error) {
      toast.error(`Failed to delete attribute template: ${error instanceof Error ? error.message : "Unknown error"}`)
      console.error("Failed to delete template:", error)
    }
  }


  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>
  }

  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <Heading level="h1">Attribute Templates</Heading>
        <Link to="/attribute-templates/new">
          <Button variant="secondary">
            <Plus className="w-4 h-4" />
            Create Template
          </Button>
        </Link>
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Code</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Created</Table.HeaderCell>
            <Table.HeaderCell className="text-right">Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {templates.map((template) => (
            <Table.Row key={template.id}>
              <Table.Cell className="font-medium">{template.name}</Table.Cell>
              <Table.Cell className="font-mono text-sm">{template.code}</Table.Cell>
              <Table.Cell className="text-sm text-gray-600">
                {template.description || '-'}
              </Table.Cell>
              <Table.Cell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${template.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {template.is_active ? 'Active' : 'Inactive'}
                </span>
              </Table.Cell>
              <Table.Cell>{new Date(template.created_at).toLocaleDateString()}</Table.Cell>
              <Table.Cell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link to={`/attribute-templates/${template.id}`}>
                    <Button variant="transparent" size="small">
                      <PencilSquare className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="transparent" 
                    size="small"
                    onClick={() => handleDelete(template)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {templates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No attribute templates found</p>
          <Link to="/attribute-templates/new">
            <Button variant="secondary">Create your first template</Button>
          </Link>
        </div>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Attribute Templates",
  icon: PencilSquare,
})

export default AttributeTemplateList