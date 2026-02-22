import { getCollectionsRes } from "../../lib/contentstack/api";
import CollectionsClient from "../../components/collections/CollectionsClient";

export default async function Collections() {
  const data = await getCollectionsRes();
  
  if (!data) {
    return <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-800">Failed to load Collections layout.</div>;
  }
  
  return <CollectionsClient initialData={data} />;
}
