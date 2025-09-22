import { retrieveProduct } from "@lib/data/products"
import ProductDetail from "@modules/products/components/product-detail"
import { Metadata } from "next"
import { notFound } from "next/navigation"

// Force dynamic rendering
export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params

  const product = await retrieveProduct(handle)

  if (!product) {
    notFound()
  }

  return {
    title: `${product.title} | PH Camera`,
    description: product.description || `${product.title}`,
    openGraph: {
      title: `${product.title} | PH Camera`,
      description: product.description || `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params

  const product = await retrieveProduct(handle)

  if (!product) {
    notFound()
  }

  return <ProductDetail product={product} />
}
