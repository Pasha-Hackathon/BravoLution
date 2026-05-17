# Bravo Flow — Feature Reference

Single source of truth. Update when a section is added, changed, or removed.

---

## Overview

Bravo Flow is a vendor product-launch intelligence tool for **Bravo supermarket** (Azerbaijan, 67 stores). Vendors fill a 4-step form and receive a full supply-chain and market-intelligence report powered by KNN analytics + Gemini AI.

**Stack:** React 18 + Vite 5 · Tailwind CSS · Framer Motion · Recharts · Express + Gemini API  
**Run:** `npm run dev:all` → Vite :5173, Express :3001  
**Entry:** `src/App.jsx` (single file, ~2400 lines) · `server.js` (Express backend)

---

## 4-Step Wizard

Two-column layout: form on the left, live preview on the right. Animated hexagon background fills the margins.

| Step | Fields |
|---|---|
| 1 · Core Identity | Name, price, category, brand tier |
| 2 · Logistics | Format, storage, shelf life, target demographic |
| 3 · Market Intel | Region, competitive intensity, launch channel, seasonality, competitor price (optional) |
| 4 · Business Profile | Annual revenue, years in business, Bravo vendor status, launch budget |

**Demo fill:** "Try demo →" on Step 1 fills all 14 fields instantly and jumps to analysis.  
**Enter key** on Step 1 submits the form.  
**Live preview panel** (right side): calls `computeResults()` on every keystroke. Shows viability score, volume estimate, KNN analog, and price gap — updating in real time before the user submits.

---

## AI Pulse Screen (2.7 s)

Shown between form submission and dashboard. Progress bar fills 0→100%. Four step-completion checkmarks appear in sequence: Product DNA encoded → KNN match found → Demand models run → Cash flow sized.

---

## Dashboard

### Launch Viability Score (hero card, full width)
Composite 0–100 score. Large animated number. Colored left border (green/amber/red) and four sub-score bars:

| Component | Max | Factors |
|---|---|---|
| Product Fit | 30 | KNN match score |
| Market Timing | 25 | Competition intensity + seasonality |
| Financial Viability | 25 | Revenue + years in business + vendor status |
| Supply Chain | 20 | Shelf life + storage complexity |

Verdict: **Strong ≥75 · Viable with Mitigation 50–74 · High Risk <50**

### 4 KPI Cards
- **Volume Forecast** — KNN + log-linear elasticity + channel multiplier. Sub-text shows channel modifier (e.g. "E-commerce −18%") and closest analog.
- **Model Confidence** — `100 − MAPE`. MAPE derived from price gap and match quality.
- **Projected Revenue** — `predictedTotal × price` (monthly AZN).
- **Operational Risk** — HIGH (spoilage or price >25% above analog), MEDIUM (10–25%), LOW.

### AI Market Intelligence
Calls `/api/analyze` (Gemini 2.0 Flash) in parallel — dashboard renders immediately with a skeleton while generating. Five fields returned: market opportunity, key risks, pricing advice, market timing, launch strategy. Graceful "unavailable" on failure.

### Demand Forecast Chart (8-month)
Area chart: Predicted (blue) vs Baseline analog (dashed grey) with 95% confidence band. Shape adapts to seasonality. Reference lines for Nowruz (Mar) and Summer Peak / Tech Season (Jun). Starts from the current calendar month.

**Optimal launch window callout:** shows the starting month with the highest 3-month cumulative demand if it differs from today.

**Market Shock Simulator (toggle):** Slider to set a competitor's price advantage (−5% to −40%). Shows estimated volume lost, revenue lost, and remaining volume using a cross-price elasticity model. Collapses when not in use.

### Price Sensitivity Explorer
Interactive slider from −60% to +80% of original price. Live volume, revenue, and % delta update with every drag. Three quick-set buttons (−10% / Original / +10%). Includes a **revenue-optimal price callout** (monopoly pricing formula) when it differs from current price by more than 2% — one-click "Apply" sets the slider.

### Spoilage Management Protocol
Only shown when shelf life = Short (<7 days). 4-column markdown schedule: Day 1–3 full price → Day 4–5 −15% → Day 6 −30% → Day 7 −50% clearance.

### Competitor Positioning Chart
Scatter chart: your product (blue), 3 closest KNN analogs (grey), and optional competitor (red) plotted on price vs. estimated volume axes.

### SKU Cannibalization Warning
Shown when KNN match score ≥70. Warns that demand will likely split with the existing analog SKU.

### Top 3 Analog SKUs
Three highest-scoring KNN reference products. Score out of 100. The #1 analog's baseSales drives the forecast baseline.

### Forecast Attribution
Decomposes how the predicted volume was built: **KNN Baseline** (analog's real sales) → **Price Effect** (log-linear elasticity adjustment) → **Channel Effect** (launch channel multiplier). Each row shows actual units added or removed, with a proportional bar.

### Dispatch Matrix
Unit allocation across Bravo store clusters, filtered to the chosen launch region:
- Baku Only → 3 Baku stores, renormalized
- Baku + Sumgayit → 4 stores
- National → all 5 locations (67 total stores)

Includes a small SVG Azerbaijan map with proportional city circles.

### Cash Flow Projection (6-month)
ComposedChart: Investment bars (red, negative, peak M1–M2) + Revenue bars (blue, growing) + Net line (black). ReferenceLine y=0. Shows breakeven month.

### Procurement Intelligence (EOQ)
Lead time: Ambient 2 wk, Chilled 3 wk, Frozen 4 wk. Holding rate: Ambient 22%, Chilled 28%, Frozen 35%. Shows: Safety Stock · Reorder Point · Economic Order Qty · First Order Recommendation.

### Launch Roadmap
7-step horizontal timeline: Application → Review → Negotiate → Planogram → First Order → Go Live → Monitor. Step 1 is marked done, Step 2 active.

### Bravo Vendor Intelligence
- Working capital required (storage-adjusted multiplier: Ambient 2.1×, Chilled 2.6×, Frozen 3.2×)
- Recommended partnership tier: Pilot Listing / Regional Vendor / Strategic Supply Partner
- Dynamic financed growth potential — uplift % varies by region × competition × budget
- Pre-application checklist (8 items, stored in local state)
- Shelf placement recommendation

---

## Scenario Saver
Up to 3 scenarios saved in `localStorage`. Each entry stores only the form inputs. Loading a scenario re-runs full analysis including a new Gemini call.

**Scenario Compare** (accessible from "Compare scenarios →" in the Saved dropdown when 2+ are saved): Side-by-side table of all saved scenarios. 11 metrics compared row by row (score, volume, revenue, confidence, risk, working capital, breakeven, partnership tier, KNN analog, price gap). Best value in each numeric row highlighted green, lowest highlighted red.

## Category Manager View
Accessible from "Manager" button in the dashboard navbar. Separate screen showing all vendor listing submissions.

- Stat cards: Total / Pending / Approved / Needs Info counts
- Filter tabs: All | Pending | Approved | Needs Info | Rejected
- Table: product, category, score, volume, risk, date, editable status dropdown, "Review →" button
- Status changes persist in `localStorage`
- **Draft Reply modal**: automatically opens when status is changed to Approved or Needs Info. Generates a professional email template (subject + body) pre-filled with product name, vendor name, metrics. One-click copy to clipboard.
- "Review →" loads the submission's full form into the dashboard and re-runs analytics

## Share Link
Encodes the current form state as a base64 URL parameter (`?s=`). Opening the link auto-runs the full analysis.

## PDF / Print Export
Navbar "Print" button calls `window.print()`. Print CSS hides navbar and CTA strip.

---

## Demand Forecast Model

**KNN matching** across 26 reference SKUs (6 attributes, weighted):
- Category 30 pts · Target Demo 20 pts · Brand Tier 15 pts · Storage 15 pts · Format 10 pts · Shelf Life 10 pts

**Demand formula** (log-linear / constant elasticity):
```
Q = baseSales × (price / basePrice) ^ elasticity × channelMultiplier
```
Log-linear model is used throughout (forecast, sensitivity, attribution, slider, competitor chart). Never produces negative demand regardless of price.

**Category elasticity:** F&B −0.65 · Personal Care −0.45 · Home Care −0.40 · Electronics −0.22

**Channel multiplier:** Modern Retail 1.00 · Hybrid 1.08 · E-commerce 0.82 · Traditional/Bazaar 0.74

**Market shock cross-elasticity:** `|own_elasticity| × 0.6` — used only in the shock simulator.

---

## Known Limitations / Hardcoded Values

| Item | Current state |
|---|---|
| `baseSales` (26 SKUs) | Estimated — would need real 90-day Bravo POS velocity |
| Ordering cost | Flat 45 AZN — would need per-category supplier data |
| Demand std deviation | 15% of baseline — would need historical σ from POS |
| Investment split (55/28/10%) | Fixed heuristic — would need vendor payment schedule data |
| Risk thresholds (>25%, >10%) | Arbitrary — would need calibration from real margin data |
| Cross-price elasticity factor (0.6) | Assumed — would need competitive price response data |
