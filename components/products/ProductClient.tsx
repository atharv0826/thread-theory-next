"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProductRes } from '../../lib/contentstack/api';
import { onEntryChange } from '../../lib/contentstack/sdk';

export default function ProductClient({ initialData, slug }: { initialData: any, slug: string }) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    onEntryChange(() => {
      const fetchUpdate = async () => {
        const productUrl = `/products/${slug}`;
        const response = await getProductRes(productUrl);
        if (response) setData(response);
      };
      fetchUpdate();
    });
  }, [slug]);

  if (!data) return null;

  const title = data.product_name || data.title;
  const price = data.price ? `$${data.price.toFixed(2)}` : 'Pricing Unavailable';
  const imageUrl = data.product_images?.[0]?.url;
  const inStock = data.in_stock !== false; // defaults to true if undefined

  return (
    <div className="bg-stone-50 min-h-screen pb-24">
      {/* Breadcrumbs */ }
      <div className="container mx-auto px-4 py-8">
        <nav className="flex text-sm text-stone-500 font-medium">
          <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/collections" className="hover:text-stone-900 transition-colors">Collections</Link>
          <span className="mx-2">/</span>
          <span className="text-stone-900 truncate" {...(data.$?.title)}>{title}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            
            {/* Main Product Image */ }
            <div className="md:col-span-5 relative">
              <div className="w-full h-full aspect-[4/5] bg-stone-100 overflow-hidden relative" {...(data.$?.product_images)}>
                {imageUrl ? (
                  <img 
                    src={`${imageUrl}?format=webply&quality=85`}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400">
                    No Image Available
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */ }
            <div className="md:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col pt-10">
              
              <div className="mb-8 space-y-2">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight" {...(data.$?.title)}>
                  {title}
                </h1>
                <p className="text-2xl lg:text-3xl font-medium text-stone-600" {...(data.$?.price)}>
                  {price}
                </p>
              </div>
              
              {!inStock && (
                <div className="mb-8">
                  <div className="inline-flex items-center px-3 py-1 bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider rounded">
                    Out of Stock
                  </div>
                </div>
              )}

              {/* Description */ }
              <div className="mb-10 flex-grow">
                <h3 className="text-sm font-bold uppercase tracking-widest text-stone-900 mb-4 border-b border-stone-100 pb-2">Description</h3>
                {data.description ? (
                  <div 
                    className="prose prose-sm md:prose-base prose-stone text-stone-600 max-w-none"
                    {...(data.$?.description)}
                    dangerouslySetInnerHTML={{ __html: data.description }}
                  />
                ) : (
                  <p className="text-stone-500 italic">No description available for this product.</p>
                )}
              </div>

              {/* Add to Cart Button (Mock) */ }
              <div className="mt-auto pt-8 border-t border-stone-100">
                <button 
                  className={`w-full py-4 px-8 rounded-full font-bold uppercase tracking-widest transition-all ${
                    inStock 
                      ? 'bg-stone-900 text-white hover:bg-stone-800 shadow-md hover:shadow-lg' 
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                  disabled={!inStock}
                >
                  {inStock ? 'Add to Cart' : 'Unavailable'}
                </button>
              </div>
              
              {/* Product Gallery Thumbnails */ }
              {data.product_images && data.product_images.length > 1 && (
                <div className="mt-10">
                   <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">More Views</h3>
                   <div className="grid grid-cols-4 gap-3">
                     {data.product_images.slice(1, 5).map((img: any, idx: number) => (
                       <div key={idx} className="aspect-square bg-stone-100 rounded-md overflow-hidden border border-stone-100">
                         <img src={`${img.url}?format=webply&quality=85`} className="w-full h-full object-cover" alt="" />
                       </div>
                     ))}
                   </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
