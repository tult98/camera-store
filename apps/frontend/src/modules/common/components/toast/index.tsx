"use client"

import { XMarkIcon } from "@heroicons/react/24/outline"
import { useEffect } from "react"

export type ToastProps = {
  message: string
  type?: "success" | "error" | "info" | "warning"
  onClose: () => void
  duration?: number
}

export default function Toast({ 
  message, 
  type = "info", 
  onClose,
  duration = 5000 
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const alertStyles = {
    success: "alert-success",
    error: "alert-error",
    warning: "alert-warning",
    info: "alert-info"
  }

  return (
    <div className="toast toast-bottom toast-end z-50">
      <div className={`alert ${alertStyles[type]} shadow-lg`}>
        <span>{message}</span>
        <button 
          className="btn btn-ghost btn-xs btn-circle"
          onClick={onClose}
          aria-label="Close"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}