import { defineRouteConfig } from "@medusajs/admin-sdk"
import { PencilSquare, Plus, Trash } from "@medusajs/icons"
import { Container, Heading, Button, Table, Input, Label, usePrompt, Toaster, toast } from "@medusajs/ui"
import { useState, useEffect } from "react"

type AttributeOption = {
  id: string
  group_code: string
  value: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

const AttributeOptionsList = () => {
  const [options, setOptions] = useState<AttributeOption[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const prompt = usePrompt()
  const [newOption, setNewOption] = useState({
    group_code: "",
    value: "",
    display_order: 0,
    is_active: true,
  })

  useEffect(() => {
    fetchOptions()
  }, [])

  const fetchOptions = async () => {
    try {
      const response = await fetch("/admin/attribute-options")
      const data = await response.json()
      setOptions(data.attribute_options || [])
    } catch (error) {
      console.error("Failed to fetch options:", error)
      toast.error("Error", {
        description: "Failed to load attribute options",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOption = async () => {
    if (!newOption.group_code || !newOption.value) {
      toast.error("Error", {
        description: "Please fill in all required fields",
      })
      return
    }

    try {
      const response = await fetch("/admin/attribute-options", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOption),
      })

      if (response.ok) {
        const data = await response.json()
        setOptions([...options, data.attribute_option])
        setNewOption({
          group_code: "",
          value: "",
          display_order: 0,
          is_active: true,
        })
        toast.success("Success", {
          description: `Attribute option "${data.attribute_option.value}" created successfully`,
        })
      } else {
        toast.error("Error", {
          description: "Failed to create attribute option",
        })
      }
    } catch (error) {
      console.error("Failed to create option:", error)
      toast.error("Error", {
        description: "An unexpected error occurred while creating the option",
      })
    }
  }

  const handleUpdateOption = async (id: string, updates: Partial<AttributeOption>) => {
    try {
      const response = await fetch(`/admin/attribute-options/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const data = await response.json()
        setOptions(options.map(opt => opt.id === id ? data.attribute_option : opt))
        setEditingId(null)
        toast.success("Success", {
          description: `Attribute option "${data.attribute_option.value}" updated successfully`,
        })
      } else {
        toast.error("Error", {
          description: "Failed to update attribute option",
        })
      }
    } catch (error) {
      console.error("Failed to update option:", error)
      toast.error("Error", {
        description: "An unexpected error occurred while updating the option",
      })
    }
  }

  const handleDelete = async (id: string, option: AttributeOption) => {
    const confirmed = await prompt({
      title: "Delete attribute option",
      description: `Are you sure you want to delete "${option.value}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    })

    if (!confirmed) return

    try {
      const response = await fetch(`/admin/attribute-options/${id}`, {
        method: "DELETE",
      })
      
      if (response.ok) {
        setOptions(options.filter(opt => opt.id !== id))
        toast.success("Success", {
          description: `Attribute option "${option.value}" deleted successfully`,
        })
      } else {
        toast.error("Error", {
          description: "Failed to delete attribute option",
        })
      }
    } catch (error) {
      console.error("Failed to delete option:", error)
      toast.error("Error", {
        description: "An unexpected error occurred while deleting the option",
      })
    }
  }

  const groupedOptions = options.reduce((groups, option) => {
    const key = option.group_code
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(option)
    return groups
  }, {} as Record<string, AttributeOption[]>)

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>
  }

  return (
    <>
      <Toaster />
      <Container>
      <div className="flex items-center justify-between mb-6">
        <Heading level="h1">Attribute Options</Heading>
      </div>

      {/* Create New Option Form */}
      <div className="bg-white p-6 rounded-lg border mb-6">
        <h3 className="text-lg font-medium mb-4">Add New Option</h3>
        
        <div className="grid grid-cols-4 gap-4">
          <div>
            <Label>Group Code</Label>
            <Input
              value={newOption.group_code}
              onChange={(e) => setNewOption({ ...newOption, group_code: e.target.value })}
              placeholder="e.g., sensor_types"
            />
          </div>
          
          <div>
            <Label>Value</Label>
            <Input
              value={newOption.value}
              onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
              placeholder="Full Frame"
            />
          </div>
          
          <div>
            <Label>Display Order</Label>
            <Input
              type="number"
              value={newOption.display_order}
              onChange={(e) => setNewOption({ ...newOption, display_order: parseInt(e.target.value) || 0 })}
            />
          </div>
          
          <div className="flex items-end">
            <Button onClick={handleCreateOption} className="w-full">
              <Plus className="w-4 h-4" />
              Add Option
            </Button>
          </div>
        </div>
      </div>

      {/* Options by Group */}
      {Object.entries(groupedOptions).map(([groupCode, groupOptions]) => (
        <div key={groupCode} className="mb-8">
          <h3 className="text-lg font-medium mb-4">
            {groupCode} Options
          </h3>
          
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Value</Table.HeaderCell>
                <Table.HeaderCell>Display Order</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Created</Table.HeaderCell>
                <Table.HeaderCell className="text-right">Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {groupOptions
                .sort((a, b) => a.display_order - b.display_order)
                .map((option) => (
                <Table.Row key={option.id}>
                  <Table.Cell>
                    {editingId === option.id ? (
                      <Input
                        value={option.value}
                        onChange={(e) => setOptions(options.map(opt => 
                          opt.id === option.id ? { ...opt, value: e.target.value } : opt
                        ))}
                        className="w-full"
                      />
                    ) : (
                      <span className="font-mono text-sm">{option.value}</span>
                    )}
                  </Table.Cell>
                  
                  <Table.Cell>
                    {editingId === option.id ? (
                      <Input
                        type="number"
                        value={option.display_order}
                        onChange={(e) => setOptions(options.map(opt => 
                          opt.id === option.id ? { ...opt, display_order: parseInt(e.target.value) || 0 } : opt
                        ))}
                        className="w-20"
                      />
                    ) : (
                      option.display_order
                    )}
                  </Table.Cell>
                  
                  <Table.Cell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      option.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {option.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </Table.Cell>
                  
                  <Table.Cell>{new Date(option.created_at).toLocaleDateString()}</Table.Cell>
                  
                  <Table.Cell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {editingId === option.id ? (
                        <>
                          <Button
                            variant="secondary"
                            size="small"
                            onClick={() => handleUpdateOption(option.id, option)}
                          >
                            Save
                          </Button>
                          <Button
                            variant="transparent"
                            size="small"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="transparent"
                            size="small"
                            onClick={() => setEditingId(option.id)}
                          >
                            <PencilSquare className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="transparent"
                            size="small"
                            onClick={() => handleDelete(option.id, option)}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      ))}

      {Object.keys(groupedOptions).length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No attribute options found</p>
          <p className="text-sm text-gray-400">Add your first option using the form above</p>
        </div>
      )}
      </Container>
    </>
  )
}

export const config = defineRouteConfig({
  label: "Attribute Options",
})

export default AttributeOptionsList