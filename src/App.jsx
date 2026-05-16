import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu, TrendingUp, Activity, DollarSign, AlertTriangle, ShieldCheck,
  Landmark, Star, CheckCircle, X, ChevronRight, ArrowLeft, Info,
  Package, Globe2, Target, BarChart3, Zap, Building2,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, Label, ComposedChart, Bar, Line,
} from 'recharts';

// ─── Products ──────────────────────────────────────────────────────────────

const PRODUCTS = [
  { id:1,  name:'RedBull Zero',           category:'Food & Beverage',       format:'Single Serve (<250g/ml)', tier:'Premium',     storage:'Ambient (Dry)',  shelfLife:'Long (>6 Months)', targetDemo:'High-Income/Professionals', basePrice:2.50,  baseSales:12000 },
  { id:2,  name:'Ariel Color 3Kg',        category:'Home Care & Cleaning',   format:'Bulk/Family (>1kg)',       tier:'Mass Market', storage:'Ambient (Dry)',  shelfLife:'Non-Perishable',   targetDemo:'Families',                 basePrice:12.00, baseSales:5000  },
  { id:3,  name:'Local Dairy Milk',       category:'Food & Beverage',        format:'Standard (250g-1kg)',      tier:'Economy',     storage:'Chilled (+4°C)', shelfLife:'Short (<7 Days)',  targetDemo:'General/Mass',             basePrice:1.20,  baseSales:25000 },
  { id:4,  name:"Lay's Max Paprika",      category:'Food & Beverage',        format:'Single Serve (<250g/ml)', tier:'Mass Market', storage:'Ambient (Dry)',  shelfLife:'Long (>6 Months)', targetDemo:'General/Mass',             basePrice:1.80,  baseSales:18000 },
  { id:5,  name:'Pantene Pro-V 400ml',    category:'Personal Care',          format:'Standard (250g-1kg)',      tier:'Premium',     storage:'Ambient (Dry)',  shelfLife:'Long (>6 Months)', targetDemo:'High-Income/Professionals', basePrice:8.50,  baseSales:7500  },
  { id:6,  name:'Tide Pods 42ct',         category:'Home Care & Cleaning',   format:'Standard (250g-1kg)',      tier:'Premium',     storage:'Ambient (Dry)',  shelfLife:'Non-Perishable',   targetDemo:'Families',                 basePrice:18.00, baseSales:3200  },
  { id:7,  name:'Activia Yoghurt 4-Pack', category:'Food & Beverage',        format:'Standard (250g-1kg)',      tier:'Mass Market', storage:'Chilled (+4°C)', shelfLife:'Short (<7 Days)',  targetDemo:'Families',                 basePrice:3.40,  baseSales:9000  },
  { id:8,  name:'Xiaomi Redmi Buds 4',   category:'Electronics',            format:'Single Serve (<250g/ml)', tier:'Mass Market', storage:'Ambient (Dry)',  shelfLife:'Non-Perishable',   targetDemo:'Students',                 basePrice:35.00, baseSales:1200  },
  { id:9,  name:'Head & Shoulders 200ml',category:'Personal Care',          format:'Single Serve (<250g/ml)', tier:'Economy',     storage:'Ambient (Dry)',  shelfLife:'Long (>6 Months)', targetDemo:'General/Mass',             basePrice:4.20,  baseSales:14000 },
  { id:10, name:'Nesquik 1kg',            category:'Food & Beverage',        format:'Bulk/Family (>1kg)',       tier:'Mass Market', storage:'Ambient (Dry)',  shelfLife:'Long (>6 Months)', targetDemo:'Families',                 basePrice:9.90,  baseSales:6500  },
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

function filterAllocation(rows, region) {
  let filtered = rows;
  if (region === 'Baku Only') filtered = rows.filter(r => r.city === 'Baku');
  else if (region === 'Baku + Sumgayit') filtered = rows.filter(r => r.city === 'Baku' || r.city === 'Sumgayit');
  const total = filtered.reduce((s, r) => s + r.pct, 0);
  return filtered.map(r => ({ ...r, pct: Math.round(r.pct / total * 100) }));
}

function getSeasonalMarkers(category, seasonality) {
  if (seasonality === 'Seasonal Only') return [];
  const m = [];
  if (category !== 'Electronics') m.push({ x: 'Mar', label: 'Nowruz', color: '#d97706' });
  if (category === 'Food & Beverage') m.push({ x: 'Jun', label: 'Summer Peak', color: '#0369a1' });
  if (category === 'Electronics') m.push({ x: 'Jun', label: 'Tech Season', color: '#7c3aed' });
  if (category === 'Personal Care') m.push({ x: 'Jun', label: 'Summer Demand', color: '#16a34a' });
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
    name: p.name, score: p.score, similarity: Math.round(p.score), baseSales: p.baseSales,
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

  // Forecast
  const priceGapPercent = ((newPrice - baseline.basePrice) / baseline.basePrice) * 100;
  const predictedTotal  = Math.max(1, Math.round(baseline.baseSales * (1 + (priceGapPercent / 100) * -0.5)));
  const errorRate       = parseFloat((Math.abs(priceGapPercent) * 0.08 + 1.9 + (100 - matchScore) * 0.03).toFixed(1));
  const confidence      = parseFloat((100 - errorRate).toFixed(1));
  const projectedRevenue = Math.round(predictedTotal * newPrice);

  // Risk
  const riskLevel =
    baseline.shelfLife === 'Short (<7 Days)' ? { label:'HIGH',   sub:'Spoilage Risk',  level:'high'   }
    : priceGapPercent > 25                   ? { label:'HIGH',   sub:'Overpriced',     level:'high'   }
    : priceGapPercent > 10                   ? { label:'MEDIUM', sub:'Watch Price',    level:'medium' }
    :                                          { label:'LOW',    sub:'Stable',         level:'low'    };

  // EOQ / Procurement
  const annualDemand   = predictedTotal * 12;
  const orderingCost   = 45;
  const holdingCost    = Math.max(0.01, newPrice * 0.22);
  const eoq            = Math.max(1, Math.round(Math.sqrt((2 * annualDemand * orderingCost) / holdingCost)));
  const demandStd      = Math.round(baseline.baseSales * 0.15);
  const leadTimeWeeks  = 2;
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

  // Financing
  const workingCapital = Math.round(predictedTotal * 0.15 * newPrice * 2.1);
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

  // Chart data
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'];
  const errF = errorRate / 100;
  const chartData = months.map((month, i) => {
    const pred = Math.round(predictedTotal * (0.25 + (i / 7) * 0.75) * (1 + Math.sin(i) * 0.03));
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

  // Price sensitivity
  const sensitivityScenarios = [-0.10, 0, 0.10].map(delta => {
    const p   = newPrice * (1 + delta);
    const gap = ((p - baseline.basePrice) / baseline.basePrice) * 100;
    const vol = Math.max(1, Math.round(baseline.baseSales * (1 + (gap / 100) * -0.5)));
    return { delta, price: parseFloat(p.toFixed(2)), volume: vol, diff: vol - predictedTotal };
  });

  // Seasonal markers
  const seasonalMarkers = getSeasonalMarkers(form.category, form.seasonality);

  // Competitor positioning
  const compPrice = form.competitorPrice ? parseFloat(form.competitorPrice) : null;
  const compGap   = compPrice ? ((newPrice - compPrice) / compPrice * 100).toFixed(1) : null;

  return {
    baseline, matchScore, topAnalogs, contributions,
    newPrice, priceGapPercent, predictedTotal, errorRate, confidence, projectedRevenue,
    riskLevel, eoq, safetyStock, rop, firstOrderQty,
    launchScore, allocRows, workingCapital, financingProduct, financedUnits, upliftPct,
    chartData, cashFlowData, breakevenMonth, sensitivityScenarios, seasonalMarkers,
    compGap,
  };
}

// ─── Shared UI ─────────────────────────────────────────────────────────────

const FIELD = 'w-full px-3 py-2.5 border border-zinc-200 rounded-md text-sm text-zinc-900 bg-white focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-colors duration-150';
const LABEL = 'block text-sm font-medium text-zinc-700 mb-1.5';

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg width="48" height="22" viewBox="0 0 48 22" fill="none" aria-label="Bravo">
        <rect width="48" height="22" rx="4" fill="#00A550"/>
        <text x="5" y="15.5" fontFamily="DM Sans,system-ui,sans-serif" fontWeight="800" fontSize="12" fill="white" letterSpacing="0.2">bravo</text>
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

// ─── Financing Modal ───────────────────────────────────────────────────────

function FinancingModal({ product, workingCapital, onClose }) {
  const [done, setDone] = useState(false);
  const [ref] = useState(() => `BF-${Math.floor(100000 + Math.random() * 900000)}`);
  const [f, setF] = useState({ name:'', company:'', phone:'' });
  const submit = e => { e.preventDefault(); setDone(true); };
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

const SCREENS = { S1:'s1', S2:'s2', S3:'s3', S4:'s4', PULSE:'pulse', DASH:'dash' };

function WizardCard({ children }) {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="bg-white border border-zinc-200 rounded-md shadow-sm w-full max-w-md p-7">
        {children}
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

const FADE = { initial:{opacity:0}, animate:{opacity:1}, exit:{opacity:0}, transition:{duration:0.2} };

// ─── Main App ──────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState(SCREENS.S1);
  const [modal,  setModal]  = useState(false);
  const [form,   setForm]   = useState(BLANK);
  const [res,    setRes]    = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const step1OK = form.name.trim() && form.price && parseFloat(form.price) > 0;

  const submit = () => {
    setRes(computeResults(form));
    setScreen(SCREENS.PULSE);
    setTimeout(() => setScreen(SCREENS.DASH), 2750);
  };

  const reset = () => { setScreen(SCREENS.S1); setRes(null); setForm(BLANK); };

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
            <WizardCard>
              <WizardHeader />
              <StepDots current={0} />
              <div className="mb-5">
                <div className="text-base font-semibold text-zinc-900 mb-0.5">Core Identity</div>
                <p className="text-sm text-zinc-500">Product fundamentals and pricing</p>
              </div>
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
                onClick={() => step1OK && setScreen(SCREENS.S2)}
                disabled={!step1OK}
                className="w-full mt-5 bg-blue-700 text-white font-semibold py-2.5 rounded-md hover:bg-blue-800 transition-colors duration-150 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
              >
                Next: Logistics <ChevronRight className="w-4 h-4" />
              </button>
            </WizardCard>
          </motion.div>
        )}

        {/* ── Step 2 ── */}
        {screen === SCREENS.S2 && (
          <motion.div key="s2" {...FADE}>
            <WizardCard>
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
            <WizardCard>
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
            <WizardCard>
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
          const scoreBars = [
            { label:'Product Fit',        pts: res.launchScore.productFit,        max:30, pct: Math.round(res.launchScore.productFit / 30 * 100) },
            { label:'Market Timing',      pts: res.launchScore.marketTiming,      max:25, pct: Math.round(res.launchScore.marketTiming / 25 * 100) },
            { label:'Financial Viability',pts: res.launchScore.financialViability, max:25, pct: Math.round(res.launchScore.financialViability / 25 * 100) },
            { label:'Supply Chain',       pts: res.launchScore.supplyChain,       max:20, pct: Math.round(res.launchScore.supplyChain / 20 * 100) },
          ];
          return (
            <motion.div key="dash" className="min-h-screen bg-zinc-50" {...FADE}>

              {/* Navbar */}
              <div className="bg-white border-b border-zinc-200 h-12 px-5 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4">
                  <button onClick={reset} className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 transition-colors text-sm">
                    <ArrowLeft className="w-3.5 h-3.5" /> Start Over
                  </button>
                  <div className="w-px h-4 bg-zinc-200" />
                  <Logo />
                </div>
                <span className="text-sm font-medium text-zinc-700">{form.name}</span>
                <div className="flex items-center gap-3">
                  <AiBadge />
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
                      <div className={`text-6xl font-black leading-none ${sc.num}`}>{res.launchScore.total}</div>
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
                      sub: `Analog: ${res.baseline.name}`,
                    },
                    {
                      icon: Activity, label:'Model Confidence', color:'text-blue-700',
                      value: <>{res.confidence}%</>,
                      sub: `MAPE ±${res.errorRate}%`,
                      tooltip: 'Ensemble of KNN similarity, price elasticity regression, and demographic weighting',
                    },
                    {
                      icon: DollarSign, label:'Projected Revenue', color:'text-green-700',
                      value: <><AnimatedNumber target={res.projectedRevenue} /><span className="text-base font-medium text-zinc-400 ml-1">AZN</span></>,
                      sub: 'Over forecast period',
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

                {/* Demand Chart */}
                <motion.div className="bg-white border border-zinc-200 rounded-md p-5"
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.22 }}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-semibold text-zinc-900 text-sm">Demand Forecast — 8-Month Outlook</div>
                      <div className="text-xs text-zinc-400 mt-0.5">Monthly unit volume with confidence interval</div>
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
                </motion.div>

                {/* Price Sensitivity */}
                <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.27 }}>
                  <div className="text-xs text-zinc-400 font-medium mb-2">Price Sensitivity Analysis</div>
                  <div className="grid grid-cols-3 gap-3">
                    {res.sensitivityScenarios.map((s, i) => {
                      const isCurrent = i === 1;
                      const maxVol = Math.max(...res.sensitivityScenarios.map(x => x.volume));
                      return (
                        <div key={i} className={`bg-white rounded-md p-4 border ${isCurrent ? 'border-blue-700' : 'border-zinc-200'}`}>
                          <div className={`text-xs font-medium mb-2 ${isCurrent ? 'text-blue-700' : 'text-zinc-400'}`}>
                            {i === 0 ? '−10% price' : i === 2 ? '+10% price' : 'Current price'}
                          </div>
                          <div className="text-sm text-zinc-500 mb-1">{s.price.toFixed(2)} AZN</div>
                          <div className="text-xl font-black text-zinc-900 mb-1">{s.volume.toLocaleString()}</div>
                          {!isCurrent && (
                            <div className={`text-xs font-semibold ${s.diff > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {s.diff > 0 ? '+' : ''}{s.diff.toLocaleString()} units
                            </div>
                          )}
                          <div className="h-1 bg-zinc-100 rounded-sm mt-2">
                            <div className={`h-full rounded-sm ${isCurrent ? 'bg-blue-700' : 'bg-zinc-300'}`}
                              style={{ width:`${Math.round(s.volume / maxVol * 100)}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Model Intelligence — Analogs + Contributions */}
                <motion.div className="grid grid-cols-2 gap-3"
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.30 }}>

                  {/* Top Analogs */}
                  <div className="bg-white border border-zinc-200 rounded-md p-5">
                    <div className="font-semibold text-zinc-900 text-sm mb-3">Top 3 Analog SKUs</div>
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

                  {/* Attribute Contributions */}
                  <div className="bg-white border border-zinc-200 rounded-md p-5">
                    <div className="font-semibold text-zinc-900 text-sm mb-3">Attribute Contribution</div>
                    <div className="space-y-2.5">
                      {res.contributions.map(c => (
                        <div key={c.attr}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-zinc-500">{c.attr}</span>
                            <span className={`text-xs font-semibold ${c.pts > 0 ? 'text-blue-700' : 'text-zinc-300'}`}>
                              +{c.pts}/{c.max}
                            </span>
                          </div>
                          <div className="h-1 bg-zinc-100 rounded-sm">
                            <div className={`h-full rounded-sm ${c.pts > 0 ? 'bg-blue-700' : 'bg-zinc-200'}`}
                              style={{ width:`${c.pts > 0 ? 100 : 30}%`, opacity: c.pts > 0 ? 1 : 0.4 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Dispatch Matrix + Cash Flow */}
                <motion.div className="grid grid-cols-2 gap-3"
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.34 }}>

                  <div className="bg-white border border-zinc-200 rounded-md p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="font-semibold text-zinc-900 text-sm">Dispatch Matrix</div>
                        <div className="text-xs text-zinc-400 mt-0.5">{form.region} · {res.allocRows.length} locations</div>
                      </div>
                      <Globe2 className="w-4 h-4 text-zinc-300" />
                    </div>
                    <DispatchMatrix rows={res.allocRows} />
                  </div>

                  <div className="bg-white border border-zinc-200 rounded-md p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="font-semibold text-zinc-900 text-sm">Cash Flow Projection</div>
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
                      <div className="font-semibold text-zinc-900 text-sm">Procurement Intelligence</div>
                      <div className="text-xs text-zinc-400 mt-0.5">EOQ model · 95% service level · 2-week lead time</div>
                    </div>
                    <Package className="w-4 h-4 text-zinc-300" />
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label:'Safety Stock',     value: res.safetyStock,    unit:'units' },
                      { label:'Reorder Point',    value: res.rop,            unit:'units' },
                      { label:'Economic Order Qty',value: res.eoq,           unit:'units' },
                      { label:'First Order Rec.', value: res.firstOrderQty,  unit:'units' },
                    ].map(({label, value, unit}) => (
                      <div key={label} className="border-l border-zinc-100 pl-4 first:border-l-0 first:pl-0">
                        <div className="text-xs text-zinc-400 mb-1">{label}</div>
                        <div className="text-xl font-black text-zinc-900">{value.toLocaleString()}</div>
                        <div className="text-xs text-zinc-400">{unit}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Financing Intelligence */}
                <motion.div className="bg-white border border-zinc-200 rounded-md p-5"
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.40 }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Landmark className="w-4 h-4 text-blue-700" />
                    <div className="font-semibold text-zinc-900 text-sm">Bravo Vendor Intelligence</div>
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
                </motion.div>

                {/* CTA */}
                <motion.div className="bg-zinc-900 rounded-md p-5 flex items-center justify-between"
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

      </AnimatePresence>

      <AnimatePresence>
        {modal && res && (
          <FinancingModal
            product={res.financingProduct}
            workingCapital={res.workingCapital}
            onClose={() => setModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
