"use client";
import React, { useEffect, useState } from 'react';
import { getAboutPageRes } from '../../lib/contentstack/api';
import { onEntryChange } from '../../lib/contentstack/sdk';

export default function AboutClient({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    onEntryChange(() => {
      const fetchUpdate = async () => {
        const response = await getAboutPageRes();
        if (response) setData(response);
      };
      fetchUpdate();
    });
  }, []);

  if (!data) return null;

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
      <h1 
        className="text-4xl md:text-5xl font-bold tracking-tight text-stone-900 mb-8 text-center"
        {...(data.$?.page_title)}
      >
        {data.page_title}
      </h1>
        
      {data.image && (
        <div className="w-full aspect-video md:aspect-[21/9] bg-stone-100 rounded-2xl overflow-hidden relative mb-12 shadow-sm">
          <img 
            src={`${data.image.url}?format=webply&quality=85`}
            alt={data.image.title || "About Aurum Apparel"}
            className="w-full h-full object-cover"
            {...(data.image.$?.url)}
          />
        </div>
      )}
      
      {data.description && (
        <div 
          className="prose prose-stone prose-lg max-w-3xl mx-auto text-stone-700 leading-relaxed space-y-6"
          {...(data.$?.description)}
          dangerouslySetInnerHTML={{ __html: data.description }}
        />
      )}
    </div>
  );
}
