/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message, UserRole, UserProfile } from '../types';
import { Send, Check, CheckCheck, MessageSquare, ShieldCheck, Phone, Video, Search, User } from 'lucide-react';

interface MessagingProps {
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  currentProfile: UserProfile;
}

export default function Messaging({
  conversations,
  setConversations,
  currentProfile,
}: MessagingProps) {
  const [activeThreadIndex, setActiveThreadIndex] = useState<number>(0);
  const [typedMessage, setTypedMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTypingReply, setIsTypingReply] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message when conversation or status updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeThreadIndex, isTypingReply]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const currentThread = conversations[activeThreadIndex];
    if (!currentThread) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentProfile.id,
      receiverId: currentThread.otherUser.id,
      content: typedMessage.trim(),
      timestamp: new Date().toISOString(),
      read: true,
    };

    const updatedMessages = [...currentThread.messages, newMessage];

    setConversations(prev =>
      prev.map((thread, index) => {
        if (index === activeThreadIndex) {
          return {
            ...thread,
            messages: updatedMessages,
            lastMessage: newMessage,
          };
        }
        return thread;
      })
    );

    const messageTextSent = typedMessage.trim();
    setTypedMessage('');

    // Trigger mock automatic response
    setIsTypingReply(true);
    setTimeout(() => {
      setIsTypingReply(false);

      const replies: Record<string, string[]> = {
        'Brand': [
          "That sounds brilliant, Aria! We are compiling the portfolio board this afternoon and will flag this message for our Art Director.",
          "Perfect. We will send the exact scheduling slots through the assistant system by tomorrow morning. Have a lovely evening!",
          "Yes, we highly agree. Organic silk textures will fit beautifully into this shoot context!"
        ],
        'Photographer': [
          "Awesome! Let's schedule that studio lookbook test for next Thursday. I will lock in the Leica camera package.",
          "Absolutely, let's make sure our styling is locked in. Let me know what agency approval says!",
          "Excellent! The black and white grain structures will look stunning on your comp card."
        ],
        'Designer': [
          "Thank you for the note! I am finalizing the bio-leather seams right now and would love to get your thoughts on the fitting next week.",
          "Yes, we can definitely customize the pleats. Let's arrange a fit session.",
        ]
      };

      const userRoleType = currentThread.otherUser.role;
      const roleReplies = replies[userRoleType] || [
        "Sounds good! Let's stay in touch and finalize the details as soon as possible.",
        "Spectacular! Looking forward to collaborating."
      ];

      // Grab random reply
      const randomReply = roleReplies[Math.floor(Math.random() * roleReplies.length)];

      const automatedReply: Message = {
        id: `msg_reply_${Date.now()}`,
        senderId: currentThread.otherUser.id,
        receiverId: currentProfile.id,
        content: randomReply,
        timestamp: new Date().toISOString(),
        read: false,
      };

      setConversations(prev =>
        prev.map((thread, index) => {
          if (index === activeThreadIndex) {
            return {
              ...thread,
              messages: [...thread.messages, automatedReply],
              lastMessage: automatedReply,
            };
          }
          return thread;
        })
      );
    }, 2200);
  };

  const activeThread = conversations[activeThreadIndex];

  // Filter threads based on searched contacts
  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleStyle = (role: UserRole) => {
    switch (role) {
      case 'Model': return 'text-amber-400 bg-amber-500/5 border-amber-500/20';
      case 'Brand': return 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20';
      case 'Photographer': return 'text-blue-400 bg-blue-500/5 border-blue-500/20';
      case 'Designer': return 'text-purple-400 bg-purple-500/5 border-purple-500/20';
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[580px] h-[75vh]">
      
      {/* Threads list (35% width) */}
      <div className="md:col-span-4 border-r border-neutral-800 flex flex-col bg-neutral-950/60">
        
        {/* Search header */}
        <div className="p-4 border-b border-neutral-800 space-y-3">
          <span className="text-[10px] font-mono text-amber-500 tracking-widest uppercase block">
            Messages
          </span>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-xs rounded-xl pl-9 pr-4 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700 font-mono"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-neutral-900/40">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-8 h-8 text-neutral-700 mx-auto mb-2" />
              <p className="text-xs font-mono text-neutral-500">No contacts found.</p>
            </div>
          ) : (
            filteredConversations.map((thread, index) => {
              const isActive = conversations.indexOf(thread) === activeThreadIndex;
              const hasUnread = thread.lastMessage && thread.lastMessage.senderId !== currentProfile.id && !thread.lastMessage.read;

              return (
                <button
                  key={thread.otherUser.id}
                  onClick={() => {
                    const originalIndex = conversations.indexOf(thread);
                    setActiveThreadIndex(originalIndex);
                    // Mark as read immediately on click
                    setConversations(prev =>
                      prev.map((t, idx) => {
                        if (idx === originalIndex && t.lastMessage) {
                          return {
                            ...t,
                            lastMessage: { ...t.lastMessage, read: true },
                            messages: t.messages.map(m => ({ ...m, read: true }))
                          };
                        }
                        return t;
                      })
                    );
                  }}
                  className={`w-full text-left p-4 flex gap-3 transition-all ${
                    isActive
                      ? 'bg-neutral-900 border-l-2 border-amber-500'
                      : 'hover:bg-neutral-900/40'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={thread.otherUser.avatar}
                      alt={thread.otherUser.name}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-800"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-neutral-900"></div>
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white truncate">{thread.otherUser.name}</span>
                      <span className="text-[9px] font-mono text-neutral-500 shrink-0">
                        {thread.lastMessage ? new Date(thread.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded border ${getRoleStyle(thread.otherUser.role)}`}>
                        {thread.otherUser.role}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500 truncate">
                        {thread.otherUser.location}
                      </span>
                    </div>

                    {thread.lastMessage && (
                      <p className={`text-[11px] truncate mt-1 ${hasUnread ? 'text-amber-300 font-bold' : 'text-neutral-400'}`}>
                        {thread.lastMessage.senderId === currentProfile.id ? 'You: ' : ''}
                        {thread.lastMessage.content}
                      </p>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main chat window (65% width) */}
      <div className="md:col-span-8 flex flex-col bg-neutral-950">
        {activeThread ? (
          <>
            {/* Thread Header */}
            <div className="p-4 border-b border-neutral-800/80 bg-neutral-900/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={activeThread.otherUser.avatar}
                  alt={activeThread.otherUser.name}
                  className="w-10 h-10 rounded-full object-cover border border-neutral-800"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white block">{activeThread.otherUser.name}</span>
                    <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded border ${getRoleStyle(activeThread.otherUser.role)}`}>
                      {activeThread.otherUser.role}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                    Active on ZIN platform
                  </span>
                </div>
              </div>

              {/* Utility visual icons */}
              <div className="flex items-center gap-2.5 text-neutral-400">
                <button className="p-1.5 hover:text-white hover:bg-neutral-900 rounded-lg transition-all" title="Audio Call via ZIN">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-1.5 hover:text-white hover:bg-neutral-900 rounded-lg transition-all" title="Video Call via ZIN">
                  <Video className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conversation Messages area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
              <div className="text-center py-2.5">
                <span className="text-[9px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-500 px-3 py-1 rounded-full uppercase">
                  Encrypted via Secure JWT Cookies
                </span>
              </div>

              {activeThread.messages.map(msg => {
                const isMe = msg.senderId === currentProfile.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                  >
                    {!isMe && (
                      <img
                        src={activeThread.otherUser.avatar}
                        alt={activeThread.otherUser.name}
                        className="w-7 h-7 rounded-full object-cover border border-neutral-800 shrink-0 mt-0.5"
                      />
                    )}
                    <div className="space-y-1">
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-white text-neutral-950 rounded-tr-none font-sans font-medium'
                            : 'bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-tl-none font-sans'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <div className={`flex items-center gap-1.5 text-[9px] font-mono text-neutral-500 ${isMe ? 'justify-end' : ''}`}>
                        <span>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && (
                          <CheckCheck className="w-3.5 h-3.5 text-amber-500" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTypingReply && (
                <div className="flex gap-2.5 max-w-[80%] mr-auto">
                  <img
                    src={activeThread.otherUser.avatar}
                    alt={activeThread.otherUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-neutral-800 shrink-0 mt-0.5 animate-pulse"
                  />
                  <div className="bg-neutral-900 border border-neutral-800 px-4 py-3 rounded-2xl rounded-tl-none text-xs flex items-center gap-1 text-neutral-400">
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    <span className="font-mono text-[9px] text-neutral-500 uppercase ml-1">{activeThread.otherUser.name} typing...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-800 bg-neutral-900/40">
              <div className="flex gap-3 bg-neutral-950 p-2 rounded-xl border border-neutral-800 focus-within:border-neutral-700">
                <input
                  type="text"
                  placeholder={`Send direct message to ${activeThread.otherUser.name}...`}
                  value={typedMessage}
                  onChange={e => setTypedMessage(e.target.value)}
                  disabled={isTypingReply}
                  className="flex-1 bg-transparent text-xs text-white placeholder-neutral-600 focus:outline-none pl-2.5 font-mono"
                />
                <button
                  type="submit"
                  disabled={!typedMessage.trim() || isTypingReply}
                  className={`p-2.5 rounded-lg transition-all flex items-center justify-center ${
                    typedMessage.trim() && !isTypingReply
                      ? 'bg-amber-500 text-neutral-950 hover:bg-amber-400'
                      : 'bg-neutral-900 text-neutral-600'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <MessageSquare className="w-12 h-12 text-neutral-700 mb-3" />
            <p className="text-sm font-mono text-neutral-400">Select a secure conversation thread to view logs.</p>
          </div>
        )}
      </div>
    </div>
  );
}
