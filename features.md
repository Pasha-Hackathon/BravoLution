# Bravo Flow — Feature Registry

> Single source of truth for all features. Update this file when adding, removing, or changing any feature.

---

## Product Overview

**Bravo Flow** is PashaBank's Supply Chain Finance Intelligence Platform for SME clients.  
It analyzes new product launches, scores viability, forecasts demand, and recommends PashaBank financing.

**Tagline:** "From Idea to Shelf — Powered by PashaBank Intelligence"

**Demo URL:** http://localhost:5173

---

## Application Flow

```
Step 1: Core Identity
    ↓
Step 2: Logistics & Supply Chain
    ↓
Step 3: Market Intelligence         ← NEW
    ↓
Step 4: Business Profile            ← NEW
    ↓
AI Pulse (2.7s processing animation)
    ↓
Command Center Dashboard
    ↓
[Optional] Financing Quote Modal
```

---

## Wizard Steps

### Step 1 — Core Identity
| Field | Type | Options |
|---|---|---|
| Product Name | Text input | Free text |
| Proposed Price | Number input (AZN prefix) | Any positive float |
| Category | Select | Food & Beverage, Home Care & Cleaning, Personal Care, Electronics |
| Brand Tier | Select | Economy, Mass Market, Premium, Luxury |

**Validation:** Name and price required; price > 0 to advance.

---

### Step 2 — Logistics & Supply Chain
| Field | Type | Options |
|---|---|---|
| Format / Size | Select | Single Serve (<250g/ml), Standard (250g-1kg), Bulk/Family (>1kg) |
| Storage Condition | Select | Ambient (Dry), Chilled (+4°C), Frozen (-18°C), Special Handling |
| Shelf Life | Select | Short (<7 Days), Medium (1-6 Months), Long (>6 Months), Non-Perishable |
| Target Demographic | Select | High-Income/Professionals, Families, Students, General/Mass |

---

### Step 3 — Market Intelligence *(new)*
| Field | Type | Options |
|---|---|---|
| Launch Region | Select | Baku Only, Baku + Sumgayit, National |
| Competitive Intensity | Select | Low (0-2 competitors), Medium (3-5 competitors), High (5+ competitors) |
| Launch Channel | Select | Modern Retail, Traditional/Bazaar, E-commerce, Hybrid |
| Seasonality | Select | Year-round, Peak Season Product, Seasonal Only |

**Effect on outputs:**
- `region` → filters distribution locations, affects financing multiplier
- `competition` → affects market timing score + financing multiplier
- `seasonality` → affects seasonal chart annotations + market timing score

---

### Step 4 — Business Profile *(new — the banking hook)*
| Field | Type | Options |
|---|---|---|
| Annual Company Revenue | Select | < 100K AZN, 100K–500K AZN, 500K–2M AZN, 2M+ AZN |
| Years in Business | Select | < 1 year, 1–3 years, 3–10 years, 10+ years |
| Existing PashaBank Products | Select | None, Active Loan, Credit Line, Multiple Products |
| Launch Budget Available | Select | < 20K AZN, 20–50K AZN, 50–200K AZN, 200K+ AZN |

**Effect on outputs:**
- `revenue` + `yearsInBiz` → Financial Viability sub-score
- `bankRelation` → bonus to Financial Viability (existing clients score higher)
- `launchBudget` → affects financing multiplier + recommended product

---

## Business Logic Engine

### KNN Product Matching
Scores all 10 reference products against form attributes:
- Category match: +30 pts
- Target Demo match: +20 pts
- Brand Tier match: +15 pts
- Storage match: +15 pts
- Format match: +10 pts
- Shelf Life match: +10 pts

**Max match score: 100 pts.** Highest-scoring product = `baseline`.

### Demand Forecast
```
priceGapPercent = ((newPrice - baseline.basePrice) / baseline.basePrice) × 100
predictedTotal  = baseline.baseSales × (1 + priceGapPercent/100 × -0.5)
```

### Model Error Rate (MAPE)
```
errorRate = |priceGapPercent| × 0.08 + 1.9 + (100 - matchScore) × 0.03
confidence = 100 - errorRate
```

### Operational Risk
| Condition | Level |
|---|---|
| shelfLife = "Short (<7 Days)" | HIGH — Spoilage Risk |
| priceGapPercent > 25% | HIGH — Overpriced |
| priceGapPercent > 10% | MEDIUM — Watch Price |
| otherwise | LOW — Stable |

### Launch Viability Score (0–100) *(new)*
Composite score used as the headline metric on the dashboard.

| Sub-score | Max | Drivers |
|---|---|---|
| Product Fit | 30 | KNN match score (matchScore / 100 × 30) |
| Market Timing | 25 | Competition (55%) + Seasonality (45%) |
| Financial Viability | 25 | Revenue (50%) + Years in biz (35%) + Bank relation (15%) |
| Supply Chain | 20 | Shelf life (50%) + Storage difficulty (50%) |

**Verdict thresholds:**
- 75–100 → "Strong Launch Candidate" (green)
- 50–74 → "Viable with Mitigation" (amber)
- 0–49 → "High Risk Launch" (red)

### Working Capital
```
workingCapital = predictedTotal × 0.15 × newPrice × 2.1
```

### Financing Product Recommendation
| Condition | Product |
|---|---|
| workingCapital < 20,000 AZN | SME Express Loan |
| 20,000–100,000 AZN | Trade Finance Facility |
| > 100,000 AZN | Supply Chain Finance Program |

### Dynamic Financing Uplift *(new — replaces fixed +34%)*
```
regionFactor      = { Baku Only: 1.16, Baku+Sumgayit: 1.24, National: 1.38 }
competitionFactor = { Low: 1.12, Medium: 1.0, High: 0.88 }
budgetFactor      = { <20K: 0.90, 20-50K: 1.0, 50-200K: 1.12, 200K+: 1.22 }
financingMultiplier = regionFactor × competitionFactor × budgetFactor
financedUnits       = predictedTotal × financingMultiplier
upliftPct           = (financingMultiplier - 1) × 100  [displayed as "+X%"]
```

---

## Reference Product Database (10 products)

| ID | Name | Category | Tier | Target Demo | Base Price | Base Sales |
|---|---|---|---|---|---|---|
| 1 | RedBull Zero | Food & Beverage | Premium | High-Income/Professionals | 2.50 AZN | 12,000 |
| 2 | Ariel Color 3Kg | Home Care & Cleaning | Mass Market | Families | 12.00 AZN | 5,000 |
| 3 | Local Dairy Milk | Food & Beverage | Economy | General/Mass | 1.20 AZN | 25,000 |
| 4 | Lay's Max Paprika | Food & Beverage | Mass Market | General/Mass | 1.80 AZN | 18,000 |
| 5 | Pantene Pro-V 400ml | Personal Care | Premium | High-Income/Professionals | 8.50 AZN | 7,500 |
| 6 | Tide Pods 42ct | Home Care & Cleaning | Premium | Families | 18.00 AZN | 3,200 |
| 7 | Activia Yoghurt 4-Pack | Food & Beverage | Mass Market | Families | 3.40 AZN | 9,000 |
| 8 | Xiaomi Redmi Buds 4 | Electronics | Mass Market | Students | 35.00 AZN | 1,200 |
| 9 | Head & Shoulders 200ml | Personal Care | Economy | General/Mass | 4.20 AZN | 14,000 |
| 10 | Nesquik 1kg | Food & Beverage | Mass Market | Families | 9.90 AZN | 6,500 |

---

## Dashboard Sections

### 1. Sticky Navbar
- Left: "← Start Over" + divider + Bravo Flow logo
- Center: Product name being analyzed
- Right: Ensemble AI v3.1 badge + "Request Financing Quote" button

### 2. KPI Row (5 cards) *(was 4)*
| Card | Metric | Notes |
|---|---|---|
| Launch Viability Score | 0–100 composite + verdict label | Headline metric — largest card |
| Volume Forecast | predictedTotal units | Animated counter |
| Model Confidence | (100 - errorRate)% | With MAPE subtext |
| Projected Revenue | projectedRevenue AZN | Animated counter |
| Operational Risk | HIGH/MEDIUM/LOW | Color-coded card |

### 3. Demand Forecast Chart
- 8-month area chart (Jan–Aug)
- Two series: Predicted (blue filled) + Baseline (dashed grey)
- Seasonal reference lines *(new)* based on category:
  - F&B: "Nowruz" (Mar), "Summer Peak" (Jun)
  - Electronics: "Tech Season" (Jun)
  - Personal Care: "Nowruz" (Mar)
  - All: "Nowruz" (Mar)

### 4. Dispatch Matrix *(expanded to 5 locations)*
Locations vary by targetDemo and region:
- Port Baku Mall (Baku)
- Park Bulvar (Baku)
- Ganjlik Mall (Baku)
- Bravo Sumgayit (Sumgayit)
- Ganja City Mall (Ganja)

Filtered by selected launch region:
- "Baku Only" → only 3 Baku locations
- "Baku + Sumgayit" → 4 locations
- "National" → all 5

Animated bars + counting numbers, staggered 130ms.

### 5. Financing Intelligence Panel (PashaBank layer)
Three sub-cards:
- **Working Capital Required** — computed AZN amount + formula note
- **Recommended Solution** — product name + description + "Best Match" badge
- **Financed Growth Potential** — dynamic uplift % (not fixed 34%), two comparison bars

### 6. Cash Flow Timeline *(new)*
6-month mini bar chart:
- Months 1–2: Investment phase (negative, red bars)
- Months 3–4: Recovery phase (amber/yellow bars)
- Months 5–6: Return phase (green bars)
- "Breakeven: Month X" label
- PashaBank financing disbursement overlay line

### 7. Price Sensitivity Strip *(new)*
Three quick-compare cards below the chart:
- Price −10% → volume delta (↑ likely)
- Current price → current predictedTotal
- Price +10% → volume delta (↓ likely)
Visual: small bar or delta indicator per card.

### 8. CTA Strip
- Blue band: "Ready to unlock growth? Apply for financing in minutes."
- "Request Financing Quote →" white button

### 9. Financing Quote Modal
Form: Full Name, Company Name, Phone Number  
Submit → success state: "Application Submitted!" + reference `BF-XXXXXX`

---

## AI Pulse Screen

- Pulsing Cpu icon with ring animation
- Progress bar filling 0→100% over 2.7s *(new)*
- Cycling text (every 620ms):
  1. "Encoding product DNA attributes..."
  2. "Running ensemble demand models..."
  3. "Sizing working capital requirement..."
  4. "Simulating branch traffic patterns..."
- Step checkmarks appearing in sequence *(new)*

---

## Tech Stack

| Layer | Library | Version |
|---|---|---|
| Framework | React | 18.3.x |
| Build | Vite | 5.x |
| Styling | Tailwind CSS | 3.4.x |
| Charts | Recharts | 2.12.x |
| Icons | Lucide React | 0.400.x |
| Animation | Framer Motion | 11.x |
| Fonts | DM Sans + DM Mono | Google Fonts |

**No backend. All data hardcoded. No router (state-driven screens).**

---

## File Structure

```
pasha-hackathon/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── features.md          ← this file
├── plan.md              ← original concept + strategic plan
└── src/
    ├── main.jsx
    ├── index.css
    └── App.jsx          ← entire application (single file)
```

---

## Demo Script (2 min)

1. **Hook (15s):** "PashaBank's SME clients launch hundreds of products every year. Most fail. Bravo Flow fixes that."
2. **Step 1–2 (35s):** Enter a product — "AZ Energy Boost 250ml", 3.20 AZN, Food & Bev, Premium
3. **Step 3 (20s):** National scope, Medium competition, Modern Retail, Year-round
4. **Step 4 (20s):** Revenue 100K–500K, 3–10 years in biz, No existing products, Budget 50–200K — *"this is where the bank actually learns about the company"*
5. **AI Pulse (10s):** Let the animation run
6. **Dashboard (30s):** Launch Score headline → chart with seasonal markers → animated dispatch across 5 locations → financing panel
7. **Close (10s):** Click "Request Financing Quote" → submit → show reference number. "This is PashaBank as a proactive partner."

---

## Model Intelligence Features (inspired by Bravo Digital Twin)

These features are simulated in the frontend but mirror real ML pipeline outputs.

### Top-3 Analog SKUs
Instead of showing a single "Nearest Analog", show the top-3 KNN matches with:
- Product name
- Similarity score (percentage of max possible score)
- Base monthly sales

### Attribute Contribution Breakdown
Show which of the 6 match attributes contributed to the KNN score:
- Category (+30), Target Demo (+20), Brand Tier (+15), Storage (+15), Format (+10), Shelf Life (+10)
- Matched attributes = filled bar, unmatched = empty bar
- This shows "why" the model picked this analog

### Confidence Intervals
The forecast chart shows upper/lower confidence bounds as thin dashed lines:
```
Upper = Predicted × (1 + errorRate/100 × 1.2)
Lower = Predicted × (1 - errorRate/100 × 0.8)
```

### EOQ Procurement Panel
Real supply chain math:
```
Annual Demand (D)    = predictedTotal × 12
Ordering Cost (S)    = 45 AZN (fixed)
Holding Cost Rate    = 22% of unit price per year
Holding Cost (H)     = newPrice × 0.22

EOQ = sqrt(2 × D × S / H)

Demand Std Dev (σ)   = baseline.baseSales × 0.15
Lead Time            = 2 weeks
Safety Stock         = 1.65 × σ × sqrt(lead_time)
Reorder Point (ROP)  = (predictedTotal/4) × lead_time + safety_stock
First Order Qty      = EOQ + safety_stock
```

### Competitor Price (Step 3 field — optional)
User can enter a competitor's price. Dashboard shows competitive positioning:
"Priced X% above/below market" with recommendation if significantly overpriced.

## Design System (Uncodixfy compliant)

Following Linear/Stripe/GitHub design language:
- Border radius: max 8px (`rounded-md`) for cards, 6px (`rounded`) for badges
- No shadows over 4px blur (`shadow-sm` only where needed)
- No gradient backgrounds on panels
- No uppercase tracking-wide section headers
- No pill-shaped badges
- No glow effects
- Colors: zinc-based grays, blue-700 primary (used sparingly), status colors for data only
- Transitions: 150ms ease, no spring bounce, no transform hover effects
- Typography: normal case, DM Sans, proper size hierarchy

## Known Limitations (acceptable for hackathon)

- All data is hardcoded — no real API
- Only 10 reference products in the KNN database
- EOQ and confidence intervals use simplified estimation formulas
- Seasonal markers are category-based, not calendar-aware
- Cash flow chart uses simplified formulas
- No mobile breakpoints (designed for 1366×768+ laptop screens)
