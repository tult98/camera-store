import { ChevronDownIcon } from "@heroicons/react/24/outline"
import { coreApiClient } from "@lib/core-api-client"
import { CategoryTreeResponse } from "@modules/shared/types/category"
import Link from "next/link"

const StoreNavigation = async () => {
  const categoriesTreeResponse = await coreApiClient.get<CategoryTreeResponse>(
    "/store/categories/tree"
  )
  const categories = categoriesTreeResponse.data.categories

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden border-b border-gray-200 lg:block relative z-50">
        <div className="container mx-auto">
          <ul className="flex items-center justify-center gap-1 py-1">
            {categories.map((category) => (
              <li key={category.id} className="group/nav relative">
                {category.children && category.children.length > 0 ? (
                  <>
                    <Link
                      href={`/categories/${category.handle}`}
                      className="inline-flex items-center gap-1.5 px-5 py-2 text-zinc-700 hover:text-zinc-900 font-medium text-[13px] uppercase tracking-[0.08em] transition duration-300 hover:bg-zinc-100 rounded-sm relative"
                    >
                      <span className="relative z-10">{category.name}</span>
                      <ChevronDownIcon className="w-3.5 h-3.5 transition-transform duration-300 group-hover/nav:rotate-180" />
                    </Link>
                    <ul className="absolute top-full left-0 mt-2 py-3 px-2 bg-white rounded-md shadow-xl border border-zinc-200 min-w-[220px] opacity-0 invisible translate-y-[-10px] group-hover/nav:opacity-100 group-hover/nav:visible group-hover/nav:translate-y-0 transition duration-300 ease-out z-[9999]">
                      {category.children.map((subCategory) => (
                        <li key={subCategory.id}>
                          <Link
                            href={`/categories/${subCategory.handle}`}
                            className="block px-4 py-2.5 text-zinc-600 hover:text-zinc-900 text-sm hover:bg-zinc-50 rounded transition duration-200 hover:translate-x-1"
                          >
                            {subCategory.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={`/categories/${category.handle}`}
                    className="inline-flex items-center px-5 py-2 text-zinc-700 hover:text-zinc-900 font-medium text-[13px] uppercase tracking-[0.08em] transition duration-300 hover:bg-zinc-100 rounded-sm relative"
                  >
                    <span className="relative z-10">{category.name}</span>
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
                  {category.children && category.children.length > 0 ? (
                    <details className="group/sub">
                      <summary className="flex items-center justify-between cursor-pointer list-none py-2.5 px-4 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded transition duration-200">
                        <Link
                          href={`/categories/${category.handle}`}
                          className="font-medium text-sm uppercase tracking-wide flex-1"
                        >
                          {category.name}
                        </Link>
                        <ChevronDownIcon className="w-4 h-4 transition-transform duration-300 group-open/sub:rotate-180" />
                      </summary>
                      <ul className="mt-1 ml-4 space-y-1">
                        {category.children.map((subCategory) => (
                          <li key={subCategory.id}>
                            <Link
                              href={`/categories/${subCategory.handle}`}
                              className="block py-2 px-4 text-zinc-600 hover:text-zinc-900 text-sm hover:bg-zinc-50 rounded transition-all duration-200"
                            >
                              {subCategory.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    <Link
                      href={`/categories/${category.handle}`}
                      className="block py-2.5 px-4 text-zinc-700 hover:text-zinc-900 font-medium text-sm uppercase tracking-wide hover:bg-zinc-100 rounded transition-all duration-200"
                    >
                      {category.name}
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
