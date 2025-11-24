import { ChevronDownIcon } from "@heroicons/react/24/outline"
import { getCategoriesForNavigation } from "@lib/data/categories"
import Link from "next/link"

const StoreNavigation = async () => {
  const categories = await getCategoriesForNavigation()

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden border-b border-gray-200 lg:block relative z-50">
        <div className="container mx-auto px-8">
          <ul className="flex items-center justify-center gap-1 py-1">
            {categories.map((category) => (
              <li key={category.id} className="group/nav relative">
                {category.dropdown && category.dropdown.length > 0 ? (
                  <>
                    <Link
                      href={category.href}
                      className="inline-flex items-center gap-1.5 px-5 py-2 text-zinc-700 hover:text-zinc-900 font-medium text-[13px] uppercase tracking-[0.08em] transition-all duration-300 hover:bg-zinc-100 rounded-sm relative overflow-hidden group/link"
                    >
                      <span className="relative z-10">{category.title}</span>
                      <ChevronDownIcon className="w-3.5 h-3.5 transition-transform duration-300 group-hover/nav:rotate-180 relative z-10" />
                      <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover/link:opacity-100 transition-opacity duration-500" />
                    </Link>
                    <ul className="absolute top-full left-0 mt-2 py-3 px-2 bg-white backdrop-blur-sm rounded-md shadow-xl border border-zinc-200 min-w-[220px] opacity-0 invisible translate-y-[-10px] group-hover/nav:opacity-100 group-hover/nav:visible group-hover/nav:translate-y-0 transition-all duration-300 ease-out z-[9999]">
                      {category.dropdown.map((subCategory) => (
                        <li key={subCategory.id}>
                          <Link
                            href={subCategory.href}
                            className="block px-4 py-2.5 text-zinc-600 hover:text-zinc-900 text-sm hover:bg-zinc-50 rounded transition-all duration-200 hover:translate-x-1"
                          >
                            {subCategory.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={category.href}
                    className="inline-flex items-center px-5 py-2 text-zinc-700 hover:text-zinc-900 font-medium text-[13px] uppercase tracking-[0.08em] transition-all duration-300 hover:bg-zinc-100 rounded-sm relative overflow-hidden group/link"
                  >
                    <span className="relative z-10">{category.title}</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover/link:opacity-100 transition-opacity duration-500" />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden relative z-50">
        <div className="px-4 py-3">
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none py-2 px-4 bg-zinc-100 hover:bg-zinc-200 rounded transition-colors duration-200">
              <span className="text-zinc-800 font-medium text-sm uppercase tracking-wider">
                Menu
              </span>
              <ChevronDownIcon className="w-5 h-5 text-zinc-600 transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <ul className="mt-3 space-y-1">
              {categories.map((category) => (
                <li key={category.id}>
                  {category.dropdown && category.dropdown.length > 0 ? (
                    <details className="group/sub">
                      <summary className="flex items-center justify-between cursor-pointer list-none py-2.5 px-4 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded transition-all duration-200">
                        <Link
                          href={category.href}
                          className="font-medium text-sm uppercase tracking-wide flex-1"
                        >
                          {category.title}
                        </Link>
                        <ChevronDownIcon className="w-4 h-4 transition-transform duration-300 group-open/sub:rotate-180" />
                      </summary>
                      <ul className="mt-1 ml-4 space-y-1">
                        {category.dropdown.map((subCategory) => (
                          <li key={subCategory.id}>
                            <Link
                              href={subCategory.href}
                              className="block py-2 px-4 text-zinc-600 hover:text-zinc-900 text-sm hover:bg-zinc-50 rounded transition-all duration-200"
                            >
                              {subCategory.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    <Link
                      href={category.href}
                      className="block py-2.5 px-4 text-zinc-700 hover:text-zinc-900 font-medium text-sm uppercase tracking-wide hover:bg-zinc-100 rounded transition-all duration-200"
                    >
                      {category.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </details>
        </div>
      </nav>
    </>
  )
}

export default StoreNavigation
