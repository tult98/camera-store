import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts, retrieveProduct } from "@lib/data/products"
import { getDefaultRegion } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"

type Props = {
  params: Promise<{ handle: string }>
}

export async function generateStaticParams() {
  try {
    const { response } = await listProducts({
      queryParams: { limit: 100, fields: "handle" },
    })

    return response.products
      .map((product) => ({
        handle: product.handle,
      }))
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
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
