import { getCategoryRes, getProductsByCategory } from "../../../lib/contentstack/api";
import CategoryClient from "../../../components/category/CategoryClient";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categoryUrl = `/category/${slug}`;
  
  const categoryData = await getCategoryRes(categoryUrl);
  
  if (!categoryData) {
    return <div className="min-h-screen flex items-center justify-center p-8 bg-red-50 text-red-800">Category not found</div>;
  }
  
  const productsData = await getProductsByCategory(categoryData.uid);
  
  return <CategoryClient initialCategory={categoryData} initialProducts={productsData} slug={slug} />;
}
