import { getCategoryRes, getProductsByCategory } from "../../../lib/contentstack/api";
import CategoryClient from "../../../components/category/CategoryClient";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const categoryUrl = `/category/${slug}`;
  
  const categoryData = await getCategoryRes(categoryUrl, null, resolvedSearchParams);
  
  if (!categoryData) {
    return <div className="min-h-screen flex items-center justify-center p-8 bg-red-50 text-red-800">Category not found</div>;
  }
  
  const productsData = await getProductsByCategory(categoryData.uid, null, resolvedSearchParams);
  
  return <CategoryClient initialCategory={categoryData} initialProducts={productsData} slug={slug} />;
}
