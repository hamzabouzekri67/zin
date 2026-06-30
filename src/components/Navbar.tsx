/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserRole } from '../types';
import { Sparkles, MessageSquare, Briefcase, User, Layers, HelpCircle, Laptop, Radio, ShoppingBag } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  unreadCount: number;
  onOpenAuth: () => void;
}

export default function Navbar({
  currentView,
  setCurrentView,
  currentRole,
  setCurrentRole,
  unreadCount,
  onOpenAuth,
}: NavbarProps) {
  const roles: UserRole[] = ['Model', 'Brand', 'Photographer', 'Designer'];

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'Model':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Brand':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Photographer':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Designer':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
        {/* Branding */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3" id="zin-brand">
            <span className="text-3xl font-black tracking-widest text-white font-serif relative">
              ZIN
              <span className="absolute -top-1 -right-4 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            </span>
            <div className="h-6 w-px bg-neutral-800 hidden sm:block"></div>
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 hidden sm:block uppercase">
              Fashion Ecosystem
            </span>
          </div>
        </div>

        {/* Navigation Actions */}
        <nav className="flex items-center overflow-x-auto gap-1 md:gap-2 no-scrollbar pb-2 md:pb-0">
          <button
            onClick={() => setCurrentView('feed')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all shrink-0 ${
              currentView === 'feed'
                ? 'bg-neutral-900 text-white border border-neutral-800'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" /> Feed
          </button>

          <button
            onClick={() => setCurrentView('marketplace')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all shrink-0 ${
              currentView === 'marketplace'
                ? 'bg-neutral-900 text-white border border-neutral-800'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-amber-500" /> Marketplace
          </button>
          
          <button
            onClick={() => setCurrentView('casting')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all shrink-0 ${
              currentView === 'casting'
                ? 'bg-neutral-900 text-white border border-neutral-800'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
            }`}
          >
            <Briefcase className="w-4 h-4 text-emerald-500" /> Casting
          </button>

          <button
            onClick={() => setCurrentView('messages')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all shrink-0 relative ${
              currentView === 'messages'
                ? 'bg-neutral-900 text-white border border-neutral-800'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-blue-500" /> Chat
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-neutral-950 text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentView('profile')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all shrink-0 ${
              currentView === 'profile'
                ? 'bg-neutral-900 text-white border border-neutral-800'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
            }`}
          >
            <User className="w-4 h-4 text-purple-500" /> Profile
          </button>

          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all shrink-0 ${
              currentView === 'dashboard'
                ? 'bg-neutral-900 text-white border border-neutral-800'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-500" /> Dashboard
          </button>


        </nav>

        {/* Dynamic Role Switcher */}
        <div className="flex items-center gap-3 self-end md:self-center">
          <div className="flex bg-neutral-900 p-1 rounded-lg border border-neutral-800 gap-1">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => {
                  setCurrentRole(r);
                  // Optionally switch view to matching dashboard for better UX
                  setCurrentView('dashboard');
                }}
                className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase transition-all ${
                  currentRole === r
                    ? 'bg-neutral-800 text-white font-bold'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
                title={`Switch profile context to ${r}`}
              >
                {r.substring(0, 3)}
              </button>
            ))}
          </div>

          {/* Premium Gold Sign In Trigger */}
          <button
            onClick={onOpenAuth}
            className="px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-[#0a0a0a] shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
}
