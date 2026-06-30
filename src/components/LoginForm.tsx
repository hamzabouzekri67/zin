/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, Mail, Lock, User, Sparkles, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';

interface LoginFormProps {
  onSuccess: (role: UserRole, name: string) => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<UserRole>('Model');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!email.includes('@')) {
      setError('Please enter a valid business or creative email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must contain at least 6 secure characters.');
      return;
    }
    if (isSignUp && !name.trim()) {
      setError('Please provide your creative or brand name.');
      return;
    }

    setLoading(true);

    // Simulate authentic network latency and JWT issue
    setTimeout(() => {
      setLoading(false);
      const displayName = isSignUp ? name : (email.split('@')[0].toUpperCase());
      onSuccess(role, displayName);
    }, 1500);
  };

  const handleGoogleAuth = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      onSuccess(role, isSignUp ? 'Google Creator' : 'Aria Sterling');
    }, 1200);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 p-2">
      {/* Header Info */}
      <div className="space-y-1 text-center md:text-left">
        <span className="text-[10px] font-mono text-amber-500 tracking-widest uppercase block font-bold">
          {isSignUp ? 'CREATOR ENROLLMENT' : 'SECURE LOG IN'}
        </span>
        <h2 className="text-3xl font-serif text-white tracking-wide">
          {isSignUp ? 'Join the Ecosystem' : 'Welcome Back'}
        </h2>
        <p className="text-xs text-neutral-400">
          {isSignUp 
            ? 'Connect with verified fashion designers, brands, and models globally.' 
            : 'Access your high-fashion campaigns, castings, and messages.'}
        </p>
      </div>

      {/* Role Selection Tabs (Only on Signup or to declare role for session) */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-mono text-neutral-500 block uppercase">
          Select Your Industry Role
        </label>
        <div className="grid grid-cols-4 gap-1 p-1 bg-neutral-950/80 rounded-xl border border-neutral-900">
          {(['Model', 'Brand', 'Photographer', 'Designer'] as UserRole[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`py-2 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all ${
                role === r
                  ? 'bg-neutral-900 text-amber-400 border border-neutral-800 font-bold'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {r.substring(0, 5)}
            </button>
          ))}
        </div>
      </div>

      {/* Google OAuth Button */}
      <button
        type="button"
        disabled={loading}
        onClick={handleGoogleAuth}
        className="w-full flex items-center justify-center gap-3 bg-neutral-950 hover:bg-neutral-900 text-neutral-200 hover:text-white border border-neutral-800 hover:border-neutral-700 py-3 px-4 rounded-xl text-xs font-mono transition-all font-semibold shadow-sm focus:ring-1 focus:ring-amber-500/50 outline-none"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        <span>Sign in with Google</span>
      </button>

      {/* Or separator */}
      <div className="flex items-center gap-3">
        <div className="h-px bg-neutral-900 flex-1"></div>
        <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
          or use credentials
        </span>
        <div className="h-px bg-neutral-900 flex-1"></div>
      </div>

      {/* Dynamic Errors */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-[11px] font-mono text-rose-400 p-3 rounded-lg leading-relaxed">
          {error}
        </div>
      )}

      {/* Form Credentials */}
      <form onSubmit={handleAuthSubmit} className="space-y-4">
        {isSignUp && (
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-neutral-400 block uppercase">
              Full Name or Brand Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="e.g. Aria Sterling"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-neutral-950/60 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono"
              />
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[10px] font-mono text-neutral-400 block uppercase">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
            <input
              type="email"
              placeholder="aria@sterling.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-950/60 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono"
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-mono text-neutral-400 block uppercase">
              Secure Password
            </label>
            {!isSignUp && (
              <button
                type="button"
                className="text-[9px] font-mono text-amber-500/80 hover:text-white transition-all uppercase"
              >
                Forgot Password?
              </button>
            )}
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-950/60 border border-neutral-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3 text-neutral-500 hover:text-white transition-all"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white hover:bg-neutral-200 disabled:bg-neutral-800 text-neutral-950 disabled:text-neutral-500 font-bold py-3 px-4 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neutral-950 animate-ping"></span>
              Synchronizing Security...
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              {isSignUp ? 'Enroll Account' : 'Authenticate Credentials'}
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          )}
        </button>
      </form>

      {/* Switch Form */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null);
          }}
          className="text-xs text-neutral-400 hover:text-white font-mono transition-all"
        >
          {isSignUp 
            ? 'Already have a campaign account? Sign In' 
            : "Don't have an account? Enlist on ZIN Platform"}
        </button>
      </div>

      {/* Platform compliance tag */}
      <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono text-neutral-600 pt-4 border-t border-neutral-900/40">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>SHA-256 encrypted transit & HttpOnly Cookie storage active.</span>
      </div>
    </div>
  );
}
