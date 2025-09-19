"use client"

import { XCircleIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
      <div className="alert alert-error alert-soft max-w-2xl w-full">
        <XCircleIcon className="w-6 h-6" />
        <div className="flex flex-col gap-2 w-full">
          <h2 className="font-bold text-lg">Something went wrong!</h2>
          <p className="text-sm opacity-90">
            {error.message ||
              "An unexpected error occurred while processing your request."}
          </p>
          {error.digest && (
            <p className="text-xs opacity-70">Error ID: {error.digest}</p>
          )}
        </div>
      </div>

      <div className="flex gap-4 mt-6 items-center">
        <button onClick={() => reset()} className="btn btn-primary">
          Try again
        </button>
        <Link href="/">Go to homepage</Link>
      </div>
    </div>
  )
}
