import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import categories from '../../../data/categories.json'
import { ProductGrid } from '../../../components/product/ProductGrid'
import { getProductBySlug, getRelatedProducts } from '../../../lib/products'
import { CartButton } from '../../../components/cart/CartButton'

type ProductPageProps = {
  params: Promise<{ slug: string }>
}
const findProduct = cache((slug: string) => getProductBySlug(slug))
const money = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = findProduct(slug)
  if (!product) return { title: 'Không tìm thấy sản phẩm | Bước Chân Demo' }
  return { title: `${product.name} | ${product.brand} | Bước Chân Demo`, description: product.description, openGraph: { title: `${product.name} | ${product.brand}`, description: product.description, images: [product.image] } }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = findProduct(slug)
  if (!product) notFound()
  const category = categories.find((item) => item.value === product.category)?.label ?? product.category
  const related = getRelatedProducts(product)

  return <section className="mx-auto max-w-7xl px-4 py-10"><div className="grid gap-8 lg:grid-cols-2"><Image src={product.image} alt={product.imageAlt} width={800} height={600} className="aspect-[4/3] w-full rounded-xl bg-slate-100 object-cover"/><div><p className="font-bold text-sky-700">{product.brand}</p><h1 className="mt-2 text-3xl font-bold">{product.name}</h1><p className="mt-3 text-slate-600">{category} · {product.color}</p><p className="mt-6 text-2xl font-bold">{money(product.price)} {product.originalPrice!==null&&<del className="ml-3 text-base font-normal text-slate-500">{money(product.originalPrice)}</del>}</p><CartButton product={{productId:product.id,slug:product.slug,name:product.name,brand:product.brand,image:product.image,imageAlt:product.imageAlt,price:product.price}} /><p className="mt-2 text-slate-700">{product.description}</p></div></div>{related.length>0&&<section className="mt-14"><h2 className="text-2xl font-bold">Sản phẩm liên quan</h2><ProductGrid products={related} categories={categories}/></section>}<section className="mt-14 rounded-xl border bg-white p-5"><h2 className="font-bold">Nguồn dữ liệu hình ảnh và sản phẩm</h2><a className="mt-2 inline-block text-sky-700" href={product.sourceUrl} target="_blank" rel="noreferrer">Xem nguồn dữ liệu</a></section></section>
}
