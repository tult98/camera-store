import Link from "next/link"
import { HomeIcon, ChevronRightIcon } from "@heroicons/react/24/outline"

export interface BreadcrumbItem {
  title: string
  href?: string
  icon?: React.ReactNode
  isActive?: boolean
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
  variant?: "default" | "compact" | "minimal"
  showHome?: boolean
  loading?: boolean
  maxItems?: number
}

const BreadcrumbSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="flex items-center space-x-1 sm:space-x-2">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="flex items-center">
        {index > 0 && (
          <ChevronRightIcon className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2 text-base-content/40" />
        )}
        <div className="skeleton h-4 w-12 sm:w-16 bg-base-300"></div>
      </div>
    ))}
  </div>
)

const Breadcrumbs = ({
  items,
  className = "",
  variant = "default",
  showHome = true,
  loading = false,
  maxItems,
}: BreadcrumbsProps) => {
  if (loading) {
    return (
      <nav
        className={`bg-base-100/80 backdrop-blur-sm border-b border-base-200 ${className}`}
        aria-label="Breadcrumb"
      >
        <div className="container mx-auto px-2 sm:px-4 py-3">
          <BreadcrumbSkeleton />
        </div>
      </nav>
    )
  }

  const allItems = showHome
    ? [
        { title: "Home", href: "/", icon: <HomeIcon className="w-4 h-4" /> },
        ...items,
      ]
    : items

  // Handle item truncation for long breadcrumb chains
  // On mobile, automatically collapse if more than 2 items (excluding home)
  const shouldCollapseMobile = allItems.length > 3
  
  const displayItems =
    maxItems && allItems.length > maxItems
      ? [
          allItems[0],
          { title: "...", href: undefined },
          ...allItems.slice(-(maxItems - 2)),
        ]
      : allItems

  // Mobile-specific collapsed version: Home > ... > Current
  const mobileCollapsedItems = shouldCollapseMobile
    ? [
        allItems[0], // Home
        { title: "...", href: undefined },
        allItems[allItems.length - 1], // Current page
      ]
    : allItems

  const getVariantClasses = () => {
    switch (variant) {
      case "compact":
        return "py-2 text-xs"
      case "minimal":
        return "py-1 border-0 bg-transparent"
      default:
        return "py-3 text-sm"
    }
  }

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      ...(item.href && {
        item: `${typeof window !== "undefined" ? window.location.origin : ""}${
          item.href
        }`,
      }),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav
        className={`bg-base-100/80 backdrop-blur-sm border-b border-base-200 ${getVariantClasses()} ${className}`}
        aria-label="Breadcrumb navigation"
      >
        <div className="container mx-auto px-2 sm:px-4">
          {/* Mobile collapsed breadcrumbs */}
          <ol className="flex sm:hidden items-center space-x-1 overflow-hidden">
            {mobileCollapsedItems.map((item, index) => (
              <li key={`mobile-${item.title}-${index}`} className="flex items-center">
                {index > 0 && (
                  <ChevronRightIcon className="w-3 h-3 mx-1 text-base-content/40 flex-shrink-0" />
                )}

                {item.title === "..." ? (
                  <span className="text-base-content/40 px-1">...</span>
                ) : item.href && index < mobileCollapsedItems.length - 1 ? (
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 text-base-content/70 hover:text-primary transition-colors duration-200 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-100 rounded"
                  >
                    {item.icon && (
                      <span className="flex-shrink-0">{item.icon}</span>
                    )}
                    <span className="truncate max-w-[80px]">
                      {item.title}
                    </span>
                  </Link>
                ) : (
                  <span
                    className="flex items-center gap-1 text-primary font-medium"
                    aria-current="page"
                  >
                    {item.icon && (
                      <span className="flex-shrink-0">{item.icon}</span>
                    )}
                    <span className="truncate max-w-[120px]">
                      {item.title}
                    </span>
                  </span>
                )}
              </li>
            ))}
          </ol>
          
          {/* Desktop full breadcrumbs */}
          <ol className="hidden sm:flex items-center space-x-1 sm:space-x-2">
            {displayItems.map((item, index) => (
              <li key={`${item.title}-${index}`} className="flex items-center">
                {index > 0 && (
                  <ChevronRightIcon className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2 text-base-content/40 flex-shrink-0" />
                )}

                {item.title === "..." ? (
                  <span className="text-base-content/40 px-1">...</span>
                ) : item.href && index < displayItems.length - 1 ? (
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 text-base-content/70 hover:text-primary transition-colors duration-200 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-100 rounded"
                  >
                    {item.icon && (
                      <span className="flex-shrink-0">{item.icon}</span>
                    )}
                    <span className="truncate max-w-[120px] sm:max-w-[200px] lg:max-w-none">
                      {item.title}
                    </span>
                  </Link>
                ) : (
                  <span
                    className="flex items-center gap-1 text-primary font-medium"
                    aria-current="page"
                  >
                    {item.icon && (
                      <span className="flex-shrink-0">{item.icon}</span>
                    )}
                    <span className="truncate max-w-[120px] sm:max-w-[200px] lg:max-w-none">
                      {item.title}
                    </span>
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  )
}

export default Breadcrumbs
