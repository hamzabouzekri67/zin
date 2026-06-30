/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product } from '../types';
import { MessageSquare, Sparkles, Tag, ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
  key?: string;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Generate WhatsApp contact URL
  const getWhatsAppUrl = () => {
    const cleanNum = product.brandWhatsAppLink.replace(/\D/g, '');
    const text = encodeURIComponent(`Hi, I saw your beautiful piece "${product.name}" on the ZIN Fashion Ecosystem, and I am highly interested in purchasing it. Please provide payment and shipping options.`);
    return `https://wa.me/${cleanNum}?text=${text}`;
  };

  return (
    <div 
      onClick={() => onSelect?.(product)}
      className="group bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden transition-all duration-500 hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.06)] flex flex-col h-full cursor-pointer"
    >
      {/* Product Image Section */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900">
        <img
          src={product.images[activeImageIdx] || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Elegant Top Badge Row */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest bg-black/75 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full backdrop-blur">
            {product.category}
          </span>
          
          <span className="text-[11px] font-mono font-bold text-white bg-neutral-950/90 border border-neutral-800 px-3 py-1 rounded-full backdrop-blur">
            ${product.price.toLocaleString()}
          </span>
        </div>

        {/* Multiple Image Dots Indicator */}
        {product.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 p-1 rounded-full bg-black/40 backdrop-blur">
            {product.images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIdx(idx);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === activeImageIdx ? 'bg-amber-400 w-3' : 'bg-neutral-500'
                }`}
                aria-label={`View image ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Subtle Dark Bottom Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent pointer-events-none" />
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Brand & Title Info */}
        <div className="space-y-2">
          {/* Brand Row */}
          <div className="flex items-center gap-2">
            <img
              src={product.brandAvatar}
              alt={product.brandName}
              className="w-4 h-4 rounded-full object-cover border border-neutral-800"
              referrerPolicy="no-referrer"
            />
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-semibold">
              {product.brandName}
            </span>
          </div>

          <h3 className="text-base font-serif text-white group-hover:text-amber-400 transition-colors tracking-wide leading-snug">
            {product.name}
          </h3>

          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed font-light font-sans">
            {product.description}
          </p>
        </div>

        {/* Action Button Section */}
        <div className="space-y-3 pt-2">
          <div className="h-px bg-neutral-900" />
          
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-200 text-neutral-950 font-bold py-2.5 px-4 rounded-xl text-xs font-mono uppercase tracking-wider transition-all transform hover:scale-[1.01] active:scale-95 group/btn"
          >
            <MessageSquare className="w-3.5 h-3.5 text-neutral-900 group-hover/btn:scale-110 transition-transform" />
            <span>Buy Now</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>

      </div>
    </div>
  );
}
