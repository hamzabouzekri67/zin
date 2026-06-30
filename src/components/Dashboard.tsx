/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserRole, UserProfile, CastingCall, JobApplication } from '../types';
import { Layers, Briefcase, Eye, Users, Award, Camera, Plus, CheckCircle, FileText, Send, UserX, UserCheck, Star, Calendar, MapPin, DollarSign } from 'lucide-react';

interface DashboardProps {
  currentProfile: UserProfile;
  currentRole: UserRole;
  castingCalls: CastingCall[];
  setCastingCalls: React.Dispatch<React.SetStateAction<CastingCall[]>>;
  applications: JobApplication[];
  setApplications: React.Dispatch<React.SetStateAction<JobApplication[]>>;
}

export default function Dashboard({
  currentProfile,
  currentRole,
  castingCalls,
  setCastingCalls,
  applications,
  setApplications,
}: DashboardProps) {
  // Brand form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newComp, setNewComp] = useState('');
  const [newLoc, setNewLoc] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [targetModels, setTargetModels] = useState(true);
  const [targetPhotos, setTargetPhotos] = useState(false);
  const [targetDesigners, setTargetDesigners] = useState(false);
  const [requirementsInput, setRequirementsInput] = useState('');

  const [notification, setNotification] = useState<string | null>(null);

  const handleCreateCasting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const rolesNeeded: UserRole[] = [];
    if (targetModels) rolesNeeded.push('Model');
    if (targetPhotos) rolesNeeded.push('Photographer');
    if (targetDesigners) rolesNeeded.push('Designer');

    const newCall: CastingCall = {
      id: `cast_${Date.now()}`,
      brandId: currentProfile.id,
      brandName: currentProfile.name,
      brandAvatar: currentProfile.avatar,
      title: newTitle,
      description: newDesc,
      requirements: requirementsInput.split(',').map(r => r.trim()).filter(r => r.length > 0),
      location: newLoc || 'Paris, France',
      compensation: newComp || '€1,000/day',
      rolesNeeded: rolesNeeded.length > 0 ? rolesNeeded : ['Model'],
      deadline: newDeadline || '2026-08-01',
      createdAt: new Date().toISOString(),
      applicantsCount: 0,
      hasApplied: false
    };

    setCastingCalls(prev => [newCall, ...prev]);
    
    // Clear Form
    setNewTitle('');
    setNewDesc('');
    setNewComp('');
    setNewLoc('');
    setNewDeadline('');
    setRequirementsInput('');
    
    setNotification('Casting opportunity published successfully on the ZIN Casting Board!');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleApplicationStatus = (appId: string, newStatus: 'Shortlisted' | 'Accepted' | 'Declined') => {
    setApplications(prev =>
      prev.map(app => (app.id === appId ? { ...app, status: newStatus } : app))
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-neutral-800 text-neutral-400 border-neutral-700';
      case 'Shortlisted': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Accepted': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Declined': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default: return 'bg-neutral-800 text-white border-neutral-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* Dynamic Header */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-500/5 border border-neutral-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src={currentProfile.avatar}
            alt={currentProfile.name}
            className="w-16 h-16 rounded-full border-2 border-amber-500/30 object-cover"
          />
          <div>
            <span className="text-xs font-mono text-amber-500 tracking-widest uppercase block mb-0.5">
              Role Dashboard
            </span>
            <h1 className="text-2xl md:text-3xl font-serif text-white tracking-wide">{currentProfile.name}</h1>
            <p className="text-xs text-neutral-400 font-mono mt-1">
              Active Location: <strong className="text-neutral-200">{currentProfile.location}</strong> | Registered Agency: <strong className="text-neutral-200">{currentProfile.details.agency || 'Independent'}</strong>
            </p>
          </div>
        </div>

        <div className="bg-neutral-950 px-4 py-2.5 rounded-xl border border-neutral-800 text-xs font-mono text-neutral-400">
          User Role: <strong className="text-amber-400 uppercase font-bold">{currentRole}</strong>
        </div>
      </div>

      {/* Grid statistics (Adapt based on role) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex items-center justify-between shadow">
          <div>
            <span className="text-[10px] font-mono text-neutral-500 tracking-wider block uppercase">Total Reach</span>
            <span className="text-2xl font-serif text-white block mt-1">
              {(currentProfile.stats.followers / 1000).toFixed(0)}k+
            </span>
          </div>
          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg">
            <Users className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex items-center justify-between shadow">
          <div>
            <span className="text-[10px] font-mono text-neutral-500 tracking-wider block uppercase">Campaigns</span>
            <span className="text-2xl font-serif text-white block mt-1">
              {currentProfile.stats.projectsCompleted} Complete
            </span>
          </div>
          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg">
            <Award className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex items-center justify-between shadow">
          <div>
            <span className="text-[10px] font-mono text-neutral-500 tracking-wider block uppercase">Profile Views</span>
            <span className="text-2xl font-serif text-white block mt-1">4.2k monthly</span>
          </div>
          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg">
            <Eye className="w-5 h-5 text-blue-500" />
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex items-center justify-between shadow">
          <div>
            <span className="text-[10px] font-mono text-neutral-500 tracking-wider block uppercase">Platform Quality</span>
            <span className="text-2xl font-serif text-white block mt-1">
              {currentProfile.stats.rating ? `★ ${currentProfile.stats.rating}` : 'Elite Rating'}
            </span>
          </div>
          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg">
            <Star className="w-5 h-5 text-purple-500" />
          </div>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-xs text-emerald-400 font-mono flex items-center gap-2.5">
          <CheckCircle className="w-4 h-4 shrink-0" /> {notification}
        </div>
      )}

      {/* Main Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Role-based tools / submissions */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* BRAND SPECIFIC: Applicant review board */}
          {currentRole === 'Brand' ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-lg">
              <div>
                <h3 className="text-lg font-serif text-white tracking-wide">Review Casting Applicants</h3>
                <p className="text-xs text-neutral-400">Process and review submissions from candidate models, photographers, and designers.</p>
              </div>

              <div className="space-y-4 max-h-[420px] overflow-y-auto no-scrollbar pr-1">
                {applications.length === 0 ? (
                  <div className="text-center py-10 bg-neutral-950/40 rounded-xl border border-neutral-800">
                    <Users className="w-8 h-8 text-neutral-700 mx-auto mb-2" />
                    <p className="text-xs font-mono text-neutral-500">No applicants submitted to your campaigns yet.</p>
                  </div>
                ) : (
                  applications.map(app => (
                    <div key={app.id} className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={app.applicantAvatar}
                            alt={app.applicantName}
                            className="w-10 h-10 rounded-full object-cover border border-neutral-800"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-medium text-white block">{app.applicantName}</span>
                              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-400">
                                {app.applicantRole}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-neutral-400 block truncate max-w-[280px]">
                              Applied to: <strong className="text-neutral-300">{app.castingTitle}</strong>
                            </span>
                          </div>
                        </div>

                        <span className={`text-[9px] font-mono border px-2 py-0.5 rounded self-start sm:self-center ${getStatusColor(app.status)}`}>
                          {app.status.toUpperCase()}
                        </span>
                      </div>

                      {app.coverLetter && (
                        <div className="bg-neutral-900/60 p-3 rounded-lg border border-neutral-800/40 text-[11px] text-neutral-300 font-mono">
                          <span className="text-[9px] text-neutral-500 block uppercase mb-1">Pitch Cover Letter:</span>
                          "{app.coverLetter}"
                        </div>
                      )}

                      {app.status === 'Pending' && (
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            onClick={() => handleApplicationStatus(app.id, 'Declined')}
                            className="px-2.5 py-1.5 bg-neutral-900 hover:bg-rose-500/10 hover:text-rose-400 border border-neutral-800 hover:border-rose-500/20 text-[10px] font-mono text-neutral-400 rounded transition-all uppercase flex items-center gap-1"
                          >
                            <UserX className="w-3.5 h-3.5" /> Decline
                          </button>
                          <button
                            onClick={() => handleApplicationStatus(app.id, 'Shortlisted')}
                            className="px-2.5 py-1.5 bg-neutral-900 hover:bg-amber-500/10 hover:text-amber-400 border border-neutral-800 hover:border-amber-500/20 text-[10px] font-mono text-neutral-400 rounded transition-all uppercase flex items-center gap-1"
                          >
                            Shortlist
                          </button>
                          <button
                            onClick={() => handleApplicationStatus(app.id, 'Accepted')}
                            className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 hover:text-emerald-950 text-neutral-950 text-[10px] font-mono font-bold rounded transition-all uppercase flex items-center gap-1"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Accept Call
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* MODELS/PHOTOGRAPHERS/DESIGNERS: My casting applications */
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-lg">
              <div>
                <h3 className="text-lg font-serif text-white tracking-wide">My Casting Applications</h3>
                <p className="text-xs text-neutral-400">Track the review status and replies of submitted castings.</p>
              </div>

              <div className="space-y-3.5 max-h-[420px] overflow-y-auto no-scrollbar">
                {applications.filter(app => app.applicantId === currentProfile.id).length === 0 ? (
                  <div className="text-center py-12 bg-neutral-950/40 rounded-xl border border-neutral-800">
                    <Briefcase className="w-8 h-8 text-neutral-700 mx-auto mb-2" />
                    <p className="text-xs font-mono text-neutral-500">You haven't submitted any applications yet.</p>
                  </div>
                ) : (
                  applications
                    .filter(app => app.applicantId === currentProfile.id)
                    .map(app => (
                      <div key={app.id} className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div className="space-y-1">
                          <span className="text-xs font-medium text-white block">{app.castingTitle}</span>
                          <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-neutral-400">
                            <span>Brand: <strong className="text-neutral-300">{app.brandName}</strong></span>
                            <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <span className={`text-[9px] font-mono border px-2.5 py-1 rounded text-center self-start sm:self-center ${getStatusColor(app.status)}`}>
                          STATUS: {app.status.toUpperCase()}
                        </span>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* Model physical card metrics / Photographer specialties / Designer bio materials */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-serif text-white tracking-wide mb-4">Professional Information & Dimensions</h3>
            <div className="grid grid-cols-2 gap-4">
              {currentRole === 'Model' && (
                <>
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                    <span className="text-[10px] font-mono text-neutral-500 block uppercase">Height</span>
                    <span className="text-sm font-semibold text-white block mt-1">{currentProfile.details.height || '179 cm'}</span>
                  </div>
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                    <span className="text-[10px] font-mono text-neutral-500 block uppercase">Measurements</span>
                    <span className="text-sm font-semibold text-white block mt-1">{currentProfile.details.measurements || '84-60-89'}</span>
                  </div>
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                    <span className="text-[10px] font-mono text-neutral-500 block uppercase">Representing Agency</span>
                    <span className="text-xs text-white block mt-1">{currentProfile.details.agency || 'Elite Milan'}</span>
                  </div>
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                    <span className="text-[10px] font-mono text-neutral-500 block uppercase">Composite Card</span>
                    <span className="text-xs text-amber-400 block mt-1 underline cursor-pointer hover:text-white">Verify Comp Card</span>
                  </div>
                </>
              )}

              {currentRole === 'Photographer' && (
                <>
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                    <span className="text-[10px] font-mono text-neutral-500 block uppercase">Primary Style Specialty</span>
                    <span className="text-sm font-semibold text-white block mt-1">{currentProfile.details.specialty || 'High Contrast Editorial'}</span>
                  </div>
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                    <span className="text-[10px] font-mono text-neutral-500 block uppercase">Production Equipment</span>
                    <span className="text-xs text-neutral-300 block mt-1">
                      {currentProfile.details.equipment?.join(', ') || 'Hasselblad, Leica M11'}
                    </span>
                  </div>
                </>
              )}

              {currentRole === 'Designer' && (
                <>
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                    <span className="text-[10px] font-mono text-neutral-500 block uppercase">Design Focus</span>
                    <span className="text-sm font-semibold text-white block mt-1">{currentProfile.details.specialty || 'Sustainable Bio-Textiles'}</span>
                  </div>
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                    <span className="text-[10px] font-mono text-neutral-500 block uppercase">Bio Leather License</span>
                    <span className="text-xs text-emerald-400 font-bold block mt-1">CERTIFIED ACTIVE</span>
                  </div>
                </>
              )}

              {currentRole === 'Brand' && (
                <>
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                    <span className="text-[10px] font-mono text-neutral-500 block uppercase">Founded Year</span>
                    <span className="text-sm font-semibold text-white block mt-1">{currentProfile.details.foundedYear || '2019'}</span>
                  </div>
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                    <span className="text-[10px] font-mono text-neutral-500 block uppercase">Brand Headquarters</span>
                    <span className="text-xs text-white block mt-1">{currentProfile.details.headquarters || 'Paris, France'}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive creator / quick actions */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* BRAND ONLY: Publish a Casting form */}
          {currentRole === 'Brand' && (
            <form onSubmit={handleCreateCasting} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-lg">
              <div className="border-b border-neutral-800 pb-3">
                <span className="text-xs font-mono text-amber-500 uppercase tracking-wider block">Campaign Portal</span>
                <h3 className="text-lg font-serif text-white tracking-wide">Publish Casting Call</h3>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-neutral-400 block uppercase">Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Milan Fashion Week Editorial Runway"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-neutral-400 block uppercase">Description & Context</label>
                  <textarea
                    placeholder="Provide information about the campaign, lookbook and expectations..."
                    required
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white h-20 placeholder-neutral-600 focus:outline-none focus:border-neutral-700 resize-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-400 block uppercase">Compensation</label>
                    <input
                      type="text"
                      placeholder="e.g. €2,000 flat / day"
                      required
                      value={newComp}
                      onChange={e => setNewComp(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-400 block uppercase">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Paris, France"
                      required
                      value={newLoc}
                      onChange={e => setNewLoc(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-400 block uppercase">Application Deadline</label>
                    <input
                      type="date"
                      required
                      value={newDeadline}
                      onChange={e => setNewDeadline(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-700 font-mono text-neutral-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-400 block uppercase">Requirements (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Height 178cm+, Valid Visa"
                      value={requirementsInput}
                      onChange={e => setRequirementsInput(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-neutral-400 block uppercase">Compatible Target Profiles</label>
                  <div className="flex gap-4 p-2 bg-neutral-950 rounded-xl border border-neutral-800/60 justify-around">
                    <label className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-300 cursor-pointer">
                      <input type="checkbox" checked={targetModels} onChange={e => setTargetModels(e.target.checked)} /> Models
                    </label>
                    <label className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-300 cursor-pointer">
                      <input type="checkbox" checked={targetPhotos} onChange={e => setTargetPhotos(e.target.checked)} /> Photographers
                    </label>
                    <label className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-300 cursor-pointer">
                      <input type="checkbox" checked={targetDesigners} onChange={e => setTargetDesigners(e.target.checked)} /> Designers
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-white hover:bg-neutral-200 text-neutral-950 font-bold py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-4"
              >
                Publish Campaign <Plus className="w-4 h-4 text-neutral-950" />
              </button>
            </form>
          )}

          {/* General platform recommendations list */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-lg">
            <h3 className="text-sm font-mono text-neutral-300 uppercase tracking-wider">Top Curated Collaborations</h3>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-800/40">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono text-amber-500">★</span>
                  <div>
                    <span className="text-xs font-medium text-white block">Elite Milan Photographers</span>
                    <span className="text-[9px] font-mono text-neutral-400">8 available studios</span>
                  </div>
                </div>
                <button className="text-[10px] font-mono text-neutral-400 hover:text-white underline">Connect</button>
              </div>

              <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-800/40">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono text-emerald-400">★</span>
                  <div>
                    <span className="text-xs font-medium text-white block">Sustainable Textile Forum</span>
                    <span className="text-[9px] font-mono text-neutral-400">Yuki Tanaka organic patterns</span>
                  </div>
                </div>
                <button className="text-[10px] font-mono text-neutral-400 hover:text-white underline">Join</button>
              </div>

              <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-800/40">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono text-purple-400">★</span>
                  <div>
                    <span className="text-xs font-medium text-white block">Composite Card Assessment</span>
                    <span className="text-[9px] font-mono text-neutral-400">Review metrics of models</span>
                  </div>
                </div>
                <button className="text-[10px] font-mono text-neutral-400 hover:text-white underline">Assess</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
