FIN-SENSE
Dynamic Financial Intelligence for New-to-Credit Customers

"Creditworthiness is behaviour, not history."

FIN-SENSE is a hackathon prototype for assessing financial risk for new-to-credit and thin-file customers — people who don't have much (or any) traditional credit history. Instead of relying on that history, it looks at behavioural signals: how someone actually manages their money.

The system pairs a behavioural intelligence layer with an ML risk model and shows the result through a dashboard that explains why it reached a given assessment.

The problem

Conventional credit scoring struggles with thin-file customers because there's just not much data to work with. FIN-SENSE tries to fill that gap by looking at things like:

Income stability
Transaction frequency and volatility
Savings behaviour
Bill-payment discipline
Debt-to-income
Cash-flow consistency
Account balance
Employment stability
Financial resilience/buffer

The goal is a risk assessment that's dynamic (based on current behaviour, not a fixed snapshot), explainable, and responsibly built.

How it works

Financial Behaviour DNA — builds a behavioural profile from how the customer manages money.

Dynamic Risk Assessment — combines the ML prediction with a behavioural stability score.

Explainable Decision — shows the actual signals behind the score instead of just a number.

What-If Financial Lab — lets you tweak variables (savings, debt, payment consistency, income stability) and see how predicted risk changes in response.

Financial Twin — a simulated 90-day scenario showing what could happen to financial stability if behaviour improves. It's explicitly framed as a scenario, not a guaranteed outcome.

Features
Portfolio-level dashboard
New applicant assessment
Financial Behaviour DNA profile
XGBoost risk prediction (Random Forest fallback)
Explainable risk drivers + decision recommendation
Financial Twin (90-day projection)
What-If Financial Lab
Trust Center with fairness indicators
Human-review flag for borderline cases
Backend input validation, environment-based frontend config
Architecture
User/Analyst → React UI → FastAPI backend
                              │
                ┌─────────────┴─────────────┐
          Behaviour Engine              ML Risk Model
          (stability score)              (XGBoost/RF)
                └─────────────┬─────────────┘
                        Dynamic Risk + Explainability
                              │
              Explainable AI · What-If Lab · Financial Twin
                              │
                         Trust Center
Tech stack

Frontend: React, Vite, Tailwind CSS, Lucide icons Backend: Python, FastAPI, Pydantic, Uvicorn ML: XGBoost, scikit-learn, pandas, NumPy

The prototype trains on a synthetic dataset (~10,000 generated applicant records) — there's no real applicant data behind this.

The model

Features: income stability, transaction frequency, transaction volatility, savings ratio, bill payment ratio, debt-to-income, cashflow consistency, account balance, employment stability, financial buffer.

XGBoost is the primary model, with a Random Forest fallback if XGBoost isn't available. The final risk score blends the ML probability with the behavioural stability score. Current prototype ROC-AUC is around 93.1% — worth noting this is a demo metric on synthetic data, not a production credit-performance number.

Risk levels:

Level	Meaning
LOW	Stronger financial behaviour, lower predicted risk
MEDIUM	Moderate risk, may warrant a closer look
HIGH	Higher risk pressure, human review recommended

FIN-SENSE is meant as decision support, not a replacement for a human reviewer.

Explainability & responsible AI

Every assessment comes with the behavioural drivers behind it — things like stable income pattern, consistent bill payments, healthy savings behaviour, low spending volatility, consistent cash flow, stable employment pattern — so the "why" is visible, not hidden behind a score.

The Trust Center surfaces a few responsible-AI basics: a prediction disparity indicator, a false-positive gap indicator, and a note that sensitive attributes are excluded from the behavioural inputs. Borderline cases are flagged for human review, and Financial Twin projections are labeled as scenarios rather than guarantees.

Project structure
fin-sense/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   └── tailwind.config.js
├── docker-compose.yml
└── README.md

(Don't include node_modules or a Python venv in the submission zip.)

Running it locally

Backend

bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
python main.py

Runs at http://localhost:8000, health check at /api/health.

Frontend

bash
cd frontend
npm install
npm run dev

Runs at http://localhost:5173. Set VITE_API_URL if the backend isn't on localhost:8000 (that's the default if you don't set it).

API endpoints
Method	Endpoint	Purpose
GET	/api/health	Health check
GET	/api/metrics	Model metrics
GET	/api/applicants	Applicant portfolio
GET	/api/applicants/{id}	Applicant intelligence
POST	/api/assess	Assess a new applicant
POST	/api/simulate	Run a What-If simulation
GET	/api/trust	Responsible-AI indicators

Example assessment output:

Risk Level: LOW
Financial Stability: 72/100
Risk Probability: 18.1%
Model Confidence: 91%
Decision: Recommended for standard evaluation
What's implemented vs. what's roadmap

Done: React frontend, FastAPI backend, XGBoost risk model, behavioural engine, explainable assessment, What-If simulation, Financial Twin, Trust Center, input validation, dynamic applicant assessment.

Not done (production roadmap): PostgreSQL persistence, auth/access control, cloud deployment, an LLM-based explanation layer with guardrails, automated testing, monitoring/logging, model drift and fairness tracking over time, proper secrets management.

Keeping these separate is intentional — I don't want to overstate what's actually built for the hackathon.

Disclaimer

This is a hackathon prototype, not a production lending system. It shouldn't be used to make real credit decisions without proper production data, legal/regulatory review, real fairness testing, security hardening, and ongoing human oversight.

Demo flow

Dashboard → Assess New Applicant → Explainable Decision → Applicant Intelligence → Financial Twin → What-If Financial Lab → Trust Center.

BY
Kasa Sai Mahindra University — B.Tech, Computer Science & Engineering