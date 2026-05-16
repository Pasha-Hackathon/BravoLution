# Bravo Digital Twin — Features & Functionalities

This document enumerates the implemented features, runtime behaviors, data schemas, APIs, ML pipeline details, and extension points for the Bravo Digital Twin project.

## Project Overview

- Purpose: estimate demand for brand-new products (zero sales history) and recommend first-order quantities using a combination of ML forecasting, analog-SKU similarity, and EOQ (economic order quantity) calculations.
- Deployment: FastAPI service that trains an internal model on startup and exposes REST endpoints and a small static SPA.

## High-level Functionalities

- Automatic model training on startup from CSV files or synthetic fallback data.
- New-product weekly demand forecasting (point estimate + confidence interval).
- Analog SKU recommendations (top-K similar existing SKUs) using vector similarity.
- Attribute contribution breakdown: how input attributes contribute to predicted demand.
- EOQ calculation, safety stock, reorder point (ROP), and recommended first-order quantity with cost breakdown.
- Scenario handling: named scenario forecasts with override parameters (ordering cost, etc.).
- Catalog listing and simple metadata endpoints for UI dropdowns.
- Model statistics endpoint (MAPE, RMSE, R², feature importances, training time).
- Health endpoint for service and model readiness.
- Static SPA served from `static/index.html`.

## API Endpoints (detailed)

- `POST /api/forecast`
  - Purpose: Forecast demand and procurement quantities for a single new product.
  - Request: payload modeled by `NewProductRequest` (see below). Many fields have defaults.
  - Response: `ForecastResponse` with forecasted weekly demand, confidence interval, top analog SKUs, attribute contributions, EOQ results and breakdown.

- `POST /api/scenario`
  - Purpose: Same as `/api/forecast` but accepts a `scenario_name` and optional `ordering_cost` override. Useful for named scenario comparisons.

- `GET /api/catalog`
  - Purpose: Return SKU catalog enriched with average weekly sales for each SKU.

- `GET /api/model-stats`
  - Purpose: Return training metrics and feature importances: `mape`, `rmse`, `r2`, `n_training_samples`, `training_time_seconds`, `feature_importances`.

- `GET /api/categories`
  - Purpose: Return category dropdown values and maps for building UI selects (categories, subcategories, flavors, packaging types).

- `GET /api/health`
  - Purpose: Simple health check indicating model readiness and number of SKUs loaded.

### Request / Response Schemas (highlights)

- `NewProductRequest` (input highlights)
  - Required: `product_name`, `category`, `price_azn` (positive), `weight_g` (default 500), `shelf_life_days`, `supplier_lead_time_days`, `min_order_qty`.
  - Flags: `is_sugar_free`, `is_premium`, `is_organic`, `is_local` (booleans).
  - Costing: `ordering_cost_azn`, `holding_cost_pct`, `service_level`, `lead_time_weeks`.
  - Promotion: `promo_flag`, `promo_discount_pct`, `competitor_price_azn`.

- `ForecastResponse` (output highlights)
  - `demand_forecast_weekly`: numeric point estimate (>= 0).
  - `confidence_interval`: lower and upper weekly values.
  - `top_analog_skus`: list of analog SKUs with `sku_id`, `name`, `similarity_score`, `avg_weekly_sales`, `price_azn`, `category`.
  - `attribute_contributions`: map of attribute -> signed contribution amount (grouped by original attribute names).
  - EOQ outputs: `eoq`, `safety_stock`, `rop`, `recommended_first_order`, `total_cost_azn`, and `eoq_breakdown` with internals.

## ML Engine & Pipeline

- Trainer: `ml.model.DemandForecastEngine`
  - Loads data from `data/sample_catalog.csv` and `data/sample_sales.csv` when present and valid; otherwise generates synthetic fallback data.
  - Prepares training frame by merging sales and catalog and enforcing feature and target schemas.
  - Model: `GradientBoostingRegressor` wrapped inside a `sklearn.pipeline.Pipeline` with a preprocessor and model.
  - Cross-validation: 5-fold CV used to compute RMSE, MAPE (as percent), and R² before final fit.
  - After training: stores feature importances, catalog vectors (preprocessed feature vectors for similarity), and category defaults used during inference.

- Preprocessing: `ml.preprocessor`
  - Feature groups: numeric, binary, categorical.
  - Numeric features are scaled with `StandardScaler`.
  - Categorical features are one-hot encoded (unknowns ignored).
  - Binary flags coerced to 0/1 robustly from common string/boolean/int forms.
  - Column aliasing: supports common alternative column names for ERP exports via `CATALOG_COLUMN_ALIASES` and `SALES_COLUMN_ALIASES`.
  - Schema enforcement: required columns are checked and default fallbacks are provided for missing optional columns.

- Similarity / Analogs: `ml.similarity.find_analog_skus`
  - Computes cosine similarity between a new product preprocessed vector and the catalog vectors.
  - Returns top-K similar SKUs with metadata and similarity scores.

- Prediction internals
  - Build inference row by merging global defaults and category defaults and coercing/validating inputs.
  - Prediction: pipeline.predict(inference_row) clipped to non-negative values.
  - Confidence interval: uses residual standard deviation estimated from training residuals (interval = ±1.5 * residual_std by default).
  - Attribute contributions: multiplies transformed input values by model feature importances and groups by decoded original attribute names to show relative impacts.

## EOQ and Procurement Calculations

- Function: `calculate_eoq` (in `ml.model`)
  - Inputs: forecasted weekly demand (D_hat), ordering cost, holding cost %, unit price, lead time (weeks), demand std, service level.
  - Computes: EOQ (annualized formula), safety stock (z-value × std × sqrt(lead_time_weeks)), reorder point (ROP), recommended_first_order (ceil of EOQ+safety or 1), and cost breakdown (ordering + holding totals).
  - Validations: raises ValueError for invalid numeric inputs (negative or zero where not allowed).

## Data Handling & Schemas

- Primary data files: `data/sample_catalog.csv` and `data/sample_sales.csv`.
- The project includes `data/README_DATA.md` describing required columns and types for both files.
- If CSVs are missing or invalid, the system generates synthetic demo data with realistic distributions and proceeds to train.
- Column aliasing allows easy mapping from ERP-exported names to internal canonical column names.

## Runtime Behavior & Startup

- On application startup (FastAPI lifespan) the `DemandForecastEngine` is instantiated and trained. Training time (seconds) is stored and available via `/api/model-stats`.
- Static assets are served from `static/` and `index.html` is available at `/`.
- Exceptions are handled centrally with consistent JSON error shapes (`error`, `detail`) for HTTP errors, validation errors, and unhandled exceptions.

## Observability & Metrics

- Exposes training metrics (MAPE, RMSE, R²) and feature importances for model introspection.
- Logs startup and fallback behaviors (e.g., synthetic data usage).

## Extension Points & Customization

- Replace training data: swap `data/sample_catalog.csv` and `data/sample_sales.csv` with real ERP exports.
- Extend aliases: modify `CATALOG_COLUMN_ALIASES` / `SALES_COLUMN_ALIASES` in `ml/preprocessor.py` to match internal naming conventions.
- Swap model: change `GradientBoostingRegressor` to another regressor in `ml.model` pipeline.
- Tune EOQ logic: tweak `z_lookup` or safety-stock formula in `calculate_eoq` to match internal procurement policies.
- Add persistence: persist trained pipeline and metadata to disk or model store to avoid retraining on every startup.

## Security & Validation Notes

- Input validation is performed via Pydantic models (`api/schemas.py`). Invalid payloads return 422 with a summarized validation message.
- Model availability checks return 503 when the engine is not initialized.

## Developer / Run Notes

- Start locally:

```
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

- Key files:
  - [main.py](main.py) — application entry and lifespan
  - [api/routes.py](api/routes.py) — REST endpoints
  - [api/schemas.py](api/schemas.py) — request/response models
  - [ml/model.py](ml/model.py) — training, prediction, EOQ
  - [ml/preprocessor.py](ml/preprocessor.py) — data cleaning & transformers
  - [ml/similarity.py](ml/similarity.py) — analog SKU similarity

## Example Requests

- Forecast example (minimal):

```
curl -s -X POST http://localhost:8000/api/forecast \
  -H 'Content-Type: application/json' \
  -d '{"product_name":"Example", "category":"İçkilər", "price_azn":2.5}'
```

- Scenario example (with overrides):

```
curl -s -X POST http://localhost:8000/api/scenario \
  -H 'Content-Type: application/json' \
  -d '{"scenario_name":"PromoTest","product_name":"Example","category":"İçkilər","price_azn":2.5,"ordering_cost":60}'
```

## Where to look for changes

- Data mapping: [ml/preprocessor.py](ml/preprocessor.py)
- Modeling & EOQ: [ml/model.py](ml/model.py)
- API contracts: [api/schemas.py](api/schemas.py)

---

This `feature.md` is intended to be a living document describing current capabilities and common extension points. If you'd like, I can also:

- generate a short `USAGE.md` with endpoint examples and sample payloads;
- add a CI step to persist the trained model after first successful training;
- or create an OpenAPI-driven UI walkthrough for typical new-product workflows.
