import { retrieveCart } from "@lib/data/cart"
import CartButton from "../store-navigation/cart-button"
import StoreLogo from "./logo"
import SearchBar from "./search-bar"

const StoreHeader = async () => {
  const cart = await retrieveCart()

  return (
    <header className="relative bg-white border-b border-gray-200">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/50 to-transparent pointer-events-none" />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 py-5">
          <div className="flex-shrink-0">
            <StoreLogo />
          </div>

          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <SearchBar />
          </div>

          <div className="flex items-center gap-4">
            <div className="md:hidden">
              <SearchBar />
            </div>

            <div className="relative transition-colors">
              <CartButton cart={cart} />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
      </div>
    </header>
  )
}

export default StoreHeader
