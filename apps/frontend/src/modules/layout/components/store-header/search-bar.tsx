"use client"

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/store?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsExpanded(false)
      setSearchSuggestions([])
    }
  }

  const handleInputChange = (value: string) => {
    setSearchQuery(value)
    if (value.length > 2) {
      const mockSuggestions = [
        "Canon EOS",
        "Nikon D850",
        "Sony Alpha",
        "Fujifilm X-T5",
        "Leica M11",
      ].filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      )
      setSearchSuggestions(mockSuggestions.slice(0, 3))
    } else {
      setSearchSuggestions([])
    }
  }

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  return (
    <div className="form-control relative flex-1 max-w-2xl">
      <form onSubmit={handleSearch} className="hidden md:block relative">
        <input
          type="text"
          placeholder="Search cameras, lenses, accessories..."
          className="w-full px-6 py-3 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-300 focus:bg-white text-sm rounded-full transition-all duration-200"
          value={searchQuery}
          onChange={(e) => handleInputChange(e.target.value)}
        />

        {searchSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-xl rounded-2xl border border-zinc-200 overflow-hidden z-50 animate-[fadeIn_0.2s_ease-out]">
            {searchSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="w-full text-left px-6 py-3 hover:bg-zinc-50 transition-colors duration-150 flex items-center gap-3 group/suggestion"
                onMouseDown={(e) => {
                  e.preventDefault()
                  setSearchQuery(suggestion)
                  router.push(`/store?q=${encodeURIComponent(suggestion)}`)
                  setSearchSuggestions([])
                }}
              >
                <MagnifyingGlassIcon className="w-4 h-4 text-zinc-400 group-hover/suggestion:text-zinc-600 transition-colors" />
                <span className="text-sm text-zinc-700 group-hover/suggestion:text-zinc-900">
                  {suggestion}
                </span>
              </button>
            ))}
          </div>
        )}
      </form>

      <div className="md:hidden">
        <button
          className="btn btn-ghost btn-circle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? "Close search" : "Open search"}
        >
          {isExpanded ? (
            <XMarkIcon className="w-5 h-5" />
          ) : (
            <MagnifyingGlassIcon className="w-5 h-5" />
          )}
        </button>

        {isExpanded && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-zinc-200 p-4 z-50 shadow-lg animate-[slideDown_0.3s_ease-out]">
            <form onSubmit={handleSearch} className="form-control">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search cameras, lenses, accessories..."
                className="w-full px-6 py-3 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-300 focus:bg-white text-sm rounded-full transition-all duration-200"
                value={searchQuery}
                onChange={(e) => handleInputChange(e.target.value)}
              />

              {searchSuggestions.length > 0 && (
                <div className="mt-2 bg-white rounded-2xl border border-zinc-200 overflow-hidden">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 text-sm transition-colors flex items-center gap-3"
                      onClick={() => {
                        setSearchQuery(suggestion)
                        router.push(
                          `/store?q=${encodeURIComponent(suggestion)}`
                        )
                        setSearchSuggestions([])
                        setIsExpanded(false)
                      }}
                    >
                      <MagnifyingGlassIcon className="w-4 h-4 text-zinc-400" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBar
