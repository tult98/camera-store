import { retrieveCart } from "@lib/data/cart"
import CartButton from "./cart-button"
import StoreLogo from "./logo"
import SearchBar from "./search-bar"

const StoreHeader = async () => {
  const cart = await retrieveCart()

  return (
    <header className="relative bg-white border-b border-gray-200">
      <div className="relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 py-2">
          <div className="shrink-0">
            <StoreLogo />
          </div>
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <SearchBar />
          </div>
          <div className="flex items-center gap-4">
            <div className="md:hidden">
              <SearchBar />
            </div>
            <CartButton cart={cart} />
          </div>
        </div>
      </div>
    </header>
  )
}

export default StoreHeader
