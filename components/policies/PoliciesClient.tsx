"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPoliciesListingRes } from '../../lib/contentstack/api';
import { onEntryChange } from '../../lib/contentstack/sdk';

export default function PoliciesClient({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    onEntryChange(() => {
      const fetchUpdate = async () => {
        const response = await getPoliciesListingRes();
        if (response) setData(response);
      };
      fetchUpdate();
    });
  }, []);

  if (!data) return null;

  return (
    <div className="bg-stone-50 min-h-screen pb-24">
      <div className="bg-white border-b border-stone-200 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 
            className="text-4xl md:text-5xl font-bold tracking-tight text-stone-900 mb-6"
            {...(data.$?.title)}
          >
            {data.title}
          </h1>
          {data.description && (
            <p 
              className="text-lg md:text-xl text-stone-600 font-light max-w-2xl mx-auto"
              {...(data.$?.description)}
            >
              {data.description}
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.policies?.map((policy: any, idx: number) => {
             const title = policy.title || policy.name || "Legal Policy";
             const summary = policy.summary || "Review our terms and conditions.";
             const url = policy.url || `/policies/`;

             return (
               <Link href={url} key={idx} className="group flex flex-col bg-white border border-stone-200 rounded-xl p-8 hover:shadow-md hover:border-stone-300 transition-all">
                  <h3 
                    className="text-2xl font-bold text-stone-900 mb-4 group-hover:text-stone-600 transition-colors"
                    {...(policy.$?.title)}
                  >
                    {title}
                  </h3>
                  <p 
                    className="text-stone-600 leading-relaxed font-light mb-8 flex-grow"
                    {...(policy.$?.summary)}
                  >
                    {summary}
                  </p>
                  
                  <div className="flex items-center text-sm font-bold uppercase tracking-widest text-stone-900 border-t border-stone-100 pt-6">
                    <span className="group-hover:mr-2 transition-all">Read Full Policy</span>
                    <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
               </Link>
             )
          })}
        </div>
        
        {(!data.policies || data.policies.length === 0) && (
            <div className="w-full py-16 text-center text-stone-500 bg-white rounded-xl border border-stone-200">
               No policies have been published yet.
            </div>
        )}
      </div>
    </div>
  );
}
