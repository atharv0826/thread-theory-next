import { getAboutPageRes } from "../../lib/contentstack/api";
import AboutClient from "../../components/about/AboutClient";

export default async function About() {
  const data = await getAboutPageRes();
  
  if (!data) {
    return <div className="min-h-screen flex items-center justify-center p-8 bg-red-50 text-red-800 break-all"><pre>Failed to fetch about_page</pre></div>;
  }
  
  return <AboutClient initialData={data} />;
}
