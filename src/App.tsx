/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserRole, UserProfile, Post, CastingCall, JobApplication, Conversation } from './types';
import {
  INITIAL_PROFILES,
  INITIAL_POSTS,
  INITIAL_CASTING_CALLS,
  INITIAL_APPLICATIONS,
  INITIAL_CONVERSATIONS,
} from './data';

import Navbar from './components/Navbar';
import DiscoverFeed from './components/DiscoverFeed';
import CastingBoard from './components/CastingBoard';
import Dashboard from './components/Dashboard';
import Messaging from './components/Messaging';
import ProfileManagement from './components/ProfileManagement';
import DeveloperHub from './components/DeveloperHub';
import AuthLayout from './components/AuthLayout';
import Marketplace from './components/Marketplace';

import { Sparkles, HelpCircle, ChevronRight, Briefcase, Mail, CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('Model');
  const [profilesMap, setProfilesMap] = useState<Record<string, UserProfile>>(INITIAL_PROFILES);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [castingCalls, setCastingCalls] = useState<CastingCall[]>(INITIAL_CASTING_CALLS);
  const [applications, setApplications] = useState<JobApplication[]>(INITIAL_APPLICATIONS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [currentView, setCurrentView] = useState<string>('feed');
  const [showAuthPortal, setShowAuthPortal] = useState(false);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  // Dynamic profile lookup depending on selected active role context
  const currentProfile = profilesMap[currentRole];

  const handleAuthSuccess = (selectedRole: UserRole, userName: string) => {
    // 1. Set role
    setCurrentRole(selectedRole);
    // 2. Update display name in user's profile context
    setProfilesMap(prev => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        name: userName
      }
    }));
    // 3. Set success notification
    setAuthSuccessMsg(`Successfully authenticated as ${userName} (${selectedRole}). Custom JWT claims generated!`);
    // 4. Hide auth portal
    setShowAuthPortal(false);
    // 5. Navigate to appropriate view (dashboard or feed)
    setCurrentView('dashboard');

    // Auto-fade success message
    setTimeout(() => {
      setAuthSuccessMsg(null);
    }, 6000);
  };

  // Calculate global unread messages for badges
  const unreadCount = conversations.reduce((acc, conv) => {
    if (conv.lastMessage && conv.lastMessage.senderId !== currentProfile.id && !conv.lastMessage.read) {
      return acc + 1;
    }
    return acc;
  }, 0);

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col selection:bg-amber-500 selection:text-neutral-950">
      
      {/* Premium Top Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        unreadCount={unreadCount}
        onOpenAuth={() => setShowAuthPortal(true)}
      />

      {/* Auth Success Notification Banner */}
      {authSuccessMsg && (
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-4">
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-yellow-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between gap-4 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="space-y-0.5">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
                  IDENTITY SECURED
                </span>
                <p className="text-xs text-neutral-200 font-mono">
                  {authSuccessMsg}
                </p>
              </div>
            </div>
            <button
              onClick={() => setAuthSuccessMsg(null)}
              className="text-neutral-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Auth Modal/Portal Overlay if open */}
      {showAuthPortal && (
        <AuthLayout
          onSuccess={handleAuthSuccess}
          onClose={() => setShowAuthPortal(false)}
        />
      )}

      {/* Main Content Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8">
        
        {/* Active Route Render Guard */}
        <div className="space-y-6">
          {currentView === 'feed' && (
            <DiscoverFeed
              posts={posts}
              setPosts={setPosts}
              currentProfile={currentProfile}
              currentRole={currentRole}
            />
          )}

          {currentView === 'marketplace' && (
            <Marketplace
              currentProfile={currentProfile}
              currentRole={currentRole}
            />
          )}

          {currentView === 'casting' && (
            <CastingBoard
              castingCalls={castingCalls}
              setCastingCalls={setCastingCalls}
              applications={applications}
              setApplications={setApplications}
              currentProfile={currentProfile}
              currentRole={currentRole}
            />
          )}

          {currentView === 'messages' && (
            <Messaging
              conversations={conversations}
              setConversations={setConversations}
              currentProfile={currentProfile}
            />
          )}

          {currentView === 'profile' && (
            <ProfileManagement
              currentProfile={currentProfile}
              setCurrentProfile={(p) => {
                setProfilesMap(prev => ({ ...prev, [currentRole]: p }));
              }}
              currentRole={currentRole}
              profilesMap={profilesMap}
              setProfilesMap={setProfilesMap}
            />
          )}

          {currentView === 'dashboard' && (
            <Dashboard
              currentProfile={currentProfile}
              currentRole={currentRole}
              castingCalls={castingCalls}
              setCastingCalls={setCastingCalls}
              applications={applications}
              setApplications={setApplications}
            />
          )}

          {currentView === 'dev-hub' && (
            <DeveloperHub />
          )}
        </div>
      </main>

      {/* Luxury Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-8 px-4 md:px-8 mt-12 text-center text-xs font-mono text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>
            © {new Date().getFullYear()} ZIN Fashion Ecosystem Inc. All creative content protected by JWT Security.
          </span>
          <div className="flex gap-4">
            <button onClick={() => setCurrentView('dev-hub')} className="hover:text-white transition-all">
              Security Guides
            </button>
            <span className="text-neutral-800">|</span>
            <button onClick={() => setCurrentView('dev-hub')} className="hover:text-white transition-all">
              Prisma Model Specs
            </button>
            <span className="text-neutral-800">|</span>
            <button onClick={() => setCurrentView('dev-hub')} className="hover:text-white transition-all">
              Google OAuth REST API
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

