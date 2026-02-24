import { getProductRes } from "../../../lib/contentstack/api";
import ProductClient from "../../../components/products/ProductClient";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function ProductPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const productUrl = `/products/${slug}`;
  
  const productData = await getProductRes(productUrl, null, resolvedSearchParams);
  
  if (!productData) {
    return <div className="min-h-screen flex items-center justify-center p-8 bg-red-50 text-red-800 break-all"><pre>Product not found: {slug}</pre></div>;
  }
  
  return <ProductClient initialData={productData} slug={slug} />;
}
