import type { Category, ProductListItem } from '../../types/product'
import { ProductCard } from './ProductCard'
export function ProductGrid({products,categories}:{products:ProductListItem[];categories:Category[]}){return <div className="grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{products.map(product=><ProductCard key={product.id} product={product} categories={categories}/>)}</div>}
