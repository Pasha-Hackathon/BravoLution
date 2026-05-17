import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: { responseMimeType: 'application/json' },
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { form, results } = req.body;

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

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let insights;
    try {
      insights = JSON.parse(text);
    } catch {
      // Gemini sometimes wraps JSON in markdown — strip it
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      insights = JSON.parse(cleaned);
    }

    res.json({ ok: true, insights });
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Bravo Flow API running on :${PORT}`));
