/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { User, MapPin, Globe, Instagram, PenTool, LayoutGrid, Image as ImageIcon, CheckCircle, Plus, Camera, Sparkles } from 'lucide-react';

interface ProfileManagementProps {
  currentProfile: UserProfile;
  setCurrentProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  currentRole: UserRole;
  profilesMap: Record<string, UserProfile>;
  setProfilesMap: React.Dispatch<React.SetStateAction<Record<string, UserProfile>>>;
}

const NEW_PORTFOLIO_OPTIONS = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=500',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=500',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=500',
  'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&q=80&w=500',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=500',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=500',
];

export default function ProfileManagement({
  currentProfile,
  setCurrentProfile,
  currentRole,
  profilesMap,
  setProfilesMap,
}: ProfileManagementProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(currentProfile.name);
  const [editedBio, setEditedBio] = useState(currentProfile.bio);
  const [editedLoc, setEditedLoc] = useState(currentProfile.location);
  const [editedWeb, setEditedWeb] = useState(currentProfile.website || '');
  const [editedInsta, setEditedInsta] = useState(currentProfile.instagram || '');
  
  // Role specific details
  const [editedHeight, setEditedHeight] = useState(currentProfile.details.height || '');
  const [editedMeas, setEditedMeas] = useState(currentProfile.details.measurements || '');
  const [editedAgency, setEditedAgency] = useState(currentProfile.details.agency || '');
  const [editedSpec, setEditedSpec] = useState(currentProfile.details.specialty || '');

  const [notification, setNotification] = useState<string | null>(null);
  const [showUploadPanel, setShowUploadPanel] = useState(false);

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: UserProfile = {
      ...currentProfile,
      name: editedName,
      bio: editedBio,
      location: editedLoc,
      website: editedWeb,
      instagram: editedInsta,
      details: {
        ...currentProfile.details,
        height: editedHeight || undefined,
        measurements: editedMeas || undefined,
        agency: editedAgency || undefined,
        specialty: editedSpec || undefined,
      },
    };

    setCurrentProfile(updated);
    setProfilesMap(prev => ({
      ...prev,
      [currentRole]: updated,
    }));

    setIsEditing(false);
    setNotification('Profile settings synchronized successfully!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUploadPortfolioItem = (imageUrl: string) => {
    const updatedPortfolio = [...currentProfile.portfolio, imageUrl];
    const updated: UserProfile = {
      ...currentProfile,
      portfolio: updatedPortfolio,
    };

    setCurrentProfile(updated);
    setProfilesMap(prev => ({
      ...prev,
      [currentRole]: updated,
    }));

    setShowUploadPanel(false);
    setNotification('New campaign visual appended to lookbook!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeletePortfolioItem = (index: number) => {
    const updatedPortfolio = currentProfile.portfolio.filter((_, idx) => idx !== index);
    const updated: UserProfile = {
      ...currentProfile,
      portfolio: updatedPortfolio,
    };

    setCurrentProfile(updated);
    setProfilesMap(prev => ({
      ...prev,
      [currentRole]: updated,
    }));
  };

  return (
    <div className="space-y-8">
      {/* Cover Image and Avatar Card */}
      <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-xl">
        <div className="h-44 md:h-60 overflow-hidden relative">
          <img
            src={currentProfile.coverImage || 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1200'}
            alt="Cover background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent"></div>
        </div>

        <div className="px-6 pb-6 pt-0 relative -mt-16 md:-mt-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 text-center md:text-left">
            <img
              src={currentProfile.avatar}
              alt={currentProfile.name}
              className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-neutral-950 object-cover mx-auto md:mx-0 shadow-lg"
            />
            <div className="space-y-1 pb-1">
              <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-bold block">
                ZIN REGISTERED {currentRole}
              </span>
              <h2 className="text-2xl md:text-3xl font-serif text-white tracking-wide">{currentProfile.name}</h2>
              <p className="text-xs text-neutral-400 font-mono flex items-center justify-center md:justify-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500" /> {currentProfile.location}
              </p>
            </div>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-mono border border-neutral-800 px-4 py-2.5 rounded-xl transition-all self-center md:self-end flex items-center gap-1.5"
            >
              <PenTool className="w-3.5 h-3.5" /> Edit Profile & Dimensions
            </button>
          ) : (
            <span className="text-xs font-mono text-neutral-500 self-center md:self-end">Editing Mode Active</span>
          )}
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-xs text-emerald-400 font-mono flex items-center gap-2.5">
          <CheckCircle className="w-4 h-4" /> {notification}
        </div>
      )}

      {/* Main forms / Information detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Profile parameters block */}
        <div className="lg:col-span-5 space-y-6">
          {isEditing ? (
            /* Editing form panel */
            <form onSubmit={handleSaveChanges} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-lg">
              <h3 className="text-sm font-mono text-amber-500 uppercase tracking-wider border-b border-neutral-800 pb-2">
                Edit Bio details
              </h3>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-neutral-400 block uppercase">Display Name</label>
                  <input
                    type="text"
                    required
                    value={editedName}
                    onChange={e => setEditedName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-700 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-neutral-400 block uppercase">Biography / Focus statement</label>
                  <textarea
                    required
                    value={editedBio}
                    onChange={e => setEditedBio(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white h-24 focus:outline-none focus:border-neutral-700 resize-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-neutral-400 block uppercase">Location Hub</label>
                  <input
                    type="text"
                    required
                    value={editedLoc}
                    onChange={e => setEditedLoc(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-700 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-400 block uppercase">Website Portfolio</label>
                    <input
                      type="text"
                      placeholder="e.g. portfolio.com"
                      value={editedWeb}
                      onChange={e => setEditedWeb(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-700 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-400 block uppercase">Instagram handle</label>
                    <input
                      type="text"
                      placeholder="e.g. @username"
                      value={editedInsta}
                      onChange={e => setEditedInsta(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-700 font-mono"
                    />
                  </div>
                </div>

                {/* Role specific editing parameters */}
                {currentRole === 'Model' && (
                  <div className="space-y-3 pt-2 border-t border-neutral-800">
                    <span className="text-[10px] font-mono text-amber-500 uppercase block">Model Metrics</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-neutral-500 block">HEIGHT (cm)</label>
                        <input
                          type="text"
                          value={editedHeight}
                          onChange={e => setEditedHeight(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-neutral-500 block">BUST-WAIST-HIPS</label>
                        <input
                          type="text"
                          value={editedMeas}
                          onChange={e => setEditedMeas(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-neutral-500 block">AGENCY NAME</label>
                      <input
                        type="text"
                        value={editedAgency}
                        onChange={e => setEditedAgency(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                )}

                {(currentRole === 'Photographer' || currentRole === 'Designer') && (
                  <div className="space-y-2 pt-2 border-t border-neutral-800">
                    <span className="text-[10px] font-mono text-amber-500 uppercase block">Styling Specializations</span>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-neutral-500 block">SPECIALTY EXAMPLES</label>
                      <input
                        type="text"
                        value={editedSpec}
                        onChange={e => setEditedSpec(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono py-2 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-white hover:bg-neutral-200 text-neutral-950 font-bold py-2 rounded-xl text-xs font-mono uppercase tracking-wider"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            /* Standard Profile Info Card */
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-5 shadow-lg">
              <div className="space-y-2">
                <h3 className="text-sm font-mono text-amber-500 uppercase tracking-wider">Biography</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">{currentProfile.bio}</p>
              </div>

              {/* Social Channels / Website Info */}
              <div className="space-y-3.5 pt-4 border-t border-neutral-800/60">
                <h3 className="text-sm font-mono text-neutral-400 uppercase tracking-wider">Verified Channels</h3>
                <div className="space-y-2.5 text-xs font-mono">
                  {currentProfile.website && (
                    <a
                      href={`https://${currentProfile.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 text-neutral-300 hover:text-white"
                    >
                      <Globe className="w-4 h-4 text-neutral-500" /> {currentProfile.website}
                    </a>
                  )}
                  {currentProfile.instagram && (
                    <a
                      href={`https://instagram.com/${currentProfile.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 text-neutral-300 hover:text-white"
                    >
                      <Instagram className="w-4 h-4 text-neutral-500" /> {currentProfile.instagram}
                    </a>
                  )}
                  <div className="flex items-center gap-2.5 text-neutral-300">
                    <User className="w-4 h-4 text-neutral-500" /> Professional ID: ZIN-{currentProfile.id.toUpperCase().substring(0,6)}
                  </div>
                </div>
              </div>

              {/* Role specific parameters list */}
              <div className="pt-4 border-t border-neutral-800/60 space-y-3">
                <h3 className="text-sm font-mono text-neutral-400 uppercase tracking-wider">Visual Specifications</h3>
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800/40 grid grid-cols-2 gap-4 text-xs font-mono">
                  {currentRole === 'Model' && (
                    <>
                      <div>
                        <span className="text-[9px] text-neutral-500 block">HEIGHT</span>
                        <span className="text-white mt-0.5 block">{currentProfile.details.height || '179 cm'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-neutral-500 block">MEASUREMENTS</span>
                        <span className="text-white mt-0.5 block">{currentProfile.details.measurements || '84-60-89'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[9px] text-neutral-500 block">REPRESENTING AGENCY</span>
                        <span className="text-white mt-0.5 block">{currentProfile.details.agency || 'Elite Milan'}</span>
                      </div>
                    </>
                  )}

                  {(currentRole === 'Photographer' || currentRole === 'Designer') && (
                    <div className="col-span-2">
                      <span className="text-[9px] text-neutral-500 block">DESIGN/PHOTO SPECIALITY</span>
                      <span className="text-white mt-0.5 block">{currentProfile.details.specialty || 'High Contrast Editorial'}</span>
                    </div>
                  )}

                  {currentRole === 'Brand' && (
                    <>
                      <div>
                        <span className="text-[9px] text-neutral-500 block">FOUNDED YEAR</span>
                        <span className="text-white mt-0.5 block">{currentProfile.details.foundedYear || '2019'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-neutral-500 block">HEADQUARTERS</span>
                        <span className="text-white mt-0.5 block truncate">{currentProfile.details.headquarters || 'Paris, France'}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Portfolio Lookbook Grid */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-serif text-white tracking-wide">Lookbook Portfolio</h3>
              </div>
              <button
                onClick={() => setShowUploadPanel(!showUploadPanel)}
                className="bg-white hover:bg-neutral-200 text-neutral-950 font-bold px-3.5 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider flex items-center gap-1 transition-all"
              >
                Upload Asset <Plus className="w-3 h-3 text-neutral-950" />
              </button>
            </div>

            {/* Simulated file upload chooser panel */}
            {showUploadPanel && (
              <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                    Select a high-resolution campaign image to append:
                  </span>
                  <button onClick={() => setShowUploadPanel(false)} className="text-[10px] text-neutral-500 hover:text-white font-mono">
                    Close
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {NEW_PORTFOLIO_OPTIONS.map((url, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleUploadPortfolioItem(url)}
                      className="h-14 rounded overflow-hidden border border-neutral-800 hover:border-amber-500 transition-all relative group"
                    >
                      <img src={url} alt={`Campaign preset ${index}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-neutral-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="w-4 h-4 text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Lookbook Gallery */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {currentProfile.portfolio.length === 0 ? (
                <div className="col-span-full text-center py-16 bg-neutral-950/40 border border-neutral-800/40 rounded-xl">
                  <ImageIcon className="w-8 h-8 text-neutral-700 mx-auto mb-2" />
                  <p className="text-xs font-mono text-neutral-500">Your visual lookbook is currently empty.</p>
                </div>
              ) : (
                currentProfile.portfolio.map((imgUrl, i) => (
                  <div
                    key={i}
                    className="group relative h-48 md:h-56 bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800/80 hover:border-neutral-700 transition-all shadow"
                  >
                    <img
                      src={imgUrl}
                      alt={`Portfolio asset ${i}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all p-3 flex flex-col justify-between">
                      <button
                        onClick={() => handleDeletePortfolioItem(i)}
                        className="self-end bg-neutral-950/80 hover:bg-rose-900 border border-neutral-800 text-[9px] font-mono px-2 py-1 rounded text-rose-400 hover:text-white transition-all uppercase"
                        title="Delete asset"
                      >
                        Delete
                      </button>
                      <div className="text-[10px] font-mono text-white tracking-wide truncate">
                        Visual Asset #{i+1}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
