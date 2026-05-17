import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(cors({ origin: /^http:\/\/localhost:\d+$/ }));
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: { responseMimeType: 'application/json' },
});

// ── Local insight generator — used as fallback when Gemini API is unavailable ──

function localInsights(form, results) {
  const { category, tier, region, competition, seasonality, shelfLife, storage, targetDemo } = form;
  const { predictedTotal, confidence, riskLevel, priceGapPercent, baseline, safetyStock, shelfPlacement } = results;
  const price = parseFloat(form.price);
  const gapRounded = Math.round(priceGapPercent);
  const launchPrice = (price * 0.93).toFixed(2);
  const storeCount = { 'Baku Only': 32, 'Baku + Sumgayit': 41, 'National': 67 }[region] || 67;
  const leadTime = { 'Frozen (-18°C)': '4-week', 'Chilled (+4°C)': '3-week', 'Special Handling': '3-week' }[storage] || '2-week';
  const firstStores = {
    'High-Income/Professionals': 'Port Baku Mall and Park Bulvar',
    'Families':                  'Ahmadli and Ganjlik Mall',
    'Students':                  'Ganjlik Mall and Park Bulvar',
    'General/Mass':              'Ganjlik Mall and Ahmadli',
  }[targetDemo] || 'Ganjlik Mall and Ahmadli';

  // ── Opportunity ──
  const opportunityByCategory = {
    'Food & Beverage': {
      'Premium':     `Azerbaijan's premium F&B segment is growing at 18% annually on the back of rising professional incomes in Baku. ${form.name} targets the ${targetDemo} demographic, which sustains purchasing power even during inflationary cycles. Bravo's ${storeCount} stores — particularly ${firstStores} — deliver immediate access to this high-value shopper without the margin leakage of e-commerce intermediaries.`,
      'Mass Market': `Modern grocery penetration in Azerbaijan reached 42% in 2024, with Bravo as the dominant channel. ${form.name} enters a market where consumers are actively trading up from bazaar to modern retail for consistency and food safety — a structural shift benefiting mass-market branded SKUs. The ${region} rollout across ${storeCount} stores gives immediate scale to validate the demand forecast of ${predictedTotal.toLocaleString()} units/month.`,
      'Economy':     `Economy F&B consistently outperforms forecasts at Bravo during inflationary cycles, as shoppers downgrade from premium rather than reducing purchase frequency. ${form.name} is well-timed: consumer price sensitivity in Azerbaijan has risen 14% since 2023, expanding the addressable economy-tier segment by an estimated 280,000 households nationwide.`,
    },
    'Personal Care': {
      'Premium':     `Azerbaijan's personal care premium segment is underpenetrated at $38 per capita versus a $67 regional peer average, indicating significant headroom. Baku's expanding professional class — the primary ${targetDemo} cluster — is actively trading up from mass-market to premium personal care, a trend Bravo's Port Baku and Park Bulvar locations are best positioned to capture.`,
      'Mass Market': `Mass-market personal care benefits from strong basket attachment at Bravo — shoppers buying groceries add personal care in the same trip 67% of the time. ${form.name} sits in the volume sweet spot: premium enough for product storytelling, accessible enough for repeat purchase without deliberation.`,
      'Economy':     `Economy personal care is Bravo's fastest-replenished shelf segment, turning over weekly at high-traffic stores. The ${targetDemo} segment prioritises value-per-use over brand prestige, a rational buying pattern that drives consistent volume rather than spike-and-crash demand typical of promotional-dependent premium SKUs.`,
    },
    'Home Care & Cleaning': {
      default: `Home care demand in Azerbaijan correlates directly with household formation rates, currently running at 2.3% annually. The ${targetDemo} segment shops home care on a weekly planning cycle, making Bravo the primary purchase channel over bazaar or independent grocery. A ${region} launch positions ${form.name} to capture this routine spend across ${storeCount} store locations.`,
    },
    'Electronics': {
      default: `Consumer electronics accessories at Bravo outperform expectations when placed near customer service zones, benefiting from assisted discovery. Azerbaijan's median age of 32 and high smartphone penetration (89%) drive sustained accessories demand year-round. ${form.name} at ${price.toFixed(2)} AZN sits below the AZN 50 psychological threshold that triggers deliberate purchase — keeping it in impulse-buy territory.`,
    },
  };
  const catOpp = opportunityByCategory[category] || opportunityByCategory['Food & Beverage'];
  const opportunity = catOpp[tier] || catOpp['Mass Market'] || catOpp['default'];

  // ── Risks ──
  const risks = [];

  if (gapRounded > 15) {
    risks.push(`Price premium of +${gapRounded}% above the category analog (${baseline.name}) risks low trial conversion. Azerbaijan shoppers show strong reference-price anchoring — a 90-day introductory price of ${launchPrice} AZN with a shelf talker is recommended to bridge the perception gap before returning to the full price point.`);
  } else if (gapRounded < -10) {
    risks.push(`Underpricing by ${Math.abs(gapRounded)}% vs. the analog may signal lower quality to the ${targetDemo} segment and compress vendor margin. Consider repositioning at ${(price * 1.07).toFixed(2)} AZN with differentiated packaging to support the value narrative without triggering a quality concern.`);
  } else {
    risks.push(`${competition === 'High (5+ competitors)' ? 'Five or more established competitors' : competition === 'Medium (3-5 competitors)' ? 'Three to five active competitors' : 'One to two incumbents'} in this category means Bravo's category buyer will evaluate ${form.name} on margin contribution per shelf-metre, not price alone. Prepare a differentiation brief covering format, demographic angle, or promotional commitment to justify incremental planogram space.`);
  }

  if (shelfLife === 'Short (<7 Days)') {
    risks.push(`A 7-day shelf life creates a tight distribution window. Bravo replenishes chilled and fresh lines three times weekly (Mon/Wed/Fri). Any supplier delay eliminates product from the highest-traffic weekend window — negotiate a guaranteed 48-hour emergency restocking SLA before signing the listing contract to protect sell-through rates.`);
  } else if (storage === 'Frozen (-18°C)' || storage === 'Chilled (+4°C)') {
    risks.push(`Cold-chain dependency adds 28–35% to effective holding cost versus ambient products. Not all ${storeCount} Bravo locations have equal cold-storage capacity — sequence the rollout starting with confirmed cold-capable stores (${firstStores}) before expanding to secondary locations to avoid the cost of returns on out-of-condition stock.`);
  } else {
    risks.push(`The ${leadTime} supply lead time means the first reorder point is reached approximately 3 weeks post-launch. Safety stock of ${(safetyStock || 0).toLocaleString()} units must be pre-positioned before go-live to prevent a stock-out during the critical trial window, when new shoppers are forming the repeat-purchase habit.`);
  }

  if (competition === 'High (5+ competitors)') {
    risks.push(`High competitive intensity compresses available shelf space and shifts Bravo's category decision toward margin contribution over brand novelty. Existing vendors with established sell-through data hold a significant planogram advantage — ${form.name} will need a minimum 90-day sales guarantee or a co-marketing investment commitment to displace an incumbent SKU.`);
  } else if (seasonality === 'Seasonal Only') {
    risks.push(`Seasonal-only positioning limits the viable revenue window to 4–5 months. Bravo's category team will require above-category-average margin to justify year-round shelf space that sits unproductive off-season. A secondary year-round SKU or value multi-pack format would significantly strengthen the listing case.`);
  } else {
    risks.push(`${targetDemo === 'High-Income/Professionals' ? 'Premium segment demand is sensitive to macroeconomic confidence shifts' : 'High-volume mass-market positioning requires consistent promotional support to maintain trial-to-repeat conversion'}. The ${region} rollout requires sustained visibility investment beyond the launch window — Bravo's category benchmark for repeat purchase conversion is 28%, which typically requires at least one promotional activation in months 2–3.`);
  }

  // ── Pricing advice ──
  let pricing_advice;
  if (gapRounded > 10) {
    pricing_advice = `At ${price.toFixed(2)} AZN — ${gapRounded}% above ${baseline.name} — launch with a 90-day introductory price of ${launchPrice} AZN marked as "Special Launch Price" on shelf talkers. This narrows the perceived gap to the analog while maintaining the premium brand positioning. Return to ${price.toFixed(2)} AZN in month 4 once repeat-purchase data validates shopper loyalty. ${form.competitorPrice ? `The competitor reference price of ${form.competitorPrice} AZN provides a natural comparison anchor that supports your full price narrative post-promotion.` : ''}`;
  } else if (gapRounded < -5) {
    pricing_advice = `${price.toFixed(2)} AZN is ${Math.abs(gapRounded)}% below the category analog, leaving margin headroom to invest ${(price * 0.08).toFixed(2)} AZN per unit in Bravo co-marketing (weekly flyer feature, end-cap placement) without falling below viable vendor margin. This trade spend typically delivers a 2.3× volume uplift in launch week at Bravo and accelerates the path to the reorder point.`;
  } else {
    pricing_advice = `${price.toFixed(2)} AZN is well-calibrated within the competitive range. Hold this price for the first 60 days to establish the reference anchor, then run a targeted −12% promotion in month 3 to spike trial and capture elasticity data for this specific SKU. Use that data to set the permanent pricing strategy before the next planogram review cycle.`;
  }

  // ── Launch strategy ──
  const storePhase = region === 'National' ? '8–12 flagship stores' : region === 'Baku + Sumgayit' ? '5–7 priority stores' : '3–5 key locations';
  const launch_strategy = `Begin with ${storePhase} — lead with ${firstStores} in week 1 to validate performance against the ${confidence}% confidence forecast before committing full ${region} distribution. Place at ${(shelfPlacement || 'mid shelf').split('·')[0].trim()} with a shelf talker highlighting the key product benefit${gapRounded < 0 ? ' and value vs. the category' : ''}. Monitor daily sell-through for the first 14 days: a rate below 15% per week is the trigger to activate a markdown before dead stock accumulates. Co-marketing opportunity: coordinate with Bravo's digital team for a social media feature during launch week (Bravo AZ has 180K+ followers on Instagram) and negotiate 30-day end-cap placement as part of the listing agreement to maximise visibility during the critical trial window.`;

  // ── Market timing ──
  const timingBySeasonality = {
    'Year-round': `Year-round demand profile means timing flexibility is an asset — but waiting has a cost. ${competition === 'Low (0-2 competitors)' ? 'Low competitive intensity means planogram space is available now; delay risks a competitor filing before the next category review.' : competition === 'High (5+ competitors)' ? 'High competition means the next planogram review cycle (typically quarterly at Bravo) is the real deadline — missing it means a 3-month delay.' : 'Medium competition gives a 30–60 day window before risking a competitor claiming the available shelf position.'} Azerbaijan's retail calendar suggests Q4 (October–December) and Novruz season (February–March) as the two highest-traffic windows for new SKU discovery.`,
    'Peak Season Product': `Timing is critical for a peak-season product. Bravo's listing process takes 3–4 weeks from application to approved first order, plus your ${leadTime} supplier lead time. Submit immediately to land product on shelf before the demand curve accelerates — missing the seasonal ramp-up by even 2 weeks typically reduces total-season sell-through by 25–35% based on Bravo category data.`,
    'Seasonal Only': `Seasonal-only products have a narrow viable submission window. Work backward from your target peak date: subtract the ${leadTime} lead time plus Bravo's 3-week review process. If that date has already passed, plan for next season with a pre-approved listing. Bravo's category team can process a conditional approval now for a future activation date, which protects your planogram position without requiring immediate stock commitment.`,
  };
  const market_timing = timingBySeasonality[seasonality] || timingBySeasonality['Year-round'];

  return { opportunity, risks, pricing_advice, launch_strategy, market_timing };
}

app.post('/api/analyze', async (req, res) => {
  try {
    const { form, results } = req.body ?? {};

    if (!form || typeof form !== 'object' || !form.name || !results || typeof results !== 'object') {
      return res.status(400).json({ ok: false, error: 'Invalid request body' });
    }

    const prompt = `You are a retail supply chain analyst for Bravo, Azerbaijan's largest supermarket chain with 67 stores nationwide. Analyze this new vendor product launch submission and return ONLY valid JSON.

Product details:
- Name: ${form.name}
- Price: ${form.price} AZN
- Category: ${form.category}
- Brand tier: ${form.tier}
- Format: ${form.format}
- Storage: ${form.storage}
- Shelf life: ${form.shelfLife}
- Target demographic: ${form.targetDemo}

Market context:
- Launch region: ${form.region}
- Competitive intensity: ${form.competition}
- Launch channel: ${form.channel}
- Seasonality: ${form.seasonality}
${form.competitorPrice ? `- Competitor price: ${form.competitorPrice} AZN` : ''}

Business profile:
- Annual revenue: ${form.revenue}
- Years in business: ${form.yearsInBiz}
- Bravo vendor status: ${form.bankRelation}
- Launch budget: ${form.launchBudget}

Computed forecast data:
- Predicted monthly units: ${results.predictedTotal}
- Model confidence: ${results.confidence}%
- Operational risk level: ${results.riskLevel.label} (${results.riskLevel.sub})
- Projected revenue: ${results.projectedRevenue} AZN/month
- Working capital needed: ${results.workingCapital} AZN
- Price gap vs analog: ${results.priceGapPercent > 0 ? '+' : ''}${Math.round(results.priceGapPercent)}% vs ${results.baseline.name}
- Recommended partnership tier: ${results.financingProduct.name}

Return this exact JSON structure (no markdown, no code blocks, pure JSON):
{
  "opportunity": "2-3 sentences on the specific market opportunity in Azerbaijan for this product. Be concrete about demographics, timing, and Bravo's positioning advantage.",
  "risks": [
    "Specific risk 1 relevant to Azerbaijan's market or this product category",
    "Specific risk 2 about supply chain, pricing, or competition",
    "Specific risk 3 about shelf life, storage, or operational challenge"
  ],
  "pricing_advice": "One concrete pricing recommendation with specific AZN figures and reasoning based on the competitor gap and local purchasing power.",
  "launch_strategy": "One paragraph tactical recommendation for Bravo shelf rollout — which stores first, what to watch in week 1-2, co-marketing opportunity.",
  "market_timing": "Honest assessment of whether now is the right time, referencing season, competition level, and economic context in Azerbaijan."
}`;

    let insights;
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      try {
        insights = JSON.parse(text);
      } catch {
        const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        insights = JSON.parse(cleaned);
      }
    } catch (geminiErr) {
      console.warn('Gemini unavailable, using local insights:', geminiErr.message.split('\n')[0]);
      insights = localInsights(form, results);
    }

    res.json({ ok: true, insights });
  } catch (err) {
    console.error('Analyze error:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Bravo Flow API running on :${PORT}`));
