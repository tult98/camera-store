import Link from "next/link"
import { HomeIcon, ChevronRightIcon } from "@heroicons/react/24/outline"

interface BreadcrumbItem {
  title: string
  href?: string
  icon?: React.ReactNode
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

const Breadcrumbs = ({ items, className = "" }: BreadcrumbsProps) => {
  const allItems = [
    { title: "Home", href: "/", icon: <HomeIcon className="w-4 h-4" /> },
    ...items
  ]

  return (
    <nav className={`bg-base-100/80 backdrop-blur-sm border-b border-base-200 ${className}`} aria-label="Breadcrumb">
      <div className="container mx-auto px-4 py-3">
        <ol className="flex items-center space-x-2 text-sm">
          {allItems.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRightIcon className="w-4 h-4 mx-2 text-base-content/40" />
              )}
              
              {item.href && index < allItems.length - 1 ? (
                <Link 
                  href={item.href} 
                  className="flex items-center gap-1 text-base-content/70 hover:text-primary transition-colors duration-200 hover:underline"
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              ) : (
                <span className="flex items-center gap-1 text-base-content font-medium" aria-current="page">
                  {item.icon}
                  <span>{item.title}</span>
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}

export default Breadcrumbs