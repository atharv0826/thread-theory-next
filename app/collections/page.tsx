import { getCollectionsRes } from "../../lib/contentstack/api";
import CollectionsClient from "../../components/collections/CollectionsClient";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function Collections({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const data = await getCollectionsRes(null, resolvedSearchParams);
  
  if (!data) {
    return <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-800">Failed to load Collections layout.</div>;
  }
  
  return <CollectionsClient initialData={data} />;
}
