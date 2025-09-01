import { InformationCircle } from "@medusajs/icons"; // cspell:disable-line
import { Tooltip } from "@medusajs/ui"; // cspell:disable-line

export interface TooltipIconProps {
  content: string;
  color: "blue" | "purple";
  examples?: Record<string, string> | string;
  comparison?: string;
  guidance?: string;
  note?: string;
}

export const TooltipIcon = ({ 
  content, 
  color, 
  examples, 
  comparison, 
  guidance, 
  note 
}: TooltipIconProps) => {
  const colorClasses = {
    blue: "text-blue-600 hover:text-blue-700",
    purple: "text-purple-600 hover:text-purple-700",
  };

  const tooltipContent = (
    <div className="space-y-2 max-w-xs">
      <p className="text-sm">{content}</p>
      
      {comparison && (
        <div className="border-t pt-2">
          <p className="text-xs text-gray-600 font-medium">Note:</p>
          <p className="text-xs text-gray-600">{comparison}</p>
        </div>
      )}
      
      {examples && (
        <div className="border-t pt-2">
          <p className="text-xs text-gray-600 font-medium">Examples:</p>
          {typeof examples === "string" ? (
            <p className="text-xs text-gray-600">{examples}</p>
          ) : (
            <div className="space-y-1">
              {Object.entries(examples).map(([key, value]) => (
                <div key={key} className="text-xs">
                  <span className="font-mono bg-gray-100 px-1 rounded">{key}:</span>
                  <span className="text-gray-600 ml-1">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {guidance && (
        <div className="border-t pt-2">
          <p className="text-xs text-gray-600 font-medium">Guidance:</p>
          <p className="text-xs text-gray-600">{guidance}</p>
        </div>
      )}
      
      {note && (
        <div className="border-t pt-2">
          <p className="text-xs text-gray-600">{note}</p>
        </div>
      )}
    </div>
  );

  return (
    <Tooltip content={tooltipContent}>
      <InformationCircle className={`w-4 h-4 ml-1 cursor-help ${colorClasses[color]}`} />
    </Tooltip>
  );
};

interface FieldWithTooltipProps {
  label: string;
  tooltip: TooltipIconProps;
  field: React.ReactNode;
  required?: boolean;
}

export const FieldWithTooltip = ({ 
  label, 
  tooltip, 
  field, 
  required = false 
}: FieldWithTooltipProps) => {
  return (
    <div>
      <div className="flex items-center">
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <TooltipIcon {...tooltip} />
      </div>
      <div className="mt-1">
        {field}
      </div>
    </div>
  );
};