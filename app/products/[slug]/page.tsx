import { getProductRes } from "../../../lib/contentstack/api";
import ProductClient from "../../../components/products/ProductClient";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const productUrl = `/products/${slug}`;
  
  const productData = await getProductRes(productUrl);
  
  if (!productData) {
    return <div className="min-h-screen flex items-center justify-center p-8 bg-red-50 text-red-800 break-all"><pre>Product not found: {slug}</pre></div>;
  }
  
  return <ProductClient initialData={productData} slug={slug} />;
}
