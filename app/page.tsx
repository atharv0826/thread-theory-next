import { getHomePageRes } from "../lib/contentstack/api";
import HomeClient from "../components/home/HomeClient";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const data = await getHomePageRes(null, resolvedSearchParams);
  
  if (!data) {
    return <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-800">Failed to load Contentstack data.</div>;
  }
  
  return <HomeClient initialData={data} />;
}
