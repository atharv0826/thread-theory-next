import { getPoliciesListingRes } from "../../lib/contentstack/api";
import PoliciesClient from "../../components/policies/PoliciesClient";

export default async function Policies() {
  const data = await getPoliciesListingRes();
  
  if (!data) {
    return <div className="min-h-screen flex items-center justify-center p-8 bg-red-50 text-red-800 break-all"><pre>Failed to fetch policies_listing_page</pre></div>;
  }
  
  return <PoliciesClient initialData={data} />;
}
