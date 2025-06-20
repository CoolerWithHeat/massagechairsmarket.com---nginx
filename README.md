# MassageChairsMarket.com – Client-Side 💺

**Live Site:** [https://massagechairsmarket.com](https://massagechairsmarket.com)

This is the client-side codebase for **MassageChairsMarket.com**, a high-performance e-commerce platform focused on massage chair products. The frontend is built entirely with **Vanilla JavaScript**, **HTML5**, and **raw CSS**, with no external UI libraries — ensuring lightning-fast performance and full SEO control.

---

## ⚙️ Tech Stack

- **HTML5 + Vanilla JavaScript**
- **CSS3** (no frameworks or libraries)
- **Algolia InstantSearch.js** – Direct client-side integration
- **AWS S3** – Static file storage and delivery
- **SEO Optimized** – Semantic HTML, metadata, and performance-focused layout

---

## 🔍 Advanced Search (Algolia)

Product search is powered by **Algolia**, integrated directly into the frontend (not routed through the backend), offering:
- ⚡ Real-time filtering and response
- 🔒 Secure index access via client-side keys with restricted rules
- 🧠 Typo-tolerant search, filtering by brand, category, etc.

---

## 💳 Stripe Integration (Client Side)

The frontend initiates secure Stripe payments:
- Checkout sessions are created via backend API
- Customers are redirected to Stripe’s hosted payment page
- Post-payment success/failure is handled on return

Sensitive operations and Stripe keys are managed securely on the backend for PCI compliance.

---

## 📦 Features

- 🪑 Product catalog with high-res images and specs
- 🔍 Instant search and filtering via Algolia
- 📱 Mobile-first, fully responsive UI
- ⚡ Ultra-light static frontend hosted via CDN (S3/CloudFront)
- 🔗 Connected to Django API backend for real-time and transactional features

---

## 🔗 Related Repos

- [🔧 Backend Repository (Django + DRF + WebSockets)](https://github.com/CoolerWithHeat/MassageChairsMarket---django)
