/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Post, UserRole, UserProfile } from '../types';
import { Heart, MessageSquare, Send, Tag, Sparkles, Image as ImageIcon, MessageCircle, Share2, Plus, X, Cloud, ExternalLink } from 'lucide-react';

interface DiscoverFeedProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  currentProfile: UserProfile;
  currentRole: UserRole;
}

const PRESET_IMAGES = [
  { id: '1', name: 'Milan Studio', url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=600' },
  { id: '2', name: 'Avant-Garde Pleats', url: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&q=80&w=600' },
  { id: '3', name: 'Luxury Runway', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600' },
  { id: '4', name: 'Monochrome Editorial', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600' },
  { id: '5', name: 'Studio Fitting', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600' },
  { id: '6', name: 'Minimalist Drape', url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=600' },
];

export default function DiscoverFeed({
  posts,
  setPosts,
  currentProfile,
  currentRole,
}: DiscoverFeedProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [newPostTags, setNewPostTags] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [showImageSelector, setShowImageSelector] = useState(false);

  // Extract all unique tags
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags || [])));

  const handleLike = (postId: string) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const isLiked = post.likedByUser;
          return {
            ...post,
            likedByUser: !isLiked,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId: string) => {
    const commentContent = commentInputs[postId]?.trim();
    if (!commentContent) return;

    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [
              ...post.comments,
              {
                id: `comment_${Date.now()}`,
                userId: currentProfile.id,
                userName: currentProfile.name,
                userAvatar: currentProfile.avatar,
                content: commentContent,
                createdAt: new Date().toISOString(),
              },
            ],
          };
        }
        return post;
      })
    );

    // Clear comment input
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    // Automatically expand comments when posting
    setExpandedComments(prev => ({ ...prev, [postId]: true }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const parsedTags = newPostTags
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0);

    const newPost: Post = {
      id: `post_${Date.now()}`,
      userId: currentProfile.id,
      userName: currentProfile.name,
      userAvatar: currentProfile.avatar,
      userRole: currentProfile.role,
      content: newPostContent,
      image: newPostImage || undefined,
      likes: 0,
      likedByUser: false,
      comments: [],
      tags: parsedTags.length > 0 ? parsedTags : ['fashion', currentRole.toLowerCase()],
      createdAt: new Date().toISOString(),
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostContent('');
    setNewPostImage(null);
    setNewPostTags('');
    setShowImageSelector(false);
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags?.includes(selectedTag))
    : posts;

  return (
    <div className="space-y-8">
      {/* Community Tags / Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-neutral-900/40 p-5 rounded-2xl border border-neutral-800">
        <div>
          <span className="text-xs font-mono text-amber-500 tracking-widest uppercase block mb-1">
            ZIN Community
          </span>
          <h2 className="text-xl font-serif text-white tracking-wide">Fashion Discover Feed</h2>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              !selectedTag
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            ALL POSTS
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                selectedTag === tag
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Post Composer */}
      <form onSubmit={handleCreatePost} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-start gap-4">
          <img
            src={currentProfile.avatar}
            alt={currentProfile.name}
            className="w-10 h-10 rounded-full border border-neutral-700 object-cover"
          />
          <div className="flex-1 space-y-3">
            <textarea
              placeholder={`Share your latest project, lookbook, or concept as a ${currentRole}...`}
              value={newPostContent}
              onChange={e => setNewPostContent(e.target.value)}
              className="w-full bg-transparent text-white placeholder-neutral-500 focus:outline-none text-sm resize-none h-20"
              required
            />

            {/* Selected Image Preview */}
            {newPostImage && (
              <div className="relative rounded-xl overflow-hidden border border-neutral-800 max-h-60 bg-neutral-950">
                <img src={newPostImage} alt="Attachment Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setNewPostImage(null)}
                  className="absolute top-2.5 right-2.5 p-1.5 bg-neutral-950/80 hover:bg-neutral-900 text-white rounded-full transition-all border border-neutral-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Natively Integrated Studio Upload & Asset Pipeline UI */}
            <div className="p-5 bg-neutral-950/80 border border-neutral-800/80 rounded-2xl space-y-4 shadow-inner mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  <span className="text-[11px] font-mono tracking-wider uppercase text-amber-400 font-bold">
                    ZIN Studio Upload Pipeline
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Connecting to ZIN High-Performance Studio Asset Database...")}
                  className="text-[10px] font-mono text-neutral-400 hover:text-amber-400 flex items-center gap-1.5 transition-colors group"
                >
                  <span>Studio Library</span>
                  <ExternalLink className="w-3 h-3 text-amber-500 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                {/* Thumbnail Grid */}
                <div className="md:col-span-8 space-y-2.5">
                  <span className="text-[10px] font-mono text-neutral-500 block uppercase tracking-wider">
                    Recent Studio Renderings
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {PRESET_IMAGES.map(img => (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => {
                          setNewPostImage(img.url);
                        }}
                        className={`group relative aspect-[3/4] rounded-lg overflow-hidden border transition-all ${
                          newPostImage === img.url
                            ? 'border-amber-500 ring-2 ring-amber-500/20'
                            : 'border-neutral-800 hover:border-neutral-600'
                        }`}
                        title={`Attach ${img.name}`}
                      >
                        <img src={img.url} alt={img.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-[8px] text-white font-mono uppercase bg-neutral-900/95 px-1.5 py-0.5 rounded border border-neutral-800 font-bold">
                            Select
                          </span>
                        </div>
                        {newPostImage === img.url && (
                          <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                            <span className="bg-amber-500 text-neutral-950 rounded-full h-4 w-4 text-[9px] font-black flex items-center justify-center">✓</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cloud Connector Panel */}
                <div className="md:col-span-4 h-full flex flex-col justify-end space-y-2.5">
                  <span className="text-[10px] font-mono text-neutral-500 block uppercase tracking-wider">
                    Remote Storage
                  </span>
                  <button
                    type="button"
                    onClick={() => alert("Launching Secure Cloud Upload Gateway...")}
                    className="w-full h-14 bg-neutral-900 hover:bg-neutral-900/80 border border-neutral-800/80 hover:border-amber-500/30 text-xs font-mono text-neutral-300 hover:text-white rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-md group active:scale-95 cursor-pointer"
                  >
                    <Cloud className="w-4 h-4 text-amber-500 group-hover:animate-bounce" />
                    <span className="font-bold uppercase tracking-wider text-[10px]">Select from Cloud</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Form Tools */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-800/60 justify-between items-stretch sm:items-center">
              <div className="flex items-center gap-3">
                <span className="text-neutral-500 text-xs font-mono select-none font-bold">#</span>
                <input
                  type="text"
                  placeholder="Tags (comma separated: e.g. milan, luxury)"
                  value={newPostTags}
                  onChange={e => setNewPostTags(e.target.value)}
                  className="bg-transparent text-xs font-mono text-neutral-300 border-none placeholder-neutral-600 focus:outline-none w-full sm:w-[260px]"
                />
              </div>

              <button
                type="submit"
                className="bg-white hover:bg-neutral-200 text-neutral-950 font-bold px-5 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-all uppercase flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Publish Post <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Feed List */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-neutral-900/30 border border-neutral-800/60 rounded-2xl">
            <Sparkles className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
            <p className="text-sm font-mono text-neutral-400">No posts found with #{selectedTag}.</p>
          </div>
        ) : (
          filteredPosts.map(post => {
            const roleBadgeStyle = (role: UserRole) => {
              switch (role) {
                case 'Model': return 'text-amber-400 bg-amber-500/5 border-amber-500/20';
                case 'Brand': return 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20';
                case 'Photographer': return 'text-blue-400 bg-blue-500/5 border-blue-500/20';
                case 'Designer': return 'text-purple-400 bg-purple-500/5 border-purple-500/20';
              }
            };

            return (
              <article key={post.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg transition-all hover:border-neutral-800/80">
                {/* Header info */}
                <div className="p-5 flex items-center justify-between border-b border-neutral-800/40">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.userAvatar}
                      alt={post.userName}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-800"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white hover:underline cursor-pointer">{post.userName}</span>
                        <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border ${roleBadgeStyle(post.userRole)}`}>
                          {post.userRole}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <Share2 className="w-4 h-4 text-neutral-500 hover:text-neutral-300 cursor-pointer" />
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  <p className="text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap">{post.content}</p>

                  {/* Optional Image */}
                  {post.image && (
                    <div className="rounded-xl overflow-hidden border border-neutral-800 max-h-[500px] bg-neutral-950">
                      <img
                        src={post.image}
                        alt="Editorial visual"
                        className="w-full h-full object-cover hover:scale-[1.01] transition-all duration-500"
                      />
                    </div>
                  )}

                  {/* Tag List */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                          className={`text-xs font-mono tracking-wide px-2.5 py-1 rounded-md transition-all ${
                            selectedTag === tag
                              ? 'bg-amber-500 text-neutral-950 font-bold'
                              : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                          }`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Likes / Comments Summary buttons */}
                <div className="px-5 py-4 bg-neutral-950/40 border-t border-neutral-800/40 flex items-center gap-6">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 text-xs font-mono transition-all ${
                      post.likedByUser ? 'text-rose-500' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.likedByUser ? 'fill-current' : ''}`} />
                    <span>{post.likes} Likes</span>
                  </button>

                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-neutral-200 transition-all"
                  >
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    <span>{post.comments.length} Comments</span>
                  </button>
                </div>

                {/* Comment Section (Collapsible drawer layout) */}
                {expandedComments[post.id] && (
                  <div className="bg-neutral-950/80 border-t border-neutral-800 p-5 space-y-4">
                    {/* Add comment input */}
                    <div className="flex gap-3">
                      <img
                        src={currentProfile.avatar}
                        alt="My profile avatar"
                        className="w-8 h-8 rounded-full object-cover border border-neutral-800 shrink-0"
                      />
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          placeholder="Write a supportive comment..."
                          value={commentInputs[post.id] || ''}
                          onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleAddComment(post.id);
                          }}
                          className="flex-1 bg-neutral-900 border border-neutral-800 text-xs rounded-xl px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-700 font-mono"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="p-2 bg-neutral-900 text-neutral-400 hover:text-white rounded-xl border border-neutral-800 transition-all"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Display existing comments */}
                    {post.comments.length === 0 ? (
                      <p className="text-[11px] font-mono text-neutral-500 pl-11">No comments yet. Be the first to start the trend!</p>
                    ) : (
                      <div className="space-y-3.5">
                        {post.comments.map(comment => (
                          <div key={comment.id} className="flex gap-3 pl-11">
                            <img
                              src={comment.userAvatar}
                              alt={comment.userName}
                              className="w-7 h-7 rounded-full object-cover border border-neutral-800 shrink-0"
                            />
                            <div className="bg-neutral-900 border border-neutral-800/50 p-3 rounded-2xl flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-white">{comment.userName}</span>
                                <span className="text-[9px] font-mono text-neutral-500">
                                  {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-300 leading-relaxed">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
