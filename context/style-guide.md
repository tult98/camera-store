# Camera Store Brand Style Guide

## Brand Identity

### Brand Values
- **Professional Excellence:** Reflecting the precision and quality photographers demand
- **Accessibility:** Making photography equipment approachable for all skill levels
- **Trust & Reliability:** Building confidence in product quality and service
- **Innovation:** Showcasing cutting-edge photography technology

### Visual Personality
- Clean, modern, and professional
- Focus on product imagery and technical details
- Minimal distractions from product showcase
- Trustworthy and credible presentation

## Color System (daisyUI Custom Theme)

### Primary Brand Colors (OKLCH)
```css
/* Light Theme */
--color-primary: oklch(70% 0.15 55);        /* Warm orange-yellow - Photography warmth */
--color-primary-content: oklch(100% 0 0);   /* Pure white text on primary */

--color-secondary: oklch(55% 0.12 250);     /* Cool blue - Professional, trustworthy */
--color-secondary-content: oklch(100% 0 0); /* Pure white text on secondary */

--color-accent: oklch(60% 0.15 180);        /* Teal accent - Modern, distinctive */
--color-accent-content: oklch(100% 0 0);    /* Pure white text on accent */
```

### Semantic Colors (OKLCH)
```css
/* Light Theme Semantic Colors */
--color-success: oklch(65% 0.18 145);       /* Green - Order confirmations, stock status */
--color-success-content: oklch(98% 0.01 145); /* Near-white with green tint */

--color-warning: oklch(75% 0.12 70);        /* Amber - Low stock, shipping delays */
--color-warning-content: oklch(20% 0.02 70); /* Dark text for contrast */

--color-error: oklch(65% 0.25 25);          /* Red - Validation errors, out of stock */
--color-error-content: oklch(98% 0.01 25);  /* Near-white with red tint */

--color-info: oklch(70% 0.18 220);          /* Blue - Product features, help text */
--color-info-content: oklch(98% 0.01 220);  /* Near-white with blue tint */
```

### Neutral Palette (OKLCH)
```css
/* Light Theme Base Colors */
--color-base-100: oklch(100% 0 0);          /* Pure white - Primary background */
--color-base-200: oklch(98% 0.01 250);      /* Very light gray - Secondary background */
--color-base-300: oklch(96% 0.015 250);     /* Light gray - Subtle borders, dividers */
--color-base-content: oklch(20% 0.02 250);  /* Dark gray - Primary text */

--color-neutral: oklch(45% 0.02 250);       /* Medium gray - Neutral elements */
--color-neutral-content: oklch(98% 0.01 250); /* Light text on neutral */

/* Dark Theme Base Colors */
--color-base-100: oklch(18% 0.02 250);      /* Dark background */
--color-base-200: oklch(15% 0.02 250);      /* Darker background */
--color-base-300: oklch(12% 0.02 250);      /* Darkest background */
--color-base-content: oklch(90% 0.01 250);  /* Light text */
```

## Typography

### Font Family
```css
/* Primary Font Stack */
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### Type Scale
```css
/* Headings */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }    /* H1 - Page titles */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }  /* H2 - Section titles */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }       /* H3 - Product names */
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }    /* H4 - Category names */

/* Body Text */
.text-base { font-size: 1rem; line-height: 1.5rem; }      /* Body - Descriptions */
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }   /* Small - Metadata */
.text-xs { font-size: 0.75rem; line-height: 1rem; }       /* Caption - Labels */
```

### Font Weights
```css
.font-normal { font-weight: 400; }    /* Body text */
.font-medium { font-weight: 500; }    /* Product names, navigation */
.font-semibold { font-weight: 600; }  /* Section headers, prices */
.font-bold { font-weight: 700; }      /* Page titles, CTAs */
```

## Spacing System

### Base Grid (8px system)
```css
/* Spacing Scale */
.space-1 { margin/padding: 0.25rem; }  /* 4px */
.space-2 { margin/padding: 0.5rem; }   /* 8px - Base unit */
.space-3 { margin/padding: 0.75rem; }  /* 12px */
.space-4 { margin/padding: 1rem; }     /* 16px */
.space-6 { margin/padding: 1.5rem; }   /* 24px */
.space-8 { margin/padding: 2rem; }     /* 32px */
.space-12 { margin/padding: 3rem; }    /* 48px */
.space-16 { margin/padding: 4rem; }    /* 64px */
```

### Component Spacing Guidelines
- **Product Cards:** 16px internal padding, 24px gap between cards
- **Page Sections:** 48px vertical spacing between major sections
- **Form Elements:** 16px vertical spacing between form groups
- **Navigation:** 8px padding for nav items, 16px for sections

## Component Styling Standards

### Buttons
```tsx
/* Primary Actions - Add to Cart, Checkout */
<button className="btn btn-primary">
  <ShoppingCartIcon className="w-5 h-5" />
  Add to Cart
</button>

/* Secondary Actions - Wishlist, Compare */
<button className="btn btn-secondary">Save for Later</button>

/* Outline Actions - View Details, Learn More */
<button className="btn btn-outline">View Details</button>

/* Ghost Actions - Navigation, Subtle Actions */
<button className="btn btn-ghost">Continue Shopping</button>

/* Destructive Actions - Remove from Cart */
<button className="btn btn-error">Remove Item</button>
```

### Product Cards
```tsx
<div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
  <figure className="aspect-square">
    <Image 
      src="/product.jpg" 
      alt="Product Name"
      className="object-cover w-full h-full"
      width={300} 
      height={300} 
    />
  </figure>
  <div className="card-body p-4">
    <h3 className="card-title text-lg font-medium line-clamp-2">Product Name</h3>
    <p className="text-sm text-base-content-secondary line-clamp-2">Brief description</p>
    <div className="flex items-center justify-between mt-auto pt-4">
      <span className="text-xl font-semibold text-primary">$299.99</span>
      <button className="btn btn-primary btn-sm">Add to Cart</button>
    </div>
  </div>
</div>
```

### Forms & Inputs
```tsx
<div className="form-control w-full">
  <label className="label">
    <span className="label-text font-medium">Email Address</span>
  </label>
  <input 
    type="email"
    placeholder="Enter your email"
    className="input input-bordered focus:input-primary" 
  />
  <label className="label">
    <span className="label-text-alt text-base-content-secondary">
      We'll never share your email
    </span>
  </label>
</div>
```

### Navigation
```tsx
<div className="navbar bg-base-100 border-b border-base-300">
  <div className="navbar-start">
    <Link href="/" className="btn btn-ghost text-xl font-bold">
      CameraStore
    </Link>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
      <li><Link href="/store" className="font-medium">Cameras</Link></li>
      <li><Link href="/lenses" className="font-medium">Lenses</Link></li>
      <li><Link href="/accessories" className="font-medium">Accessories</Link></li>
    </ul>
  </div>
  <div className="navbar-end gap-2">
    <button className="btn btn-ghost btn-circle">
      <MagnifyingGlassIcon className="w-5 h-5" />
    </button>
    <button className="btn btn-ghost btn-circle indicator">
      <ShoppingCartIcon className="w-5 h-5" />
      <span className="badge badge-primary badge-sm indicator-item">3</span>
    </button>
  </div>
</div>
```

## Icon System (Heroicons)

### E-commerce Icon Set
```tsx
/* Shopping & Cart */
import { ShoppingCartIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'

/* User & Account */
import { UserIcon, UserCircleIcon } from '@heroicons/react/24/outline'

/* Navigation */
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

/* Product Actions */
import { HeartIcon, EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'

/* Status & Feedback */
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

/* Camera Specific */
import { CameraIcon, PhotoIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'
```

### Icon Usage Guidelines
- **Size Standard:** `w-5 h-5` (20px) for most UI icons
- **Button Icons:** `w-4 h-4` (16px) in small buttons, `w-6 h-6` (24px) in large buttons
- **Navigation Icons:** `w-6 h-6` (24px) for primary navigation
- **Feature Icons:** `w-8 h-8` (32px) or larger for feature highlights

## Layout Patterns

### Page Structure
```tsx
<div className="min-h-screen bg-base-200">
  {/* Navigation */}
  <nav className="bg-base-100 border-b">...</nav>
  
  {/* Main Content */}
  <main className="container mx-auto px-4 py-8">
    {/* Page Header */}
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-base-content">Page Title</h1>
      <p className="text-lg text-base-content-secondary mt-2">Page description</p>
    </div>
    
    {/* Content Sections */}
    <section className="mb-12">...</section>
  </main>
  
  {/* Footer */}
  <footer className="bg-base-100 border-t">...</footer>
</div>
```

### Product Grid Layout
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {products.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

## Photography Industry Styling

### Product Image Standards
- **Aspect Ratio:** Square (1:1) for product cards, 4:3 or 16:9 for hero images
- **Quality:** High-resolution with professional lighting
- **Background:** Clean white or neutral backgrounds for consistency
- **Zoom:** Support hover zoom and lightbox for detailed viewing

### Technical Specification Display
```tsx
<div className="bg-base-100 p-6 rounded-lg">
  <h3 className="text-xl font-semibold mb-4">Specifications</h3>
  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <dt className="text-sm font-medium text-base-content-secondary">Sensor Size</dt>
      <dd className="text-base font-medium">APS-C (23.5 x 15.7mm)</dd>
    </div>
    <div>
      <dt className="text-sm font-medium text-base-content-secondary">Resolution</dt>
      <dd className="text-base font-medium">40.2 Megapixels</dd>
    </div>
  </dl>
</div>
```

## Mobile Commerce Styling

### Touch-Friendly Design
- **Minimum Touch Target:** 44px (w-11 h-11) for all interactive elements
- **Thumb-Friendly:** Bottom navigation and actions within easy thumb reach
- **Gesture Support:** Swipe gestures for image galleries and product carousels

### Mobile-Specific Components
```tsx
/* Mobile Cart Drawer */
<div className="drawer drawer-end">
  <input id="cart-drawer" type="checkbox" className="drawer-toggle" />
  <div className="drawer-content">
    <label htmlFor="cart-drawer" className="btn btn-primary drawer-button">
      <ShoppingCartIcon className="w-5 h-5" />
    </label>
  </div>
  <div className="drawer-side">
    <label htmlFor="cart-drawer" className="drawer-overlay"></label>
    <div className="menu p-4 w-80 min-h-full bg-base-100">
      {/* Cart contents */}
    </div>
  </div>
</div>

/* Mobile Filter Panel */
<div className="btm-nav lg:hidden">
  <button className="active">
    <AdjustmentsHorizontalIcon className="w-5 h-5" />
    <span className="btm-nav-label">Filter</span>
  </button>
</div>
```

## Animation & Interaction Guidelines

### Hover States
```css
/* Product Card Hover */
.product-card {
  @apply transition-all duration-200 ease-in-out;
}
.product-card:hover {
  @apply scale-105 shadow-xl;
}

/* Button Hover */
.btn:hover {
  @apply scale-105;
}
```

### Loading States
```tsx
/* Product Grid Loading */
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {Array.from({ length: 8 }).map((_, i) => (
    <div key={i} className="card bg-base-100 shadow-lg">
      <div className="skeleton h-64 w-full"></div>
      <div className="card-body">
        <div className="skeleton h-4 w-3/4 mb-2"></div>
        <div className="skeleton h-4 w-1/2"></div>
      </div>
    </div>
  ))}
</div>

/* Button Loading */
<button className="btn btn-primary loading">Processing...</button>
```

## E-commerce Component Standards

### Price Display
```tsx
/* Regular Price */
<span className="text-2xl font-bold text-primary">$1,299.99</span>

/* Sale Price */
<div className="flex items-center gap-2">
  <span className="text-2xl font-bold text-error">$999.99</span>
  <span className="text-lg line-through text-base-content-secondary">$1,299.99</span>
  <span className="badge badge-error">Save $300</span>
</div>

/* Price Range */
<span className="text-lg font-semibold">From $599.99</span>
```

### Stock Status Indicators
```tsx
/* In Stock */
<div className="badge badge-success gap-1">
  <CheckCircleIcon className="w-3 h-3" />
  In Stock
</div>

/* Low Stock */
<div className="badge badge-warning gap-1">
  <ExclamationTriangleIcon className="w-3 h-3" />
  Only 3 left
</div>

/* Out of Stock */
<div className="badge badge-error gap-1">
  <XMarkIcon className="w-3 h-3" />
  Out of Stock
</div>
```

### Rating Display
```tsx
<div className="flex items-center gap-2">
  <div className="rating rating-sm">
    {[1, 2, 3, 4, 5].map(star => (
      <input
        key={star}
        type="radio"
        className={`mask mask-star-2 ${star <= rating ? 'bg-warning' : 'bg-base-300'}`}
        disabled
      />
    ))}
  </div>
  <span className="text-sm text-base-content-secondary">
    ({reviewCount} reviews)
  </span>
</div>
```

## Responsive Breakpoints

### daisyUI/Tailwind Breakpoints
```css
/* Mobile First Approach */
/* Default: 0px and up (mobile) */

/* Small: 640px and up (large mobile/small tablet) */
sm: { min-width: '640px' }

/* Medium: 768px and up (tablet) */  
md: { min-width: '768px' }

/* Large: 1024px and up (desktop) */
lg: { min-width: '1024px' }

/* Extra Large: 1280px and up (large desktop) */
xl: { min-width: '1280px' }
```

### Responsive Patterns
```tsx
/* Product Grid Responsive */
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">

/* Navigation Responsive */
<div className="navbar">
  <div className="navbar-start">
    <div className="dropdown lg:hidden">
      <label className="btn btn-ghost">
        <Bars3Icon className="w-5 h-5" />
      </label>
    </div>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal">...</ul>
  </div>
</div>
```

## Accessibility Guidelines

### Color Contrast Requirements
- **Normal Text:** Minimum 4.5:1 contrast ratio
- **Large Text:** Minimum 3:1 contrast ratio
- **Interactive Elements:** Clear focus indicators with 3:1 contrast

### Keyboard Navigation
```tsx
/* Focus States */
.btn:focus-visible {
  @apply outline-2 outline-offset-2 outline-primary;
}

/* Skip Links */
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 btn btn-primary">
  Skip to main content
</a>
```

### Screen Reader Support
```tsx
/* Image Alt Text */
<Image 
  src="/camera.jpg"
  alt="Canon EOS R5 mirrorless camera with 24-105mm lens"
  width={400}
  height={400}
/>

/* Button Labels */
<button className="btn btn-ghost btn-square" aria-label="Add to wishlist">
  <HeartIcon className="w-5 h-5" />
</button>

/* Status Announcements */
<div role="status" aria-live="polite" className="sr-only">
  Item added to cart successfully
</div>
```

## Brand Voice & Content Guidelines

### Tone of Voice
- **Professional yet approachable:** Expert knowledge without intimidation
- **Helpful and educational:** Guide customers to the right equipment
- **Confident but not pushy:** Inform and suggest without overselling
- **Clear and concise:** Straightforward product information and descriptions

### Content Patterns
```tsx
/* Product Descriptions */
"Professional mirrorless camera perfect for wildlife and sports photography"

/* Feature Highlights */
"• 40.2MP full-frame sensor"
"• 8K video recording"
"• Weather-sealed body"

/* Call-to-Action Copy */
"Add to Cart" (not "Buy Now")
"Save for Later" (not "Add to Wishlist")
"View Details" (not "Learn More")
```

## Performance Standards

### Image Optimization
- **Format:** WebP with JPEG fallback
- **Sizing:** Responsive images with appropriate srcset
- **Loading:** Lazy loading for non-critical images
- **Compression:** Balanced quality vs. file size for fast loading

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint):** < 2.5 seconds
- **FID (First Input Delay):** < 100 milliseconds  
- **CLS (Cumulative Layout Shift):** < 0.1

### Bundle Size Guidelines
- **JavaScript Bundle:** Keep initial bundle under 200KB gzipped
- **CSS Bundle:** Optimize Tailwind output, purge unused styles
- **Images:** Optimize product images for web without sacrificing quality