"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsExpanded(false)
    }
  }

  return (
    <div className="form-control">
      {/* Desktop Search */}
      <form onSubmit={handleSearch} className="hidden md:flex">
        <div className="input-group">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="input input-bordered input-sm w-full max-w-xs" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-square btn-sm">
            <MagnifyingGlassIcon className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Mobile Search */}
      <div className="md:hidden">
        <button 
          className="btn btn-ghost btn-circle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
        </button>
        
        {isExpanded && (
          <div className="absolute top-full left-0 right-0 bg-base-100 border-b border-base-200 p-4 z-10">
            <form onSubmit={handleSearch} className="form-control">
              <div className="input-group">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="input input-bordered flex-1" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="btn btn-square">
                  <MagnifyingGlassIcon className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBar