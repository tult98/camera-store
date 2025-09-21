"use client"

import { useState } from "react"
import Link from "next/link"

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  
  // This would be replaced with actual user state management
  const isLoggedIn = false // Replace with actual auth state
  const userName = "John Doe" // Replace with actual user data

  return (
    <div className="dropdown dropdown-end ml-2">
      <div 
        tabIndex={0} 
        role="button" 
        className="btn btn-ghost btn-circle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      {isOpen && (
        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          {isLoggedIn ? (
            <>
              <li className="menu-title">
                <span>Welcome, {userName}</span>
              </li>
              <li><Link href="/wishlist" onClick={() => setIsOpen(false)}>Wishlist</Link></li>
              <li><hr className="my-1" /></li>
              <li><button onClick={() => setIsOpen(false)}>Sign Out</button></li>
            </>
          ) : (
            <>
              <li><Link href="/login" onClick={() => setIsOpen(false)}>Sign In</Link></li>
              <li><Link href="/register" onClick={() => setIsOpen(false)}>Create Account</Link></li>
            </>
          )}
        </ul>
      )}
    </div>
  )
}

export default UserMenu