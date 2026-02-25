import { getPolicyRes } from "../../../lib/contentstack/api";
import PolicyClient from "../../../components/policies/PolicyClient";

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policyUrl = `/policies/${slug}`;
  
  const policyData = await getPolicyRes(policyUrl);
  
  if (!policyData) {
    return <div className="min-h-screen flex items-center justify-center p-8 bg-red-50 text-red-800 break-all"><pre>Policy not found: {slug}</pre></div>;
  }
  
  return <PolicyClient initialData={policyData} slug={slug} />;
}
