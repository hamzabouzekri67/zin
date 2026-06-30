/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, ArrowLeft, Heart, Shield, Globe, Compass, Film, Award } from 'lucide-react';
import LoginForm from './LoginForm';
import { UserRole } from '../types';

interface AuthLayoutProps {
  onSuccess: (role: UserRole, userName: string) => void;
  onClose: () => void;
}

export default function AuthLayout({ onSuccess, onClose }: AuthLayoutProps) {
  const [campaignIndex, setCampaignIndex] = useState(0);

  const campaigns = [
    {
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000",
      title: "ZIN AUTUMN/WINTER '26",
      subtitle: "The digital luxury collective where world-class agencies find exceptional creative talent.",
      tag: "MILAN COUTURE",
      credits: "Photography by Chen Wu"
    },
    {
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1000",
      title: "AETHERIA COLLECTION",
      subtitle: "Pristine lines, organic fibers, and smart contracts matching models directly to dynamic campaigns.",
      tag: "METROPOLITAN MODERN",
      credits: "Model Styling by Aria Sterling"
    },
    {
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1000",
      title: "BRUTALIST ARCHITECTS",
      subtitle: "Reclaiming the runways. Empowering creators to run self-sovereign digital high-fashion careers.",
      tag: "TOKYO AVANT-GARDE",
      credits: "Campaign Art by Kenji Sato"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] overflow-y-auto flex items-center justify-center min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(180,140,50,0.07),transparent_50%)]"></div>

      {/* Close button to go back to App */}
      <button
        onClick={onClose}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-neutral-400 hover:text-white transition-all text-xs font-mono group py-2 px-3 rounded-full bg-neutral-900/60 border border-neutral-800/80 backdrop-blur"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
        <span>Return to Platform</span>
      </button>

      {/* Main Container */}
      <div className="w-full min-h-screen flex flex-col lg:flex-row">
        
        {/* Left Side: Sophisticated Campaign Side */}
        <div className="w-full lg:w-[55%] relative min-h-[380px] lg:min-h-screen flex flex-col justify-between p-6 lg:p-12 overflow-hidden border-b lg:border-b-0 lg:border-r border-neutral-900">
          
          {/* Campaign Image */}
          <div className="absolute inset-0 z-0 select-none">
            <img
              src={campaigns[campaignIndex].image}
              alt="ZIN Campaign"
              className="w-full h-full object-cover object-center scale-105 filter brightness-[0.45] transition-all duration-1000 ease-out"
              referrerPolicy="no-referrer"
            />
            {/* Elegant overlay gradients matching gold hues */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/40"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/20 to-transparent"></div>
          </div>

          {/* Top Logo / Brand Header */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center font-serif text-[#0a0a0a] font-bold text-sm shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                Z
              </span>
              <span className="font-serif text-lg tracking-[0.2em] font-bold text-white">
                ZIN <span className="text-[9px] font-mono font-normal text-amber-500 tracking-widest pl-1">PREMIUM</span>
              </span>
            </div>
            
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-[9px] font-mono text-neutral-400">Campaigns Active: 142</span>
              <span className="text-neutral-800">|</span>
              <span className="text-[9px] font-mono text-emerald-400">Nodes Secured</span>
            </div>
          </div>

          {/* Middle Carousel text */}
          <div className="relative z-10 my-auto max-w-xl space-y-6 pt-16 lg:pt-0">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span className="text-[9px] font-mono tracking-widest uppercase text-amber-400 font-semibold">
                {campaigns[campaignIndex].tag}
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl lg:text-5xl font-serif text-white tracking-wide leading-tight transition-all duration-700">
                {campaigns[campaignIndex].title}
              </h1>
              <p className="text-sm text-neutral-300 font-light leading-relaxed font-sans max-w-lg">
                {campaigns[campaignIndex].subtitle}
              </p>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2.5 pt-4">
              {campaigns.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCampaignIndex(idx)}
                  className={`h-1.5 transition-all duration-500 rounded-full ${
                    idx === campaignIndex ? 'w-10 bg-amber-400' : 'w-2 bg-neutral-700 hover:bg-neutral-500'
                  }`}
                  aria-label={`Go to campaign ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Bottom Trust Indicators */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-neutral-900/40 text-[10px] font-mono text-neutral-400">
            <span>{campaigns[campaignIndex].credits}</span>
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-amber-500" /> Web3 Sign
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-neutral-500" /> Milan / Tokyo / NYC
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Luxury Interactive Form Side */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center items-center px-6 md:px-12 py-12 lg:py-24 bg-[#0a0a0a] relative">
          
          {/* Premium Glass Card Container */}
          <div className="w-full max-w-md bg-neutral-950/40 backdrop-blur-md border border-neutral-900/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative">
            
            {/* Top golden accent bead */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
            
            <LoginForm onSuccess={onSuccess} />
          </div>

          {/* Subtle Privacy & Compliance notice */}
          <div className="mt-8 text-center text-[10px] font-mono text-neutral-500 max-w-xs space-y-1">
            <p>Protected by ZIN Decentralized Identity Vaults.</p>
            <p className="text-neutral-600">By authenticating, you verify you are of legal age to enter model representations.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
