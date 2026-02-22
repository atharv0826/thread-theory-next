"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategoryRes, getProductsByCategory } from '../../lib/contentstack/api';
import { onEntryChange } from '../../lib/contentstack/sdk';

export default function CategoryClient({ 
  initialCategory, 
  initialProducts, 
  slug 
}: { 
  initialCategory: any; 
  initialProducts: any[]; 
  slug: string;
}) {
  const [category, setCategory] = useState(initialCategory);
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    onEntryChange(() => {
      const fetchUpdate = async () => {
        const categoryUrl = `/category/${slug}`;
        const catRes = await getCategoryRes(categoryUrl);
        if (catRes) {
          setCategory(catRes);
          const prodRes = await getProductsByCategory(catRes.uid);
          setProducts(prodRes || []);
        }
      };
      fetchUpdate();
    });
  }, [slug]);

  if (!category) return null;

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="relative w-full h-[40vh] min-h-[350px] flex items-center justify-center overflow-hidden bg-stone-100" {...(category.$?.image)}>
        {category.image?.url && (
          <img 
            src={`${category.image.url}?format=webply&quality=85`}
            alt={category.title || category.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-stone-900/40"></div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-3xl flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 drop-shadow-md capitalize" {...(category.$?.title)}>
            {category.title || category.name}
          </h1>
          {category.description && (
            <p className="text-lg md:text-xl font-medium opacity-90 drop-shadow-sm max-w-2xl text-center" {...(category.$?.description)}>
              {category.description}
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-10 border-b border-stone-200 pb-4">
          <h2 className="text-2xl font-bold text-stone-900">
            {products.length} {products.length === 1 ? 'Product' : 'Products'}
          </h2>
        </div>

        {products.length === 0 ? (
           <div className="w-full py-16 text-center text-stone-500 bg-stone-50 rounded-xl border border-stone-100">
             No products currently available in this category.
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product: any, idx: number) => {
              const imageUrl = product.product_images?.[0]?.url;
              const price = product.price ? `$${(product.price).toFixed(2)}` : 'Pricing Unavailable';
              
              return (
                <Link 
                  key={product.uid || idx} 
                  href={`/products/${product.slug}`} 
                  className="group flex flex-col"
                >
                  <div className="w-full aspect-[3/4] bg-stone-100 rounded-xl overflow-hidden relative mb-4">
                    {imageUrl ? (
                      <img 
                        src={`${imageUrl}?format=webply&quality=85`}
                        alt={product.product_name || product.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        {...(product.$?.product_images)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400 bg-stone-100">
                        No Image
                      </div>
                    )}
                    
                    {!product.in_stock && (
                      <div className="absolute top-3 left-3 bg-stone-900/90 text-white text-xs px-3 py-1.5 font-bold uppercase tracking-wider rounded">
                         Out of Stock
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-stone-900 group-hover:text-stone-600 transition-colors" {...(product.$?.title)}>
                       {product.product_name || product.title}
                    </h3>
                    <p className="text-stone-500 mt-1 font-medium" {...(product.$?.price)}>
                       {price}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
