'use client'
export default function ErrorPage({reset}:{error:Error;reset:()=>void}){return <section className="p-8"><h1>Không thể tải sản phẩm</h1><button onClick={reset}>Thử lại</button></section>}
