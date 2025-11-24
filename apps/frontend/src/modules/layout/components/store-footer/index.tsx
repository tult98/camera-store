import { getCategoriesForNavigation } from "@lib/data/categories"

const StoreFooter = async () => {
  const categories = await getCategoriesForNavigation()

  return (
    <div className="relative bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
        }}
      />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <footer className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12">
          <div className="lg:col-span-5 space-y-8 animate-[fadeIn_0.8s_ease-out]">
            <div className="space-y-6">
              <div className="flex items-center space-x-4 group">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-all duration-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-3xl font-serif font-bold tracking-tight text-zinc-50">
                  PH Camera
                </h2>
              </div>

              <p className="text-lg text-zinc-400 leading-relaxed max-w-md font-light">
                Your trusted partner in capturing life&apos;s most precious
                moments.
                <span className="block mt-3 text-primary/80 text-base font-medium">
                  Professional equipment, expert advice, exceptional service.
                </span>
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-800/50">
              <p className="text-sm text-zinc-500 mb-4 tracking-wide uppercase font-medium">
                Connect With Us
              </p>
              <div className="flex space-x-3">
                {[
                  {
                    name: "Pinterest",
                    path: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.083.343-.09.37-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.752-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.017 0z",
                  },
                  {
                    name: "YouTube",
                    path: "M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z",
                  },
                  {
                    name: "Facebook",
                    path: "M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z",
                  },
                  {
                    name: "Twitter",
                    path: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z",
                  },
                ].map((social, index) => (
                  <a
                    key={social.name}
                    href="#"
                    className="group relative w-10 h-10 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 hover:border-primary/50 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                    aria-label={social.name}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <svg
                      className="w-5 h-5 text-zinc-400 group-hover:text-primary transition-colors duration-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8 animate-[fadeIn_0.8s_ease-out_0.2s_both]">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent" />
                <h3 className="text-sm font-medium tracking-[0.2em] uppercase text-primary">
                  Shop
                </h3>
                <div className="w-2 h-2 bg-primary rounded-full" />
              </div>
              <nav className="space-y-4">
                {categories.map((category, index) => (
                  <div
                    key={category.id}
                    className="space-y-2"
                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                  >
                    <a
                      href={category.href}
                      className="group block text-base font-medium text-zinc-300 hover:text-primary transition-colors duration-300"
                    >
                      <span className="inline-flex items-center space-x-2">
                        <span className="w-1 h-1 bg-zinc-600 rounded-full group-hover:bg-primary transition-colors duration-300" />
                        <span>{category.title}</span>
                      </span>
                    </a>
                    {category.dropdown && category.dropdown.length > 0 && (
                      <div className="ml-6 space-y-1.5">
                        {category.dropdown.map((subCategory) => (
                          <a
                            key={subCategory.id}
                            href={subCategory.href}
                            className="block text-sm text-zinc-500 hover:text-zinc-300 transition-colors duration-300 hover:translate-x-1 transform"
                          >
                            {subCategory.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-8 animate-[fadeIn_0.8s_ease-out_0.4s_both]">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent" />
                <h3 className="text-sm font-medium tracking-[0.2em] uppercase text-primary">
                  Visit
                </h3>
                <div className="w-2 h-2 bg-primary rounded-full" />
              </div>
              <div className="space-y-5">
                <div className="group">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 w-5 h-5 text-primary/70 group-hover:text-primary transition-colors duration-300 flex-shrink-0">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        className="w-full h-full"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div className="text-sm leading-relaxed">
                      <p className="text-zinc-300 font-medium">
                        123 Photography Street
                      </p>
                      <p className="text-zinc-500">Camera District, CD 12345</p>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors duration-300 flex-shrink-0">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        className="w-full h-full"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-zinc-300 font-medium">
                      (123) 456-7890
                    </p>
                  </div>
                </div>

                <div className="group">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors duration-300 flex-shrink-0">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        className="w-full h-full"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-zinc-300 font-medium">
                      info@phcamera.com
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800/50">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 w-5 h-5 text-primary/70 flex-shrink-0">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        className="w-full h-full"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="text-sm leading-relaxed space-y-1">
                      <p className="text-zinc-400">
                        <span className="text-zinc-300 font-medium">
                          Mon - Fri:
                        </span>{" "}
                        9:00 AM - 8:00 PM
                      </p>
                      <p className="text-zinc-400">
                        <span className="text-zinc-300 font-medium">Sat:</span>{" "}
                        10:00 AM - 6:00 PM
                      </p>
                      <p className="text-zinc-400">
                        <span className="text-zinc-300 font-medium">Sun:</span>{" "}
                        12:00 PM - 5:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-800/50 animate-[fadeIn_0.8s_ease-out_0.6s_both]">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-sm text-zinc-500 text-center md:text-left">
              © 2025 PH Camera. All rights reserved.
              <span className="mx-2 text-zinc-700">•</span>
              <span className="text-zinc-600">
                Capturing moments since 2010.
              </span>
            </p>
            <div className="flex items-center space-x-6 text-xs text-zinc-600">
              <a
                href="#"
                className="hover:text-primary transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <span className="text-zinc-800">|</span>
              <a
                href="#"
                className="hover:text-primary transition-colors duration-300"
              >
                Terms of Service
              </a>
              <span className="text-zinc-800">|</span>
              <a
                href="#"
                className="hover:text-primary transition-colors duration-300"
              >
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default StoreFooter
