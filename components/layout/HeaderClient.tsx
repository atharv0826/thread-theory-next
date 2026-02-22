"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getHeaderRes } from '../../lib/contentstack/api';
import { onEntryChange } from '../../lib/contentstack/sdk';

export default function HeaderClient({ initialData }: { initialData: any }) {
  const [header, setHeader] = useState(initialData);

  useEffect(() => {
    onEntryChange(() => {
      const fetchUpdate = async () => {
        const res = await getHeaderRes();
        if (res) setHeader(res);
      };
      fetchUpdate();
    });
  }, []);

  if (!header) {
    return <header className="h-16 w-full bg-red-50 text-red-800 flex items-center px-4">Failed to load Header</header>;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {header.logo && (
            <img 
              src={`${header.logo.url}?format=webply&quality=85`} 
              alt={header.logo.title || "Logo"} 
              className="h-8 w-auto" 
              {...(header.logo.$?.url)}
            />
          )}
          <span className="font-bold text-xl tracking-tight" {...(header.$?.title)}>{header.title}</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {header.navigation_links?.map((navItem: any, idx: number) => (
            <Link 
              key={idx} 
              href={navItem.link?.href || '#'} 
              className="hover:text-stone-500 transition-colors"
              {...(navItem.$?.label)}
            >
              {navItem.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
           {header.cta?.label && (
             <Link 
               href={header.cta.link?.href || '#'} 
               className="hidden md:block text-sm font-medium px-4 py-2 border border-stone-900 rounded-full hover:bg-stone-900 hover:text-white transition-colors"
               {...(header.cta.$?.label)}
             >
               {header.cta.label}
             </Link>
           )}
        </div>
      </div>
    </header>
  );
}
