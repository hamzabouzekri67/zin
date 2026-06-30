/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, Post, CastingCall, JobApplication, Conversation } from './types';

// Let's define the primary user. The user can switch roles to view different dashboard perspectives.
export const INITIAL_PROFILES: Record<string, UserProfile> = {
  'Model': {
    id: 'user_model_1',
    name: 'Aria Sterling',
    role: 'Model',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    coverImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1200',
    bio: 'International editorial and runway model. Represented by Elite Milan & Next Paris. Focused on sustainable haute couture and experimental streetwear.',
    location: 'Milan, Italy',
    website: 'www.ariasterling.com',
    instagram: '@ariasterling',
    stats: {
      followers: 142000,
      following: 820,
      projectsCompleted: 34,
      rating: 4.9
    },
    details: {
      height: '179 cm / 5\'10.5"',
      measurements: '84-60-89',
      agency: 'Elite Models Milan',
      portfolioUrl: 'ariasterling.com/portfolio'
    },
    portfolio: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&q=80&w=500'
    ]
  },
  'Brand': {
    id: 'user_brand_1',
    name: 'VÉLANTE Paris',
    role: 'Brand',
    avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=300',
    coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200',
    bio: 'Contemporary Parisian luxury house. Creating elegant architectural ready-to-wear with organic structures and artisanal silk fabrics.',
    location: 'Paris, France',
    website: 'www.velante-paris.com',
    instagram: '@velanteparis',
    stats: {
      followers: 520000,
      following: 110,
      projectsCompleted: 85,
      rating: 5.0
    },
    details: {
      foundedYear: '2019',
      headquarters: 'Rue du Faubourg Saint-Honoré, Paris',
      portfolioUrl: 'velante-paris.com/lookbook'
    },
    portfolio: [
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=500'
    ]
  },
  'Photographer': {
    id: 'user_photo_1',
    name: 'Laurent Mercer',
    role: 'Photographer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200',
    bio: 'Cinematic fashion photographer and director. Specializing in high-contrast analog aesthetics, urban light play, and intimate black & white editorial captures.',
    location: 'New York, USA',
    website: 'www.laurentmercer.com',
    instagram: '@laurentmercer',
    stats: {
      followers: 98000,
      following: 410,
      projectsCompleted: 62,
      rating: 4.8
    },
    details: {
      specialty: 'Editorial & High-Contrast Black/White',
      equipment: ['Hasselblad H6D', 'Leica M11', 'Arri Alexa Mini'],
      portfolioUrl: 'laurentmercer.com/editorial'
    },
    portfolio: [
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=500'
    ]
  },
  'Designer': {
    id: 'user_design_1',
    name: 'Yuki Tanaka',
    role: 'Designer',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=300',
    coverImage: 'https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&q=80&w=1200',
    bio: 'Avant-garde fashion designer. Crafting architectural silhouettes blending traditional Japanese origami structures with premium bio-degradable fibers.',
    location: 'Tokyo, Japan',
    website: 'www.yukitanaka-studio.com',
    instagram: '@yukitanakadesign',
    stats: {
      followers: 125000,
      following: 300,
      projectsCompleted: 19,
      rating: 4.9
    },
    details: {
      specialty: 'Avant-garde Tailoring & Sustainable Bio-Textiles',
      portfolioUrl: 'yukitanaka.tokyo/collections'
    },
    portfolio: [
      'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=500'
    ]
  }
};

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    userId: 'user_photo_1',
    userName: 'Laurent Mercer',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    userRole: 'Photographer',
    content: 'Captured Aria Sterling for VÉLANTE Paris Autumn Collection. The focus was architectural minimalism and organic lighting at twilight in Paris. Film stock: Portra 400.',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800',
    likes: 1248,
    likedByUser: false,
    tags: ['editorial', 'paris', 'haute-couture', 'portra400'],
    createdAt: '2026-06-25T14:30:00Z',
    comments: [
      {
        id: 'comment_1',
        userId: 'user_model_1',
        userName: 'Aria Sterling',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
        content: 'An absolute dream working with you, Laurent! That twilight reflection is pure magic.',
        createdAt: '2026-06-25T14:45:00Z'
      },
      {
        id: 'comment_2',
        userId: 'user_brand_1',
        userName: 'VÉLANTE Paris',
        userAvatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=100',
        content: 'Breathtaking capture! This perfectly encapsulates the aesthetic structure of our Autumn line.',
        createdAt: '2026-06-25T15:10:00Z'
      }
    ]
  },
  {
    id: 'post_2',
    userId: 'user_design_1',
    userName: 'Yuki Tanaka',
    userAvatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=100',
    userRole: 'Designer',
    content: 'Extremely proud of this pleated sculptural gown made completely from sustainable mushroom mycelium leather and organic silk. Designed with parametric folding techniques.',
    image: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&q=80&w=800',
    likes: 852,
    likedByUser: false,
    tags: ['sustainability', 'mycelium', 'avantgarde', 'sculpturalfashion'],
    createdAt: '2026-06-24T10:15:00Z',
    comments: [
      {
        id: 'comment_3',
        userId: 'user_model_1',
        userName: 'Aria Sterling',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
        content: 'Unbelievable texture, Yuki! I would love to model this for an upcoming shoot or runway opportunity.',
        createdAt: '2026-06-24T11:00:00Z'
      }
    ]
  },
  {
    id: 'post_3',
    userId: 'user_brand_1',
    userName: 'VÉLANTE Paris',
    userAvatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=100',
    userRole: 'Brand',
    content: 'Milan Fashion Week schedule confirmed! We will be debuting the "Stasis & Motion" collection on September 24th. Casting is now officially open on ZIN. Models, Photographers, and Stylists can apply via our Casting section.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
    likes: 2190,
    likedByUser: true,
    tags: ['milanfashionweek', 'runway', 'casting', 'velanteparis'],
    createdAt: '2026-06-23T18:00:00Z',
    comments: []
  }
];

export const INITIAL_CASTING_CALLS: CastingCall[] = [
  {
    id: 'cast_1',
    brandId: 'user_brand_1',
    brandName: 'VÉLANTE Paris',
    brandAvatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=100',
    title: 'Milan Fashion Week Runway - "Stasis & Motion"',
    description: 'VÉLANTE is looking for professional runway models and lead backstage photographers to capture the essence of our landmark SS27 show in Milan. The collection focuses on high-contrast architectural movement.',
    requirements: [
      'Models: Height: 177cm+ (Female), 185cm+ (Male)',
      'Photographers: Experience shooting behind-the-scenes with analog/medium format digital gear',
      'Must have full availability from Sept 22 to Sept 25 in Milan',
      'Professional portfolio and agency or high-quality freelance representation'
    ],
    location: 'Milan, Italy',
    compensation: '€2,500/day + flights & luxury hotel lodging',
    rolesNeeded: ['Model', 'Photographer'],
    deadline: '2026-08-15',
    createdAt: '2026-06-23T18:00:00Z',
    applicantsCount: 42,
    hasApplied: false
  },
  {
    id: 'cast_2',
    brandId: 'user_brand_1',
    brandName: 'VÉLANTE Paris',
    brandAvatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=100',
    title: 'Autumn Lookbook Editorial Shoot',
    description: 'Looking for an Avant-Garde designer collaborator and visual models for an experimental studio shoot. The project explores eco-luxury and biomaterials, to be published in Harper\'s Bazaar.',
    requirements: [
      'Designers: Ready-made avant-garde pieces incorporating sustainable elements',
      'Models: Expressive posing, comfortable with artistic styling',
      'Located in or willing to travel to Paris',
      'Flexible and highly collaborative attitude'
    ],
    location: 'Paris Studio, France',
    compensation: '€1,800 total flat rate + publication credits',
    rolesNeeded: ['Model', 'Designer'],
    deadline: '2026-07-20',
    createdAt: '2026-06-25T09:00:00Z',
    applicantsCount: 15,
    hasApplied: false
  },
  {
    id: 'cast_3',
    brandId: 'user_brand_1',
    brandName: 'VÉLANTE Paris',
    brandAvatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=100',
    title: 'Streetwear Fusion Campaign Video',
    description: 'Casting models and hiring a skilled motion-photographer / videographer for an urban high-fashion streetwear capsule collection shoot.',
    requirements: [
      'Models with high dynamic range movement and parkour or professional dancing background is a plus',
      'Videographer with high-speed cameras and modern grading tools',
      'Tokyo-based or immediate transit capability'
    ],
    location: 'Tokyo (Shibuya & Shinjuku), Japan',
    compensation: '$2,000 flat project rate',
    rolesNeeded: ['Model', 'Photographer'],
    deadline: '2026-07-30',
    createdAt: '2026-06-24T11:00:00Z',
    applicantsCount: 8,
    hasApplied: false
  }
];

export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'app_1',
    castingId: 'cast_1',
    castingTitle: 'Milan Fashion Week Runway - "Stasis & Motion"',
    brandName: 'VÉLANTE Paris',
    applicantId: 'user_model_1',
    applicantName: 'Aria Sterling',
    applicantRole: 'Model',
    applicantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
    status: 'Shortlisted',
    appliedAt: '2026-06-24T12:30:00Z',
    coverLetter: 'I would be absolutely thrilled to represent VÉLANTE in Milan! Having walked for Next and Milan Fashion Week previously, I feel that my pacing and high editorial background align with the "Stasis & Motion" architectural spirit.'
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    otherUser: {
      id: 'user_brand_1',
      name: 'VÉLANTE Paris',
      role: 'Brand',
      avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=100',
      location: 'Paris, France'
    },
    messages: [
      {
        id: 'msg_1',
        senderId: 'user_brand_1',
        receiverId: 'user_model_1',
        content: 'Hi Aria! We loved your runway portfolio. Are you available for a callback session in Milan on August 18th?',
        timestamp: '2026-06-25T16:00:00Z',
        read: true
      },
      {
        id: 'msg_2',
        senderId: 'user_model_1',
        receiverId: 'user_brand_1',
        content: 'Hello VÉLANTE team! Thank you so much, I am highly thrilled! Yes, I am fully available in Milan on August 18th and will block my agency schedule for you.',
        timestamp: '2026-06-25T16:15:00Z',
        read: true
      },
      {
        id: 'msg_3',
        senderId: 'user_brand_1',
        receiverId: 'user_model_1',
        content: 'Spectacular. Our casting coordinator will follow up with the formal callback packet details soon!',
        timestamp: '2026-06-25T16:30:00Z',
        read: true
      }
    ],
    lastMessage: {
      id: 'msg_3',
      senderId: 'user_brand_1',
      receiverId: 'user_model_1',
      content: 'Spectacular. Our casting coordinator will follow up with the formal callback packet details soon!',
      timestamp: '2026-06-25T16:30:00Z',
      read: true
    }
  },
  {
    otherUser: {
      id: 'user_photo_1',
      name: 'Laurent Mercer',
      role: 'Photographer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
      location: 'New York, USA'
    },
    messages: [
      {
        id: 'msg_4',
        senderId: 'user_photo_1',
        receiverId: 'user_model_1',
        content: 'Hey Aria! Are you interested in doing a TFP studio test in Paris next week? I have some vintage Hasselblad film I want to experiment with.',
        timestamp: '2026-06-24T09:00:00Z',
        read: true
      },
      {
        id: 'msg_5',
        senderId: 'user_model_1',
        receiverId: 'user_photo_1',
        content: 'Hi Laurent! I would absolutely love to! Let me check with my booker, but I should have free slots next Thursday afternoon.',
        timestamp: '2026-06-24T09:45:00Z',
        read: true
      }
    ],
    lastMessage: {
      id: 'msg_5',
      senderId: 'user_model_1',
      receiverId: 'user_photo_1',
      content: 'Hi Laurent! I would absolutely love to! Let me check with my booker, but I should have free slots next Thursday afternoon.',
      timestamp: '2026-06-24T09:45:00Z',
      read: true
    }
  }
];
