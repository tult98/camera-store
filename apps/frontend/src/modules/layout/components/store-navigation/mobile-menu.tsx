"use client"

import { useState } from "react"
import Link from "next/link"

interface NavigationItem {
  title: string
  href: string
  dropdown?: Array<{
    title: string
    href: string
  }>
}

interface MobileMenuProps {
  navigationItems: NavigationItem[]
}

const MobileMenu = ({ navigationItems }: MobileMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="dropdown">
      <div 
        tabIndex={0} 
        role="button" 
        className="btn btn-ghost lg:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </div>
      {isMenuOpen && (
        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          {navigationItems.map((item) => (
            <li key={item.title}>
              <Link href={item.href} className="font-medium" onClick={() => setIsMenuOpen(false)}>
                {item.title}
              </Link>
              {item.dropdown && (
                <ul className="p-2">
                  {item.dropdown.map((dropItem) => (
                    <li key={dropItem.title}>
                      <Link href={dropItem.href} className="text-sm" onClick={() => setIsMenuOpen(false)}>
                        {dropItem.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MobileMenu