import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu, TrendingUp, Activity, DollarSign, AlertTriangle, ShieldCheck,
  Landmark, Star, CheckCircle, X, ChevronRight, ArrowLeft, Info,
  Package, Globe2, Target, BarChart3, Zap, Building2,
  Bookmark, Printer, BookOpen, Pencil, Share2, ClipboardList, Clock, Users,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, Label, ComposedChart, Bar, Line,
  ScatterChart, Scatter,
} from 'recharts';

// ─── Products ──────────────────────────────────────────────────────────────

const PRODUCTS = [
  // Food & Beverage — Single Serve
  { id:1,  name:'RedBull Zero 250ml',        category:'Food & Beverage', format:'Single Serve (<250g/ml)', tier:'Premium',     storage:'Ambient (Dry)',  shelfLife:'Long (>6 Months)', targetDemo:'High-Income/Professionals', basePrice:2.50,  baseSales:12000 },
  { id:2,  name:"Lay's Max Paprika 50g",     category:'Food & Beverage', format:'Single Serve (<250g/ml)', tier:'Mass Market', storage:'Ambient (Dry)',  shelfLife:'Long (>6 Months)', targetDemo:'General/Mass',             basePrice:1.80,  baseSales:18000 },
  { id:3,  name:'Coca-Cola Zero 500ml',      category:'Food & Beverage', format:'Single Serve (<250g/ml)', tier:'Mass Market', storage:'Ambient (Dry)',  shelfLife:'Long (>6 Months)', targetDemo:'Students',                 basePrice:1.50,  baseSales:22000 },
  { id:4,  name:'Evian Still Water 750ml',   category:'Food & Beverage', format:'Single Serve (<250g/ml)', tier:'Premium',     storage:'Ambient (Dry)',  shelfLife:'Long (>6 Months)', targetDemo:'High-Income/Professionals', basePrice:2.90,  baseSales:9500  },
  { id:5,  name:'Snickers 50g',              category:'Food & Beverage', format:'Single Serve (<250g/ml)', tier:'Economy',     storage:'Ambient (Dry)',  shelfLife:'Long (>6 Months)', targetDemo:'Students',                 basePrice:0.90,  baseSales:28000 },
  // Food & Beverage — Standard
  { id:6,  name:'Activia Yoghurt 4-Pack',    category:'Food & Beverage', format:'Standard (250g-1kg)',     tier:'Mass Market', storage:'Chilled (+4°C)', shelfLife:'Short (<7 Days)',  targetDemo:'Families',                 basePrice:3.40,  baseSales:9000  },
  { id:7,  name:'Local Dairy Milk 1L',       category:'Food & Beverage', format:'Standard (250g-1kg)',     tier:'Economy',     storage:'Chilled (+4°C)', shelfLife:'Short (<7 Days)',  targetDemo:'General/Mass',             basePrice:1.20,  baseSales:25000 },
  { id:8,  name:'Chobani Greek Yoghurt 450g',category:'Food & Beverage', format:'Standard (250g-1kg)',     tier:'Premium',     storage:'Chilled (+4°C)', shelfLife:'Short (<7 Days)',  targetDemo:'High-Income/Professionals', basePrice:5.20,  baseSales:4800  },
  { id:9,  name:'Pringles Original 165g',    category:'Food & Beverage', format:'Standard (250g-1kg)',     tier:'Mass Market', storage:'Ambient (Dry)',  shelfLife:'Long (>6 Months)', targetDemo:'General/Mass',             basePrice:3.60,  baseSales:11000 },
  { id:10, name:"Lay's Family Pack 200g",    category:'Food & Beverage', format:'Standard (250g-1kg)',     tier:'Economy',     storage:'Ambient (Dry)',  shelfLife:'Long (>6 Months)', targetDemo:'Families',                 basePrice:2.80,  baseSales:14500 },
  // Food & Beverage — Bulk
  { id:11, name:'Nesquik 1kg',               category:'Food & Beverage', format:'Bulk/Family (>1kg)',      tier:'Mass Market', storage:'Ambient (Dry)',  shelfLife:'Long (>6 Months)', targetDemo:'Families',                 basePrice:9.90,  baseSales:6500  },
  { id:12, name:'Barilla Pasta 5-Pack',      category:'Food & Beverage', format:'Bulk/Family (>1kg)',      tier:'Premium',     storage:'Ambient (Dry)',  shelfLife:'Long (>6 Months)', targetDemo:'High-Income/Professionals', basePrice:11.50, baseSales:3800  },
  { id:13, name:'Economy Rice 5kg',          category:'Food & Beverage', format:'Bulk/Family (>1kg)',      tier:'Economy',     storage:'Ambient (Dry)',  shelfLife:'Long (>6 Months)', targetDemo:'General/Mass',             basePrice:6.40,  baseSales:19000 },
  // Personal Care
  { id:14, name:'Pantene Pro-V 400ml',       category:'Personal Care',   format:'Standard (250g-1kg)',     tier:'Premium',     storage:'Ambient (Dry)',  shelfLife:'Long (>6 Months)', targetDemo:'High-Income/Professionals', basePrice:8.50,  baseSales:7500  },
  { id:15, name:'Head & Shoulders 200ml',    category:'Personal Care',   format:'Single Serve (<250g/ml)', tier:'Economy',     storage:'Ambient (Dry)',  shelfLife:'Long (>6 Months)', targetDemo:'General/Mass',             basePrice:4.20,  baseSales:14000 },
  { id:16, name:'Dove Body Wash 250ml',      category:'Personal Care',   format:'Single Serve (<250g/ml)', tier:'Mass Market', storage:'Ambient (Dry)',  shelfLife:'Long (>6 Months)', targetDemo:'Families',                 basePrice:5.80,  baseSales:8500  },
  { id:17, name:'Nivea Moisturiser 150ml',   category:'Personal Care',   format:'Single Serve (<250g/ml)', tier:'Premium',     storage:'Ambient (Dry)',  shelfLife:'Long (>6 Months)', targetDemo:'High-Income/Professionals', basePrice:7.20,  baseSales:5200  },
  { id:18, name:"Gillette Mach3 4-Pack",     category:'Personal Care',   format:'Standard (250g-1kg)',     tier:'Mass Market', storage:'Ambient (Dry)',  shelfLife:'Non-Perishable',   targetDemo:'General/Mass',             basePrice:9.80,  baseSales:6200  },
  { id:19, name:'Garnier Micellar Water 400ml',category:'Personal Care', format:'Standard (250g-1kg)',     tier:'Mass Market', storage:'Ambient (Dry)',  shelfLife:'Long (>6 Months)', targetDemo:'Students',                 basePrice:6.40,  baseSales:7800  },
  // Home Care & Cleaning
  { id:20, name:'Ariel Color 3kg',           category:'Home Care & Cleaning', format:'Bulk/Family (>1kg)', tier:'Mass Market', storage:'Ambient (Dry)',  shelfLife:'Non-Perishable',   targetDemo:'Families',                 basePrice:12.00, baseSales:5000  },
  { id:21, name:'Tide Pods 42ct',            category:'Home Care & Cleaning', format:'Standard (250g-1kg)',tier:'Premium',     storage:'Ambient (Dry)',  shelfLife:'Non-Perishable',   targetDemo:'Families',                 basePrice:18.00, baseSales:3200  },
  { id:22, name:'Fairy Dish Soap 500ml',     category:'Home Care & Cleaning', format:'Single Serve (<250g/ml)',tier:'Economy', storage:'Ambient (Dry)',  shelfLife:'Non-Perishable',   targetDemo:'General/Mass',             basePrice:3.10,  baseSales:16000 },
  { id:23, name:'Domestos Bleach 750ml',     category:'Home Care & Cleaning', format:'Single Serve (<250g/ml)',tier:'Economy', storage:'Ambient (Dry)',  shelfLife:'Long (>6 Months)', targetDemo:'General/Mass',             basePrice:2.80,  baseSales:12500 },
  // Electronics
  { id:24, name:'Xiaomi Redmi Buds 4',       category:'Electronics',     format:'Single Serve (<250g/ml)', tier:'Mass Market', storage:'Ambient (Dry)',  shelfLife:'Non-Perishable',   targetDemo:'Students',                 basePrice:35.00, baseSales:1200  },
  { id:25, name:'Anker PowerCore 10000',     category:'Electronics',     format:'Standard (250g-1kg)',     tier:'Mass Market', storage:'Ambient (Dry)',  shelfLife:'Non-Perishable',   targetDemo:'High-Income/Professionals', basePrice:42.00, baseSales:850   },
  { id:26, name:'JBL Go 3 Speaker',          category:'Electronics',     format:'Single Serve (<250g/ml)', tier:'Premium',     storage:'Ambient (Dry)',  shelfLife:'Non-Perishable',   targetDemo:'Students',                 basePrice:55.00, baseSales:620   },
];

const ALLOCATIONS = {
  'High-Income/Professionals': [
    { branch:'Port Baku Mall',  city:'Baku',     pct:40, demo:'Premium & Luxury Shoppers',   color:'#1d4ed8' },
    { branch:'Park Bulvar',     city:'Baku',     pct:25, demo:'High-Income Urban Shoppers',  color:'#4f46e5' },
    { branch:'Ganjlik Mall',    city:'Baku',     pct:15, demo:'Young Professionals',         color:'#7c3aed' },
    { branch:'Ganja City Mall', city:'Ganja',    pct:12, demo:'Regional Premium Segment',    color:'#0369a1' },
    { branch:'Bravo Sumgayit',  city:'Sumgayit', pct:8,  demo:'Industrial Premium Workers',  color:'#0f766e' },
  ],
  'Families': [
    { branch:'Bravo Ahmadli',   city:'Baku',     pct:33, demo:'Family Households',          color:'#16a34a' },
    { branch:'Ganjlik Mall',    city:'Baku',     pct:22, demo:'Weekend Families',           color:'#1d4ed8' },
    { branch:'Bravo Sumgayit',  city:'Sumgayit', pct:20, demo:'Industrial Family Segment',  color:'#0f766e' },
    { branch:'Ganja City Mall', city:'Ganja',    pct:15, demo:'Regional Families',          color:'#0369a1' },
    { branch:'Park Bulvar',     city:'Baku',     pct:10, demo:'Premium Families',           color:'#4f46e5' },
  ],
  'General/Mass': [
    { branch:'Ganjlik Mall',    city:'Baku',     pct:30, demo:'General Population',         color:'#1d4ed8' },
    { branch:'Bravo Ahmadli',   city:'Baku',     pct:25, demo:'Budget Conscious',           color:'#16a34a' },
    { branch:'Bravo Sumgayit',  city:'Sumgayit', pct:20, demo:'Industrial Workers',         color:'#0f766e' },
    { branch:'Ganja City Mall', city:'Ganja',    pct:15, demo:'Regional General Market',    color:'#0369a1' },
    { branch:'Park Bulvar',     city:'Baku',     pct:10, demo:'Upmarket Segment',           color:'#4f46e5' },
  ],
  'Students': [
    { branch:'Ganjlik Mall',    city:'Baku',     pct:38, demo:'Student Population',         color:'#7c3aed' },
    { branch:'Park Bulvar',     city:'Baku',     pct:22, demo:'University Area Shoppers',   color:'#4f46e5' },
    { branch:'Bravo Ahmadli',   city:'Baku',     pct:18, demo:'Budget Students',            color:'#1d4ed8' },
    { branch:'Ganja City Mall', city:'Ganja',    pct:14, demo:'Regional Students',          color:'#0369a1' },
    { branch:'Bravo Sumgayit',  city:'Sumgayit', pct:8,  demo:'Technical College Students', color:'#0f766e' },
  ],
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const REGION_STORES = { 'Baku Only': 32, 'Baku + Sumgayit': 41, 'National': 67 };

function getShelfPlacement(category, tier, storage) {
  if (storage === 'Chilled (+4°C)' || storage === 'Frozen (-18°C)')
    return 'Chilled/Frozen Aisle · Dedicated Section';
  if (category === 'Electronics') return 'Electronics Zone · Near Customer Service';
  if (tier === 'Premium' || tier === 'Luxury') return 'Eye Level · Entrance Zone · Feature End Cap';
  if (tier === 'Economy') return 'Bottom Shelf · Bulk Section · Value Aisle';
  return 'Mid Shelf · High-Traffic Aisle · Category Block';
}

function filterAllocation(rows, region) {
  let filtered = rows;
  if (region === 'Baku Only') filtered = rows.filter(r => r.city === 'Baku');
  else if (region === 'Baku + Sumgayit') filtered = rows.filter(r => r.city === 'Baku' || r.city === 'Sumgayit');
  const total = filtered.reduce((s, r) => s + r.pct, 0);
  return filtered.map(r => ({ ...r, pct: Math.round(r.pct / total * 100) }));
}

const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getSeasonalMarkers(category, seasonality) {
  if (seasonality === 'Seasonal Only') return [];
  const m = [];
  if (category !== 'Electronics') m.push({ x: MONTH_ABBR[2], label: 'Nowruz', color: '#d97706' });
  if (category === 'Food & Beverage') m.push({ x: MONTH_ABBR[5], label: 'Summer Peak', color: '#0369a1' });
  if (category === 'Electronics') m.push({ x: MONTH_ABBR[5], label: 'Tech Season', color: '#7c3aed' });
  if (category === 'Personal Care') m.push({ x: MONTH_ABBR[5], label: 'Summer Demand', color: '#16a34a' });
  return m;
}

function computeLaunchScore(form, matchScore) {
  const productFit = Math.round((matchScore / 100) * 30);
  const compScore  = { 'Low (0-2 competitors)': 25, 'Medium (3-5 competitors)': 15, 'High (5+ competitors)': 7 };
  const seasScore  = { 'Year-round': 25, 'Peak Season Product': 17, 'Seasonal Only': 9 };
  const marketTiming = Math.min(25, Math.round(
    (compScore[form.competition] || 15) * 0.55 + (seasScore[form.seasonality] || 17) * 0.45
  ));
  const revScore  = { '< 100K AZN': 7, '100K–500K AZN': 14, '500K–2M AZN': 21, '2M+ AZN': 25 };
  const yrScore   = { '< 1 year': 5, '1–3 years': 12, '3–10 years': 20, '10+ years': 25 };
  const bankBonus = { 'None': 0, 'Existing Vendor (1-2 SKUs)': 3, 'Active Vendor (3+ SKUs)': 5, 'Strategic Partner': 8 };
  const financialViability = Math.min(25, Math.round(
    (revScore[form.revenue] || 14) * 0.50 +
    (yrScore[form.yearsInBiz] || 12) * 0.35 +
    (bankBonus[form.bankRelation] || 0) * 0.50
  ));
  const shelfScore   = { 'Short (<7 Days)': 5, 'Medium (1-6 Months)': 12, 'Long (>6 Months)': 20, 'Non-Perishable': 20 };
  const storageScore = { 'Ambient (Dry)': 20, 'Chilled (+4°C)': 15, 'Frozen (-18°C)': 9, 'Special Handling': 7 };
  const supplyChain = Math.min(20, Math.round(
    (shelfScore[form.shelfLife] || 12) * 0.50 + (storageScore[form.storage] || 15) * 0.50
  ));
  const total = productFit + marketTiming + financialViability + supplyChain;
  const verdict = total >= 75 ? 'Strong Launch Candidate' : total >= 50 ? 'Viable with Mitigation' : 'High Risk Launch';
  const level   = total >= 75 ? 'strong' : total >= 50 ? 'moderate' : 'risky';
  return { total, productFit, marketTiming, financialViability, supplyChain, verdict, level };
}

function computeResults(form) {
  const newPrice = parseFloat(form.price);

  // KNN — top 3
  const scored = PRODUCTS.map(p => {
    let score = 0;
    if (p.category === form.category)   score += 30;
    if (p.targetDemo === form.targetDemo) score += 20;
    if (p.tier === form.tier)           score += 15;
    if (p.storage === form.storage)     score += 15;
    if (p.format === form.format)       score += 10;
    if (p.shelfLife === form.shelfLife) score += 10;
    return { ...p, score };
  }).sort((a, b) => b.score - a.score);

  const baseline   = scored[0];
  const matchScore = baseline.score;
  const topAnalogs = scored.slice(0, 3).map(p => ({
    name: p.name, score: p.score, similarity: Math.round(p.score), baseSales: p.baseSales, basePrice: p.basePrice,
  }));

  // Attribute contributions
  const contributions = [
    { attr:'Category',    pts: form.category === baseline.category ? 30 : 0,       max:30 },
    { attr:'Target Demo', pts: form.targetDemo === baseline.targetDemo ? 20 : 0,   max:20 },
    { attr:'Brand Tier',  pts: form.tier === baseline.tier ? 15 : 0,               max:15 },
    { attr:'Storage',     pts: form.storage === baseline.storage ? 15 : 0,         max:15 },
    { attr:'Format',      pts: form.format === baseline.format ? 10 : 0,           max:10 },
    { attr:'Shelf Life',  pts: form.shelfLife === baseline.shelfLife ? 10 : 0,     max:10 },
  ];

  // Category-specific price elasticity
  const ELASTICITY = {
    'Food & Beverage': -0.65, 'Personal Care': -0.45,
    'Home Care & Cleaning': -0.40, 'Electronics': -0.22,
  };
  const elasticity = ELASTICITY[form.category] || -0.50;

  // Channel demand multiplier
  const CHANNEL_MULT = {
    'Modern Retail': 1.00, 'Hybrid': 1.08,
    'E-commerce': 0.82, 'Traditional/Bazaar': 0.74,
  };
  const channelMult = CHANNEL_MULT[form.channel] || 1.00;
  const channelLabel = channelMult !== 1.00
    ? `${form.channel} ${channelMult > 1 ? '+' : ''}${Math.round((channelMult - 1) * 100)}%`
    : form.channel;

  // Forecast — log-linear (constant elasticity) model: Q = Q0 × (P/P0)^e
  // Never goes negative; valid across large price ranges unlike the linear approximation
  const priceGapPercent = ((newPrice - baseline.basePrice) / baseline.basePrice) * 100;
  const predictedTotal  = Math.max(1, Math.round(
    baseline.baseSales * Math.pow(newPrice / baseline.basePrice, elasticity) * channelMult
  ));
  const errorRate       = parseFloat((Math.abs(priceGapPercent) * 0.08 + 1.9 + (100 - matchScore) * 0.03).toFixed(1));
  const confidence      = parseFloat((100 - errorRate).toFixed(1));
  const projectedRevenue = Math.round(predictedTotal * newPrice);

  // Risk
  const riskLevel =
    form.shelfLife === 'Short (<7 Days)'     ? { label:'HIGH',   sub:'Spoilage Risk',  level:'high'   }
    : priceGapPercent > 25                   ? { label:'HIGH',   sub:'Overpriced',     level:'high'   }
    : priceGapPercent > 10                   ? { label:'MEDIUM', sub:'Watch Price',    level:'medium' }
    :                                          { label:'LOW',    sub:'Stable',         level:'low'    };

  // EOQ / Procurement — holding rate and lead time vary by storage type
  const annualDemand   = predictedTotal * 12;
  const orderingCost   = 45;
  const holdingRates   = { 'Frozen (-18°C)': 0.35, 'Chilled (+4°C)': 0.28, 'Special Handling': 0.30, 'Ambient (Dry)': 0.22 };
  const holdingCost    = Math.max(0.01, newPrice * (holdingRates[form.storage] || 0.22));
  const eoq            = Math.max(1, Math.round(Math.sqrt((2 * annualDemand * orderingCost) / holdingCost)));
  const demandStd      = Math.round(baseline.baseSales * 0.15);
  const leadTimeWeeks  = { 'Frozen (-18°C)': 4, 'Chilled (+4°C)': 3, 'Special Handling': 3, 'Ambient (Dry)': 2 }[form.storage] || 2;
  const safetyStock    = Math.round(1.65 * demandStd * Math.sqrt(leadTimeWeeks));
  const rop            = Math.round((predictedTotal / 4) * leadTimeWeeks + safetyStock);
  const firstOrderQty  = eoq + safetyStock;

  // Launch score
  const launchScore = computeLaunchScore(form, matchScore);

  // Allocation (filtered)
  const rawAlloc  = ALLOCATIONS[form.targetDemo] || ALLOCATIONS['General/Mass'];
  const allocRows = filterAllocation(rawAlloc, form.region).map(a => ({
    ...a, units: Math.round(predictedTotal * a.pct / 100),
  }));

  // Financing — working capital multiplier varies by storage complexity
  const wcMultipliers  = { 'Frozen (-18°C)': 3.2, 'Chilled (+4°C)': 2.6, 'Special Handling': 2.8, 'Ambient (Dry)': 2.1 };
  const workingCapital = Math.round(predictedTotal * 0.15 * newPrice * (wcMultipliers[form.storage] || 2.1));
  const REGION_MULT = { 'Baku Only': 1.16, 'Baku + Sumgayit': 1.24, 'National': 1.38 };
  const COMP_MULT   = { 'Low (0-2 competitors)': 1.12, 'Medium (3-5 competitors)': 1.00, 'High (5+ competitors)': 0.88 };
  const BUDGET_MULT = { '< 20K AZN': 0.90, '20–50K AZN': 1.00, '50–200K AZN': 1.12, '200K+ AZN': 1.22 };
  const finMult    = (REGION_MULT[form.region] || 1.24) * (COMP_MULT[form.competition] || 1.0) * (BUDGET_MULT[form.launchBudget] || 1.0);
  const financedUnits = Math.round(predictedTotal * finMult);
  const upliftPct  = Math.round((finMult - 1) * 100);
  const financingProduct =
    workingCapital < 20000   ? { name:'Pilot Listing Program',       desc:'Up to 3 stores · Trial phase · Fast onboarding'                }
    : workingCapital < 100000 ? { name:'Regional Vendor Program',     desc:'All Baku stores · Co-marketing support · 12-month contract'   }
    :                           { name:'Strategic Supply Partner',    desc:'All Bravo locations · Dedicated shelf space · Analytics access' };

  // Chart data — shape varies by seasonality, starts from current calendar month
  const startMonth = new Date().getMonth();
  const months     = Array.from({ length: 8 }, (_, i) => MONTH_ABBR[(startMonth + i) % 12]);
  const errF = errorRate / 100;
  const seasonShape =
    form.seasonality === 'Peak Season Product' ? [0.40, 0.55, 0.75, 0.92, 1.00, 0.95, 0.82, 0.68]
    : form.seasonality === 'Seasonal Only'     ? [0.18, 0.32, 0.68, 1.00, 0.96, 0.58, 0.28, 0.14]
    :                                            [0.25, 0.35, 0.45, 0.57, 0.67, 0.76, 0.88, 1.00];
  const chartData = months.map((month, i) => {
    const pred = Math.round(predictedTotal * seasonShape[i] * (1 + Math.sin(i) * 0.02));
    return {
      month,
      Baseline:  Math.round(baseline.baseSales * (0.3 + (i / 7) * 0.7)),
      Predicted: pred,
      Upper:     Math.round(pred * (1 + errF * 1.2)),
      Lower:     Math.round(pred * (1 - errF * 0.8)),
    };
  });

  // Cash flow
  const cashFlowData = [0,1,2,3,4,5].map(i => {
    const invest = i === 0 ? -Math.round(workingCapital * 0.55)
                 : i === 1 ? -Math.round(workingCapital * 0.28)
                 : i === 2 ? -Math.round(workingCapital * 0.10) : 0;
    const rev = i < 2 ? Math.round(projectedRevenue / 8 * (i + 0.5))
              : Math.round(projectedRevenue / 8 * (i * 1.4));
    return { month:`M${i+1}`, investment: invest, revenue: rev, net: invest + rev };
  });
  const breakevenMonth = cashFlowData.findIndex(d => d.net >= 0) + 1;

  // Price sensitivity — same log-linear model
  const sensitivityScenarios = [-0.10, 0, 0.10].map(delta => {
    const p   = newPrice * (1 + delta);
    const vol = Math.max(1, Math.round(baseline.baseSales * Math.pow(p / baseline.basePrice, elasticity) * channelMult));
    return { delta, price: parseFloat(p.toFixed(2)), volume: vol, diff: vol - predictedTotal };
  });

  // Seasonal markers
  const seasonalMarkers = getSeasonalMarkers(form.category, form.seasonality);

  // Competitor positioning
  const compPrice = form.competitorPrice ? parseFloat(form.competitorPrice) : null;
  const compGap   = compPrice ? ((newPrice - compPrice) / compPrice * 100).toFixed(1) : null;

  // Optimal launch window — month where cumulative 3-month demand is highest
  let bestLaunchIdx = 0, bestCum = 0;
  chartData.forEach((_, i) => {
    if (i > chartData.length - 3) return;
    const cum = chartData.slice(i, i + 3).reduce((s, d) => s + d.Predicted, 0);
    if (cum > bestCum) { bestCum = cum; bestLaunchIdx = i; }
  });
  const optimalLaunchMonth = months[bestLaunchIdx];

  // Forecast attribution — decompose how the final number was built
  const afterPrice          = Math.round(baseline.baseSales * Math.pow(newPrice / baseline.basePrice, elasticity));
  const forecastAttribution = {
    baseline:      baseline.baseSales,
    priceEffect:   afterPrice - baseline.baseSales,
    channelEffect: predictedTotal - afterPrice,
    total:         predictedTotal,
  };

  return {
    baseline, matchScore, topAnalogs, contributions,
    newPrice, priceGapPercent, predictedTotal, errorRate, confidence, projectedRevenue,
    channelLabel, elasticity, channelMult,
    riskLevel, eoq, safetyStock, rop, firstOrderQty,
    launchScore, allocRows,
    storeCount: REGION_STORES[form.region] || 67,
    shelfPlacement: getShelfPlacement(form.category, form.tier, form.storage),
    workingCapital, financingProduct, financedUnits, upliftPct,
    chartData, cashFlowData, breakevenMonth, sensitivityScenarios, seasonalMarkers,
    compGap, forecastAttribution, optimalLaunchMonth,
  };
}

// ─── Shared UI ─────────────────────────────────────────────────────────────

const FIELD = 'w-full px-3 py-2.5 border border-zinc-200 rounded-md text-sm text-zinc-900 bg-white focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-colors duration-150';
const LABEL = 'block text-sm font-medium text-zinc-700 mb-1.5';

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg width="24" height="28" viewBox="0 0 26 30" fill="none" aria-label="Bravo">
        <polygon points="13,0.5 25.6,7.75 25.6,22.25 13,29.5 0.4,22.25 0.4,7.75" fill="#009A44" />
        <text x="13" y="18" textAnchor="middle" fontFamily="DM Sans,system-ui,sans-serif" fontWeight="900" fontSize="7" fill="white" letterSpacing="0.5">BRAVO</text>
      </svg>
      <span className="font-bold text-zinc-900 text-sm tracking-tight">Flow</span>
    </div>
  );
}

function AiBadge() {
  return (
    <span className="text-xs text-zinc-500 font-medium px-2 py-1 border border-zinc-200 rounded bg-white">
      Ensemble AI v3.1
    </span>
  );
}

const STEP_LABELS = ['Core Identity', 'Logistics', 'Market Intel', 'Business'];

function StepDots({ current }) {
  return (
    <div className="mb-6">
      <div className="flex items-center">
        {[0,1,2,3].map(i => (
          <div key={i} className="flex items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors duration-200 ${
              i < current  ? 'bg-blue-700 text-white'
              : i === current ? 'bg-zinc-900 text-white'
              : 'bg-zinc-100 text-zinc-400'
            }`}>
              {i < current ? '✓' : i + 1}
            </div>
            {i < 3 && (
              <div className={`h-px w-10 mx-1 transition-colors duration-300 ${i < current ? 'bg-blue-700' : 'bg-zinc-200'}`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex mt-1.5" style={{ gap: 0 }}>
        {[0,1,2,3].map(i => (
          <div key={i} className="flex items-center">
            <span className={`text-xs ${i === current ? 'text-zinc-900 font-medium' : 'text-zinc-400'}`}
                  style={{ width: i < 3 ? '44px' : undefined }}>
              {STEP_LABELS[i]}
            </span>
            {i < 3 && <div style={{ width: '12px' }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AI Pulse ──────────────────────────────────────────────────────────────

const PULSE_TEXTS = [
  'Encoding product DNA attributes...',
  'Running ensemble demand models...',
  'Sizing working capital requirement...',
  'Simulating branch traffic patterns...',
];

const PULSE_STEPS = [
  'Product DNA encoded',
  'KNN match found',
  'Demand models run',
  'Cash flow sized',
];

function AIPulseScreen() {
  const [textIdx, setTextIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState([]);

  useEffect(() => {
    const t = setInterval(() => setTextIdx(i => (i + 1) % PULSE_TEXTS.length), 620);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(100, Math.round((elapsed / 2700) * 100)));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timers = [700, 1350, 1950, 2450].map((delay, i) =>
      setTimeout(() => setVisibleSteps(prev => [...prev, i]), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      key="pulse"
      className="fixed inset-0 bg-white flex items-center justify-center z-50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="w-80">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-zinc-900 rounded flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" strokeWidth={1.5} />
          </div>
          <div>
            <div className="font-bold text-zinc-900 text-sm">Analyzing Product</div>
            <div className="h-5 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={textIdx}
                  className="text-zinc-500 text-xs"
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                >
                  {PULSE_TEXTS[textIdx]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="h-1 bg-zinc-100 rounded-sm mb-5">
          <div
            className="h-full bg-blue-700 rounded-sm transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-2">
          {PULSE_STEPS.map((step, i) => (
            <div key={step} className={`flex items-center gap-2 text-xs transition-opacity duration-200 ${visibleSteps.includes(i) ? 'opacity-100' : 'opacity-0'}`}>
              <CheckCircle className="w-3.5 h-3.5 text-blue-700" />
              <span className="text-zinc-600">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Animated Number ───────────────────────────────────────────────────────

function AnimatedNumber({ target, duration = 1300 }) {
  const [val, setVal] = useState(0);
  const raf = useRef(null);
  const start = useRef(null);
  useEffect(() => {
    start.current = null;
    const tick = ts => {
      if (!start.current) start.current = ts;
      const p = Math.min((ts - start.current) / duration, 1);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return <>{val.toLocaleString()}</>;
}

// ─── Dispatch Matrix ───────────────────────────────────────────────────────

function DispatchMatrix({ rows }) {
  const [widths, setWidths] = useState(rows.map(() => 0));
  useEffect(() => {
    rows.forEach((_, i) =>
      setTimeout(() => setWidths(prev => prev.map((w, j) => j === i ? rows[i].pct : w)), i * 130)
    );
  }, [rows]);
  return (
    <div className="space-y-4">
      {rows.map((row, i) => (
        <div key={row.branch}>
          <div className="flex items-center justify-between mb-1">
            <div>
              <span className="text-sm font-medium text-zinc-900">{row.branch}</span>
              <span className="text-xs text-zinc-400 ml-2">{row.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-zinc-900 font-mono tabular-nums">
                <AnimatedNumber target={row.units} />
              </span>
              <span className="text-xs text-zinc-400">units</span>
              <span className="text-xs font-medium text-zinc-600 w-7 text-right">{row.pct}%</span>
            </div>
          </div>
          <div className="text-xs text-zinc-400 mb-1">{row.demo}</div>
          <div className="h-1.5 bg-zinc-100 rounded-sm overflow-hidden">
            <div
              className="h-full rounded-sm transition-all ease-out"
              style={{ width:`${widths[i]}%`, transitionDuration:'1.3s', background: row.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Azerbaijan Map ─────────────────────────────────────────────────────────

function AzMapViz({ allocRows }) {
  const CITY_COORDS = {
    'Baku':     { x: 218, y: 82 },
    'Sumgayit': { x: 212, y: 57 },
    'Ganja':    { x: 76,  y: 78 },
  };
  const cityTotals = {};
  allocRows.forEach(r => { cityTotals[r.city] = (cityTotals[r.city] || 0) + r.pct; });
  const maxPct = Math.max(...Object.values(cityTotals), 1);
  return (
    <svg viewBox="0 0 260 140" className="w-full" style={{ height: 96 }}>
      <polygon
        points="20,60 38,30 72,20 112,24 145,20 178,30 205,22 232,42 250,68 244,92 226,108 200,118 168,132 130,137 90,132 60,122 32,110 18,90"
        fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5"
      />
      <path d="M250,68 C258,76 260,88 253,98 L244,92 Z" fill="#dbeafe" fillOpacity="0.65" />
      {Object.entries(CITY_COORDS).map(([city, pos]) => {
        const pct = cityTotals[city] || 0;
        if (pct === 0) return null;
        const r = 5 + (pct / maxPct) * 11;
        return (
          <g key={city}>
            <circle cx={pos.x} cy={pos.y} r={r} fill="#1d4ed8" fillOpacity="0.14" stroke="#1d4ed8" strokeWidth="1.5" />
            <circle cx={pos.x} cy={pos.y} r={3} fill="#1d4ed8" />
            <text x={pos.x} y={pos.y - r - 3} textAnchor="middle" fontSize="8" fill="#64748b" fontFamily="DM Sans,system-ui,sans-serif">{city}</text>
            <text x={pos.x} y={pos.y + r + 9} textAnchor="middle" fontSize="8" fill="#1d4ed8" fontFamily="DM Sans,system-ui,sans-serif" fontWeight="700">{pct}%</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Animated Score Bars ───────────────────────────────────────────────────

function ScoreBars({ bars, color }) {
  const [widths, setWidths] = useState(bars.map(() => 0));
  useEffect(() => {
    bars.forEach((_, i) =>
      setTimeout(() => setWidths(prev => prev.map((w, j) => j === i ? bars[i].pct : w)), i * 120)
    );
  }, [bars]);
  return (
    <div className="space-y-2.5">
      {bars.map((bar, i) => (
        <div key={bar.label}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-zinc-500">{bar.label}</span>
            <span className="text-xs font-semibold text-zinc-700 font-mono">{bar.pts}/{bar.max}</span>
          </div>
          <div className="h-1 bg-zinc-100 rounded-sm overflow-hidden">
            <div
              className="h-full rounded-sm transition-all ease-out"
              style={{ width:`${widths[i]}%`, transitionDuration:'0.9s', background: color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Section Info Tooltip ──────────────────────────────────────────────────

function SectionInfo({ text }) {
  return (
    <div className="relative group shrink-0">
      <Info className="w-3 h-3 text-zinc-300 cursor-help" />
      <div className="absolute left-0 top-5 w-72 bg-zinc-900 text-white text-xs rounded-md p-3 hidden group-hover:block z-30 shadow-lg leading-relaxed whitespace-normal">
        {text}
      </div>
    </div>
  );
}

// ─── Tooltips ──────────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-zinc-200 rounded-md px-3 py-2.5 shadow text-xs min-w-[130px]">
      <p className="font-medium text-zinc-700 mb-1.5">{label}</p>
      {payload.filter(p => p.dataKey !== 'Upper' && p.dataKey !== 'Lower').map(p => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 mb-1 last:mb-0">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-sm inline-block" style={{ background: p.color }} />
            <span className="text-zinc-500">{p.dataKey}</span>
          </div>
          <span className="font-semibold text-zinc-900">{p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

function CashTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-zinc-200 rounded-md px-3 py-2 shadow text-xs">
      <p className="font-medium text-zinc-700 mb-1">{label}</p>
      {payload.map(p => p.value !== 0 && (
        <div key={p.dataKey} className="flex justify-between gap-3">
          <span className="text-zinc-500 capitalize">{p.dataKey}</span>
          <span className={`font-semibold ${p.value < 0 ? 'text-red-600' : 'text-zinc-900'}`}>
            {p.value < 0 ? '' : '+'}{p.value?.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Competitor Chart ──────────────────────────────────────────────────────

function CompetitorChart({ topAnalogs, newPrice, predictedTotal, compPrice, elasticity, channelMult, baseline, productName }) {
  const analogDots = topAnalogs.map(a => ({ x: a.basePrice, y: a.baseSales, label: a.name }));
  const yourDot    = [{ x: newPrice, y: predictedTotal, label: productName }];
  let   compDot    = [];
  if (compPrice) {
    const vol = Math.max(1, Math.round(baseline.baseSales * Math.pow(compPrice / baseline.basePrice, elasticity) * channelMult));
    compDot   = [{ x: compPrice, y: vol, label: 'Competitor' }];
  }
  const CustomDot = ({ cx, cy, payload, fill }) => {
    if (!cx || !cy) return null;
    return (
      <g>
        <circle cx={cx} cy={cy} r={7} fill={fill} fillOpacity={0.85} stroke="white" strokeWidth={1.5} />
        <text x={cx} y={cy - 12} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="DM Sans,system-ui">{payload?.label}</text>
      </g>
    );
  };
  return (
    <ResponsiveContainer width="100%" height={180}>
      <ScatterChart margin={{ top:20, right:20, bottom:8, left:0 }}>
        <CartesianGrid stroke="#f4f4f5" strokeDasharray="3 3" />
        <XAxis dataKey="x" type="number" domain={['auto','auto']}
          tick={{ fill:'#a1a1aa', fontSize:11 }} axisLine={false} tickLine={false}
          tickFormatter={v => `${v.toFixed(2)} ₼`} />
        <YAxis dataKey="y" type="number" domain={['auto','auto']}
          tick={{ fill:'#a1a1aa', fontSize:11 }} axisLine={false} tickLine={false}
          tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
        <Tooltip cursor={{ strokeDasharray:'3 3' }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0]?.payload;
            return (
              <div className="bg-white border border-zinc-200 rounded-md px-3 py-2 shadow text-xs">
                <p className="font-medium text-zinc-800 mb-0.5">{d?.label}</p>
                <p className="text-zinc-500">{d?.x?.toFixed(2)} AZN · {d?.y?.toLocaleString()} units/mo</p>
              </div>
            );
          }}
        />
        <Scatter name="Analogs"      data={analogDots} fill="#94a3b8" shape={<CustomDot fill="#94a3b8" />} />
        <Scatter name="Your Product" data={yourDot}    fill="#1d4ed8" shape={<CustomDot fill="#1d4ed8" />} />
        {compDot.length > 0 && <Scatter name="Competitor" data={compDot} fill="#dc2626" shape={<CustomDot fill="#dc2626" />} />}
      </ScatterChart>
    </ResponsiveContainer>
  );
}

// ─── Launch Timeline ────────────────────────────────────────────────────────

const TIMELINE_STEPS = [
  { label:'Application', sub:'Analysis submitted',    done:true  },
  { label:'Review',      sub:'Category team scoring', active:true },
  { label:'Negotiate',   sub:'Pricing & margins',     done:false  },
  { label:'Planogram',   sub:'Shelf slot assigned',   done:false  },
  { label:'First Order', sub:'PO issued & delivered', done:false  },
  { label:'Go Live',     sub:'In-store setup',        done:false  },
  { label:'Monitor',     sub:'Sales tracking begins', done:false  },
];

function LaunchTimeline() {
  return (
    <div className="relative pt-1">
      <div className="absolute top-4 left-[3.5%] right-[3.5%] h-px bg-zinc-200" />
      <div className="relative flex justify-between">
        {TIMELINE_STEPS.map((step, i) => (
          <div key={step.label} className="flex flex-col items-center" style={{ width:`${100/TIMELINE_STEPS.length}%` }}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 z-10 transition-colors ${
              step.done   ? 'bg-blue-700 border-blue-700 text-white'
              : step.active ? 'bg-white border-blue-700 text-blue-700'
              : 'bg-white border-zinc-200 text-zinc-400'
            }`}>
              {step.done ? '✓' : i + 1}
            </div>
            <div className={`text-xs font-medium mt-2 text-center leading-tight ${!step.done && !step.active ? 'text-zinc-400' : 'text-zinc-800'}`}>{step.label}</div>
            <div className="text-xs text-zinc-400 text-center leading-tight mt-0.5 hidden sm:block">{step.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Readiness Checklist ───────────────────────────────────────────────────

const READINESS_ITEMS = [
  { id:'barcode',   label:'EAN/barcode registered'    },
  { id:'images',    label:'Product images (hi-res)'   },
  { id:'halal',     label:'Halal / food safety cert'  },
  { id:'label',     label:'Azerbaijani ingredient label' },
  { id:'packaging', label:'Shelf-ready packaging'     },
  { id:'moq',       label:'Min. order qty confirmed'  },
  { id:'insurance', label:'Product liability insurance' },
  { id:'docs',      label:'Company registration docs' },
];

// ─── Financing Modal ───────────────────────────────────────────────────────

function FinancingModal({ product, workingCapital, onClose, onSubmit, vendorForm, results }) {
  const [done, setDone] = useState(false);
  const [ref] = useState(() => `BF-${Math.floor(100000 + Math.random() * 900000)}`);
  const [f, setF] = useState({ name:'', company:'', phone:'' });
  const submit = e => {
    e.preventDefault();
    setDone(true);
    if (onSubmit) onSubmit({
      id: ref, timestamp: Date.now(),
      vendor: f.name, company: f.company, phone: f.phone,
      form: vendorForm,
      metrics: {
        score:     results?.launchScore?.total,
        verdict:   results?.launchScore?.verdict,
        level:     results?.launchScore?.level,
        volume:    results?.predictedTotal,
        revenue:   results?.projectedRevenue,
        risk:      results?.riskLevel?.label,
        riskLevel: results?.riskLevel?.level,
        confidence:results?.confidence,
      },
      status: 'pending',
    });
  };
  return (
    <motion.div
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="bg-white rounded-md border border-zinc-200 p-7 max-w-md w-full shadow-lg"
        initial={{ scale:0.97, opacity:0, y:8 }} animate={{ scale:1, opacity:1, y:0 }}
        exit={{ scale:0.97, opacity:0, y:8 }} transition={{ duration:0.18 }}
      >
        {!done ? (
          <>
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Landmark className="w-3.5 h-3.5 text-blue-700" />
                  <span className="text-xs font-semibold text-blue-700">Bravo</span>
                </div>
                <h2 className="text-lg font-bold text-zinc-900">Apply for {product.name}</h2>
                <p className="text-zinc-500 text-sm mt-0.5">Est. working capital {workingCapital.toLocaleString()} AZN · {product.desc}</p>
              </div>
              <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors p-1 -mt-1 -mr-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={submit} className="space-y-3.5">
              {[{l:'Full Name',k:'name',t:'text',p:'Your full name'},{l:'Company',k:'company',t:'text',p:'Company name'},{l:'Phone',k:'phone',t:'tel',p:'+994 XX XXX XX XX'}].map(({l,k,t,p})=>(
                <div key={k}>
                  <label className={LABEL}>{l}</label>
                  <input type={t} placeholder={p} required value={f[k]} onChange={e=>setF(x=>({...x,[k]:e.target.value}))} className={FIELD} />
                </div>
              ))}
              <button type="submit" className="w-full mt-1 bg-blue-700 text-white font-semibold py-2.5 rounded-md hover:bg-blue-800 transition-colors duration-150 text-sm">
                Submit Application
              </button>
              <p className="text-center text-zinc-400 text-xs">Advisor will contact you within 24 hours</p>
            </form>
          </>
        ) : (
          <motion.div className="text-center py-3" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.2 }}>
            <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-zinc-900 mb-2">Application Submitted</h3>
            <p className="text-zinc-500 text-sm mb-4">A Bravo category manager will contact you within 3 business days.</p>
            <div className="bg-zinc-50 border border-zinc-200 rounded-md px-4 py-2 inline-flex items-center gap-2 mb-5">
              <span className="text-xs text-zinc-500">Reference</span>
              <span className="text-sm font-mono font-bold text-zinc-900">{ref}</span>
            </div>
            <button onClick={onClose} className="w-full bg-zinc-900 text-white font-semibold py-2.5 rounded-md hover:bg-zinc-800 transition-colors text-sm">Close</button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── App State ─────────────────────────────────────────────────────────────

const SCREENS = { S1:'s1', S2:'s2', S3:'s3', S4:'s4', PULSE:'pulse', DASH:'dash', MANAGER:'manager', COMPARE:'compare' };

const STEP_CONTEXT = [
  {
    heading: 'What you\'ll get',
    items: [
      { Icon: BarChart3,  text: 'KNN demand forecast vs 10 analog SKUs' },
      { Icon: Target,     text: 'Launch Viability Score out of 100' },
      { Icon: TrendingUp, text: '8-month demand curve with confidence band' },
      { Icon: Cpu,        text: 'Gemini AI market intelligence report' },
    ],
    footerLabel: 'Bravo Network',
    footerStats: ['67 stores nationwide', 'Baku · Sumgayit · Ganja', '2.4M+ monthly shoppers'],
  },
  {
    heading: 'Why it matters',
    items: [
      { Icon: Package,    text: 'Storage type sets your working capital floor' },
      { Icon: Activity,   text: 'Shelf life determines spoilage risk and markdown schedule' },
      { Icon: BarChart3,  text: 'Format drives EOQ batch sizing and safety stock' },
    ],
    footerLabel: 'Bravo Supply Chain',
    footerStats: ['Cold chain across all 67 stores', '48h restocking cycle in Baku', '2–4 week vendor lead times'],
  },
  {
    heading: 'Azerbaijan market',
    items: [
      { Icon: Globe2,     text: 'Baku: 2.4M residents · largest consumer market' },
      { Icon: TrendingUp, text: 'Modern retail growing ~9% YoY since 2022' },
      { Icon: Star,       text: 'Nowruz + summer = two major demand spikes per year' },
    ],
    footerLabel: 'Channel mix',
    footerStats: ['Modern retail 58%', 'Traditional bazaar 28%', 'E-commerce 14%'],
  },
  {
    heading: 'Partnership tiers',
    items: [
      { Icon: Building2,  text: 'Pilot Listing — up to 3 stores, trial phase' },
      { Icon: Globe2,     text: 'Regional Vendor — all Baku stores + co-marketing' },
      { Icon: Star,       text: 'Strategic Partner — 67 stores + shelf analytics' },
    ],
    footerLabel: 'Decision timeline',
    footerStats: ['Application: instant', 'Review: 3 business days', 'Onboarding: 2–4 weeks'],
  },
];

// ─── Live Preview (replaces static PreviewPanel) ──────────────────────────

const PANEL_CLS = 'flex-1 border-t sm:border-t-0 sm:border-l border-zinc-100 p-7 flex flex-col bg-zinc-50 rounded-b-md sm:rounded-b-none sm:rounded-r-md min-w-0';

function LivePreview({ form }) {
  const valid = form?.name?.trim() && form?.price && parseFloat(form?.price) > 0;
  if (!valid) {
    return (
      <div className={PANEL_CLS}>
        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">Live Preview</div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <BarChart3 className="w-7 h-7 text-zinc-200 mb-3" />
          <p className="text-xs text-zinc-400 text-center leading-relaxed">
            Enter a product name and price<br />to see a live forecast estimate
          </p>
        </div>
        <div className="mt-auto pt-5 border-t border-zinc-100">
          <div className="space-y-1.5">
            {['67 stores · 5 locations', 'KNN across 10 analog SKUs', 'Gemini AI market report'].map((s,i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-700 shrink-0" />
                <span className="text-xs text-zinc-400">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  try {
    const p = computeResults(form);
    const s = p.launchScore.total >= 75 ? { cls:'text-green-700', bg:'bg-green-50 border-green-200', bar:'bg-green-500' }
            : p.launchScore.total >= 50 ? { cls:'text-amber-700',  bg:'bg-amber-50 border-amber-200',  bar:'bg-amber-400'  }
            :                             { cls:'text-red-700',    bg:'bg-red-50 border-red-200',      bar:'bg-red-400'    };
    return (
      <div className={PANEL_CLS}>
        <div className="flex items-center gap-2 mb-4">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Live Preview</div>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        </div>

        {/* Score + volume */}
        <div className={`border rounded-md p-3 mb-3 ${s.bg}`}>
          <div className="flex items-end justify-between mb-2">
            <div>
              <div className="text-xs opacity-50 mb-0.5">Viability Score</div>
              <div className={`text-4xl font-black leading-none ${s.cls}`}>{p.launchScore.total}</div>
              <div className="text-xs opacity-50 mt-0.5">/100</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-zinc-400 mb-0.5">Volume</div>
              <div className="text-2xl font-black text-zinc-900 leading-none">{p.predictedTotal.toLocaleString()}</div>
              <div className="text-xs text-zinc-400 mt-0.5">units/mo</div>
            </div>
          </div>
          <div className={`text-xs font-medium px-2 py-0.5 rounded border inline-block ${s.bg} ${s.cls}`}>{p.launchScore.verdict}</div>
        </div>

        {/* KNN match */}
        <div className="bg-white border border-zinc-200 rounded-md p-3 mb-2.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-zinc-400">KNN Analog</span>
            <span className="text-xs font-mono text-blue-700">{p.matchScore}pt match</span>
          </div>
          <div className="text-sm font-semibold text-zinc-800 leading-tight truncate">{p.baseline.name}</div>
          <div className="text-xs text-zinc-400 mt-0.5">{p.baseline.baseSales.toLocaleString()} units/mo baseline</div>
          <div className="h-1 bg-zinc-100 rounded-sm mt-1.5">
            <div className="h-full bg-blue-700 rounded-sm transition-all duration-300" style={{ width:`${p.matchScore}%` }} />
          </div>
        </div>

        {/* Price position */}
        <div className="bg-white border border-zinc-200 rounded-md p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Price vs. analog</span>
            <span className={`text-xs font-semibold ${p.priceGapPercent > 10 ? 'text-red-600' : p.priceGapPercent < -5 ? 'text-green-600' : 'text-zinc-500'}`}>
              {p.priceGapPercent > 0 ? '+' : ''}{p.priceGapPercent.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm font-semibold text-zinc-800">{parseFloat(form.price).toFixed(2)} AZN</span>
            <span className="text-xs text-zinc-400">analog: {p.baseline.basePrice.toFixed(2)} AZN</span>
          </div>
        </div>

        <div className="mt-auto pt-4 text-center">
          <span className="text-xs text-zinc-300">Updates live with each field</span>
        </div>
      </div>
    );
  } catch { return null; }
}

// ─── Live Estimate Strip (steps 1-3 top bar) ───────────────────────────────

function LiveEstimateStrip({ form }) {
  if (!form?.name?.trim() || !form?.price || parseFloat(form?.price) <= 0) return null;
  try {
    const p = computeResults(form);
    return (
      <div className="bg-white border border-zinc-200 rounded-md p-3 mb-4">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Live Estimate</span>
        </div>
        <div className="grid grid-cols-3 gap-1 text-center divide-x divide-zinc-100">
          {[
            { val: p.launchScore.total,    sub: 'Score /100' },
            { val: p.predictedTotal >= 1000 ? `${(p.predictedTotal/1000).toFixed(0)}k` : p.predictedTotal, sub: 'Units/mo' },
            { val: p.projectedRevenue >= 1000 ? `${(p.projectedRevenue/1000).toFixed(0)}k` : p.projectedRevenue, sub: 'AZN/mo' },
          ].map(({ val, sub }) => (
            <div key={sub}>
              <div className="text-base font-black text-zinc-900 leading-none">{val}</div>
              <div className="text-xs text-zinc-400 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch { return null; }
}

function RightPanel({ step, liveData }) {
  if (step === 0) return <LivePreview form={liveData} />;
  const ctx = STEP_CONTEXT[step];
  if (!ctx) return null;
  return (
    <div className={PANEL_CLS}>
      <LiveEstimateStrip form={liveData} />
      <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">{ctx.heading}</div>
      <div className="space-y-3.5 flex-1">
        {ctx.items.map(({ Icon, text }, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded bg-white border border-zinc-200 flex items-center justify-center shrink-0">
              <Icon className="w-3 h-3 text-blue-700" />
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed pt-0.5">{text}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-5 border-t border-zinc-200">
        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">{ctx.footerLabel}</div>
        <div className="space-y-1.5">
          {ctx.footerStats.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-blue-700 shrink-0" />
              <span className="text-xs text-zinc-500">{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const HEX_FIELDS = [
  { x:'-3%', y:'-2%', s:170, fo:0.035, so:0.055, dur:12, d:0   },
  { x:'90%', y:'-3%', s:155, fo:0.030, so:0.050, dur:11, d:1.8 },
  { x:'-4%', y:'82%', s:160, fo:0.035, so:0.055, dur:13, d:3.2 },
  { x:'88%', y:'80%', s:145, fo:0.030, so:0.048, dur:10, d:0.9 },
  { x:'4%',  y:'35%', s:85,  fo:0.055, so:0.085, dur:8,  d:1.4 },
  { x:'1%',  y:'62%', s:65,  fo:0.065, so:0.095, dur:7,  d:4.1 },
  { x:'10%', y:'18%', s:50,  fo:0.070, so:0.100, dur:9,  d:2.6 },
  { x:'87%', y:'32%', s:80,  fo:0.055, so:0.085, dur:8,  d:0.6 },
  { x:'93%', y:'58%', s:60,  fo:0.065, so:0.095, dur:9,  d:3.5 },
  { x:'82%', y:'15%', s:55,  fo:0.070, so:0.100, dur:7,  d:2.0 },
  { x:'38%', y:'-1%', s:60,  fo:0.055, so:0.080, dur:10, d:0.3 },
  { x:'55%', y:'93%', s:55,  fo:0.060, so:0.085, dur:8,  d:5.0 },
];

function HexBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {HEX_FIELDS.map((h, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: h.x, top: h.y }}
          animate={{ y: [0, -14, 0], rotate: [0, 4, 0] }}
          transition={{ duration: h.dur, delay: h.d, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width={h.s} height={Math.round(h.s * 1.15)} viewBox="0 0 26 30" fill="none">
            <polygon
              points="13,0.5 25.6,7.75 25.6,22.25 13,29.5 0.4,22.25 0.4,7.75"
              fill="#009A44" fillOpacity={h.fo}
              stroke="#009A44" strokeOpacity={h.so} strokeWidth="0.8"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

function WizardCard({ children, step = null, liveData = null }) {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 relative overflow-hidden">
      <HexBg />
      <div className={`relative z-10 bg-white border border-zinc-200 rounded-md shadow-sm w-full flex flex-col sm:flex-row overflow-hidden ${step !== null ? 'max-w-3xl' : 'max-w-md'}`}>
        <div className={`${step !== null ? 'sm:w-[420px] sm:shrink-0' : ''} w-full p-7`}>
          {children}
        </div>
        {step !== null && <RightPanel step={step} liveData={liveData} />}
      </div>
    </div>
  );
}

function WizardHeader() {
  return (
    <div className="mb-7">
      <Logo />
    </div>
  );
}

function SelectField({ label, value, onChange, opts }) {
  return (
    <div>
      <label className={LABEL}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className={FIELD}>
        {opts.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

const BLANK = {
  name:'', price:'',
  category:'Food & Beverage', tier:'Mass Market',
  format:'Single Serve (<250g/ml)', storage:'Ambient (Dry)',
  shelfLife:'Long (>6 Months)', targetDemo:'General/Mass',
  region:'National', competition:'Medium (3-5 competitors)',
  channel:'Modern Retail', seasonality:'Year-round', competitorPrice:'',
  revenue:'100K–500K AZN', yearsInBiz:'1–3 years',
  bankRelation:'None', launchBudget:'20–50K AZN',
};

const DEMO_FORM = {
  name:'AZ Energy Boost 250ml', price:'3.20',
  category:'Food & Beverage', tier:'Premium',
  format:'Single Serve (<250g/ml)', storage:'Ambient (Dry)',
  shelfLife:'Long (>6 Months)', targetDemo:'High-Income/Professionals',
  region:'National', competition:'Medium (3-5 competitors)',
  channel:'Modern Retail', seasonality:'Year-round', competitorPrice:'2.80',
  revenue:'100K–500K AZN', yearsInBiz:'3–10 years',
  bankRelation:'Active Vendor (3+ SKUs)', launchBudget:'50–200K AZN',
};

async function fetchAIInsights(form, results) {
  try {
    const resp = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ form, results }),
    });
    const data = await resp.json();
    if (data.ok) return data.insights;
    return null;
  } catch {
    return null;
  }
}

const FADE = { initial:{opacity:0}, animate:{opacity:1}, exit:{opacity:0}, transition:{duration:0.2} };

// ─── Main App ──────────────────────────────────────────────────────────────

export default function App() {
  const [screen,         setScreen]         = useState(SCREENS.S1);
  const [modal,          setModal]          = useState(false);
  const [form,           setForm]           = useState(() => {
    try {
      const s = new URLSearchParams(window.location.search).get('s');
      if (s) return JSON.parse(decodeURIComponent(atob(s)));
    } catch {}
    return BLANK;
  });
  const [res,            setRes]            = useState(null);
  const [savedScenarios, setSavedScenarios] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bfScenarios') || '[]'); } catch { return []; }
  });
  const [scenariosOpen,  setScenariosOpen]  = useState(false);
  const [livePrice,      setLivePrice]      = useState(0);
  const [checklist,      setChecklist]      = useState({});
  const [shareCopied,    setShareCopied]    = useState(false);
  const [submissions,    setSubmissions]    = useState(() => {
    try { return JSON.parse(localStorage.getItem('bfSubmissions') || '[]'); } catch { return []; }
  });
  const [managerFilter,  setManagerFilter]  = useState('all');
  const [replyModal,     setReplyModal]     = useState(null);
  const [shockEnabled,   setShockEnabled]   = useState(false);
  const [shockPct,       setShockPct]       = useState(-15);

  useEffect(() => { if (res?.newPrice) setLivePrice(res.newPrice); }, [res?.newPrice]);

  // Auto-run analysis when page is opened via share link
  useEffect(() => {
    try {
      const s = new URLSearchParams(window.location.search).get('s');
      if (s) {
        const f = JSON.parse(decodeURIComponent(atob(s)));
        const computed = computeResults(f);
        setRes({ ...computed, aiInsights: null, aiLoading: true });
        setScreen(SCREENS.PULSE);
        setTimeout(() => setScreen(SCREENS.DASH), 2750);
        fetchAIInsights(f, computed).then(insights =>
          setRes(prev => ({ ...prev, aiInsights: insights, aiLoading: false }))
        );
      }
    } catch {}
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const step1OK = form.name.trim() && form.price && parseFloat(form.price) > 0;

  const toggleCheck = id => setChecklist(prev => ({ ...prev, [id]: !prev[id] }));

  const submit = (overrideForm) => {
    const f = overrideForm || form;
    const computed = computeResults(f);
    setRes({ ...computed, aiInsights: null, aiLoading: true });
    setScreen(SCREENS.PULSE);
    setTimeout(() => setScreen(SCREENS.DASH), 2750);
    fetchAIInsights(f, computed).then(insights =>
      setRes(prev => ({ ...prev, aiInsights: insights, aiLoading: false }))
    );
  };

  const reset = () => { setScreen(SCREENS.S1); setRes(null); setForm(BLANK); window.history.replaceState(null, '', window.location.pathname); };

  const shareAnalysis = () => {
    try {
      const encoded = btoa(encodeURIComponent(JSON.stringify(form)));
      const url = `${window.location.origin}${window.location.pathname}?s=${encoded}`;
      window.history.replaceState(null, '', `?s=${encoded}`);
      navigator.clipboard.writeText(url).catch(() => {});
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2200);
    } catch {}
  };

  const saveScenario = () => {
    if (!res) return;
    const entry = { id: Date.now(), label: form.name, form };
    const updated = [entry, ...savedScenarios.filter(s => s.label !== form.name)].slice(0, 3);
    setSavedScenarios(updated);
    try { localStorage.setItem('bfScenarios', JSON.stringify(updated)); } catch {}
  };

  const loadScenario = (s) => { setScenariosOpen(false); submit(s.form); };

  const addSubmission = (sub) => {
    const updated = [sub, ...submissions];
    setSubmissions(updated);
    try { localStorage.setItem('bfSubmissions', JSON.stringify(updated)); } catch {}
  };

  const updateSubmissionStatus = (id, status) => {
    const target = submissions.find(s => s.id === id);
    const updated = submissions.map(s => s.id === id ? { ...s, status } : s);
    setSubmissions(updated);
    try { localStorage.setItem('bfSubmissions', JSON.stringify(updated)); } catch {}
    if ((status === 'approved' || status === 'needs_info') && target) {
      setReplyModal({ sub: { ...target, status }, status });
    }
  };

  const reviewSubmission = (sub) => {
    if (!sub.form) return;
    const f = sub.form;
    setForm(f);
    const computed = computeResults(f);
    setRes({ ...computed, aiInsights: null, aiLoading: false });
    setScreen(SCREENS.DASH);
  };

  const riskCfg = {
    high:   { bg:'bg-red-50   border-red-200',   text:'text-red-700',   Icon: AlertTriangle },
    medium: { bg:'bg-amber-50 border-amber-200', text:'text-amber-700', Icon: AlertTriangle },
    low:    { bg:'bg-green-50 border-green-200', text:'text-green-700', Icon: ShieldCheck   },
  };

  const scoreCfg = {
    strong:   { accent:'border-l-green-600',  num:'text-green-700',  bar:'#16a34a', bg:'bg-green-50 border-green-200'   },
    moderate: { accent:'border-l-amber-500',  num:'text-amber-700',  bar:'#d97706', bg:'bg-amber-50 border-amber-200'   },
    risky:    { accent:'border-l-red-600',    num:'text-red-700',    bar:'#dc2626', bg:'bg-red-50 border-red-200'       },
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <AnimatePresence mode="wait">

        {/* ── Step 1 ── */}
        {screen === SCREENS.S1 && (
          <motion.div key="s1" {...FADE}>
            <WizardCard step={0} liveData={form}>
              <WizardHeader />
              <StepDots current={0} />
              <div className="mb-5">
                <div className="text-base font-semibold text-zinc-900 mb-0.5">Core Identity</div>
                <p className="text-sm text-zinc-500">Product fundamentals and pricing</p>
              </div>
              <form onSubmit={e => { e.preventDefault(); step1OK && setScreen(SCREENS.S2); }}>
                <div className="space-y-4">
                  <div>
                    <label className={LABEL}>Product Name</label>
                    <input type="text" placeholder="e.g. AZ Energy Boost 250ml"
                      value={form.name} onChange={e => set('name', e.target.value)} className={FIELD} />
                  </div>
                  <div>
                    <label className={LABEL}>Proposed Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-zinc-400 pointer-events-none">AZN</span>
                      <input type="number" step="0.01" min="0.01" placeholder="0.00"
                        value={form.price} onChange={e => set('price', e.target.value)} className={`${FIELD} pl-11`} />
                    </div>
                  </div>
                  <SelectField label="Category" value={form.category} onChange={v => set('category', v)} opts={['Food & Beverage','Home Care & Cleaning','Personal Care','Electronics']} />
                  <SelectField label="Brand Tier" value={form.tier} onChange={v => set('tier', v)} opts={['Economy','Mass Market','Premium','Luxury']} />
                </div>
                <button
                  type="submit"
                  disabled={!step1OK}
                  className="w-full mt-5 bg-blue-700 text-white font-semibold py-2.5 rounded-md hover:bg-blue-800 transition-colors duration-150 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                >
                  Next: Logistics <ChevronRight className="w-4 h-4" />
                </button>
              </form>
              <button
                type="button"
                onClick={() => {
                  setForm(DEMO_FORM);
                  submit(DEMO_FORM);
                }}
                className="w-full mt-2 text-zinc-400 hover:text-zinc-600 transition-colors text-xs py-1.5 text-center"
              >
                Try demo →
              </button>
            </WizardCard>
          </motion.div>
        )}

        {/* ── Step 2 ── */}
        {screen === SCREENS.S2 && (
          <motion.div key="s2" {...FADE}>
            <WizardCard step={1} liveData={form}>
              <WizardHeader />
              <StepDots current={1} />
              <div className="mb-5">
                <div className="text-base font-semibold text-zinc-900 mb-0.5">Logistics & Supply Chain</div>
                <p className="text-sm text-zinc-500">Parameters for <span className="font-medium text-zinc-700">{form.name}</span></p>
              </div>
              <div className="space-y-4">
                <SelectField label="Format / Size" value={form.format} onChange={v => set('format', v)} opts={['Single Serve (<250g/ml)','Standard (250g-1kg)','Bulk/Family (>1kg)']} />
                <SelectField label="Storage Condition" value={form.storage} onChange={v => set('storage', v)} opts={['Ambient (Dry)','Chilled (+4°C)','Frozen (-18°C)','Special Handling']} />
                <SelectField label="Shelf Life" value={form.shelfLife} onChange={v => set('shelfLife', v)} opts={['Short (<7 Days)','Medium (1-6 Months)','Long (>6 Months)','Non-Perishable']} />
                <SelectField label="Target Demographic" value={form.targetDemo} onChange={v => set('targetDemo', v)} opts={['High-Income/Professionals','Families','Students','General/Mass']} />
              </div>
              <button onClick={() => setScreen(SCREENS.S3)}
                className="w-full mt-5 bg-blue-700 text-white font-semibold py-2.5 rounded-md hover:bg-blue-800 transition-colors duration-150 flex items-center justify-center gap-2 text-sm">
                Next: Market Intel <ChevronRight className="w-4 h-4" />
              </button>
              <button onClick={() => setScreen(SCREENS.S1)} className="w-full mt-2.5 text-zinc-500 hover:text-zinc-800 transition-colors text-sm py-1.5 flex items-center justify-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            </WizardCard>
          </motion.div>
        )}

        {/* ── Step 3 ── */}
        {screen === SCREENS.S3 && (
          <motion.div key="s3" {...FADE}>
            <WizardCard step={2} liveData={form}>
              <WizardHeader />
              <StepDots current={2} />
              <div className="mb-5">
                <div className="text-base font-semibold text-zinc-900 mb-0.5">Market Intelligence</div>
                <p className="text-sm text-zinc-500">Competitive landscape and launch context</p>
              </div>
              <div className="space-y-4">
                <SelectField label="Launch Region" value={form.region} onChange={v => set('region', v)} opts={['Baku Only','Baku + Sumgayit','National']} />
                <SelectField label="Competitive Intensity" value={form.competition} onChange={v => set('competition', v)} opts={['Low (0-2 competitors)','Medium (3-5 competitors)','High (5+ competitors)']} />
                <SelectField label="Launch Channel" value={form.channel} onChange={v => set('channel', v)} opts={['Modern Retail','Traditional/Bazaar','E-commerce','Hybrid']} />
                <SelectField label="Seasonality" value={form.seasonality} onChange={v => set('seasonality', v)} opts={['Year-round','Peak Season Product','Seasonal Only']} />
                <div>
                  <label className={LABEL}>Competitor Price (optional)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-zinc-400 pointer-events-none">AZN</span>
                    <input type="number" step="0.01" min="0" placeholder="Leave blank if unknown"
                      value={form.competitorPrice} onChange={e => set('competitorPrice', e.target.value)} className={`${FIELD} pl-11`} />
                  </div>
                </div>
              </div>
              <button onClick={() => setScreen(SCREENS.S4)}
                className="w-full mt-5 bg-blue-700 text-white font-semibold py-2.5 rounded-md hover:bg-blue-800 transition-colors duration-150 flex items-center justify-center gap-2 text-sm">
                Next: Business Profile <ChevronRight className="w-4 h-4" />
              </button>
              <button onClick={() => setScreen(SCREENS.S2)} className="w-full mt-2.5 text-zinc-500 hover:text-zinc-800 transition-colors text-sm py-1.5 flex items-center justify-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            </WizardCard>
          </motion.div>
        )}

        {/* ── Step 4 ── */}
        {screen === SCREENS.S4 && (
          <motion.div key="s4" {...FADE}>
            <WizardCard step={3} liveData={form}>
              <WizardHeader />
              <StepDots current={3} />
              <div className="mb-5">
                <div className="text-base font-semibold text-zinc-900 mb-0.5">Business Profile</div>
                <p className="text-sm text-zinc-500">Helps Bravo match the right vendor partnership tier</p>
              </div>
              <div className="space-y-4">
                <SelectField label="Annual Company Revenue" value={form.revenue} onChange={v => set('revenue', v)} opts={['< 100K AZN','100K–500K AZN','500K–2M AZN','2M+ AZN']} />
                <SelectField label="Years in Business" value={form.yearsInBiz} onChange={v => set('yearsInBiz', v)} opts={['< 1 year','1–3 years','3–10 years','10+ years']} />
                <SelectField label="Bravo Vendor Status" value={form.bankRelation} onChange={v => set('bankRelation', v)} opts={['None','Existing Vendor (1-2 SKUs)','Active Vendor (3+ SKUs)','Strategic Partner']} />
                <SelectField label="Launch Budget Available" value={form.launchBudget} onChange={v => set('launchBudget', v)} opts={['< 20K AZN','20–50K AZN','50–200K AZN','200K+ AZN']} />
              </div>
              <button onClick={submit}
                className="w-full mt-5 bg-blue-700 text-white font-semibold py-2.5 rounded-md hover:bg-blue-800 transition-colors duration-150 flex items-center justify-center gap-2 text-sm">
                <Cpu className="w-4 h-4" /> Synthesize DNA & Run Forecast
              </button>
              <button onClick={() => setScreen(SCREENS.S3)} className="w-full mt-2.5 text-zinc-500 hover:text-zinc-800 transition-colors text-sm py-1.5 flex items-center justify-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            </WizardCard>
          </motion.div>
        )}

        {/* ── AI Pulse ── */}
        {screen === SCREENS.PULSE && <AIPulseScreen key="pulse" />}

        {/* ── Dashboard ── */}
        {screen === SCREENS.DASH && res && (() => {
          const sc  = scoreCfg[res.launchScore.level];
          const risk = riskCfg[res.riskLevel.level];
          const liveVolume   = Math.max(1, Math.round(res.baseline.baseSales * Math.pow(livePrice / res.baseline.basePrice, res.elasticity) * res.channelMult));
          const liveRevenue  = Math.round(liveVolume * livePrice);
          const liveDiff     = liveVolume - res.predictedTotal;
          const scoreBars = [
            { label:'Product Fit',        pts: res.launchScore.productFit,        max:30, pct: Math.round(res.launchScore.productFit / 30 * 100) },
            { label:'Market Timing',      pts: res.launchScore.marketTiming,      max:25, pct: Math.round(res.launchScore.marketTiming / 25 * 100) },
            { label:'Financial Viability',pts: res.launchScore.financialViability, max:25, pct: Math.round(res.launchScore.financialViability / 25 * 100) },
            { label:'Supply Chain',       pts: res.launchScore.supplyChain,       max:20, pct: Math.round(res.launchScore.supplyChain / 20 * 100) },
          ];
          return (
            <motion.div key="dash" className="min-h-screen bg-zinc-50" {...FADE}>

              {/* Navbar */}
              <div className="bg-white border-b border-zinc-200 h-12 px-5 flex items-center justify-between sticky top-0 z-20 no-print">
                <div className="flex items-center gap-4">
                  <button onClick={reset} className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 transition-colors text-sm">
                    <ArrowLeft className="w-3.5 h-3.5" /> Start Over
                  </button>
                  <div className="w-px h-4 bg-zinc-200" />
                  <Logo />
                </div>
                <span className="text-sm font-medium text-zinc-700">{form.name}</span>
                <div className="flex items-center gap-2">
                  {/* Scenario saver */}
                  <div className="relative">
                    <button
                      onClick={() => setScenariosOpen(o => !o)}
                      className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 border border-zinc-200 rounded-md px-2.5 py-1.5 transition-colors"
                    >
                      <BookOpen className="w-3 h-3" />
                      Saved{savedScenarios.length > 0 && ` (${savedScenarios.length})`}
                    </button>
                    {scenariosOpen && (
                      <div className="absolute right-0 top-9 bg-white border border-zinc-200 rounded-md shadow-lg w-56 z-40 overflow-hidden">
                        <div className="px-3 py-2 border-b border-zinc-100 flex items-center justify-between">
                          <span className="text-xs font-semibold text-zinc-500">Saved Scenarios</span>
                          <button onClick={() => setScenariosOpen(false)}><X className="w-3 h-3 text-zinc-400" /></button>
                        </div>
                        {savedScenarios.length === 0 ? (
                          <div className="px-3 py-3 text-xs text-zinc-400">No saved scenarios yet.</div>
                        ) : (
                          <>
                            {savedScenarios.map(s => (
                              <button key={s.id} onClick={() => loadScenario(s)}
                                className="w-full text-left px-3 py-2.5 hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-b-0">
                                <div className="text-xs font-medium text-zinc-800 truncate">{s.label}</div>
                              </button>
                            ))}
                            {savedScenarios.length >= 2 && (
                              <button onClick={() => { setScenariosOpen(false); setScreen(SCREENS.COMPARE); }}
                                className="w-full text-left px-3 py-2.5 border-t border-zinc-200 hover:bg-blue-50 transition-colors flex items-center gap-2 text-blue-700">
                                <BarChart3 className="w-3 h-3" />
                                <span className="text-xs font-semibold">Compare scenarios →</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <button onClick={() => setScreen(SCREENS.S4)}
                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 border border-zinc-200 rounded-md px-2.5 py-1.5 transition-colors">
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={shareAnalysis}
                    className={`flex items-center gap-1.5 text-xs border rounded-md px-2.5 py-1.5 transition-colors ${shareCopied ? 'text-green-700 border-green-300 bg-green-50' : 'text-zinc-500 hover:text-zinc-800 border-zinc-200'}`}>
                    <Share2 className="w-3 h-3" /> {shareCopied ? 'Copied!' : 'Share'}
                  </button>
                  <button onClick={saveScenario}
                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 border border-zinc-200 rounded-md px-2.5 py-1.5 transition-colors">
                    <Bookmark className="w-3 h-3" /> Save
                  </button>
                  <button onClick={() => window.print()}
                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 border border-zinc-200 rounded-md px-2.5 py-1.5 transition-colors">
                    <Printer className="w-3 h-3" /> Print
                  </button>
                  <button onClick={() => setScreen(SCREENS.MANAGER)}
                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 border border-zinc-200 rounded-md px-2.5 py-1.5 transition-colors">
                    <Users className="w-3 h-3" /> Manager {submissions.length > 0 && <span className="bg-blue-700 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center text-[9px] font-bold">{submissions.length}</span>}
                  </button>
                  <button onClick={() => setModal(true)} className="bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-blue-800 transition-colors">
                    Request Vendor Listing
                  </button>
                </div>
              </div>

              <div className="max-w-7xl mx-auto px-5 py-5 space-y-4">

                {/* Launch Score — full width hero */}
                <motion.div
                  className={`border-l-4 ${sc.accent} bg-white border border-zinc-200 rounded-md p-5`}
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }}
                >
                  <div className="flex gap-8 items-start">
                    <div className="shrink-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-zinc-400 font-medium">Launch Viability Score</span>
                        <SectionInfo text="Composite 0–100 score across Product Fit (30pts), Market Timing (25pts), Financial Viability (25pts), and Supply Chain readiness (20pts). Scores ≥75 are Strong; 50–74 need mitigation; below 50 is high risk." />
                      </div>
                      <div className={`text-6xl font-black leading-none ${sc.num}`}><AnimatedNumber target={res.launchScore.total} duration={1500} /></div>
                      <div className="text-sm text-zinc-400 mt-1 font-mono">/100</div>
                      <div className={`mt-2 text-xs font-semibold px-2 py-0.5 rounded border ${sc.bg}`}>
                        {res.launchScore.verdict}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <ScoreBars bars={scoreBars} color={sc.bar} />
                    </div>
                    {res.compGap && (
                      <div className="shrink-0 border-l border-zinc-100 pl-6">
                        <div className="text-xs text-zinc-500 mb-1">vs. Competitor</div>
                        <div className={`text-lg font-bold ${parseFloat(res.compGap) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {parseFloat(res.compGap) > 0 ? '+' : ''}{res.compGap}%
                        </div>
                        <div className="text-xs text-zinc-400">{parseFloat(res.compGap) > 0 ? 'above market' : 'below market'}</div>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* 4 KPI cards */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    {
                      icon: TrendingUp, label:'Volume Forecast', color:'text-blue-700',
                      value: <><AnimatedNumber target={res.predictedTotal} /><span className="text-base font-medium text-zinc-400 ml-1">units</span></>,
                      sub: `${res.channelLabel} · ${res.baseline.name}`,
                      tooltip: `KNN demand forecast using ${res.baseline.name} as the closest analog. Category elasticity applied (${({'Food & Beverage':'-0.65','Personal Care':'-0.45','Home Care & Cleaning':'-0.40','Electronics':'-0.22'}[form.category]||'-0.50')}). Channel adjusts volume up or down.`,
                    },
                    {
                      icon: Activity, label:'Model Confidence', color:'text-blue-700',
                      value: <>{res.confidence}%</>,
                      sub: `MAPE ±${res.errorRate}%`,
                      tooltip: 'Mean Absolute Percentage Error estimated from price gap size and KNN match quality. Higher match score + closer price = lower error = higher confidence.',
                    },
                    {
                      icon: DollarSign, label:'Projected Revenue', color:'text-green-700',
                      value: <><AnimatedNumber target={res.projectedRevenue} /><span className="text-base font-medium text-zinc-400 ml-1">AZN</span></>,
                      sub: `${res.predictedTotal.toLocaleString()} units × ${res.newPrice.toFixed(2)} AZN`,
                      tooltip: 'Predicted monthly gross revenue at forecast volume and your proposed price. Does not account for Bravo margin or promotional discounts.',
                    },
                    null,
                  ].map((card, i) => {
                    if (i === 3) {
                      const RIcon = risk.Icon;
                      return (
                        <motion.div key="risk" className={`border rounded-md p-5 ${risk.bg}`}
                          initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.18 }}>
                          <div className="flex items-center gap-1.5 mb-2">
                            <RIcon className={`w-3.5 h-3.5 ${risk.text}`} />
                            <span className="text-xs text-zinc-500">Operational Risk</span>
                            <SectionInfo text="HIGH if shelf life is short (<7 days) or price is >25% above analog. MEDIUM if price gap is 10–25%. LOW otherwise. Reflects the main operational threat to a successful launch." />
                          </div>
                          <div className={`text-2xl font-black ${risk.text}`}>{res.riskLevel.label}</div>
                          <div className="text-xs text-zinc-400 mt-1">{res.riskLevel.sub}</div>
                        </motion.div>
                      );
                    }
                    const { icon:Icon, label, color, value, sub, tooltip } = card;
                    return (
                      <motion.div key={label} className="bg-white border border-zinc-200 rounded-md p-5"
                        initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08 + i*0.05 }}>
                        <div className="flex items-center gap-1.5 mb-2">
                          <Icon className={`w-3.5 h-3.5 ${color}`} />
                          <span className="text-xs text-zinc-500">{label}</span>
                          {tooltip && (
                            <div className="relative group ml-auto">
                              <Info className="w-3 h-3 text-zinc-300 cursor-help" />
                              <div className="absolute right-0 top-4 w-52 bg-zinc-900 text-white text-xs rounded-md p-2.5 hidden group-hover:block z-30 shadow leading-relaxed">
                                {tooltip}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="text-2xl font-black text-zinc-900 leading-none mb-1">{value}</div>
                        <div className="text-xs text-zinc-400">{sub}</div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* SKU Cannibalization Warning */}
                {res.matchScore >= 70 && (
                  <motion.div className="border border-orange-200 bg-orange-50 rounded-md p-4 flex items-start gap-3"
                    initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.19 }}>
                    <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-orange-800 mb-0.5">Potential Cannibalization Risk</div>
                      <p className="text-xs text-orange-700 leading-relaxed">
                        Your product matches <span className="font-medium">{res.baseline.name}</span> on {res.matchScore}% of attributes
                        (currently ~{res.baseline.baseSales.toLocaleString()} units/month at Bravo).
                        Expect demand overlap — consider differentiating on price, format, or target demographic before launch.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* AI Market Intelligence */}
                <motion.div className="bg-white border border-zinc-200 rounded-md p-5"
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.21 }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Cpu className="w-4 h-4 text-blue-700" />
                    <div className="font-semibold text-zinc-900 text-sm">AI Market Intelligence</div>
                    <span className="text-xs text-zinc-400">· Powered by Gemini</span>
                    {res.aiLoading && <span className="text-xs text-zinc-400 animate-pulse ml-auto">Generating...</span>}
                  </div>
                  {res.aiLoading ? (
                    <div className="space-y-2">
                      {[...Array(4)].map((_,i) => (
                        <div key={i} className="h-3 bg-zinc-100 rounded animate-pulse" style={{width:`${88-i*12}%`}} />
                      ))}
                    </div>
                  ) : res.aiInsights ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-medium text-zinc-500 mb-1.5">Market Opportunity</div>
                        <p className="text-sm text-zinc-700 leading-relaxed">{res.aiInsights.opportunity}</p>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-zinc-500 mb-1.5">Key Risks</div>
                        <ul className="space-y-1">
                          {res.aiInsights.risks.map((r,i) => (
                            <li key={i} className="flex gap-2 text-xs text-zinc-600">
                              <span className="text-red-400 shrink-0">•</span>{r}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-zinc-500 mb-1.5">Pricing Advice</div>
                        <p className="text-xs text-zinc-600 leading-relaxed">{res.aiInsights.pricing_advice}</p>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-zinc-500 mb-1.5">Market Timing</div>
                        <p className="text-xs text-zinc-600 leading-relaxed">{res.aiInsights.market_timing}</p>
                      </div>
                      <div className="col-span-2">
                        <div className="text-xs font-medium text-zinc-500 mb-1.5">Launch Strategy</div>
                        <p className="text-xs text-zinc-600 leading-relaxed">{res.aiInsights.launch_strategy}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-400">AI insights unavailable. All forecast data above is complete.</p>
                  )}
                </motion.div>

                {/* Demand Chart */}
                <motion.div className="bg-white border border-zinc-200 rounded-md p-5"
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.22 }}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-zinc-900 text-sm">Demand Forecast — 8-Month Outlook</div>
                        <SectionInfo text="Blue line = your product's predicted monthly units. Grey dashed = the closest analog's historical baseline. The shaded band is a 95% confidence interval based on model error rate. Vertical markers show seasonal demand spikes for this category." />
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5">Monthly unit volume · confidence band · seasonal markers</div>
                      {res.optimalLaunchMonth !== res.chartData[0]?.month && (
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="text-xs text-green-700 font-medium">Best window: {res.optimalLaunchMonth}</span>
                          <span className="text-xs text-zinc-400">— highest 3-month cumulative demand</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      {[{c:'#94a3b8',dash:true,l:`${res.baseline.name}`},{c:'#1d4ed8',l:`${form.name}`}].map(({c,dash,l})=>(
                        <div key={l} className="flex items-center gap-1.5">
                          <div className="w-5 border-t border-zinc-300" style={{ borderColor:c, borderStyle:dash?'dashed':'solid', borderWidth:dash?undefined:'2px' }} />
                          <span className="text-xs text-zinc-500">{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={res.chartData} margin={{ top:10, right:8, left:0, bottom:0 }}>
                      <defs>
                        <linearGradient id="gradPred" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.12} />
                          <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#f4f4f5" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill:'#a1a1aa', fontSize:11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill:'#a1a1aa', fontSize:11 }} axisLine={false} tickLine={false}
                        tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                      <Tooltip content={<ChartTooltip />} />
                      {res.seasonalMarkers.map(m => (
                        <ReferenceLine key={m.x} x={m.x} stroke={m.color} strokeDasharray="4 2" strokeWidth={1.5}>
                          <Label value={m.label} position="insideTopLeft" fill={m.color} fontSize={10} />
                        </ReferenceLine>
                      ))}
                      <Area type="monotone" dataKey="Upper" stroke="#93c5fd" strokeWidth={1} strokeDasharray="3 3" fill="none" dot={false} legendType="none" />
                      <Area type="monotone" dataKey="Lower" stroke="#93c5fd" strokeWidth={1} strokeDasharray="3 3" fill="none" dot={false} legendType="none" />
                      <Area type="monotone" dataKey="Baseline" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 3" fill="none" dot={false} />
                      <Area type="monotone" dataKey="Predicted" stroke="#1d4ed8" strokeWidth={2} fill="url(#gradPred)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>

                  {/* Demand Shock Simulator */}
                  <div className="mt-4 pt-4 border-t border-zinc-100">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShockEnabled(e => !e)}
                        className={`text-xs font-medium px-2.5 py-1 rounded border transition-colors ${shockEnabled ? 'bg-red-50 border-red-200 text-red-700' : 'border-zinc-200 text-zinc-400 hover:border-zinc-300 hover:text-zinc-600'}`}
                      >
                        {shockEnabled ? 'Hide shock scenario' : 'Simulate market shock'}
                      </button>
                      {!shockEnabled && <span className="text-xs text-zinc-300">What if a competitor undercuts your price?</span>}
                    </div>
                    {shockEnabled && (() => {
                      const crossE     = Math.abs(res.elasticity) * 0.6;
                      const shockVol   = Math.max(1, Math.round(res.predictedTotal * (1 - crossE * Math.abs(shockPct / 100))));
                      const shockDrop  = res.predictedTotal - shockVol;
                      const shockRevDrop = Math.round(shockDrop * res.newPrice);
                      const compPrice  = parseFloat((res.newPrice * (1 + shockPct / 100)).toFixed(2));
                      const dropPct    = Math.round(crossE * Math.abs(shockPct / 100) * 100);
                      return (
                        <div className="mt-3">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-xs text-zinc-500 whitespace-nowrap shrink-0">Competitor enters at</span>
                            <input type="range" min={-40} max={-5} step={1} value={shockPct}
                              onChange={e => setShockPct(parseInt(e.target.value))}
                              className="flex-1 accent-red-600 cursor-pointer" />
                            <span className="text-xs font-bold text-red-700 w-8 text-right shrink-0">{shockPct}%</span>
                            <span className="text-xs text-zinc-400 shrink-0">({compPrice.toFixed(2)} AZN)</span>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="bg-red-50 border border-red-100 rounded-md p-3">
                              <div className="text-xs text-red-600 mb-1">Volume Impact</div>
                              <div className="text-xl font-black text-red-700">−{shockDrop.toLocaleString()}</div>
                              <div className="text-xs text-zinc-400 mt-0.5">units / month</div>
                            </div>
                            <div className="bg-red-50 border border-red-100 rounded-md p-3">
                              <div className="text-xs text-red-600 mb-1">Revenue Impact</div>
                              <div className="text-xl font-black text-red-700">−{shockRevDrop.toLocaleString()}</div>
                              <div className="text-xs text-zinc-400 mt-0.5">AZN / month</div>
                            </div>
                            <div className="bg-zinc-50 border border-zinc-200 rounded-md p-3">
                              <div className="text-xs text-zinc-500 mb-1">Remaining Volume</div>
                              <div className="text-xl font-black text-zinc-900">{shockVol.toLocaleString()}</div>
                              <div className="text-xs text-zinc-400 mt-0.5">units / month</div>
                            </div>
                          </div>
                          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                            Cross-price elasticity model: a competitor {Math.abs(shockPct)}% cheaper captures ~{dropPct}% of your volume. Counter with loyalty promotions, shelf visibility, or a matching price response.
                          </p>
                        </div>
                      );
                    })()}
                  </div>

                </motion.div>

                {/* Competitor Positioning */}
                <motion.div className="bg-white border border-zinc-200 rounded-md p-5"
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.24 }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="font-semibold text-zinc-900 text-sm">Competitor Positioning</div>
                    <SectionInfo text="Price vs. estimated volume scatter for your product (blue), the 3 closest KNN analogs (grey), and the competitor you entered (red). Top-left = high volume at low price (strong position). Hover each dot for details." />
                    <div className="ml-auto flex items-center gap-4 shrink-0">
                      {[{c:'#94a3b8',l:'Analogs'},{c:'#1d4ed8',l:form.name},{...(res.compGap ? {c:'#dc2626',l:'Competitor'} : null)}].filter(Boolean).map(({c,l})=>(
                        <div key={l} className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background:c }} />
                          <span className="text-xs text-zinc-500 truncate max-w-[90px]">{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <CompetitorChart
                    topAnalogs={res.topAnalogs}
                    newPrice={res.newPrice}
                    predictedTotal={res.predictedTotal}
                    compPrice={form.competitorPrice ? parseFloat(form.competitorPrice) : null}
                    elasticity={res.elasticity}
                    channelMult={res.channelMult}
                    baseline={res.baseline}
                    productName={form.name}
                  />
                </motion.div>

                {/* Price Sensitivity — Interactive Slider */}
                <motion.div className="bg-white border border-zinc-200 rounded-md p-5"
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.27 }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="font-semibold text-zinc-900 text-sm">Price Sensitivity Explorer</div>
                    <SectionInfo text="Drag the slider to simulate any price and see volume and revenue update instantly. Uses category-specific elasticity — Food & Beverage (−0.65) reacts more sharply than Electronics (−0.22)." />
                  </div>
                  {/* Revenue-maximising price callout */}
                  {(() => {
                    const optPrice = parseFloat((res.baseline.basePrice * (1 - 1 / (2 * res.elasticity))).toFixed(2));
                    const clampedOpt = Math.max(res.newPrice * 0.5, Math.min(res.newPrice * 2, optPrice));
                    const optVol  = Math.max(1, Math.round(res.baseline.baseSales * Math.pow(clampedOpt / res.baseline.basePrice, res.elasticity) * res.channelMult));
                    const optRev  = Math.round(optVol * clampedOpt);
                    const currentRev = res.projectedRevenue;
                    const uplift = Math.round((optRev / currentRev - 1) * 100);
                    if (uplift <= 2) return null;
                    return (
                      <div className="mb-4 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-md px-4 py-2.5">
                        <Zap className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        <div className="text-xs text-blue-700">
                          <span className="font-semibold">Revenue-optimal price: {clampedOpt.toFixed(2)} AZN</span>
                          <span className="ml-2 opacity-70">→ +{uplift}% revenue vs. your current price</span>
                        </div>
                        <button onClick={() => setLivePrice(clampedOpt)}
                          className="ml-auto text-xs text-blue-700 font-semibold border border-blue-300 rounded px-2 py-0.5 hover:bg-blue-100 transition-colors shrink-0">
                          Apply
                        </button>
                      </div>
                    );
                  })()}
                  <div className="grid grid-cols-2 gap-6 items-start">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-zinc-400">Simulated Price</span>
                        <span className="text-xl font-black text-blue-700">{livePrice.toFixed(2)} <span className="text-sm font-medium text-zinc-400">AZN</span></span>
                      </div>
                      <input
                        type="range"
                        min={Math.max(0.01, res.newPrice * 0.4)}
                        max={res.newPrice * 1.8}
                        step={0.01}
                        value={livePrice}
                        onChange={e => setLivePrice(parseFloat(e.target.value))}
                        className="w-full accent-blue-700 cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-zinc-300 mt-1.5">
                        <span>−60%</span>
                        <span className="text-zinc-400">Original: {res.newPrice.toFixed(2)} AZN</span>
                        <span>+80%</span>
                      </div>
                      {/* Reference points */}
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {res.sensitivityScenarios.map((s, i) => (
                          <button key={i}
                            onClick={() => setLivePrice(s.price)}
                            className={`text-xs py-1 rounded border transition-colors ${Math.abs(livePrice - s.price) < 0.005 ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium' : 'border-zinc-200 text-zinc-400 hover:border-zinc-300 hover:text-zinc-600'}`}>
                            {i === 0 ? '−10%' : i === 2 ? '+10%' : 'Original'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center">
                          <div className="text-xs text-zinc-400 mb-1">Volume</div>
                          <div className="text-2xl font-black text-zinc-900 leading-none">{liveVolume.toLocaleString()}</div>
                          <div className={`text-xs font-semibold mt-0.5 ${liveDiff > 0 ? 'text-green-600' : liveDiff < 0 ? 'text-red-600' : 'text-zinc-400'}`}>
                            {liveDiff > 0 ? '+' : ''}{liveDiff.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-zinc-400 mb-1">Revenue</div>
                          <div className="text-2xl font-black text-zinc-900 leading-none">{liveRevenue >= 1000 ? `${(liveRevenue/1000).toFixed(1)}k` : liveRevenue}</div>
                          <div className="text-xs text-zinc-400 mt-0.5">AZN/mo</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-zinc-400 mb-1">Price Δ</div>
                          <div className={`text-2xl font-black leading-none ${livePrice === res.newPrice ? 'text-zinc-400' : livePrice > res.newPrice ? 'text-red-600' : 'text-green-600'}`}>
                            {livePrice === res.newPrice ? '—' : `${livePrice > res.newPrice ? '+' : ''}${((livePrice / res.newPrice - 1) * 100).toFixed(0)}%`}
                          </div>
                          <div className="text-xs text-zinc-400 mt-0.5">from original</div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs text-zinc-400 mb-0.5">
                          <span>Volume vs. original</span>
                          <span className="font-mono">{liveVolume.toLocaleString()} / {res.predictedTotal.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 bg-zinc-100 rounded-sm overflow-hidden">
                          <div className="h-full bg-blue-700 rounded-sm transition-all duration-75"
                            style={{ width:`${Math.min(100, Math.round(liveVolume / Math.max(liveVolume, res.predictedTotal) * 100))}%` }} />
                        </div>
                        <div className="h-1.5 bg-zinc-100 rounded-sm overflow-hidden">
                          <div className="h-full bg-zinc-300 rounded-sm"
                            style={{ width:`${Math.min(100, Math.round(res.predictedTotal / Math.max(liveVolume, res.predictedTotal) * 100))}%` }} />
                        </div>
                        <div className="flex justify-between text-xs text-zinc-300">
                          <span className="text-blue-700">Simulated</span><span>Original</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Waste / Spoilage Callout */}
                {form.shelfLife === 'Short (<7 Days)' && (
                  <motion.div className="border border-amber-200 bg-amber-50 rounded-md p-5"
                    initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.30 }}>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <div className="font-semibold text-amber-800 text-sm">Spoilage Management Protocol</div>
                      <span className="text-xs text-amber-500 ml-1">· Short shelf life detected</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { days:'Day 1–3', label:'Full Price',     pct:100, color:'bg-green-500' },
                        { days:'Day 4–5', label:'−15% markdown', pct:85,  color:'bg-yellow-400' },
                        { days:'Day 6',   label:'−30% markdown', pct:70,  color:'bg-orange-400' },
                        { days:'Day 7',   label:'−50% clearance',pct:50,  color:'bg-red-400'    },
                      ].map(s => (
                        <div key={s.days} className="bg-white border border-amber-100 rounded-md p-3">
                          <div className="font-semibold text-zinc-700 text-xs mb-1">{s.days}</div>
                          <div className="text-zinc-500 text-xs mb-2">{s.label}</div>
                          <div className="h-1 bg-zinc-100 rounded-sm">
                            <div className={`h-full rounded-sm ${s.color}`} style={{ width:`${s.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Model Intelligence — Analogs + Contributions */}
                <motion.div className="grid grid-cols-2 gap-3"
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.30 }}>

                  {/* Top Analogs */}
                  <div className="bg-white border border-zinc-200 rounded-md p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="font-semibold text-zinc-900 text-sm">Top 3 Analog SKUs</div>
                      <SectionInfo text="The three most similar products in Bravo's catalog, ranked by attribute match score (max 100pts). The #1 analog's monthly sales become the demand baseline for your forecast. Higher score = more reliable prediction." />
                    </div>
                    <div className="space-y-3">
                      {res.topAnalogs.map((a, i) => (
                        <div key={a.name}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-zinc-400 font-mono w-4">{i+1}</span>
                              <span className="text-sm font-medium text-zinc-900">{a.name}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-semibold text-zinc-700">{a.score}pts</span>
                              <span className="text-xs text-zinc-400 ml-2 font-mono">{a.baseSales.toLocaleString()}/mo</span>
                            </div>
                          </div>
                          <div className="h-1 bg-zinc-100 rounded-sm">
                            <div className="h-full bg-blue-700 rounded-sm opacity-60" style={{ width:`${a.similarity}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Forecast Attribution */}
                  <div className="bg-white border border-zinc-200 rounded-md p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="font-semibold text-zinc-900 text-sm">Forecast Attribution</div>
                      <SectionInfo text="Shows exactly how your predicted volume was built. Starts from the KNN analog's real baseline sales, then applies a price elasticity adjustment (category-specific), then a channel multiplier. Each row shows the actual units added or removed." />
                    </div>
                    <div className="space-y-3">
                      {[
                        {
                          label:  'KNN Baseline',
                          sub:    `${res.baseline.name} · ${res.matchScore}pt match`,
                          value:  res.forecastAttribution.baseline,
                          effect: res.forecastAttribution.baseline,
                          bar:    'bg-zinc-400',
                          sign:   '',
                        },
                        {
                          label:  'Price Effect',
                          sub:    `${res.priceGapPercent > 0 ? '+' : ''}${res.priceGapPercent.toFixed(1)}% vs analog · elasticity ${res.elasticity}`,
                          value:  Math.abs(res.forecastAttribution.priceEffect),
                          effect: res.forecastAttribution.priceEffect,
                          bar:    res.forecastAttribution.priceEffect >= 0 ? 'bg-green-500' : 'bg-red-400',
                          sign:   res.forecastAttribution.priceEffect >= 0 ? '+' : '−',
                        },
                        {
                          label:  'Channel Effect',
                          sub:    `${res.channelLabel} · ×${res.channelMult.toFixed(2)}`,
                          value:  Math.abs(res.forecastAttribution.channelEffect),
                          effect: res.forecastAttribution.channelEffect,
                          bar:    res.forecastAttribution.channelEffect > 0 ? 'bg-green-500' : res.forecastAttribution.channelEffect < 0 ? 'bg-red-400' : 'bg-zinc-200',
                          sign:   res.forecastAttribution.channelEffect > 0 ? '+' : res.forecastAttribution.channelEffect < 0 ? '−' : '',
                        },
                      ].map(row => (
                        <div key={row.label}>
                          <div className="flex items-start justify-between mb-1">
                            <div className="min-w-0">
                              <span className="text-xs font-medium text-zinc-700">{row.label}</span>
                              <span className="text-xs text-zinc-400 ml-2 truncate">{row.sub}</span>
                            </div>
                            <span className={`text-xs font-semibold font-mono ml-3 shrink-0 ${row.effect > 0 ? 'text-green-700' : row.effect < 0 ? 'text-red-600' : 'text-zinc-400'}`}>
                              {row.effect !== 0 ? `${row.sign}${row.value.toLocaleString()}` : '×1.0'}
                            </span>
                          </div>
                          <div className="h-1.5 bg-zinc-100 rounded-sm overflow-hidden">
                            <div className={`h-full rounded-sm ${row.bar}`}
                              style={{ width:`${Math.min(100, Math.round(row.value / res.forecastAttribution.total * 100))}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-700">Predicted Total</span>
                      <span className="text-sm font-black text-zinc-900">{res.forecastAttribution.total.toLocaleString()} <span className="text-xs font-medium text-zinc-400">units/mo</span></span>
                    </div>
                  </div>
                </motion.div>

                {/* Dispatch Matrix + Cash Flow */}
                <motion.div className="grid grid-cols-2 gap-3"
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.34 }}>

                  <div className="bg-white border border-zinc-200 rounded-md p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-zinc-900 text-sm">Dispatch Matrix</div>
                          <SectionInfo text="Recommended unit allocation across Bravo store clusters, filtered to your chosen launch region. Allocation percentages are based on demographic match between target customer and store catchment area." />
                        </div>
                        <div className="text-xs text-zinc-400 mt-0.5">{form.region} · {res.storeCount} stores · {res.allocRows.length} priority locations</div>
                      </div>
                      <Globe2 className="w-4 h-4 text-zinc-300" />
                    </div>
                    <AzMapViz allocRows={res.allocRows} />
                    <DispatchMatrix rows={res.allocRows} />
                  </div>

                  <div className="bg-white border border-zinc-200 rounded-md p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-zinc-900 text-sm">Cash Flow Projection</div>
                          <SectionInfo text="Investment (red bars) = inventory purchasing cost, peaking in M1–M2. Revenue (blue bars) = sales income growing month-over-month. The black net line crosses zero at the breakeven point — the month you start recovering your investment." />
                        </div>
                        <div className="text-xs text-zinc-400 mt-0.5">
                          6-month impact · Breakeven: {res.breakevenMonth > 0 && res.breakevenMonth <= 6 ? `M${res.breakevenMonth}` : 'M6+'}
                        </div>
                      </div>
                      <BarChart3 className="w-4 h-4 text-zinc-300" />
                    </div>
                    <ResponsiveContainer width="100%" height={160}>
                      <ComposedChart data={res.cashFlowData} margin={{ top:4, right:4, left:0, bottom:0 }}>
                        <CartesianGrid stroke="#f4f4f5" strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" tick={{ fill:'#a1a1aa', fontSize:10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill:'#a1a1aa', fontSize:10 }} axisLine={false} tickLine={false}
                          tickFormatter={v => v >= 1000 || v <= -1000 ? `${Math.round(v/1000)}k` : v} />
                        <Tooltip content={<CashTooltip />} />
                        <ReferenceLine y={0} stroke="#e4e4e7" strokeWidth={1} />
                        <Bar dataKey="investment" fill="#fca5a5" radius={[2,2,0,0]} maxBarSize={20} />
                        <Bar dataKey="revenue"    fill="#93c5fd" radius={[2,2,0,0]} maxBarSize={20} />
                        <Line dataKey="net" type="monotone" stroke="#1d4ed8" strokeWidth={2} dot={false} />
                      </ComposedChart>
                    </ResponsiveContainer>
                    <div className="flex items-center gap-4 mt-2">
                      {[{c:'#fca5a5',l:'Investment'},{c:'#93c5fd',l:'Revenue'},{c:'#1d4ed8',l:'Net'}].map(({c,l})=>(
                        <div key={l} className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-sm" style={{ background:c }} />
                          <span className="text-xs text-zinc-400">{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* EOQ Procurement */}
                <motion.div className="bg-white border border-zinc-200 rounded-md p-5"
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.37 }}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-zinc-900 text-sm">Procurement Intelligence</div>
                        <SectionInfo text="Economic Order Quantity model minimising total holding + ordering cost. Lead time varies by storage: Ambient 2wk, Chilled 3wk, Frozen 4wk. Safety stock provides a 95% service level buffer against demand spikes." />
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5">EOQ model · 95% service level · {({'Frozen (-18°C)':'4-week','Chilled (+4°C)':'3-week','Special Handling':'3-week'}[form.storage]||'2-week')} lead time</div>
                    </div>
                    <Package className="w-4 h-4 text-zinc-300" />
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label:'Safety Stock',      hint:'95% service level buffer',  value: res.safetyStock,   unit:'units' },
                      { label:'Reorder Point',     hint:'Place order when stock hits', value: res.rop,          unit:'units' },
                      { label:'Economic Order Qty',hint:'Min-cost replenishment batch', value: res.eoq,         unit:'units' },
                      { label:'First Order Rec.',  hint:'EOQ + safety stock combined', value: res.firstOrderQty,unit:'units' },
                    ].map(({label, hint, value, unit}) => (
                      <div key={label} className="border-l border-zinc-100 pl-4 first:border-l-0 first:pl-0">
                        <div className="text-xs text-zinc-400 mb-1">{label}</div>
                        <div className="text-xl font-black text-zinc-900">{value.toLocaleString()}</div>
                        <div className="text-xs text-zinc-400">{unit}</div>
                        <div className="text-xs text-zinc-300 mt-1 leading-tight">{hint}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Launch Timeline */}
                <motion.div className="bg-white border border-zinc-200 rounded-md p-5"
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.39 }}>
                  <div className="flex items-center gap-2 mb-5">
                    <Clock className="w-4 h-4 text-blue-700" />
                    <div className="font-semibold text-zinc-900 text-sm">Launch Roadmap</div>
                    <SectionInfo text="8-week milestone plan from analysis submission to live sales monitoring. Category review takes 3 business days. First order delivery lead time varies by storage type (2–4 weeks)." />
                    <span className="text-xs text-zinc-400 ml-1">· Est. 8 weeks to shelf</span>
                  </div>
                  <LaunchTimeline />
                </motion.div>

                {/* Financing Intelligence */}
                <motion.div className="bg-white border border-zinc-200 rounded-md p-5"
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.40 }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Landmark className="w-4 h-4 text-blue-700" />
                    <div className="font-semibold text-zinc-900 text-sm">Bravo Vendor Intelligence</div>
                    <SectionInfo text="Working Capital = units needed to cover safety stock × unit cost × storage multiplier (Ambient 2.1×, Chilled 2.6×, Frozen 3.2×). Partnership tier is recommended based on your revenue, experience, and PashaBank relationship. Financed Growth shows how Bravo's supply-chain credit line unlocks additional inventory capacity." />
                    <span className="text-xs text-zinc-400 ml-1">·</span>
                    <span className="text-xs text-zinc-400">Partnership Engine</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="border border-zinc-200 rounded-md p-4">
                      <div className="text-xs text-zinc-400 mb-1.5">Working Capital Required</div>

                      <div className="text-2xl font-black text-zinc-900">{res.workingCapital.toLocaleString()}</div>
                      <div className="text-xs text-zinc-400 mt-0.5">AZN · safety stock × cost × lead</div>
                    </div>

                    <div className="border-2 border-blue-700 rounded-md p-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-zinc-400">Recommended</span>
                        <span className="text-xs font-semibold text-blue-700 border border-blue-700 rounded px-1.5 py-0.5">Best Match</span>
                      </div>
                      <div className="font-bold text-blue-700 text-sm leading-tight">{res.financingProduct.name}</div>
                      <div className="text-xs text-zinc-400 mt-1 leading-relaxed">{res.financingProduct.desc}</div>
                    </div>

                    <div className="border border-zinc-200 rounded-md p-4">
                      <div className="text-xs text-zinc-400 mb-2">Financed Growth Potential</div>
                      <div className="space-y-2">
                        {[
                          { label:'Without Bravo support', val: res.predictedTotal, pct: Math.round(res.predictedTotal / res.financedUnits * 100), color:'bg-zinc-200' },
                          { label:'With Bravo partnership', val: res.financedUnits, pct: 100, color:'bg-blue-700' },
                        ].map(({label, val, pct, color}) => (
                          <div key={label}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className={label.includes('With') ? 'font-medium text-zinc-700' : 'text-zinc-400'}>{label}</span>
                              <span className="font-semibold text-zinc-900">{val.toLocaleString()}</span>
                            </div>
                            <div className="h-1 bg-zinc-100 rounded-sm">
                              <div className={`h-full rounded-sm ${color}`} style={{ width:`${pct}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-xs font-semibold text-green-600">+{res.upliftPct}% capacity unlocked</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-xs text-zinc-500">Shelf Placement:</span>
                    <span className="text-xs font-medium text-zinc-700">{res.shelfPlacement}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-zinc-100">
                    <div className="flex items-center gap-2 mb-2.5">
                      <ClipboardList className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="text-xs font-medium text-zinc-600">Pre-Application Checklist</span>
                      <span className="text-xs text-zinc-400 ml-auto">
                        {Object.values(checklist).filter(Boolean).length}/{READINESS_ITEMS.length} ready
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                      {READINESS_ITEMS.map(item => (
                        <div key={item.id} onClick={() => toggleCheck(item.id)}
                          className="flex items-center gap-2 cursor-pointer group select-none">
                          <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                            checklist[item.id] ? 'bg-blue-700 border-blue-700' : 'border-zinc-200 group-hover:border-blue-300'
                          }`}>
                            {checklist[item.id] && (
                              <svg viewBox="0 0 10 10" className="w-2 h-2" fill="none">
                                <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-xs transition-colors ${checklist[item.id] ? 'line-through text-zinc-300' : 'text-zinc-600 group-hover:text-zinc-800'}`}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* CTA */}
                <motion.div className="no-print bg-zinc-900 rounded-md p-5 flex items-center justify-between"
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.43 }}>
                  <div>
                    <div className="font-semibold text-white text-sm">Ready to launch with Bravo?</div>
                    <div className="text-zinc-400 text-xs mt-0.5">Submit your product for vendor review. Category team responds in 3 days.</div>
                  </div>
                  <button onClick={() => setModal(true)}
                    className="bg-white text-zinc-900 font-semibold px-5 py-2 rounded-md hover:bg-zinc-100 transition-colors duration-150 text-sm flex items-center gap-2 shrink-0 ml-8">
                    Request Vendor Listing <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>

              </div>
            </motion.div>
          );
        })()}

        {/* ── Scenario Compare ── */}
        {screen === SCREENS.COMPARE && (() => {
          const scenarios = savedScenarios.map(s => {
            try { return { label: s.label, form: s.form, r: computeResults(s.form) }; }
            catch { return null; }
          }).filter(Boolean);

          const ROWS = [
            { label:'Launch Score',     key: r => r.launchScore.total,                                  fmt: (v)    => `${v}/100`,                                                         bestHigh: true  },
            { label:'Verdict',          key: r => r.launchScore.verdict,                                fmt: (v)    => v,                                                                  bestHigh: null  },
            { label:'Volume / month',   key: r => r.predictedTotal,                                     fmt: (v)    => v.toLocaleString() + ' units',                                      bestHigh: true  },
            { label:'Revenue / month',  key: r => r.projectedRevenue,                                   fmt: (v)    => v.toLocaleString() + ' AZN',                                        bestHigh: true  },
            { label:'Confidence',       key: r => r.confidence,                                         fmt: (v)    => `${v}%`,                                                            bestHigh: true  },
            { label:'Risk Level',       key: r => ({ HIGH:0, MEDIUM:1, LOW:2 })[r.riskLevel.label]??1, fmt: (_,r)  => r.riskLevel.label,                                                  bestHigh: true  },
            { label:'Working Capital',  key: r => r.workingCapital,                                     fmt: (v)    => v.toLocaleString() + ' AZN',                                        bestHigh: false },
            { label:'Breakeven',        key: r => r.breakevenMonth > 0 && r.breakevenMonth <= 6 ? r.breakevenMonth : 7, fmt: (_,r) => r.breakevenMonth > 0 && r.breakevenMonth <= 6 ? `M${r.breakevenMonth}` : 'M6+', bestHigh: false },
            { label:'Partnership Tier', key: r => r.financingProduct.name,                              fmt: (v)    => v,                                                                  bestHigh: null  },
            { label:'KNN Analog',       key: r => r.baseline.name,                                      fmt: (v)    => v,                                                                  bestHigh: null  },
            { label:'Price vs Analog',  key: r => Math.abs(r.priceGapPercent),                          fmt: (_,r)  => `${r.priceGapPercent > 0 ? '+' : ''}${r.priceGapPercent.toFixed(1)}%`, bestHigh: false },
          ];

          const cols = `180px repeat(${scenarios.length}, 1fr)`;

          return (
            <motion.div key="compare" className="min-h-screen bg-zinc-50" {...FADE}>
              <div className="bg-white border-b border-zinc-200 h-12 px-5 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4">
                  <button onClick={() => setScreen(SCREENS.DASH)}
                    className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 transition-colors text-sm">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <div className="w-px h-4 bg-zinc-200" />
                  <Logo />
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-sm font-semibold text-zinc-900">Scenario Comparison</span>
                  <span className="text-xs text-zinc-400">· {scenarios.length} saved scenario{scenarios.length !== 1 ? 's' : ''}</span>
                </div>
                <div />
              </div>

              <div className="max-w-5xl mx-auto px-5 py-5">
                {scenarios.length < 2 ? (
                  <div className="bg-white border border-zinc-200 rounded-md p-12 text-center">
                    <Bookmark className="w-8 h-8 text-zinc-200 mx-auto mb-3" />
                    <p className="text-sm text-zinc-500 font-medium">Save at least 2 scenarios to compare</p>
                    <p className="text-xs text-zinc-300 mt-1">Use "Save" on the dashboard after each analysis run</p>
                  </div>
                ) : (
                  <div className="bg-white border border-zinc-200 rounded-md overflow-hidden">

                    {/* Scenario header row */}
                    <div className="grid border-b border-zinc-200" style={{ gridTemplateColumns: cols }}>
                      <div className="px-5 py-3 bg-zinc-50 border-r border-zinc-100" />
                      {scenarios.map((s, i) => {
                        const lvl = s.r.launchScore.level;
                        const numCls = lvl === 'strong' ? 'text-green-700' : lvl === 'moderate' ? 'text-amber-700' : 'text-red-600';
                        return (
                          <div key={i} className="px-5 py-3 border-l border-zinc-100 first:border-l-0">
                            <div className="text-sm font-bold text-zinc-900 truncate">{s.label}</div>
                            <div className={`text-xs font-semibold ${numCls}`}>{s.r.launchScore.verdict}</div>
                            <div className="text-xs text-zinc-400 mt-0.5">{s.form.category} · {s.form.tier} · {s.form.region}</div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Data rows */}
                    {ROWS.map((row, ri) => {
                      const vals = scenarios.map(s => row.key(s.r));
                      const nums = vals.filter(v => typeof v === 'number');
                      const best  = row.bestHigh === true ? Math.max(...nums) : row.bestHigh === false ? Math.min(...nums) : null;
                      const worst = row.bestHigh === true ? Math.min(...nums) : row.bestHigh === false ? Math.max(...nums) : null;
                      return (
                        <div key={row.label}
                          className={`grid border-b border-zinc-100 last:border-b-0 ${ri % 2 === 0 ? '' : 'bg-zinc-50/40'}`}
                          style={{ gridTemplateColumns: cols }}>
                          <div className="px-5 py-3 border-r border-zinc-100 flex items-center bg-zinc-50/60">
                            <span className="text-xs font-medium text-zinc-500">{row.label}</span>
                          </div>
                          {scenarios.map((s, ci) => {
                            const val = vals[ci];
                            const isBest  = row.bestHigh !== null && typeof val === 'number' && val === best;
                            const isWorst = row.bestHigh !== null && typeof val === 'number' && val === worst && best !== worst;
                            return (
                              <div key={ci} className={`px-5 py-3 border-l border-zinc-100 ${isBest ? 'bg-green-50' : isWorst ? 'bg-red-50' : ''}`}>
                                <span className={`text-sm font-semibold ${isBest ? 'text-green-700' : isWorst ? 'text-red-600' : 'text-zinc-800'}`}>
                                  {row.fmt(val, s.r)}
                                </span>
                                {isBest  && <span className="ml-2 text-xs text-green-500 font-medium">best</span>}
                                {isWorst && <span className="ml-2 text-xs text-red-400 font-medium">lowest</span>}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}

                  </div>
                )}
              </div>
            </motion.div>
          );
        })()}

        {/* ── Category Manager ── */}
        {screen === SCREENS.MANAGER && (() => {
          const statusCfg = {
            pending:    { label:'Pending',    cls:'bg-blue-50 text-blue-700 border-blue-200'   },
            approved:   { label:'Approved',   cls:'bg-green-50 text-green-700 border-green-200' },
            needs_info: { label:'Needs Info', cls:'bg-amber-50 text-amber-700 border-amber-200' },
            rejected:   { label:'Rejected',   cls:'bg-red-50 text-red-700 border-red-200'       },
          };
          const counts = {
            all:        submissions.length,
            pending:    submissions.filter(s => s.status === 'pending').length,
            approved:   submissions.filter(s => s.status === 'approved').length,
            needs_info: submissions.filter(s => s.status === 'needs_info').length,
            rejected:   submissions.filter(s => s.status === 'rejected').length,
          };
          const filtered = managerFilter === 'all' ? submissions : submissions.filter(s => s.status === managerFilter);
          return (
            <motion.div key="manager" className="min-h-screen bg-zinc-50" {...FADE}>
              {/* Navbar */}
              <div className="bg-white border-b border-zinc-200 h-12 px-5 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4">
                  <button onClick={() => setScreen(SCREENS.DASH)}
                    className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 transition-colors text-sm">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <div className="w-px h-4 bg-zinc-200" />
                  <Logo />
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-sm font-semibold text-zinc-900">Category Manager</span>
                  <span className="text-xs text-zinc-400 ml-1">· Vendor Submissions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">{submissions.length} total submission{submissions.length !== 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="max-w-7xl mx-auto px-5 py-5 space-y-4">

                {/* Stat cards */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label:'Total',      count: counts.all,        icon: ClipboardList, cls:'text-zinc-700' },
                    { label:'Pending',    count: counts.pending,     icon: Clock,         cls:'text-blue-700' },
                    { label:'Approved',   count: counts.approved,    icon: CheckCircle,   cls:'text-green-700' },
                    { label:'Needs Info', count: counts.needs_info,  icon: AlertTriangle, cls:'text-amber-600' },
                  ].map(({ label, count, icon: Icon, cls }) => (
                    <motion.div key={label}
                      className="bg-white border border-zinc-200 rounded-md p-5"
                      initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={`w-3.5 h-3.5 ${cls}`} />
                        <span className="text-xs text-zinc-400">{label}</span>
                      </div>
                      <div className={`text-3xl font-black ${cls}`}>{count}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Filter tabs + table */}
                <motion.div className="bg-white border border-zinc-200 rounded-md overflow-hidden"
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.10 }}>

                  {/* Tabs */}
                  <div className="flex border-b border-zinc-200 px-4 pt-1">
                    {[
                      { key:'all',        label:`All (${counts.all})` },
                      { key:'pending',    label:`Pending (${counts.pending})` },
                      { key:'approved',   label:`Approved (${counts.approved})` },
                      { key:'needs_info', label:`Needs Info (${counts.needs_info})` },
                      { key:'rejected',   label:`Rejected (${counts.rejected})` },
                    ].map(tab => (
                      <button key={tab.key}
                        onClick={() => setManagerFilter(tab.key)}
                        className={`text-xs font-medium px-3 py-2.5 border-b-2 transition-colors ${
                          managerFilter === tab.key
                            ? 'border-blue-700 text-blue-700'
                            : 'border-transparent text-zinc-400 hover:text-zinc-600'
                        }`}>
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Table */}
                  {filtered.length === 0 ? (
                    <div className="py-16 flex flex-col items-center justify-center">
                      <ClipboardList className="w-8 h-8 text-zinc-200 mb-3" />
                      <p className="text-sm text-zinc-400 font-medium">No submissions yet</p>
                      <p className="text-xs text-zinc-300 mt-1">
                        {managerFilter === 'all'
                          ? 'Vendors submit via "Request Vendor Listing" on the dashboard'
                          : `No ${statusCfg[managerFilter]?.label.toLowerCase()} submissions`}
                      </p>
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-zinc-100">
                          {['Product', 'Category', 'Score', 'Volume', 'Risk', 'Submitted', 'Status', ''].map(h => (
                            <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-zinc-400 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((sub, i) => {
                          const sc = statusCfg[sub.status] || statusCfg.pending;
                          const riskCls =
                            sub.metrics?.riskLevel === 'high'   ? 'text-red-600'
                            : sub.metrics?.riskLevel === 'medium' ? 'text-amber-600'
                            : 'text-green-600';
                          const scoreCls =
                            (sub.metrics?.score || 0) >= 75 ? 'text-green-700'
                            : (sub.metrics?.score || 0) >= 50 ? 'text-amber-700'
                            : 'text-red-600';
                          const ts = sub.timestamp ? new Date(sub.timestamp) : null;
                          const dateStr = ts ? `${ts.getDate()}/${ts.getMonth()+1}/${String(ts.getFullYear()).slice(2)}` : '—';
                          return (
                            <tr key={sub.id} className={`border-b border-zinc-50 hover:bg-zinc-50 transition-colors ${i % 2 === 0 ? '' : 'bg-zinc-50/40'}`}>
                              <td className="px-4 py-3">
                                <div className="font-medium text-zinc-900 text-xs">{sub.form?.name || '—'}</div>
                                <div className="text-xs text-zinc-400 mt-0.5 font-mono">{sub.id}</div>
                              </td>
                              <td className="px-4 py-3 text-xs text-zinc-500 whitespace-nowrap">{sub.form?.category || '—'}</td>
                              <td className="px-4 py-3">
                                <span className={`text-sm font-black ${scoreCls}`}>{sub.metrics?.score ?? '—'}</span>
                                <span className="text-xs text-zinc-300 ml-0.5">/100</span>
                              </td>
                              <td className="px-4 py-3 text-xs text-zinc-700 font-mono whitespace-nowrap">
                                {sub.metrics?.volume?.toLocaleString() ?? '—'}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`text-xs font-semibold ${riskCls}`}>{sub.metrics?.risk || '—'}</span>
                              </td>
                              <td className="px-4 py-3 text-xs text-zinc-400 whitespace-nowrap">{dateStr}</td>
                              <td className="px-4 py-3">
                                <select
                                  value={sub.status}
                                  onChange={e => updateSubmissionStatus(sub.id, e.target.value)}
                                  className={`text-xs font-medium border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-700 cursor-pointer ${sc.cls}`}>
                                  <option value="pending">Pending</option>
                                  <option value="approved">Approved</option>
                                  <option value="needs_info">Needs Info</option>
                                  <option value="rejected">Rejected</option>
                                </select>
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => reviewSubmission(sub)}
                                  disabled={!sub.form}
                                  className="text-xs text-blue-700 font-semibold hover:underline disabled:opacity-30 disabled:no-underline whitespace-nowrap">
                                  Review →
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </motion.div>

              </div>
            </motion.div>
          );
        })()}

      </AnimatePresence>

      <AnimatePresence>
        {modal && res && (
          <FinancingModal
            product={res.financingProduct}
            workingCapital={res.workingCapital}
            onClose={() => setModal(false)}
            onSubmit={addSubmission}
            vendorForm={form}
            results={res}
          />
        )}
        {replyModal && (() => {
          const { sub, status } = replyModal;
          const isApproved = status === 'approved';
          const product = sub.form?.name || 'your product';
          const vendor  = sub.vendor  || 'Vendor';
          const subject = isApproved
            ? `Your Bravo vendor application is approved — ${product}`
            : `Additional information needed — ${product}`;
          const body = isApproved
            ? `Dear ${vendor},

We are pleased to confirm that ${product} has been approved for listing in Bravo stores.

Launch Score: ${sub.metrics?.score}/100 — ${sub.metrics?.verdict}
Forecast: ${sub.metrics?.volume?.toLocaleString()} units/month · ${sub.metrics?.revenue?.toLocaleString()} AZN/month
Partnership tier: ${sub.form ? computeResults(sub.form).financingProduct.name : '—'}

Your Bravo category contact will reach out within 3 business days to discuss shelf planogram, first order quantity, and the onboarding timeline.

Reference: ${sub.id}

Best regards,
Bravo Category Management Team`
            : `Dear ${vendor},

Thank you for submitting ${product} for Bravo listing consideration.

Our category team requires the following documents before proceeding:
• Product certifications (Halal / food safety / import permits as applicable)
• Confirmed minimum order quantity and unit cost breakdown
• Hi-resolution product images and Azerbaijani-language label
• Company registration certificate

Please reply with these documents within 14 days or your application will expire.

Reference: ${sub.id}

Best regards,
Bravo Category Management Team`;

          return (
            <motion.div
              className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={e => e.target === e.currentTarget && setReplyModal(null)}
            >
              <motion.div
                className="bg-white rounded-md border border-zinc-200 p-6 max-w-lg w-full shadow-lg"
                initial={{ scale:0.97, opacity:0, y:8 }} animate={{ scale:1, opacity:1, y:0 }}
                exit={{ scale:0.97, opacity:0, y:8 }} transition={{ duration:0.18 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className={`text-xs font-semibold px-2 py-0.5 rounded border mb-2 inline-block ${isApproved ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {isApproved ? 'Approved' : 'Needs Info'}
                    </div>
                    <h3 className="text-base font-bold text-zinc-900">Draft Reply</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Auto-generated template · edit before sending</p>
                  </div>
                  <button onClick={() => setReplyModal(null)} className="text-zinc-400 hover:text-zinc-600 p-1 -mt-1 -mr-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-zinc-50 border border-zinc-200 rounded-md px-3 py-2 mb-3">
                  <div className="text-xs text-zinc-400 mb-0.5">Subject</div>
                  <div className="text-xs font-medium text-zinc-800">{subject}</div>
                </div>
                <pre className="text-xs text-zinc-600 leading-relaxed whitespace-pre-wrap bg-zinc-50 border border-zinc-200 rounded-md p-3 mb-4 max-h-60 overflow-y-auto font-sans">
                  {body}
                </pre>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`).catch(() => {})}
                    className="flex-1 bg-zinc-900 text-white font-semibold py-2 rounded-md hover:bg-zinc-800 transition-colors text-xs">
                    Copy to Clipboard
                  </button>
                  <button onClick={() => setReplyModal(null)}
                    className="px-4 py-2 border border-zinc-200 rounded-md text-xs text-zinc-500 hover:text-zinc-700 transition-colors">
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
