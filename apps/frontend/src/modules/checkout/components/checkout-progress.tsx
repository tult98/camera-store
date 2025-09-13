"use client"

import { useSearchParams } from "next/navigation"
import { CheckCircleIcon } from "@heroicons/react/24/solid"
import { ChevronRightIcon } from "@heroicons/react/24/outline"

const steps: { key: string; label: string; description?: string; mobileLabel?: string }[] = [
  { key: "cart", label: "Cart", mobileLabel: "Cart", description: "Review your items" },
  { key: "shipping-address", label: "Shipping Address", mobileLabel: "Shipping Address" },
  { key: "review", label: "Review", mobileLabel: "Review" },
]

export default function CheckoutProgress() {
  const searchParams = useSearchParams()
  const currentStep = searchParams.get("step") || "cart"
  
  const isSuccess = currentStep === "success"
  const currentStepIndex = isSuccess 
    ? steps.length 
    : steps.findIndex((step) => step.key === currentStep)

  return (
    <>
      {/* Mobile Progress - Show only current step like in mockup */}
      <div className="md:hidden bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center">
          {/* Current step indicator */}
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
              {currentStepIndex + 1}
            </div>
            
            <div className="ml-3">
              <div className="text-base font-semibold text-gray-900">
                {steps[currentStepIndex]?.label || "Cart"}
              </div>
              {steps[currentStepIndex]?.description && (
                <div className="text-sm text-gray-500">
                  {steps[currentStepIndex].description}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Progress - Original design */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = !isSuccess && step.key === currentStep
            const isCompleted = isSuccess || index < currentStepIndex
            const isAccessible = isSuccess || index <= currentStepIndex

            return (
              <div key={step.key} className="flex items-center flex-1">
                <div className="flex items-center flex-1">
                  {/* Step Circle */}
                  <div
                    className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                    ${
                      isCompleted
                        ? "bg-primary border-primary text-primary-content"
                        : isActive
                        ? "border-primary bg-base-100 text-primary"
                        : isAccessible
                        ? "border-base-300 bg-base-100 text-base-content"
                        : "border-base-200 bg-base-100 text-base-content/50"
                    }
                  `}
                  >
                    {isCompleted ? (
                      <CheckCircleIcon className="w-6 h-6" />
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="ml-4 flex-1">
                    <div
                      className={`
                      text-sm font-semibold transition-colors duration-300
                      ${
                        isActive
                          ? "text-primary"
                          : isAccessible
                          ? "text-base-content"
                          : "text-base-content/50"
                      }
                    `}
                    >
                      {step.label}
                    </div>
                    {step.description && (
                      <div
                        className={`
                        text-xs transition-colors duration-300
                        ${
                          isActive
                            ? "text-primary/70"
                            : isAccessible
                            ? "text-base-content/60"
                            : "text-base-content/40"
                        }
                      `}
                      >
                        {step.description}
                      </div>
                    )}
                  </div>
                </div>

                {/* Chevron separator */}
                {index < steps.length - 1 && (
                  <ChevronRightIcon
                    className={`
                    w-5 h-5 mx-4 transition-colors duration-300
                    ${
                      isAccessible
                        ? "text-base-content/40"
                        : "text-base-content/20"
                    }
                  `}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
