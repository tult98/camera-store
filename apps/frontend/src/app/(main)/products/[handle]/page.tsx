import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts, retrieveProduct } from "@lib/data/products"
import { getDefaultRegion } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ handle: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params

  const product = await retrieveProduct(handle)

  if (!product) {
    notFound()
  }

  return {
    title: `${product.title} | Camera Store`,
    description: product.description || `${product.title}`,
    openGraph: {
      title: `${product.title} | Camera Store`,
      description: product.description || `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getDefaultRegion()

  if (!region) {
    notFound()
  }

  const product = await retrieveProduct(params.handle)

  if (!product) {
    notFound()
  }

  return <ProductTemplate product={product} region={region} />
}
