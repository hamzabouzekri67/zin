/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, MouseEvent } from 'react';
import { Product } from '../types';
import { MessageSquare, ArrowLeft, ShieldCheck, HelpCircle, Compass, Sparkles, Check, ZoomIn } from 'lucide-react';

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
}

export default function ProductDetails({ product, onBack }: ProductDetailsProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const activeImage = product.images[activeImageIdx] || product.images[0];

  // Generate WhatsApp contact URL
  const getWhatsAppUrl = () => {
    const cleanNum = product.brandWhatsAppLink.replace(/\D/g, '');
    const text = encodeURIComponent(`Hi, I'm interested in buying your beautiful piece "${product.name}" from the ZIN Fashion Platform. Please let me know how we can proceed with payment and sizing details.`);
    return `https://wa.me/${cleanNum}?text=${text}`;
  };

  // High-performance pan-zoom on hover following mouse coordinates
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    
    // Calculate cursor positions in percentage relative to the image element
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2.2)',
    });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)',
    });
  };

  return (
    <div className="space-y-8 animate-fade-in text-white pb-12">
      
      {/* Return to showroom link */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-all text-xs font-mono group py-2 px-3.5 rounded-full bg-neutral-900/60 border border-neutral-800/80 backdrop-blur"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Return to Marketplace</span>
        </button>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Side: Product Gallery (5 columns) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Large Main Zoomable Stage */}
          <div 
            ref={imageContainerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-900 cursor-zoom-in group select-none shadow-2xl"
          >
            <img
              src={activeImage}
              alt={product.name}
              style={zoomStyle}
              className="w-full h-full object-cover object-center transition-transform duration-150 ease-out"
              referrerPolicy="no-referrer"
            />

            {/* Magnify overlay notice */}
            {!isZoomed && (
              <div className="absolute bottom-4 right-4 bg-black/75 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-full text-[10px] font-mono flex items-center gap-1.5 backdrop-blur pointer-events-none transition-all duration-300 opacity-80 group-hover:opacity-100">
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Hover to Zoom Couture</span>
              </div>
            )}

            {/* Top Categories overlay */}
            <div className="absolute top-4 left-4 z-10">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest bg-black/80 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-full backdrop-blur">
                {product.category}
              </span>
            </div>
          </div>

          {/* Thumbnail Gallery List */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative w-20 aspect-[3/4] rounded-xl overflow-hidden bg-neutral-900 border transition-all shrink-0 ${
                    idx === activeImageIdx
                      ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'border-neutral-800 hover:border-neutral-500'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} preview ${idx + 1}`}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Custom Configuration (5 columns) */}
        <div className="lg:col-span-5 space-y-6 bg-neutral-950/40 p-6 md:p-8 rounded-2xl border border-neutral-900/80 backdrop-blur-md relative">
          
          {/* Golden accent crown on details panel */}
          <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"></div>

          {/* Brand header context */}
          <div className="flex items-center gap-3 pb-2">
            <img
              src={product.brandAvatar}
              alt={product.brandName}
              className="w-10 h-10 rounded-full object-cover border-2 border-neutral-800"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono text-amber-500 tracking-wider block uppercase font-bold">
                VERIFIED ZIN BRAND
              </span>
              <h4 className="text-sm font-sans font-semibold text-white tracking-wide">
                {product.brandName}
              </h4>
            </div>
          </div>

          {/* Main Title & Price */}
          <div className="space-y-2 border-t border-neutral-900 pt-4">
            <h1 className="text-3xl md:text-4xl font-serif text-white tracking-wide leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono text-amber-400 font-bold">
                ${product.price.toLocaleString()}
              </span>
              <span className="text-[10px] font-mono text-neutral-500 uppercase">
                USD (Excl. custom import taxes)
              </span>
            </div>
          </div>

          {/* Narrative description */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">
              CAPSULE STATEMENT & SPECS
            </span>
            <p className="text-xs text-neutral-300 font-sans leading-relaxed font-light">
              {product.description}
            </p>
          </div>

          {/* Additional details list - styled with high end grid */}
          <div className="grid grid-cols-2 gap-4 bg-neutral-900/40 p-4 rounded-xl border border-neutral-900 text-xs font-mono">
            <div className="space-y-1">
              <span className="text-[9px] text-neutral-500 uppercase">FIBER CONTENT</span>
              <p className="text-neutral-200">95% Silk / 5% elastane</p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-neutral-500 uppercase">Tailor Care</span>
              <p className="text-neutral-200">Dry Clean Only</p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-neutral-500 uppercase">ORIGIN</span>
              <p className="text-neutral-200">Milan Creative Lab</p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-neutral-500 uppercase">AVAILABILITY</span>
              <p className="text-amber-400 font-semibold">1-of-1 Piece</p>
            </div>
          </div>

          {/* Call to Action Button */}
          <div className="space-y-3 pt-4 border-t border-neutral-900">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-[#0a0a0a] font-mono font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_35px_rgba(245,158,11,0.4)] transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-neutral-950 stroke-[3]" />
              <span>Buy on WhatsApp</span>
            </a>

            <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono text-neutral-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Verified direct buyer routing. No middleman fees applied.</span>
            </div>
          </div>

          {/* Sizing advisor assistance */}
          <div className="bg-neutral-900/20 border border-neutral-900 p-4 rounded-xl flex gap-3">
            <Compass className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-semibold">
                Custom Tailoring
              </span>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                Need customized dimensions or custom color variants? Connect directly with the couturier via WhatsApp to discuss measurements.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
