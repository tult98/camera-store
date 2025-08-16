"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline"

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
        "Leica M11"
      ].filter(suggestion => 
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
    <div className="form-control relative">
      {/* Desktop Search */}
      <form onSubmit={handleSearch} className="hidden md:flex">
        <div className="join">
          <input 
            type="text" 
            placeholder="Search cameras, lenses..." 
            className="input input-bordered join-item w-full max-w-xs" 
            value={searchQuery}
            onChange={(e) => handleInputChange(e.target.value)}
          />
          <button type="submit" className="btn join-item btn-primary">
            <MagnifyingGlassIcon className="w-4 h-4" />
          </button>
        </div>
        
        {searchSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-base-100 shadow-lg rounded-b-lg border border-t-0 z-50 max-w-xs">
            {searchSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="w-full text-left px-4 py-2 hover:bg-base-200 first:rounded-t-none last:rounded-b-lg"
                onClick={() => {
                  setSearchQuery(suggestion)
                  router.push(`/store?q=${encodeURIComponent(suggestion)}`)
                  setSearchSuggestions([])
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Mobile Search */}
      <div className="md:hidden">
        <button 
          className="btn btn-ghost btn-circle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <XMarkIcon className="w-5 h-5" /> : <MagnifyingGlassIcon className="w-5 h-5" />}
        </button>
        
        {isExpanded && (
          <div className="absolute top-full left-0 right-0 bg-base-100 border-b border-base-200 p-4 z-50 shadow-lg">
            <form onSubmit={handleSearch} className="form-control">
              <div className="join w-full">
                <input 
                  ref={inputRef}
                  type="text" 
                  placeholder="Search cameras, lenses..." 
                  className="input input-bordered join-item flex-1" 
                  value={searchQuery}
                  onChange={(e) => handleInputChange(e.target.value)}
                />
                <button type="submit" className="btn join-item btn-primary">
                  <MagnifyingGlassIcon className="w-4 h-4" />
                </button>
              </div>
              
              {searchSuggestions.length > 0 && (
                <div className="mt-2 bg-base-100 rounded-lg border">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full text-left px-4 py-2 hover:bg-base-200 first:rounded-t-lg last:rounded-b-lg"
                      onClick={() => {
                        setSearchQuery(suggestion)
                        router.push(`/store?q=${encodeURIComponent(suggestion)}`)
                        setSearchSuggestions([])
                        setIsExpanded(false)
                      }}
                    >
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