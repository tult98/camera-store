import Link from "next/link"
import { HomeIcon } from "@heroicons/react/24/outline"

interface BreadcrumbItem {
  title: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <div className="breadcrumbs text-sm bg-base-200/50 py-2">
      <div className="container mx-auto px-4">
        <ul>
          <li>
            <Link href="/" className="hover:text-primary">
              <HomeIcon className="w-4 h-4 mr-2" />
              Home
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index}>
              {item.href && index < items.length - 1 ? (
                <Link href={item.href} className="hover:text-primary">
                  {item.title}
                </Link>
              ) : (
                <span className="text-base-content/60">{item.title}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Breadcrumbs