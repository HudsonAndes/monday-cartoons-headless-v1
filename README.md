# Monday Cartoons : Hydrogen Storefront

A custom headless Shopify storefront for [Monday Cartoons](https://mondaycartoons.com), built as a proof of concept to demonstrate a storefront powered by Shopify's Hydrogen framework and deployed to Oxygen hosting.

## What This Is

This is a fully functional e-commerce storefront built from the ground up using Hydrogen,  Shopify's React-based framework for headless commerce. The goal was to go beyond what's possible with standard Liquid themes and build a custom editorial shopping experience with full creative control.

The storefront pulls real product data from the Monday Cartoons Shopify store via the Storefront API, handles cart operations, and routes to Shopify's native checkout.

**NOTE**: Since this is only a proof of concept, quick design decisions were made. 

## What I Built

- **Custom dark editorial design** — warm black + burnt orange brand palette with Instrument Serif and DM Sans typography
- **Animated hero section** with staggered type reveals and featured product showcase
- **Custom product grid** with hover overlays and add-to-cart functionality
- **Brand storytelling sections** — scroll-triggered animations for the "Born in NYC" story block and email capture
- **Scrolling marquee banner** with brand messaging
- **Full cart integration** using Hydrogen's CartForm API with visual add-to-cart feedback
- **Deployed to Oxygen** — Shopify's global edge hosting built on Cloudflare Workers

## Tech Stack

- **Shopify Hydrogen** - React framework for headless Shopify storefronts
- **React Router** — file-based routing and server-side rendering
- **Storefront API** (GraphQL) — product data, collections, cart mutations
- **Tailwind CSS v4** — utility styling alongside custom brand CSS
- **Oxygen** — Shopify's edge hosting, deployed via Shopify CLI
- **Vite** — build tooling and dev server

## Running Locally

```bash
npm install
npx shopify hydrogen dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploying

```bash
npx shopify hydrogen deploy
```

## Project Structure

```
app/
├── components/
│   ├── Hero.jsx              # Animated homepage hero
│   ├── MCProductCard.jsx     # Product card with hover overlay + add to cart
│   ├── Marquee.jsx           # Scrolling brand banner
│   ├── Sections.jsx          # Story section, email capture, custom footer
│   ├── CustomCursor.jsx      # Mix-blend-mode cursor effect
│   ├── Header.jsx            # Site navigation (Hydrogen starter)
│   ├── CartMain.jsx          # Cart drawer (Hydrogen starter)
│   └── ...                   # Other Hydrogen starter components
├── lib/
│   ├── utils.js              # formatMoney, useInView, getProductBadge helpers
│   ├── context.js            # Hydrogen context setup for Oxygen runtime
│   └── fragments.js          # Shared GraphQL fragments
├── routes/
│   ├── _index.jsx            # Custom homepage with hero + product grid
│   ├── products.$handle.jsx  # Product detail page
│   ├── collections.$handle.jsx
│   ├── cart.jsx              # Cart actions (add/remove/update via CartForm)
│   └── ...                   # Account, search, policies, etc.
├── styles/
│   ├── monday-cartoons.css   # All custom brand styles
│   └── app.css               # Hydrogen starter base styles
└── root.jsx                  # App shell with Marquee + analytics
```

## Why Hydrogen Over a Theme

| | Liquid Theme | This Hydrogen Build |
|---|---|---|
| Custom animations | Limited | Full control (scroll-triggered, staggered reveals) |
| Cart experience | Page refresh or basic AJAX | React state + CartForm API, no reload |
| Design freedom | Constrained by theme architecture | Unlimited — it's just React |
| Performance | Theme engine | Edge-rendered on 100+ global nodes |
| Developer experience | Liquid + JS | React + Vite + hot reload |

---

Built by Angel Guerrero · [lightbyangel.com](https://lightbyangel.com)
