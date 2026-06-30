/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Check, FolderTree, Database, ShieldCheck, KeyRound, Code, Info } from 'lucide-react';

export default function DeveloperHub() {
  const [activeTab, setActiveTab] = useState<'folder' | 'schema' | 'oauth' | 'security'>('folder');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const folderStructureText = `zin-fashion-platform/
├── prisma/
│   ├── schema.prisma           # Prisma database schema
│   └── seed.ts                 # Seed script for initial roles and users
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── layout.tsx          # Global layout
│   │   ├── page.tsx            # Main landing page
│   │   ├── api/                # Next.js API Routes (or proxy to Express)
│   │   │   └── auth/[...nextauth]/route.ts # NextAuth.js Google & Credentials handler
│   │   ├── (auth)/             # Authentication views
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   └── (dashboard)/        # Feature-based role dashboards
│   │       ├── model/page.tsx
│   │       ├── brand/page.tsx
│   │       ├── photographer/page.tsx
│   │       └── designer/page.tsx
│   │
│   ├── features/               # FEATURE-BASED MODULES (Encapsulated)
│   │   ├── discover-feed/      # Discover Feed feature
│   │   │   ├── components/     # PostCard, CommentSection, PostBuilder
│   │   │   ├── actions.ts      # Server actions for likes, comments, posts
│   │   │   └── types.ts        # Feed-specific interfaces
│   │   ├── casting-board/      # Casting & Job Applications feature
│   │   │   ├── components/     # JobCard, ApplicationModal, CreateCasting
│   │   │   ├── actions.ts      # Server actions to apply and manage jobs
│   │   │   └── types.ts
│   │   ├── messaging/          # Real-time / polling chat feature
│   │   │   ├── components/     # ChatWindow, ThreadList, MessageInput
│   │   │   └── actions.ts
│   │   └── profile/            # Profile feature
│   │       ├── components/     # PortfolioGrid, EditProfileForm
│   │       └── actions.ts
│   │
│   ├── components/             # Global reusable UI (Button, Input, Card)
│   ├── lib/                    # Shared libraries
│   │   ├── prisma.ts           # Prisma client singleton
│   │   └── utils.ts            # Tailwind merges, formatters
│   └── styles/
│       └── globals.css         # Tailwind directives
│
├── server/                     # Backend Service (Node.js/Express)
│   ├── index.ts                # Express server entry point
│   ├── middlewares/            # Auth, rate-limiter, multer-file-upload
│   │   ├── auth.middleware.ts  # JWT validation & role checking
│   │   └── upload.middleware.ts# Secure Multer configuration
│   ├── routes/                 # Express REST endpoints
│   │   ├── auth.routes.ts      # Google OAuth login, JWT issuance
│   │   ├── posts.routes.ts
│   │   └── jobs.routes.ts
│   └── config/
│       └── passport.ts         # Google OAuth & JWT strategies
│
├── .env                        # Environment variables (uncommitted)
├── package.json
└── tsconfig.json`;

  const prismaSchemaText = `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  MODEL
  BRAND
  PHOTOGRAPHER
  DESIGNER
}

enum ApplicationStatus {
  PENDING
  SHORTLISTED
  ACCEPTED
  DECLINED
}

model User {
  id            String          @id @default(uuid())
  email         String          @unique
  passwordHash  String?         // Nullable for OAuth users
  name          String
  role          Role
  avatar        String          @default("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde")
  coverImage    String?
  bio           String?         @db.Text
  location      String
  website       String?
  instagram     String?
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  // Profile associations
  profile       Profile?
  posts         Post[]
  comments      Comment[]
  likes         Like[]
  castingCalls  CastingCall[]   @relation("BrandCastingCalls")
  applications  Application[]   @relation("ApplicantApplications")

  // Messaging relations
  sentMessages     Message[]    @relation("SentMessages")
  receivedMessages Message[]    @relation("ReceivedMessages")
}

model Profile {
  id          String   @id @default(uuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Custom metrics based on role
  followersCount Int     @default(0)
  followingCount Int     @default(0)
  rating         Float?  @default(5.0)

  // Technical metrics
  height         String? // Model
  measurements   String? // Model
  agency         String? // Model
  specialty      String? // Photographer, Designer
  equipment      String[]// Photographer
  foundedYear    String? // Brand
  headquarters   String? // Brand

  portfolio      String[] // List of uploaded asset URLs
}

model Post {
  id        String    @id @default(uuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  content   String    @db.Text
  image     String?   // Uploaded post media URL
  createdAt DateTime  @default(now())
  tags      String[]
  
  likes     Like[]
  comments  Comment[]
}

model Comment {
  id        String   @id @default(uuid())
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  content   String   @db.Text
  createdAt DateTime @default(now())
}

model Like {
  id        String   @id @default(uuid())
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([postId, userId]) // Avoid duplicate likes
}

model CastingCall {
  id           String        @id @default(uuid())
  brandId      String
  brand        User          @relation("BrandCastingCalls", fields: [brandId], references: [id], onDelete: Cascade)
  title        String
  description  String        @db.Text
  requirements String[]
  location     String
  compensation String
  rolesNeeded  Role[]        // Multi-role compatibility
  deadline     DateTime
  createdAt    DateTime      @default(now())

  applications Application[]
}

model Application {
  id          String            @id @default(uuid())
  castingId   String
  casting     CastingCall       @relation(fields: [castingId], references: [id], onDelete: Cascade)
  applicantId String
  applicant   User              @relation("ApplicantApplications", fields: [applicantId], references: [id], onDelete: Cascade)
  status      ApplicationStatus @default(PENDING)
  coverLetter String?           @db.Text
  appliedAt   DateTime          @default(now())
}

model Message {
  id         String   @id @default(uuid())
  senderId   String
  sender     User     @relation("SentMessages", fields: [senderId], references: [id], onDelete: Cascade)
  receiverId String
  receiver   User     @relation("ReceivedMessages", fields: [receiverId], references: [id], onDelete: Cascade)
  content    String   @db.Text
  timestamp  DateTime @default(now())
  read       Boolean  @default(false)
}`;

  const oauthText = `// server/config/passport.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient, Role } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: \`\${process.env.APP_URL}/api/auth/google/callback\`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(new Error('No email found in Google account profile'), undefined);
        }

        // Check if user already exists
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          // If register is requested, grab role from session query or default
          const stateParam = req.query.state as string;
          let role: Role = Role.MODEL; // default role

          if (stateParam) {
            try {
              const stateObj = JSON.parse(Buffer.from(stateParam, 'base64').toString('ascii'));
              if (stateObj.role) role = stateObj.role.toUpperCase() as Role;
            } catch (e) {
              console.error('Failed parsing state parameter for role selection', e);
            }
          }

          user = await prisma.user.create({
            data: {
              email,
              name: profile.displayName,
              avatar: profile.photos?.[0]?.value || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
              role,
              location: 'Please update location', // Mandatory default
            },
          });

          // Initialize nested user profile statistics
          await prisma.profile.create({
            data: {
              userId: user.id,
              followersCount: 0,
              followingCount: 0,
              portfolio: [],
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

// server/routes/auth.routes.ts
import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = Router();

// Route 1: Trigger Google auth. Optionally embed selected role in State.
router.get('/google', (req, res, next) => {
  const role = req.query.role || 'Model';
  const state = Buffer.from(JSON.stringify({ role })).toString('base64');
  
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: state,
    session: false,
  })(req, res, next);
});

// Route 2: Callback after authorization. Issue HttpOnly JWT.
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const user = req.user as any;
    
    // Generate secure JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Set cookie with security flags
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Redirect user to their respective dashboard
    const dashboardRoute = \`/dashboard/\${user.role.toLowerCase()}\`;
    res.redirect(\`\${process.env.FRONTEND_URL}\${dashboardRoute}\`);
  }
);

export default router;`;

  const securityText = `=== 1. ROBUST JWT HANDLING STRATEGY ===
• Storage location: Store JWTs exclusively in 'HttpOnly', 'Secure', and 'SameSite=Lax/Strict' cookies.
  Never save JWTs in localStorage or sessionStorage, which are accessible to malicious scripts via Cross-Site Scripting (XSS).
• Token Expiry: Set standard short-lived Access Tokens (e.g. 15 minutes) and implement Refresh Token Rotation with database checks to invalidate compromised tokens immediately.
• Middleware validation: Ensure express route verification verifies claims securely:

\`\`\`ts
// server/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please login.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired session token.' });
  }
};

// Role Check Decorator Middleware
export const requireRoles = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Unauthorized role permissions.' });
    }
    next();
  };
};
\`\`\`

=== 2. SECURE FILE UPLOADS USING MULTER ===
When handling model portfolios or brand asset collections, enforce rigorous validations to prevent remote code execution or file inclusion vulnerabilities:
• Limit File Sizes: Block excessively large files to avoid Denial-of-Service (DoS) memory crashes.
• Strict File Filter: Enforce MIME-type verification (only allow JPEG, PNG, WEBP for portfolio lookbooks). Do not rely solely on extensions.
• Sanitize Filenames: Override original files names with unique UUIDs/timestamps to avoid path traversal.

\`\`\`ts
// server/middlewares/upload.middleware.ts
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/portfolios'); // Ensure directory is created on initialization
  },
  filename: (req, file, cb) => {
    // Generate secure random filename to prevent file collisions and directory injection
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, \`zin-asset-\${uniqueSuffix}\${extension}\`);
  }
});

const fileFilter = (req: any, file: Express.Item, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and WEBP images are allowed.') as any, false);
  }
};

export const secureUploader = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Enforce maximum 5MB files
    files: 10 // Max 10 files in a single post/upload sequence
  }
});
\`\`\``;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="p-6 bg-gradient-to-r from-amber-500/10 to-neutral-900 border-b border-neutral-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-amber-500 tracking-widest uppercase flex items-center gap-1.5 mb-1">
              <Code className="w-3.5 h-3.5" /> Lead Architect Console
            </span>
            <h2 className="text-2xl font-serif text-white tracking-wide">ZIN Architecture & Developer Hub</h2>
            <p className="text-sm text-neutral-400 mt-1">
              Interactive architectural layout, full production schema, Google OAuth configuration, and server security guides.
            </p>
          </div>
          <div className="bg-neutral-950 px-3.5 py-1.5 rounded-lg border border-neutral-800 text-xs font-mono text-amber-400/80 self-start md:self-center flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Fully Typed & Secured
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-800 bg-neutral-950/60 overflow-x-auto">
        <button
          onClick={() => setActiveTab('folder')}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs font-mono uppercase tracking-wider border-b-2 transition-all shrink-0 ${
            activeTab === 'folder'
              ? 'border-amber-500 text-amber-400 bg-neutral-900/60'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <FolderTree className="w-4 h-4" /> Folder Structure
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs font-mono uppercase tracking-wider border-b-2 transition-all shrink-0 ${
            activeTab === 'schema'
              ? 'border-amber-500 text-amber-400 bg-neutral-900/60'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Database className="w-4 h-4" /> Prisma DB Schema
        </button>
        <button
          onClick={() => setActiveTab('oauth')}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs font-mono uppercase tracking-wider border-b-2 transition-all shrink-0 ${
            activeTab === 'oauth'
              ? 'border-amber-500 text-amber-400 bg-neutral-900/60'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <KeyRound className="w-4 h-4" /> Google OAuth Express
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs font-mono uppercase tracking-wider border-b-2 transition-all shrink-0 ${
            activeTab === 'security'
              ? 'border-amber-500 text-amber-400 bg-neutral-900/60'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Security Strategy
        </button>
      </div>

      {/* Tab Content Panels */}
      <div className="p-6 bg-neutral-950 min-h-[480px]">
        {activeTab === 'folder' && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-neutral-900/50 p-4 rounded-lg border border-neutral-800">
              <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs text-neutral-300 leading-relaxed">
                <span className="font-serif text-white font-medium text-sm block mb-1">Feature-Based Modular Architecture</span>
                Following clean architectural patterns, we isolate key platform modules (Discover Feed, Casting Board, Messaging, Profile) into self-contained directories under <code className="text-amber-400 font-mono">src/features/</code>. This maximizes service testability and allows full re-usability, avoiding monolithic files like <code className="text-neutral-400">App.tsx</code> or bloated routers.
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => handleCopy(folderStructureText, 'folder')}
                className="absolute top-3 right-3 p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-all"
                title="Copy Structure"
              >
                {copied === 'folder' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <pre className="p-5 bg-neutral-900 rounded-xl border border-neutral-800 overflow-x-auto text-[13px] font-mono leading-relaxed text-amber-100/90 max-h-[500px]">
                {folderStructureText}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'schema' && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-neutral-900/50 p-4 rounded-lg border border-neutral-800">
              <Database className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs text-neutral-300 leading-relaxed">
                <span className="font-serif text-white font-medium text-sm block mb-1">Prisma PostgreSQL Relational Modelling</span>
                Our database model perfectly encapsulates relation schemas. Includes <code className="text-amber-400">User</code> with role-specific constraints, nested <code className="text-amber-400">Profile</code> extensions, posts with double-binding likes & comments, casting calls targeting multi-roles, real-time message tables, and application schemas.
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => handleCopy(prismaSchemaText, 'schema')}
                className="absolute top-3 right-3 p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-all"
                title="Copy Schema"
              >
                {copied === 'schema' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <pre className="p-5 bg-neutral-900 rounded-xl border border-neutral-800 overflow-x-auto text-[13px] font-mono leading-relaxed text-neutral-200 max-h-[500px]">
                {prismaSchemaText}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'oauth' && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-neutral-900/50 p-4 rounded-lg border border-neutral-800">
              <KeyRound className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs text-neutral-300 leading-relaxed">
                <span className="font-serif text-white font-medium text-sm block mb-1">Google OAuth + Passport JWT Strategy</span>
                This production-ready snippet integrates Google OAuth inside the Express backend. On successful authorization, it issues a secure JWT containing the user identity, role parameters, and injects it via an <code className="text-amber-400">HttpOnly Cookie</code> for secure browser transport.
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => handleCopy(oauthText, 'oauth')}
                className="absolute top-3 right-3 p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-all"
                title="Copy OAuth Code"
              >
                {copied === 'oauth' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <pre className="p-5 bg-neutral-900 rounded-xl border border-neutral-800 overflow-x-auto text-[12.5px] font-mono leading-relaxed text-amber-100/90 max-h-[500px]">
                {oauthText}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-neutral-900/50 p-4 rounded-lg border border-neutral-800">
              <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs text-neutral-300 leading-relaxed">
                <span className="font-serif text-white font-medium text-sm block mb-1">Critical API Security Implementations</span>
                We secure our backend routes using custom Express guards. Included below is the production middleware for JWT token verification, strict role-based capability verification, and secure, bounded Multer file upload setups.
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => handleCopy(securityText, 'security')}
                className="absolute top-3 right-3 p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-all"
                title="Copy Security Code"
              >
                {copied === 'security' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <pre className="p-5 bg-neutral-900 rounded-xl border border-neutral-800 overflow-x-auto text-[12.5px] font-mono leading-relaxed text-neutral-200 max-h-[500px] whitespace-pre-wrap">
                {securityText}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
