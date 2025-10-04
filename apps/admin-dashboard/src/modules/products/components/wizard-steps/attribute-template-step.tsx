import React from 'react';

export const AttributeTemplateStep: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Attribute Template & Custom Attributes</h2>
        
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="space-y-6">
              <div>
                <label className="label-wrapper" htmlFor="template">
                  <span className="label-text">Select Template</span>
                </label>
                <select
                  id="template"
                  className="input-base input-focus w-full"
                >
                  <option value="">Choose a template...</option>
                  <option value="camera">Camera Template</option>
                  <option value="lens">Lens Template</option>
                  <option value="accessory">Accessory Template</option>
                </select>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Template Attributes</h3>
                <div className="text-center py-8">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">
                    Dynamic attribute fields will appear here based on the selected template.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label-wrapper" htmlFor="brand">
                    <span className="label-text">Brand</span>
                  </label>
                  <input
                    id="brand"
                    type="text"
                    placeholder="e.g., Canon, Nikon, Sony"
                    className="input-base input-focus w-full"
                  />
                </div>
                
                <div>
                  <label className="label-wrapper" htmlFor="model">
                    <span className="label-text">Model</span>
                  </label>
                  <input
                    id="model"
                    type="text"
                    placeholder="e.g., EOS R5, D850"
                    className="input-base input-focus w-full"
                  />
                </div>
                
                <div>
                  <label className="label-wrapper" htmlFor="megapixels">
                    <span className="label-text">Megapixels</span>
                  </label>
                  <input
                    id="megapixels"
                    type="number"
                    placeholder="e.g., 45"
                    className="input-base input-focus w-full"
                  />
                </div>
                
                <div>
                  <label className="label-wrapper" htmlFor="sensor_type">
                    <span className="label-text">Sensor Type</span>
                  </label>
                  <select
                    id="sensor_type"
                    className="input-base input-focus w-full"
                  >
                    <option value="">Select sensor type</option>
                    <option value="full-frame">Full Frame</option>
                    <option value="aps-c">APS-C</option>
                    <option value="micro-four-thirds">Micro Four Thirds</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};