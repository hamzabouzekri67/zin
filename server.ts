/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'products-db.json');

const INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    name: "Couture Silk Trench Coat",
    description: "An elegant, oversized trench crafted in Italian Mulberry silk. Water-resistant, featuring brass-toned hardware and double-breasted closure.",
    price: 540,
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800"
    ],
    category: "Outerwear",
    brandWhatsAppLink: "212600000000",
    brandName: "ZIN Atelier",
    brandAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-2",
    name: "Obsidian Tailored Blazer",
    description: "Sharp shoulder lines with structured internal padding. Hand-stitched lapels and matte horn buttons. A modern uniform staple.",
    price: 420,
    images: [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=800"
    ],
    category: "Suits & Tailoring",
    brandWhatsAppLink: "212600000000",
    brandName: "Aetheria Tailoring",
    brandAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-3",
    name: "Asymmetrical Draped Satin Dress",
    description: "Flowing heavy-weight satin dress that plays with negative space and dramatic asymmetric pleating. Ideal for digital red carpets and exclusive dinners.",
    price: 380,
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800"
    ],
    category: "Dresses",
    brandWhatsAppLink: "212600000000",
    brandName: "Milan Collective",
    brandAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150",
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-4",
    name: "Avant-Garde Architectural Boots",
    description: "Sculpted platform boots with custom block heels and soft glove-leather shaft. Side zipper and metallic interior plating.",
    price: 650,
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=800"
    ],
    category: "Footwear",
    brandWhatsAppLink: "212600000000",
    brandName: "Tokyo Shogun",
    brandAvatar: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=150",
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-5",
    name: "Monogram Brass Collar Choker",
    description: "Bold gold-plated architectural collar choker with laser-engraved ZIN minimalist emblem. Adjustable hinge backing.",
    price: 195,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"
    ],
    category: "Accessories",
    brandWhatsAppLink: "212600000000",
    brandName: "ZIN Atelier",
    brandAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    createdAt: new Date().toISOString()
  }
];

// Ensure DB file exists and read
function readDatabase() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_PRODUCTS, null, 2), 'utf-8');
      return INITIAL_PRODUCTS;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error("Error reading database file:", error);
    return INITIAL_PRODUCTS;
  }
}

function writeDatabase(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing database file:", error);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Endpoints
  app.get("/api/products", (req, res) => {
    const products = readDatabase();
    res.json(products);
  });

  app.post("/api/products", (req, res) => {
    try {
      const { name, description, price, images, category, brandWhatsAppLink, brandName, brandAvatar } = req.body;
      
      if (!name || !price || !brandWhatsAppLink) {
        return res.status(400).json({ error: "Product name, price, and brandWhatsAppLink are required." });
      }

      const products = readDatabase();
      const newProduct = {
        id: `prod-${Date.now()}`,
        name,
        description: description || "Exclusive creative capsule release.",
        price: Number(price) || 0,
        images: Array.isArray(images) && images.length > 0 ? images : [
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800"
        ],
        category: category || "Couture",
        brandWhatsAppLink: brandWhatsAppLink.replace(/\D/g, ''), // Strip non-numeric for WhatsApp URL
        brandName: brandName || "ZIN Premium Creator",
        brandAvatar: brandAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
        createdAt: new Date().toISOString()
      };

      products.unshift(newProduct);
      writeDatabase(products);

      res.status(201).json(newProduct);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Internal server error during product placement." });
    }
  });

  // Serve Vite or static index
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ZIN Server] Fullstack engine running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
