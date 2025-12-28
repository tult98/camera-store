import Link from "next/link"

const StoreLogo = () => {
  return (
    <Link href="/" className="group relative flex items-center gap-3">
      <div className="relative">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <svg className="w-14 h-14" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-primary/20 animate-[spin_20s_linear_infinite]"
              strokeDasharray="4 4"
            />
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-primary/15 animate-[spin_15s_linear_infinite_reverse]"
              strokeDasharray="3 3"
            />
          </svg>
        </div>
      </div>

      <div>
        <div className="font-serif text-2xl font-semibold tracking-tight text-primary transition-colors duration-300">
          PHCamera
        </div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-light -mt-0.5">
          Professional Photography
        </div>
      </div>

      <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </Link>
  )
}

export default StoreLogo
