import Link from 'next/link'
import { CartLink } from '../cart/CartButton'
export function AppHeader(){return <header className="border-b bg-white"><div className="mx-auto flex max-w-7xl justify-between p-4"><Link className="font-bold" href="/">Bước Chân Demo</Link><nav className="flex gap-4"><Link href="/">Trang chủ</Link><Link href="/products">Sản phẩm</Link><CartLink /></nav></div></header>}
