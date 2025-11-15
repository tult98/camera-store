# Form Building Patterns

Forms in the admin dashboard follow a consistent pattern using React Hook Form, Zod validation, and React Query mutations.

## Complete Form Example

Here's a full example showing all the patterns together:

```typescript
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { FormInput } from '../../shared/components/ui/form-input';
import { FormImageUpload } from '../../shared/components/ui/form-input/form-image-upload';
import { LoadingIcon } from '../../shared/components/ui/loading-icon';
import { useToast } from '../../shared/hooks/use-toast';
import { createBrand, updateBrand } from '../apiCalls/brands';
import type { BrandSchemaType } from '../types';

// 1. Define Zod schema for validation
const brandSchema = z.object({
  name: z.string().min(1, 'Brand name is required').max(255, 'Brand name must be less than 255 characters'),
  image_url: z.string().url('Must be a valid URL').or(z.literal('')),
});

// 2. Define form props interface
interface BrandFormProps {
  initialData?: BrandSchemaType;
  isEditMode?: boolean;
  brandId?: string;
}

export const BrandForm: React.FC<BrandFormProps> = ({ initialData, isEditMode = false, brandId }) => {
  // 3. Initialize React Hook Form with Zod resolver
  const {
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { isSubmitting },
  } = useForm<BrandSchemaType>({
    resolver: zodResolver(brandSchema),
    mode: 'onBlur',
    defaultValues: initialData || {
      name: '',
      image_url: '',
    },
  });

  // 4. Setup utilities
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const navigate = useNavigate();

  // 5. Create mutation
  const createBrandMutation = useMutation({
    mutationFn: createBrand,
    onSuccess: (newBrand) => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      success('Brand created', `"${newBrand.name}" has been created successfully`);
      reset();
      navigate('/brands');
    },
    onError: (err: Error) => {
      error('Failed to create brand', err.message || 'An unexpected error occurred');
    },
  });

  // 6. Update mutation
  const updateBrandMutation = useMutation({
    mutationFn: (data: BrandSchemaType) => updateBrand(brandId!, data),
    onSuccess: (updatedBrand) => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      queryClient.invalidateQueries({ queryKey: ['brand', brandId] });
      success('Brand updated', `"${updatedBrand.name}" has been updated successfully`);
      navigate('/brands');
    },
    onError: (err: Error) => {
      error('Failed to update brand', err.message || 'An unexpected error occurred');
    },
  });

  // 7. Form submit handler
  const handleFormSubmit = async (data: BrandSchemaType) => {
    const isValid = await trigger();
    if (isValid) {
      if (isEditMode) {
        updateBrandMutation.mutate(data);
      } else {
        createBrandMutation.mutate(data);
      }
    }
  };

  const handleCancel = () => {
    navigate('/brands');
  };

  // 8. Render form
  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
      <FormInput
        name="name"
        control={control}
        type="text"
        label="Brand Name"
        placeholder="Enter brand name"
        disabled={isSubmitting || createBrandMutation.isPending || updateBrandMutation.isPending}
        required={true}
      />

      <FormImageUpload
        name="image_url"
        control={control}
        label="Brand Logo"
        disabled={isSubmitting}
        placeholder="Click to upload or drag and drop"
        maxSizeInMB={10}
      />

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          disabled={isSubmitting || createBrandMutation.isPending || updateBrandMutation.isPending}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || createBrandMutation.isPending || updateBrandMutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {(isSubmitting || createBrandMutation.isPending || updateBrandMutation.isPending) && (
            <LoadingIcon size="md" color="white" className="mr-2" />
          )}
          {isEditMode ? 'Update Brand' : 'Create Brand'}
        </button>
      </div>
    </form>
  );
};
```

## Key Form Patterns

### 1. Validation Schema

Use Zod for type-safe validation:

```typescript
const schema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Invalid email'),
  price: z.number().min(0, 'Price must be positive'),
  image_url: z.string().url().or(z.literal('')), // Optional URL
  description: z.string().optional(),
  category: z.enum(['cameras', 'lenses', 'accessories']),
});
```

**Common Validations**:
- Required string: `z.string().min(1, 'Required')`
- Optional string: `z.string().optional()` or `z.string().or(z.literal(''))`
- Email: `z.string().email('Invalid email')`
- URL: `z.string().url('Invalid URL')`
- Number range: `z.number().min(0).max(100)`
- Enum: `z.enum(['option1', 'option2'])`
- Array: `z.array(z.string())`
- Custom: `z.string().refine((val) => /* custom logic */, 'Error message')`

### 2. Form Hook Setup

```typescript
const {
  control,
  handleSubmit,
  reset,
  trigger,
  formState: { isSubmitting, errors },
} = useForm({
  resolver: zodResolver(schema),
  mode: 'onBlur', // Validate on blur
  defaultValues: initialData || {
    name: '',
    email: '',
    // ... other defaults
  },
});
```

**Form Modes**:
- `onBlur`: Validate when field loses focus (recommended)
- `onChange`: Validate on every change (can be annoying)
- `onSubmit`: Validate only on form submission
- `all`: Validate on both blur and change

### 3. Dual Mode Forms (Create/Edit)

Handle both create and update in the same form:

```typescript
interface FormProps {
  initialData?: DataType;
  isEditMode?: boolean;
  itemId?: string;
}

export const ItemForm: React.FC<FormProps> = ({
  initialData,
  isEditMode = false,
  itemId,
}) => {
  // Separate mutations for create/update
  const createMutation = useMutation({
    mutationFn: createItem,
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      success('Item created', `"${newItem.name}" has been created`);
      reset(); // Reset form after create
      navigate('/items');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: DataType) => updateItem(itemId!, data),
    onSuccess: (updatedItem) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item', itemId] });
      success('Item updated', `"${updatedItem.name}" has been updated`);
      navigate('/items'); // No reset after update
    },
  });

  // Conditional submission
  const handleFormSubmit = async (data: DataType) => {
    const isValid = await trigger();
    if (isValid) {
      if (isEditMode) {
        updateMutation.mutate(data);
      } else {
        createMutation.mutate(data);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      {/* Form fields */}
      <button type="submit">
        {isEditMode ? 'Update Item' : 'Create Item'}
      </button>
    </form>
  );
};
```

### 4. Loading States

Disable form during submission:

```typescript
const isFormDisabled =
  isSubmitting ||
  createMutation.isPending ||
  updateMutation.isPending;

// Apply to all inputs
<FormInput disabled={isFormDisabled} /* ... */ />
<FormImageUpload disabled={isFormDisabled} /* ... */ />
<button type="submit" disabled={isFormDisabled}>Submit</button>
```

### 5. Success Handling

After successful mutation:

```typescript
onSuccess: (newItem) => {
  // 1. Invalidate relevant queries to refetch data
  queryClient.invalidateQueries({ queryKey: ['items'] });
  queryClient.invalidateQueries({ queryKey: ['item', itemId] }); // For detail pages

  // 2. Show success toast notification
  success('Item created', `"${newItem.name}" has been created successfully`);

  // 3. Reset form (create mode only, not for updates)
  if (!isEditMode) {
    reset();
  }

  // 4. Navigate away to list page
  navigate('/items');
};
```

### 6. Error Handling

```typescript
onError: (err: Error) => {
  // Show user-friendly error message
  error('Failed to create item', err.message || 'An unexpected error occurred');

  // Optionally log for debugging
  console.error('Create item error:', err);
};
```

### 7. Custom Form Components

Use the shared form components for consistency:

#### Text Input
```typescript
<FormInput
  name="name"
  control={control}
  type="text"
  label="Item Name"
  placeholder="Enter name"
  disabled={isFormDisabled}
  required={true}
/>
```

#### Email Input
```typescript
<FormInput
  name="email"
  control={control}
  type="email"
  label="Email Address"
  placeholder="user@example.com"
  required={true}
/>
```

#### Number Input
```typescript
<FormInput
  name="price"
  control={control}
  type="number"
  label="Price"
  placeholder="0.00"
  step="0.01"
  min="0"
/>
```

#### Image Upload
```typescript
<FormImageUpload
  name="image_url"
  control={control}
  label="Product Image"
  disabled={isFormDisabled}
  placeholder="Click to upload or drag and drop"
  maxSizeInMB={10}
  accept="image/*"
/>
```

#### Textarea (if available)
```typescript
<FormTextarea
  name="description"
  control={control}
  label="Description"
  placeholder="Enter description"
  rows={4}
  maxLength={500}
/>
```

#### Select Dropdown (if available)
```typescript
<FormSelect
  name="category"
  control={control}
  label="Category"
  options={[
    { value: 'cameras', label: 'Cameras' },
    { value: 'lenses', label: 'Lenses' },
    { value: 'accessories', label: 'Accessories' },
  ]}
  required={true}
/>
```

### 8. Submit Button with Loading

Button text stays the same, only shows loading icon:

```typescript
<button
  type="submit"
  disabled={isFormDisabled}
  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
>
  {isFormDisabled && <LoadingIcon size="md" color="white" className="mr-2" />}
  {isEditMode ? 'Update Brand' : 'Create Brand'}
</button>
```

**DON'T** change button text to "Creating..." or "Updating..." - keep it consistent.

## Advanced Patterns

### Dependent Fields

Fields that depend on other field values:

```typescript
const category = watch('category'); // Watch category field

// Conditionally show fields based on category
{category === 'cameras' && (
  <FormInput
    name="sensor_size"
    control={control}
    label="Sensor Size"
  />
)}
```

### Dynamic Field Arrays

For repeating fields (e.g., multiple images, specifications):

```typescript
import { useFieldArray } from 'react-hook-form';

const { fields, append, remove } = useFieldArray({
  control,
  name: 'specifications',
});

return (
  <div>
    {fields.map((field, index) => (
      <div key={field.id} className="flex gap-2">
        <FormInput
          name={`specifications.${index}.key`}
          control={control}
          placeholder="Feature name"
        />
        <FormInput
          name={`specifications.${index}.value`}
          control={control}
          placeholder="Feature value"
        />
        <button type="button" onClick={() => remove(index)}>
          Remove
        </button>
      </div>
    ))}
    <button type="button" onClick={() => append({ key: '', value: '' })}>
      Add Specification
    </button>
  </div>
);
```

### Conditional Validation

Validate fields based on other field values:

```typescript
const schema = z.object({
  has_warranty: z.boolean(),
  warranty_months: z.number().optional(),
}).refine(
  (data) => !data.has_warranty || (data.warranty_months && data.warranty_months > 0),
  {
    message: 'Warranty months required when warranty is enabled',
    path: ['warranty_months'],
  }
);
```

### File Upload with Preview

```typescript
const [previewUrl, setPreviewUrl] = useState<string | null>(null);

const handleFileChange = (file: File) => {
  // Create preview
  const url = URL.createObjectURL(file);
  setPreviewUrl(url);

  // Upload file or convert to base64
  // ...
};

return (
  <div>
    <FormImageUpload
      name="image"
      control={control}
      onChange={handleFileChange}
    />
    {previewUrl && (
      <img src={previewUrl} alt="Preview" className="mt-2 w-32 h-32 object-cover" />
    )}
  </div>
);
```

### Form Reset with Confirmation

```typescript
const handleReset = () => {
  if (confirm('Are you sure you want to reset the form? All changes will be lost.')) {
    reset();
  }
};

<button type="button" onClick={handleReset}>
  Reset Form
</button>
```

## Form Best Practices

1. **Always use Zod schemas** for validation
   - Type-safe validation
   - Reusable schemas
   - Clear error messages

2. **Separate mutations** for create and update operations
   - Different success messages
   - Different cache invalidation strategies
   - Clear separation of concerns

3. **Invalidate queries** after successful mutations
   - List queries: `['items']`
   - Detail queries: `['item', itemId]`
   - Related queries that might be affected

4. **Show loading indicators** (icon only) during submission
   - Use `LoadingIcon` component
   - Show in button alongside text
   - Never change button text

5. **Disable all inputs** during submission to prevent duplicate requests
   - Create `isFormDisabled` computed value
   - Apply to all form fields and buttons

6. **Keep button text consistent**
   - DON'T change to "Updating..." or "Creating..."
   - DO show loading icon
   - Keep text the same: "Update Brand" or "Create Brand"

7. **Reset form** after successful creation (but not after update)
   - Create: `reset()` - clear form for next entry
   - Update: No reset - navigate away

8. **Navigate away** after successful submission
   - Usually to list page: `navigate('/items')`
   - Sometimes to detail page: `navigate('/items/${newItem.id}')`

9. **Use toast notifications** for user feedback
   - Success: Green toast with item name
   - Error: Red toast with error message
   - Keep messages concise and actionable

10. **Handle errors gracefully** with meaningful messages
    - Never show raw error stack traces
    - Provide user-friendly messages
    - Log errors for debugging

11. **Use custom form components** from shared/components/ui for consistency
    - `FormInput` for text/email/number
    - `FormImageUpload` for images
    - `FormTextarea` for long text
    - `FormSelect` for dropdowns

12. **Validate on blur** for better UX
    - Less intrusive than onChange
    - Still catches errors before submit
    - Set `mode: 'onBlur'` in useForm

## Complete Form Checklist

When building a form, ensure:

- [ ] Zod schema defined with all validation rules
- [ ] Form props interface includes initialData, isEditMode, itemId
- [ ] useForm hook configured with zodResolver and mode
- [ ] Separate mutations for create and update
- [ ] Success handlers with query invalidation, toast, and navigation
- [ ] Error handlers with user-friendly messages
- [ ] Submit handler with validation and conditional mutation
- [ ] Loading state computed from mutations
- [ ] All inputs disabled during submission
- [ ] Submit button shows loading icon (not text change)
- [ ] Cancel button navigates back
- [ ] Form reset after create (not update)
- [ ] All form components use shared UI components
- [ ] TypeScript types for all data

## Common Issues and Solutions

### Issue: Form doesn't validate on submit
**Solution**: Call `trigger()` before mutation:
```typescript
const isValid = await trigger();
if (isValid) {
  createMutation.mutate(data);
}
```

### Issue: Form doesn't reset after successful create
**Solution**: Add `reset()` in onSuccess:
```typescript
onSuccess: (newItem) => {
  reset(); // Only for create, not update
  // ...
}
```

### Issue: Stale data after mutation
**Solution**: Invalidate all relevant queries:
```typescript
queryClient.invalidateQueries({ queryKey: ['items'] });
queryClient.invalidateQueries({ queryKey: ['item', itemId] });
```

### Issue: Multiple submissions
**Solution**: Disable button during pending state:
```typescript
disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
```

### Issue: Validation errors not showing
**Solution**: Ensure form components are connected to control:
```typescript
<FormInput name="name" control={control} /* ... */ />
```

### Issue: Default values not loading in edit mode
**Solution**: Pass initialData to defaultValues:
```typescript
defaultValues: initialData || {
  name: '',
  // ...
}
```
