type ProductPageProps = {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  return <h1 className="text-2xl font-bold text-slate-900">Product placeholder: {slug}</h1>
}
