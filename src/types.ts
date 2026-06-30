/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'Model' | 'Brand' | 'Photographer' | 'Designer';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  coverImage?: string;
  bio: string;
  location: string;
  website?: string;
  instagram?: string;
  stats: {
    followers: number;
    following: number;
    projectsCompleted: number;
    rating?: number;
  };
  details: {
    // Role-specific fields
    height?: string; // Model
    measurements?: string; // Model
    agency?: string; // Model
    specialty?: string; // Photographer, Designer
    equipment?: string[]; // Photographer
    foundedYear?: string; // Brand
    headquarters?: string; // Brand
    portfolioUrl?: string;
  };
  portfolio: string[]; // List of images
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  content: string;
  image?: string;
  likes: number;
  likedByUser: boolean;
  comments: Comment[];
  createdAt: string;
  tags?: string[];
}

export interface CastingCall {
  id: string;
  brandId: string;
  brandName: string;
  brandAvatar: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  compensation: string;
  rolesNeeded: UserRole[];
  deadline: string;
  createdAt: string;
  applicantsCount: number;
  hasApplied?: boolean;
}

export interface JobApplication {
  id: string;
  castingId: string;
  castingTitle: string;
  brandName: string;
  applicantId: string;
  applicantName: string;
  applicantRole: UserRole;
  applicantAvatar: string;
  status: 'Pending' | 'Shortlisted' | 'Accepted' | 'Declined';
  appliedAt: string;
  coverLetter?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  otherUser: {
    id: string;
    name: string;
    role: UserRole;
    avatar: string;
    location: string;
  };
  lastMessage?: Message;
  messages: Message[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  brandWhatsAppLink: string;
  brandName: string;
  brandAvatar: string;
  createdAt: string;
}

