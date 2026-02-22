"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getFooterRes } from '../../lib/contentstack/api';
import { onEntryChange } from '../../lib/contentstack/sdk';

export default function FooterClient({ initialData }: { initialData: any }) {
  const [footer, setFooter] = useState(initialData);

  useEffect(() => {
    onEntryChange(() => {
      const fetchUpdate = async () => {
        const res = await getFooterRes();
        if (res) setFooter(res);
      };
      fetchUpdate();
    });
  }, []);

  if (!footer) {
    return (
      <footer className="bg-stone-50 border-t border-stone-200 mt-20 py-8 text-center text-stone-400">
         Failed to load footer.
      </footer>
    );
  }

  return (
    <footer className="bg-stone-50 border-t border-stone-200 mt-20 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-bold text-lg" {...(footer.$?.title)}>{footer.title}</h3>
            <p className="text-stone-600 max-w-sm" {...(footer.$?.footer_text)}>{footer.footer_text}</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-stone-900">Links</h4>
            <ul className="space-y-3 text-sm text-stone-600">
              {footer.footer_links?.map((item: any, idx: number) => (
                <li key={idx}>
                  <Link href={item.link?.href || '#'} className="hover:text-stone-900 transition-colors" {...(item.$?.label)}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-stone-900">Social</h4>
            <ul className="space-y-3 text-sm text-stone-600">
              {footer.social_links?.map((item: any, idx: number) => (
                 <li key={idx}>
                   <a href={item.link?.href || '#'} target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 transition-colors" {...(item.$?.platform)}>
                     {item.platform}
                   </a>
                 </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-stone-200 pt-8 text-center text-sm text-stone-500">
          <p {...(footer.$?.copyright_text)}>{footer.copyright_text}</p>
        </div>
      </div>
    </footer>
  );
}
