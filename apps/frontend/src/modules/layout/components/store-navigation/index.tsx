import { ChevronDownIcon } from "@heroicons/react/24/outline"
import { retrieveCart } from "@lib/data/cart"
import { getCategoriesForNavigation } from "@lib/data/categories"
import Image from "next/image"
import Link from "next/link"
import CartDropdown from "./cart-dropdown"

// Navigation component for category-based navigation matching the image design
const StoreNavigation = async () => {
  const categories = await getCategoriesForNavigation()
  const cart = await retrieveCart()

  return (
    <div className="navbar bg-base-100 shadow-sm px-6 relative z-10">
      <div className="navbar-start">
        <Link href="/" className="flex items-center text-xl font-bold">
          <Image
            src="/logo.png"
            alt="PHCameras Logo"
            width={64}
            height={64}
            className="mr-3"
          />
        </Link>

        {/* Mobile Categories Dropdown */}
        <div className="dropdown lg:hidden ml-2">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            <span>Categories</span>
            <ChevronDownIcon className="w-4 h-4" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-1 z-50"
          >
            {categories.map((category) => (
              <li key={category.id}>
                {category.dropdown && category.dropdown.length > 0 ? (
                  <details>
                    <summary>
                      <Link
                        href={category.href}
                        className="text-sm font-medium"
                      >
                        {category.title}
                      </Link>
                    </summary>
                    <ul className="p-2">
                      {category.dropdown.map((subCategory) => (
                        <li key={subCategory.id}>
                          <Link href={subCategory.href} className="text-sm">
                            {subCategory.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <Link href={category.href} className="text-sm font-medium">
                    {category.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {categories.map((category) => (
            <li
              key={category.id}
              className={
                category.dropdown && category.dropdown.length > 0
                  ? "dropdown group/nav relative hover:bg-transparent"
                  : ""
              }
            >
              {category.dropdown && category.dropdown.length > 0 ? (
                <>
                  <div className="font-medium text-sm uppercase tracking-wide flex items-center cursor-pointer">
                    <Link href={category.href}>{category.title}</Link>
                    <ChevronDownIcon className="w-4 h-4 ml-1 transition-transform group-hover/nav:rotate-180" />
                  </div>
                  <ul className="p-2 shadow bg-base-100 rounded-box w-56 z-50 absolute top-full left-0 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200">
                    {category.dropdown.map((subCategory) => (
                      <li key={subCategory.id}>
                        <Link
                          href={subCategory.href}
                          className="text-sm hover:bg-base-200 rounded px-3 py-2 block transition-colors"
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
                  className="font-medium text-sm uppercase tracking-wide"
                >
                  {category.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end">
        <CartDropdown cart={cart} />
      </div>
    </div>
  )
}

export default StoreNavigation
