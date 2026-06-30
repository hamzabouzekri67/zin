/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CastingCall, JobApplication, UserRole, UserProfile } from '../types';
import { Briefcase, MapPin, Calendar, Clock, Sparkles, Filter, CheckCircle2, UserCheck, ChevronRight, X, DollarSign, Send } from 'lucide-react';

interface CastingBoardProps {
  castingCalls: CastingCall[];
  setCastingCalls: React.Dispatch<React.SetStateAction<CastingCall[]>>;
  applications: JobApplication[];
  setApplications: React.Dispatch<React.SetStateAction<JobApplication[]>>;
  currentProfile: UserProfile;
  currentRole: UserRole;
}

export default function CastingBoard({
  castingCalls,
  setCastingCalls,
  applications,
  setApplications,
  currentProfile,
  currentRole,
}: CastingBoardProps) {
  const [selectedCasting, setSelectedCasting] = useState<CastingCall | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Compatible'>('Compatible');

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCasting) return;

    // Check if already applied
    const alreadyApplied = applications.some(
      app => app.castingId === selectedCasting.id && app.applicantId === currentProfile.id
    );
    if (alreadyApplied) return;

    // Create a new application record
    const newApplication: JobApplication = {
      id: `app_${Date.now()}`,
      castingId: selectedCasting.id,
      castingTitle: selectedCasting.title,
      brandName: selectedCasting.brandName,
      applicantId: currentProfile.id,
      applicantName: currentProfile.name,
      applicantRole: currentProfile.role,
      applicantAvatar: currentProfile.avatar,
      status: 'Pending',
      appliedAt: new Date().toISOString(),
      coverLetter: coverLetter.trim() || undefined,
    };

    setApplications(prev => [newApplication, ...prev]);

    // Update the casting call state (increment count and set hasApplied)
    setCastingCalls(prev =>
      prev.map(call => {
        if (call.id === selectedCasting.id) {
          return {
            ...call,
            applicantsCount: call.applicantsCount + 1,
            hasApplied: true,
          };
        }
        return call;
      })
    );

    // Clean up modals
    setCoverLetter('');
    setShowApplyModal(false);
    setSelectedCasting(null);
  };

  // Filter casting calls
  const filteredCastingCalls = castingCalls.filter(call => {
    if (roleFilter === 'Compatible') {
      return call.rolesNeeded.includes(currentRole);
    }
    return true; // Show all
  });

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'Model': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Brand': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Photographer': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'Designer': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter Switches */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900/40 p-5 rounded-2xl border border-neutral-800">
        <div>
          <span className="text-xs font-mono text-emerald-500 tracking-widest uppercase block mb-1">
            Casting & Gigs Board
          </span>
          <h2 className="text-xl font-serif text-white tracking-wide">Fashion Opportunities</h2>
          <p className="text-xs text-neutral-400 mt-1">Connect directly with luxury brands hosting Milan, Paris and Tokyo collections.</p>
        </div>

        <div className="flex items-center bg-neutral-950 p-1.5 rounded-xl border border-neutral-800 gap-1 self-start md:self-center">
          <span className="text-[10px] font-mono text-neutral-400 px-2.5 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <button
            onClick={() => setRoleFilter('Compatible')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              roleFilter === 'Compatible'
                ? 'bg-neutral-800 text-amber-400 font-bold border border-neutral-700/60'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Saves for {currentRole}s
          </button>
          <button
            onClick={() => setRoleFilter('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              roleFilter === 'All'
                ? 'bg-neutral-800 text-white font-bold border border-neutral-700/60'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Show All Casting
          </button>
        </div>
      </div>

      {/* Grid of Casting Calls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCastingCalls.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-neutral-900/30 border border-neutral-800/60 rounded-2xl">
            <Briefcase className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
            <p className="text-sm font-mono text-neutral-400">
              No matching casting calls needing a <strong className="text-neutral-200">{currentRole}</strong> currently.
            </p>
            <button
              onClick={() => setRoleFilter('All')}
              className="mt-4 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-xs font-mono text-amber-400 border border-neutral-800 rounded-lg transition-all"
            >
              Browse All General Gigs ({castingCalls.length})
            </button>
          </div>
        ) : (
          filteredCastingCalls.map(call => {
            const hasApplied = applications.some(app => app.castingId === call.id && app.applicantId === currentProfile.id);

            return (
              <div
                key={call.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Brand Profile & Meta */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={call.brandAvatar}
                        alt={call.brandName}
                        className="w-8 h-8 rounded-full object-cover border border-neutral-800"
                      />
                      <div>
                        <span className="text-xs font-medium text-white block">{call.brandName}</span>
                        <span className="text-[9px] font-mono text-neutral-500">Released recently</span>
                      </div>
                    </div>
                    {hasApplied && (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3" /> Applied
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-serif text-white tracking-wide">{call.title}</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">{call.description}</p>
                  </div>

                  {/* Technical Parameters */}
                  <div className="grid grid-cols-2 gap-3.5 pt-1 text-[11px] font-mono">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">{call.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-400">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate text-emerald-400/90 font-medium">{call.compensation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-400 col-span-2">
                      <Clock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span>Deadline: <strong className="text-neutral-300">{call.deadline}</strong></span>
                    </div>
                  </div>

                  {/* Targeted Roles */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[9px] font-mono text-neutral-500 mr-1 uppercase">Roles Needed:</span>
                    {call.rolesNeeded.map(role => (
                      <span
                        key={role}
                        className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border ${getRoleColor(role)}`}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-800/60 pt-4 mt-auto">
                  <span className="text-[10px] font-mono text-neutral-500">
                    Active Applicants: <strong className="text-neutral-300">{call.applicantsCount}</strong>
                  </span>

                  <button
                    onClick={() => setSelectedCasting(call)}
                    className="text-xs font-mono text-amber-400 hover:text-white flex items-center gap-1 group transition-all"
                  >
                    View details & Apply <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Casting Detail and Apply Overlay Modal */}
      {selectedCasting && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl relative">
            <button
              onClick={() => {
                setSelectedCasting(null);
                setShowApplyModal(false);
              }}
              className="absolute top-4 right-4 p-2 bg-neutral-950/60 text-neutral-400 hover:text-white rounded-lg transition-all border border-neutral-800/80"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Banner/Header */}
            <div className="p-6 border-b border-neutral-800 bg-neutral-950/40">
              <span className="text-xs font-mono text-amber-500 tracking-wider uppercase block mb-1">
                Casting Specification
              </span>
              <h3 className="text-2xl font-serif text-white tracking-wide">{selectedCasting.title}</h3>
              <div className="flex items-center gap-3 mt-4">
                <img
                  src={selectedCasting.brandAvatar}
                  alt={selectedCasting.brandName}
                  className="w-8 h-8 rounded-full object-cover border border-neutral-800"
                />
                <div>
                  <span className="text-xs text-white font-medium block">{selectedCasting.brandName}</span>
                  <span className="text-[10px] font-mono text-neutral-400">Verified Brand Client</span>
                </div>
              </div>
            </div>

            {/* Details Body */}
            <div className="p-6 space-y-6">
              {/* Core Information Grid */}
              <div className="grid grid-cols-2 gap-4 bg-neutral-950/60 p-4 rounded-xl border border-neutral-800/80">
                <div>
                  <span className="text-[9px] font-mono text-neutral-500 block uppercase">Location</span>
                  <span className="text-xs text-white font-mono flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" /> {selectedCasting.location}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-neutral-500 block uppercase">Compensation</span>
                  <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1.5 mt-0.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> {selectedCasting.compensation}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-neutral-500 block uppercase">Deadline</span>
                  <span className="text-xs text-white font-mono flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" /> {selectedCasting.deadline}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-neutral-500 block uppercase">Applicants currently</span>
                  <span className="text-xs text-neutral-300 font-mono flex items-center gap-1.5 mt-0.5">
                    <Briefcase className="w-3.5 h-3.5 text-neutral-400" /> {selectedCasting.applicantsCount} candidates
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400">About the Gig:</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">{selectedCasting.description}</p>
              </div>

              {/* Requirements Bullet points */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400">Required Credentials:</h4>
                <ul className="space-y-2 pl-4">
                  {selectedCasting.requirements.map((req, i) => (
                    <li key={i} className="text-xs text-neutral-300 list-disc leading-relaxed">
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-neutral-500 block uppercase">Target Candidates</span>
                  <div className="flex gap-1.5 mt-1">
                    {selectedCasting.rolesNeeded.map(role => (
                      <span
                        key={role}
                        className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border ${getRoleColor(role)}`}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {applications.some(app => app.castingId === selectedCasting.id && app.applicantId === currentProfile.id) ? (
                  <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono px-4 py-2.5 rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> You have applied
                  </div>
                ) : (
                  <div>
                    {!showApplyModal ? (
                      <button
                        onClick={() => setShowApplyModal(true)}
                        className="bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-mono font-bold tracking-wider px-5 py-3 rounded-xl transition-all uppercase"
                      >
                        Apply for this Role
                      </button>
                    ) : (
                      <span className="text-xs font-mono text-neutral-400">Write custom cover letter below:</span>
                    )}
                  </div>
                )}
              </div>

              {/* Expandable Cover Letter Block */}
              {showApplyModal && (
                <form onSubmit={handleApplySubmit} className="space-y-4 pt-4 border-t border-neutral-800">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-neutral-400 block uppercase">Cover Letter / Pitch</label>
                    <textarea
                      placeholder="Explain your relevant campaigns, sizes, camera equipment or lookbooks, and why you are the perfect addition..."
                      value={coverLetter}
                      onChange={e => setCoverLetter(e.target.value)}
                      required
                      className="w-full h-24 bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700 resize-none font-mono"
                    />
                  </div>
                  <div className="flex justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShowApplyModal(false)}
                      className="px-4 py-2 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs font-mono rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-mono font-bold tracking-wider rounded-lg transition-all uppercase flex items-center gap-1.5"
                    >
                      Submit Application <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
