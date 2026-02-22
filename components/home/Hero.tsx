import React from 'react';
import Link from 'next/link';

export default function Hero({ data }: { data: any }) {
  return (
    <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-stone-900">
      
      {data.background_image && (
         <div className="absolute inset-0 z-0">
           <img 
             src={`${data.background_image.url}?format=webply&quality=85`}
             alt={data.background_image.title || "Hero background"} 
             className="w-full h-full object-cover opacity-60 mix-blend-multiply"
             {...(data.background_image.$?.url)}
           />
         </div>
      )}

      <div className="relative z-10 text-center px-4 max-w-4xl flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-6 leading-[0.9]" {...(data.$?.heading)}>
          {data.heading}
        </h1>
        
        {data.subheading && (
          <p className="text-xl md:text-2xl text-stone-200 font-light mb-10 max-w-2xl text-center" {...(data.$?.subheading)}>
            {data.subheading}
          </p>
        )}

        {data.cta_label && data.cta_link && (
          <Link 
            href={data.cta_link.href} 
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-stone-900 font-bold uppercase tracking-widest overflow-hidden"
            {...(data.$?.cta_label)}
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">{data.cta_label}</span>
            <div className="absolute inset-0 bg-stone-900 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></div>
          </Link>
        )}
      </div>

    </section>
  );
}
