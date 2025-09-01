import { zodResolver } from "@hookform/resolvers/zod";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ArrowUturnLeft } from "@medusajs/icons";
import { Button, Container, Heading, toast } from "@medusajs/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { withQueryClientProvider } from "../../../utils/query-client";
import {
  AttributeTemplateFormData,
  AttributeTemplateSchema,
  defaultAttributeDefinition,
  defaultAttributeTemplate,
} from "../schemas/attribute-template.schema";
import { AttributeDefinitionsSection } from "./components/AttributeDefinitionsSection";
import { BasicInformationSection } from "./components/BasicInformationSection";

const AttributeTemplateFormCore = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = id !== "new";

  const form = useForm({
    resolver: zodResolver(AttributeTemplateSchema),
    defaultValues: defaultAttributeTemplate,
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const {
    register,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = form;

  const {
    fields: attributeFields,
    append: appendAttribute,
    remove: removeAttribute,
  } = useFieldArray({
    control,
    name: "attribute_definitions",
  });

  // React Query for fetching template data
  const {
    data: templateData,
    isLoading: templateLoading,
    error: templateError,
  } = useQuery({
    queryKey: ["attribute-template", id],
    queryFn: async () => {
      const response = await fetch(`/admin/attribute-templates/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch template");
      }
      const data = await response.json();
      return { ...data.attribute_template, id };
    },
    enabled: isEditing,
  });

  // React Query for fetching option groups
  const {
    data: optionGroups = [],
    isLoading: optionGroupsLoading,
    error: optionGroupsError,
  } = useQuery({
    queryKey: ["option-groups"],
    queryFn: async () => {
      const response = await fetch("/admin/attribute-options/groups");
      if (!response.ok) {
        throw new Error("Failed to fetch option groups");
      }
      const data = await response.json();
      return data.option_groups || [];
    },
  });

  // Update form when template data is loaded
  useEffect(() => {
    if (templateData) {
      reset(templateData);
    }
  }, [templateData, reset]);

  // Handle fetch errors
  useEffect(() => {
    if (templateError) {
      toast.error("Failed to fetch template");
    }
    if (optionGroupsError) {
      toast.error("Failed to fetch option groups");
    }
  }, [templateError, optionGroupsError]);

  // React Query mutation for saving template
  const saveTemplateMutation = useMutation({
    mutationFn: async (data: AttributeTemplateFormData) => {
      const url = isEditing
        ? `/admin/attribute-templates/${id}`
        : "/admin/attribute-templates";

      // Clean up placeholder values before submission
      const cleanedData = {
        ...data,
        attribute_definitions: data.attribute_definitions.map((def) => ({
          ...def,
          option_group:
            def.option_group === "__placeholder__"
              ? undefined
              : def.option_group,
        })),
      };

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.details || errorData.message || "Failed to save template";
        throw new Error(errorMessage);
      }

      return response.json();
    },
    onSuccess: (_, data) => {
      const actionText = isEditing ? "updated" : "created";
      toast.success(
        `Attribute template "${data.name}" has been ${actionText} successfully.`
      );
      queryClient.invalidateQueries({ queryKey: ["attribute-templates"] });
      queryClient.invalidateQueries({ queryKey: ["attribute-template", id] });
      navigate("/attribute-templates");
    },
    onError: (error) => {
      const actionText = isEditing ? "update" : "create";
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      toast.error(
        `Failed to ${actionText} attribute template: ${errorMessage}`
      );
    },
  });

  const onSubmit: SubmitHandler<AttributeTemplateFormData> = (data) => {
    saveTemplateMutation.mutate(data);
  };

  const handleAddAttribute = () => {
    appendAttribute(defaultAttributeDefinition);
  };

  const handleRemoveAttribute = (index: number) => {
    removeAttribute(index);
  };

  const isLoading = templateLoading || optionGroupsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">Loading...</div>
    );
  }

  return (
    <Container>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center gap-4 mb-6">
          <Link to="/attribute-templates">
            <Button variant="transparent" size="small" type="button">
              <ArrowUturnLeft className="w-4 h-4" />
            </Button>
          </Link>
          <Heading level="h1">
            {isEditing ? "Edit Template" : "Create Template"}
          </Heading>
        </div>

        <div className="max-w-4xl space-y-6">
          <BasicInformationSection
            register={register}
            control={control}
            errors={errors}
          />

          <AttributeDefinitionsSection
            attributeFields={attributeFields}
            register={register}
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
            optionGroups={optionGroups}
            onAddAttribute={handleAddAttribute}
            onRemoveAttribute={handleRemoveAttribute}
          />

          <div className="flex justify-end gap-3">
            <Link to="/attribute-templates">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={saveTemplateMutation.isPending}>
              {saveTemplateMutation.isPending
                ? "Saving..."
                : isEditing
                ? "Update"
                : "Create"}
            </Button>
          </div>
        </div>
      </form>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Attribute Template",
});

const AttributeTemplateForm = withQueryClientProvider(
  AttributeTemplateFormCore
);

export default AttributeTemplateForm;
