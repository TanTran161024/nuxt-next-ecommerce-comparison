export interface Product { id: string; name: string; slug: string; brand: string; category: string; color: string; price: number; originalPrice: number | null; currency: 'VND'; onSale: boolean; description: string; image: string; imageAlt: string; sourceUrl: string; sourceImageUrl: string; featured: boolean }
export interface Brand { value: string; label: string; productCount: number }
export interface Category { value: string; label: string; productCount: number }
export interface ProductFilters { brand?: string; category?: string; color?: string; minPrice?: number; maxPrice?: number }
export type ProductListItem = Omit<Product, 'sourceImageUrl'>
export interface ProductListResponse { items: ProductListItem[]; total: number; appliedFilters: ProductFilters; availableBrands: Brand[]; availableCategories: Category[]; availableColors: string[]; priceRange: { min: number; max: number } }
export interface ApiErrorResponse { statusCode: number; statusMessage: string; message: string }
