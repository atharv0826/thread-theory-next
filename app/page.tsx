import { getHomePageRes } from "../lib/contentstack/api";
import HomeClient from "../components/home/HomeClient";

export default async function Home() {
  const data = await getHomePageRes();
  
  if (!data) {
    return <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-800">Failed to load Contentstack data.</div>;
  }
  
  return <HomeClient initialData={data} />;
}
