/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, UserProfile, UserRole } from '../types';
import ProductCard from './ProductCard';
import ProductDetails from './ProductDetails';
import { Sparkles, Plus, Search, Tag, ShoppingBag, X, Check, Eye, HelpCircle, Loader } from 'lucide-react';

interface MarketplaceProps {
  currentProfile: UserProfile;
  currentRole: UserRole;
}

const CATEGORIES = ['All', 'Outerwear', 'Suits & Tailoring', 'Dresses', 'Footwear', 'Accessories', 'Couture'];

export default function Marketplace({ currentProfile, currentRole }: MarketplaceProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Add Product modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Couture');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductWhatsApp, setNewProductWhatsApp] = useState('');
  const [newProductImage, setNewProductImage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Fetch products on mount
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to retrieve items from ZIN Database.');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Error synchronizing products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filtered Products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.brandName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle new product submission
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);

    // Front-end valid checking
    if (!newProductName.trim()) {
      setFormError('Please input a valid design name.');
      return;
    }
    const priceNum = Number(newProductPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('Price must be a valid number greater than 0.');
      return;
    }
    if (!newProductWhatsApp.trim()) {
      setFormError('WhatsApp contact link or number is required for buyers.');
      return;
    }

    setFormSubmitting(true);

    try {
      // Default sample image if empty
      const imageList = newProductImage.trim() 
        ? [newProductImage.trim()] 
        : ["https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800"];

      const payload = {
        name: newProductName.trim(),
        price: priceNum,
        category: newProductCategory,
        description: newProductDescription.trim(),
        brandWhatsAppLink: newProductWhatsApp.trim().replace(/\D/g, ''), // Strip non-digits
        images: imageList,
        brandName: currentProfile.name || 'Anonymous Brand',
        brandAvatar: currentProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to publish premium item.');
      }

      setFormSuccess(true);
      
      // Reset inputs
      setNewProductName('');
      setNewProductPrice('');
      setNewProductCategory('Couture');
      setNewProductDescription('');
      setNewProductWhatsApp('');
      setNewProductImage('');

      // Refresh list
      fetchProducts();

      // Delay modal closing
      setTimeout(() => {
        setIsModalOpen(false);
        setFormSuccess(false);
      }, 1500);

    } catch (err: any) {
      setFormError(err.message || 'API connection failure.');
    } finally {
      setFormSubmitting(false);
    }
  };

  if (selectedProduct) {
    return (
      <ProductDetails 
        product={selectedProduct} 
        onBack={() => setSelectedProduct(null)} 
      />
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Welcome Stage */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-neutral-900 pb-8">
        <div className="space-y-2">
          <span className="text-[10px] font-mono text-amber-500 tracking-widest uppercase block font-bold">
            CURATED COUTURE DIRECTORY
          </span>
          <h1 className="text-4xl font-serif text-white tracking-wide">
            ZIN Marketplace
          </h1>
          <p className="text-xs text-neutral-400 max-w-xl">
            Sleek direct-to-creator digital showroom. Acquire unique runway samples, exclusive capsule drops, and custom-made apparel directly from verified high-fashion creators.
          </p>
        </div>

        {/* List Product CTA - visible for Brands, Designers, and high-fashion profiles */}
        <button
          onClick={() => {
            // Auto pre-populate WhatsApp from bio if possible or default to a demo number
            setNewProductWhatsApp(currentProfile.instagram || '212600000000');
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-[#0a0a0a] font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-neutral-950 stroke-[3]" />
          <span>List Design Capsule</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-neutral-950 p-4 rounded-2xl border border-neutral-900">
        
        {/* Search Input */}
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-3 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search products, capsule lines, or brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono"
          />
        </div>

        {/* Category Filters scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all whitespace-nowrap border ${
                selectedCategory === cat
                  ? 'bg-white text-neutral-950 border-white font-bold'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader className="w-8 h-8 text-amber-500 animate-spin" />
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
            Synchronizing ZIN Ledger...
          </span>
        </div>
      ) : error ? (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 text-center max-w-md mx-auto space-y-3">
          <p className="text-xs font-mono text-rose-400">{error}</p>
          <button
            onClick={fetchProducts}
            className="text-[11px] font-mono text-amber-500 hover:text-white underline transition-all"
          >
            Retry Ledger Sync
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-neutral-950/40 border border-neutral-900 border-dashed rounded-2xl space-y-4 max-w-xl mx-auto p-8">
          <ShoppingBag className="w-8 h-8 text-neutral-700 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-mono text-white uppercase tracking-wider">No capsules found</h3>
            <p className="text-xs text-neutral-500">
              No luxury pieces match your current query. Be the first to publish a high-end design capsule!
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="text-[10px] font-mono text-amber-500 hover:text-white uppercase tracking-wider font-semibold border border-amber-500/20 hover:border-amber-500 px-3.5 py-1.5 rounded-xl transition-all"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onSelect={(p) => setSelectedProduct(p)} 
            />
          ))}
        </div>
      )}

      {/* List Product Modal (Glassmorphism Overlay) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden shadow-2xl p-6 md:p-8 space-y-6">
            
            {/* Top gold line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-amber-500 uppercase tracking-widest font-bold block">
                  LEDGER PROTOCOL #04
                </span>
                <h3 className="text-xl font-serif text-white tracking-wide">
                  Publish Design Capsule
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Success Animation overlay */}
            {formSuccess ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Check className="w-6 h-6 text-amber-400 animate-pulse" />
                </div>
                <div className="text-center space-y-1">
                  <h4 className="text-sm font-mono text-white uppercase tracking-wider">Capsule Placed Successfully</h4>
                  <p className="text-[11px] font-mono text-neutral-500">Your design is now active in the showroom database.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitProduct} className="space-y-4 text-left">
                
                {formError && (
                  <div className="bg-rose-500/10 border border-rose-500/20 text-[11px] font-mono text-rose-400 p-3 rounded-lg leading-relaxed">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-400 block uppercase">
                      Design / Capsule Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Asymmetrical Satin Suit"
                      required
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono"
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-400 block uppercase">
                      Price (USD $)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 450"
                      required
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-400 block uppercase">
                      Couture Category
                    </label>
                    <select
                      value={newProductCategory}
                      onChange={(e) => setNewProductCategory(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono"
                    >
                      {CATEGORIES.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* WhatsApp contact */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-400 block uppercase">
                      WhatsApp Contact No. (no spaces)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 212600000000"
                      required
                      value={newProductWhatsApp}
                      onChange={(e) => setNewProductWhatsApp(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-neutral-400 block uppercase">
                    Luxury Product Image URL (Unsplash recommended)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newProductImage}
                    onChange={(e) => setNewProductImage(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono"
                  />
                  <span className="text-[9px] font-mono text-neutral-500 block">
                    Leave blank to automatically apply a premium fashion mockup image.
                  </span>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-neutral-400 block uppercase">
                    Capsule Story & Specifications
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe design lines, tailored fits, texture, fabric materials, and sizing guidelines."
                    value={newProductDescription}
                    onChange={(e) => setNewProductDescription(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono resize-none"
                  />
                </div>

                {/* Submit button */}
                <div className="flex gap-3 pt-4 border-t border-neutral-900">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white font-mono text-xs uppercase tracking-wider transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 disabled:text-neutral-500 disabled:bg-neutral-800 font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    {formSubmitting ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-950 animate-ping"></span>
                        Syncing...
                      </>
                    ) : (
                      'Publish Live'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
