import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button } from "@medusajs/ui"
import { Link } from "react-router-dom"
import { Adjustments, Tag, DocumentText } from "@medusajs/icons"

const AttributeManagement = () => {
  return (
    <Container>
      <div className="space-y-6">
        <Heading level="h1">Attribute Management</Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Attribute Templates */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DocumentText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Templates</h3>
                <p className="text-sm text-gray-500">Manage attribute templates for different product types</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Create and manage templates that define the structure and validation rules for product attributes.
              </p>
              
              <div className="flex gap-2">
                <Link to="/attribute-templates" className="flex-1">
                  <Button variant="secondary" className="w-full">
                    View Templates
                  </Button>
                </Link>
                <Link to="/attribute-templates/new">
                  <Button variant="primary">
                    Create New
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Attribute Options */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Tag className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Options</h3>
                <p className="text-sm text-gray-500">Manage predefined options for select attributes</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Define dropdown options that can be used across different attribute templates.
              </p>
              
              <Link to="/attribute-options" className="block">
                <Button variant="secondary" className="w-full">
                  Manage Options
                </Button>
              </Link>
            </div>
          </div>

          {/* Product Attributes */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Adjustments className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Product Attributes</h3>
                <p className="text-sm text-gray-500">Assign attributes to individual products</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Product attributes are managed directly on each product's detail page through the attribute widget.
              </p>
              
              <Link to="/products" className="block">
                <Button variant="secondary" className="w-full">
                  Go to Products
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Quick Overview</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">-</div>
              <div className="text-sm text-gray-500">Total Templates</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">-</div>
              <div className="text-sm text-gray-500">Option Groups</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">-</div>
              <div className="text-sm text-gray-500">Products with Attributes</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">-</div>
              <div className="text-sm text-gray-500">Active Templates</div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Getting Started</h3>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-600">1</span>
              </div>
              <div>
                <p className="font-medium">Create Attribute Options</p>
                <p className="text-sm text-gray-600">Start by defining reusable dropdown options like camera sensor types, lens mounts, etc.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-600">2</span>
              </div>
              <div>
                <p className="font-medium">Design Attribute Templates</p>
                <p className="text-sm text-gray-600">Create templates for different product types (cameras, lenses, accessories) with their specific attributes.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-600">3</span>
              </div>
              <div>
                <p className="font-medium">Assign to Products</p>
                <p className="text-sm text-gray-600">Use the attribute widget on product pages to assign templates and fill in specific values.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Attributes",
  icon: Adjustments,
})

export default AttributeManagement