"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCollectionsRes } from '../../lib/contentstack/api';
import { onEntryChange } from '../../lib/contentstack/sdk';

export default function CollectionsClient({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    onEntryChange(() => {
      const fetchUpdate = async () => {
        const response = await getCollectionsRes();
        if (response) setData(response);
      };
      fetchUpdate();
    });
  }, []);

  if (!data) return null;

  const background_image = data.background_image;
  const heading = data.heading || "Collections";
  const subheading = data.subheading;
  const reference = data.reference || [];

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="relative w-full h-[45vh] min-h-[400px] flex items-center justify-center overflow-hidden" {...(data.$?.background_image)}>
        {background_image?.url && (
          <img 
            src={`${background_image.url}?format=webply&quality=85`} 
            alt={background_image.title || "Collections Banner"}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-stone-900/40"></div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-3xl flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 drop-shadow-md" {...(data.$?.heading)}>
            {heading}
          </h1>
          <p className="text-lg md:text-xl font-medium opacity-90 drop-shadow-sm max-w-xl text-center" {...(data.$?.subheading)}>
            {subheading}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
          {reference?.map((category: any, idx: number) => {
            const catTitle = category.title || category.name;
            const catImage = category.image?.url;
            const catDesc = category.description;
            const linkDest = category.url || `/category/${category.slug}`; // Fixed hardcoded route path to match folder structure

            return (
              <Link 
                href={linkDest} 
                key={idx} 
                className="group relative flex flex-col bg-white overflow-hidden"
              >
                <div className="aspect-[4/5] bg-stone-100 overflow-hidden relative shadow-sm" {...(category.$?.image)}>
                   {catImage ? (
                      <img 
                        src={`${catImage}?format=webply&quality=85`} 
                        alt={catTitle}
                        className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                      />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400">
                         No Image
                      </div>
                   )}
                   <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <div className="pt-6 flex flex-col">
                  <h3 className="text-2xl font-bold text-stone-900 mb-2" {...(category.$?.title)}>
                    {catTitle}
                  </h3>
                  <div className="w-12 h-0.5 bg-stone-900 mb-4 transition-all duration-300 group-hover:w-20"></div>
                  {catDesc && (
                    <p className="text-stone-600 line-clamp-2" {...(category.$?.description)}>
                      {catDesc}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
