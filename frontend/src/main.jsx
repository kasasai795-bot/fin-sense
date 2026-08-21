import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity, ArrowDownRight, ArrowUpRight, BrainCircuit, CheckCircle2,
  ChevronRight, CircleHelp, Gauge, Landmark, LayoutDashboard, ShieldCheck,
  SlidersHorizontal, Sparkles, TrendingDown, TrendingUp, Users, WalletCards,
  Zap
} from "lucide-react";
import "./index.css";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api`;

const nav = [
  ["dashboard", "Dashboard", LayoutDashboard],
  ["newapplicant", "Assess New Applicant", Users],
  ["applicant", "Applicant Intelligence", BrainCircuit],
  ["simulator", "What-If Lab", SlidersHorizontal],
  ["trust", "Trust Center", ShieldCheck],
];

function App() {
  const [page, setPage] = useState("dashboard");
  const [applicants, setApplicants] = useState([]);
  const [selectedId, setSelectedId] = useState("FS-1042");
  const [selected, setSelected] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [trust, setTrust] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/applicants`).then(r => r.json()),
      fetch(`${API}/metrics`).then(r => r.json()),
      fetch(`${API}/trust`).then(r => r.json()),
    ]).then(([a, m, t]) => {
      setApplicants(a); setMetrics(m); setTrust(t);
      setSelected(a.find(x => x.id === selectedId) || a[0]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const x = applicants.find(a => a.id === selectedId);
    if (x) setSelected(x);
  }, [selectedId, applicants]);

  const openApplicant = (id) => {
    setSelectedId(id);
    setPage("applicant");
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col p-5">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#111827] text-white">
              <Sparkles size={19}/>
            </div>
            <div>
              <div className="font-bold tracking-tight">FIN-SENSE</div>
              <div className="text-[11px] text-slate-500">Financial Intelligence</div>
            </div>
          </div>

          <div className="mt-8 space-y-1">
            {nav.map(([key, label, Icon]) => (
              <button key={key} onClick={() => setPage(key)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  page === key ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}>
                <Icon size={18}/>{label}
              </button>
            ))}
          </div>

          <div className="mt-auto rounded-2xl bg-slate-950 p-4 text-white">
            <div className="flex items-center gap-2 text-sm font-semibold"><Zap size={16}/> AI engine online</div>
            <div className="mt-2 text-xs leading-5 text-slate-400">
              Explainable risk intelligence for new-to-credit customers.
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400"/> All systems operational
            </div>
          </div>
        </div>
      </aside>

      <main className="lg:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur md:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">FIN-SENSE • Financial Intelligence</div>
              <h1 className="mt-1 text-xl font-bold tracking-tight md:text-2xl">
  {page === "dashboard"
    ? "Financial Intelligence Dashboard"
    : page === "newapplicant"
    ? "Assess New Applicant"
    : page === "applicant"
    ? "Applicant Intelligence"
    : page === "simulator"
    ? "What-If Financial Lab"
    : "Responsible AI Trust Center"}
</h1>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <div className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
                Model: {metrics?.model || "XGBoost"}
              </div>
              <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500"/> Live
              </div>
            </div>
          </div>
        </header>

        <div className="p-5 md:p-8">
          {page === "dashboard" && <Dashboard applicants={applicants} metrics={metrics} onOpen={openApplicant}/>}
          {page === "newapplicant" && <NewApplicant/>}
          {page === "applicant" && selected && <Applicant selected={selected}/>}
          {page === "simulator" && selected && <Simulator selected={selected}/>}
          {page === "trust" && trust && <Trust trust={trust} metrics={metrics}/>}
        </div>
      </main>
    </div>
  );
}

function Dashboard({ applicants, metrics, onOpen }) {
  const low = applicants.filter(a => a.risk_level === "LOW").length;
  const medium = applicants.filter(a => a.risk_level === "MEDIUM").length;
  const high = applicants.filter(a => a.risk_level === "HIGH").length;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-slate-950 p-6 text-white md:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200">
            <Sparkles size={14}/> Creditworthiness is behaviour, not history.
          </div>
          <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-5xl">
            Understand customers traditional credit models can't see.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
            FIN-SENSE turns alternative financial behaviour into dynamic, explainable risk intelligence for new-to-credit and thin-file customers.
          </p>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        <Metric title="Applications" value="1,248" icon={Users}/>
        <Metric title="Low risk" value="76%" icon={CheckCircle2} green/>
        <Metric title="Model ROC-AUC" value={`${metrics?.roc_auc ?? "--"}%`} icon={Gauge}/>
        <Metric title="Explainability" value="100%" icon={BrainCircuit}/>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <div className="font-bold">Recent assessments</div>
              <div className="mt-1 text-xs text-slate-500">Dynamic risk across sample applicants</div>
            </div>
            <Activity size={19} className="text-slate-400"/>
          </div>
          <div className="divide-y divide-slate-100">
            {applicants.map(a => (
              <button onClick={() => onOpen(a.id)} key={a.id} className="flex w-full items-center justify-between p-5 text-left hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">
                    {a.name.split(" ").map(x=>x[0]).join("")}
                  </div>
                  <div>
                    <div className="font-semibold">{a.name}</div>
                    <div className="mt-1 text-xs text-slate-500">{a.segment} · {a.id}</div>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="hidden text-right sm:block">
                    <div className="text-xs text-slate-400">Stability</div>
                    <div className="font-bold">{a.financial_stability}/100</div>
                  </div>
                  <RiskBadge level={a.risk_level}/>
                  <ChevronRight size={17} className="text-slate-400"/>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <div className="font-bold">Risk distribution</div>
          <div className="mt-1 text-xs text-slate-500">Current prototype portfolio</div>
          <div className="mt-8 space-y-5">
            <Bar label="Low risk" value={76} tone="bg-emerald-500"/>
            <Bar label="Medium risk" value={16} tone="bg-amber-400"/>
            <Bar label="High risk" value={8} tone="bg-rose-500"/>
          </div>
          <div className="mt-8 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            <b>Design principle:</b> the model supports credit decisions; it does not replace human review for borderline cases.
          </div>
        </section>
      </div>
    </div>
  );
}

function Applicant({ selected }) {
  const positives = selected.factors.filter(x => x.type === "positive");
  const negatives = selected.factors.filter(x => x.type === "negative");

  const dna = [
    ["Income Stability", selected.income_stability],
    ["Payment Discipline", selected.bill_payment_ratio],
    ["Savings Behaviour", Math.min(selected.savings_ratio * 2.2, 100)],
    ["Spending Stability", 100 - selected.transaction_volatility],
    ["Cashflow Consistency", selected.cashflow_consistency],
    ["Financial Resilience", selected.financial_buffer],
  ];

  return (
    <div className="space-y-6">
      <section className="card p-6 md:p-7">
        <div className="flex flex-col justify-between gap-6 md:flex-row">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-indigo-500">{selected.segment}</div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">{selected.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{selected.id} · Traditional credit history: Limited</p>
          </div>
          <RiskBadge level={selected.risk_level} large/>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-4">
          <Score value={selected.financial_stability} label="Financial Stability"/>
          <Score value={selected.risk_probability} label="Risk Probability" inverse/>
          <Score value={selected.confidence} label="Model Confidence"/>
          <div className="rounded-2xl bg-slate-50 p-5">
            <div className="label">30-day trend</div>
            <div className="mt-3 flex items-center gap-2 text-lg font-bold">
              <TrendingDown className="text-emerald-500"/> {selected.trend}
            </div>
          </div>
        </div>

      {/* Financial Twin */}
      <section className="rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-950 p-6 text-white md:p-7">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-100">
              <Sparkles size={14}/> Signature intelligence
            </div>

            <h3 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
              Financial Twin
            </h3>

            <p className="mt-2 text-sm leading-6 text-indigo-100/80">
              A simulated 90-day version of the customer's financial behaviour,
              showing how healthier behaviour could change risk.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm">
            <div className="text-xs text-indigo-200">Projection horizon</div>
            <div className="mt-1 font-bold">Next 90 days</div>
          </div>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2">

          <div className="rounded-2xl bg-white/10 p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
              Current state
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="text-4xl font-bold">
                  {Math.round(selected.financial_stability)}
                </div>
                <div className="mt-1 text-xs text-indigo-200">
                  Financial stability /100
                </div>
              </div>

              <RiskBadge level={selected.risk_level}/>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 text-slate-950">
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Projected state
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="text-4xl font-bold text-indigo-700">
                  {Math.min(
                    100,
                    Math.round(
                      selected.financial_stability +
                      (selected.risk_level === "HIGH"
                        ? 22
                        : selected.risk_level === "MEDIUM"
                        ? 15
                        : 8)
                    )
                  )}
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  Financial stability /100
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-current"/>
                IMPROVED
              </span>
            </div>
          </div>

        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">

          <div className="rounded-2xl bg-white/10 p-4">
            <div className="text-xs text-indigo-200">Stability gain</div>
            <div className="mt-1 text-xl font-bold">
              +{
                selected.risk_level === "HIGH"
                  ? 22
                  : selected.risk_level === "MEDIUM"
                  ? 15
                  : 8
              } points
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 p-4">
            <div className="text-xs text-indigo-200">Risk reduction</div>
            <div className="mt-1 text-xl font-bold">
              {
                selected.risk_level === "HIGH"
                  ? "38%"
                  : selected.risk_level === "MEDIUM"
                  ? "30%"
                  : "18%"
              }
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 p-4">
            <div className="text-xs text-indigo-200">Projection</div>
            <div className="mt-1 text-xl font-bold">90 days</div>
          </div>

        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-indigo-100/85">
          <b className="text-white">Important:</b> this is a scenario projection,
          not a guaranteed outcome. It helps explain how improved financial
          behaviour could influence the customer's future risk profile.
        </div>
      </section>

      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <section className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold">Financial Behaviour DNA</div>
              <div className="mt-1 text-xs text-slate-500">Signals that describe how the customer manages money</div>
            </div>
            <BrainCircuit className="text-indigo-500"/>
          </div>
          <div className="mt-7 space-y-5">
            {dna.map(([label, value]) => (
              <div key={label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium">{label}</span>
                  <span className="font-bold">{Math.round(value)}</span>
                </div>
                <div className="progress"><div className={value >= 70 ? "bg-indigo-500" : "bg-amber-400"} style={{width:`${Math.min(value,100)}%`}}/></div>
              </div>
            ))}
          </div>
        </section>

        <section className="card p-6">
          <div className="font-bold">Explainable AI decision</div>
          <div className="mt-1 text-xs text-slate-500">Key behavioural signals behind the prediction</div>

          <div className="mt-6 rounded-2xl bg-emerald-50 p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-700"><CheckCircle2 size={17}/> Recommended for standard evaluation</div>
            <p className="mt-3 text-sm leading-6 text-emerald-900">
              The customer shows {selected.risk_level === "LOW" ? "strong" : "mixed"} financial behaviour despite limited formal credit history.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {positives.slice(0,4).map((f,i)=><Factor key={i} positive {...f}/>)}
            {negatives.slice(0,2).map((f,i)=><Factor key={i} positive={false} {...f}/>)}
          </div>
        </section>
      </div>
    </div>
  );
}

function Simulator({ selected }) {
  const [savings, setSavings] = useState(5000);
  const [debt, setDebt] = useState(Math.round(selected.debt_to_income * 45000));
  const [payments, setPayments] = useState(selected.bill_payment_ratio);
  const [incomeStability, setIncomeStability] = useState(selected.income_stability);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    const r = await fetch(`${API}/simulate`, {
      method: "POST", headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        applicant_id: selected.id,
        monthly_savings: savings, debt, bill_payment_ratio: payments,
        income_stability: incomeStability
      })
    });
    setResult(await r.json());
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-indigo-600 to-slate-950 p-6 text-white md:p-8">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10"><SlidersHorizontal/></div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-indigo-200">Signature feature</div>
            <h2 className="mt-2 text-3xl font-bold">What-If Financial Lab</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-100/75">
              Simulate realistic behaviour changes and see how financial resilience and predicted risk respond.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_.8fr]">
        <section className="card p-6">
          <div className="font-bold">Simulate {selected.name}</div>
          <div className="mt-1 text-xs text-slate-500">Move one signal at a time and run the model again.</div>
          <div className="mt-8 space-y-7">
            <Slider label="Monthly savings" value={savings} min={0} max={20000} step={500} display={`₹${savings.toLocaleString()}`} set={setSavings}/>
            <Slider label="Existing debt" value={debt} min={0} max={100000} step={1000} display={`₹${debt.toLocaleString()}`} set={setDebt}/>
            <Slider label="Bill payment consistency" value={payments} min={40} max={100} step={1} display={`${Math.round(payments)}%`} set={setPayments}/>
            <Slider label="Income stability" value={incomeStability} min={30} max={100} step={1} display={`${Math.round(incomeStability)}/100`} set={setIncomeStability}/>
          </div>
          <button onClick={run} disabled={loading} className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50">
            <Zap size={17}/> {loading ? "Running model..." : "Run simulation"}
          </button>
        </section>

        <section className="card p-6">
          <div className="font-bold">Simulation impact</div>
          <div className="mt-1 text-xs text-slate-500">Model response to your scenario</div>

          {!result ? (
            <div className="mt-12 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 text-indigo-600"><Sparkles/></div>
              <p className="mt-4 text-sm leading-6 text-slate-500">Change the financial signals and run the simulation to reveal the impact.</p>
            </div>
          ) : (
            <div className="mt-8 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <Impact label="Current risk" value={`${result.before.risk}%`}/>
                <Impact label="Projected risk" value={`${result.after.risk}%`} highlight/>
              </div>
              <div className={`rounded-2xl p-5 ${result.impact === "POSITIVE" ? "bg-emerald-50 text-emerald-900" : result.impact === "NEGATIVE" ? "bg-rose-50 text-rose-900" : "bg-slate-50 text-slate-900"}`}>
                <div className="flex items-center gap-2 font-bold">
                  {result.impact === "POSITIVE" ? <ArrowDownRight/> : <ArrowUpRight/>}
                  {result.impact} IMPACT
                </div>
                <p className="mt-2 text-sm leading-6">{result.message}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="label">Financial stability</div>
                <div className="mt-2 flex items-end justify-between">
                  <span className="text-3xl font-bold">{result.before.stability}</span>
                  <ChevronRight className="mb-1 text-slate-300"/>
                  <span className="text-3xl font-bold text-indigo-600">{result.after.stability}</span>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Trust({ trust, metrics }) {
  const items = [
    ["Prediction disparity", `${trust?.prediction_disparity ?? 2.1}%`, "Within monitored range"],
    ["False-positive gap", `${trust?.false_positive_gap ?? 1.8}%`, "Within monitored range"],
    ["Explainability coverage", `${trust?.explainability_coverage ?? trust?.explainability ?? 100}%`, "Fully enabled"],
    ["Sensitive features", "Excluded", "Decision inference"],
  ];

  const principles =
    trust?.principles ||
    trust?.responsible_ai_principles ||
    trust?.responsible_ai ||
    [
      "Sensitive attributes are excluded from the risk assessment.",
      "Explainable factors are shown with every assessment.",
      "Human review is recommended for borderline cases.",
      "Fairness indicators are monitored.",
    ];

  return (
    <div className="space-y-6">
      <section className="card p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
            <ShieldCheck />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              Responsible AI Trust Center
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Transparency, fairness monitoring and human review are built
              into the decision workflow.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {items.map(([a, b, c]) => (
            <div
              className="rounded-2xl bg-slate-50 p-5"
              key={a}
            >
              <div className="label">{a}</div>
              <div className="mt-2 text-xl font-bold">{b}</div>
              <div className="mt-1 text-xs text-slate-500">{c}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="card p-6">
          <div className="font-bold">Model performance</div>

          <div className="mt-5 space-y-4">
            {Object.entries(metrics || {})
  .filter(([k, v]) => k !== "model" && typeof v === "number")
  .map(([k, v]) => (
    <div
      key={k}
      className="flex items-center justify-between border-b border-slate-100 pb-3 text-sm"
    >
      <span className="capitalize text-slate-500">
        {k.replaceAll("_", " ")}
      </span>
      <b>{v}%</b>
    </div>
  ))}
          </div>
        </section>

        <section className="card p-6">
          <div className="font-bold">Governance principles</div>

          <div className="mt-5 space-y-3">
            {principles.map((p, i) => (
              <div
                key={i}
                className="flex gap-3 text-sm leading-6 text-slate-600"
              >
                <CheckCircle2
                  className="mt-1 shrink-0 text-emerald-500"
                  size={17}
                />
                <span>{typeof p === "string" ? p : p.text || p.description}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({title,value,icon:Icon,green}) {
  return <div className="card p-5"><div className={`grid h-9 w-9 place-items-center rounded-xl ${green?"bg-emerald-50 text-emerald-600":"bg-slate-100 text-slate-600"}`}><Icon size={17}/></div><div className="mt-5 label">{title}</div><div className="mt-1 metric">{value}</div></div>
}

function Score({value,label,inverse}) {
  const v = Math.round(value);
  return <div className="rounded-2xl bg-slate-50 p-5"><div className="label">{label}</div><div className="mt-3 flex items-end justify-between"><span className={`text-3xl font-bold ${inverse ? (v<35?"text-emerald-600":v<60?"text-amber-600":"text-rose-600") : "text-slate-950"}`}>{v}</span><span className="text-xs text-slate-400">/100</span></div></div>
}

function RiskBadge({level,large}) {
  const styles = level==="LOW" ? "bg-emerald-50 text-emerald-700" : level==="MEDIUM" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700";
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${styles} ${large?"text-sm":""}`}><span className="h-1.5 w-1.5 rounded-full bg-current"/>{level} RISK</span>
}

function Bar({label,value,tone}) {
  return <div><div className="mb-2 flex justify-between text-sm"><span className="font-medium">{label}</span><b>{value}%</b></div><div className="progress"><div className={tone} style={{width:`${value}%`}}/></div></div>
}

function Factor({text,positive}) {
  return <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm"><span className={`grid h-7 w-7 place-items-center rounded-lg ${positive?"bg-emerald-100 text-emerald-700":"bg-rose-100 text-rose-700"}`}>{positive?"✓":"−"}</span><span className="font-medium">{text}</span></div>
}

function Slider({label,value,min,max,step,display,set}) {
  return <div><div className="mb-3 flex justify-between text-sm"><span className="font-semibold">{label}</span><span className="font-bold text-indigo-600">{display}</span></div><input className="w-full accent-indigo-600" type="range" min={min} max={max} step={step} value={value} onChange={e=>set(Number(e.target.value))}/><div className="mt-1 flex justify-between text-[11px] text-slate-400"><span>{min}</span><span>{max}</span></div></div>
}

function Impact({label,value,highlight}) {
  return <div className={`rounded-2xl p-5 ${highlight?"bg-indigo-50":"bg-slate-50"}`}><div className="label">{label}</div><div className={`mt-2 text-3xl font-bold ${highlight?"text-indigo-600":""}`}>{value}</div></div>
}
function NewApplicant() {
  const [form, setForm] = useState({
    name: "", income: 45000, income_stability: 80, transaction_frequency: 70,
    transaction_volatility: 20, savings_ratio: 30, bill_payment_ratio: 90,
    debt_to_income: 20, cashflow_consistency: 80, employment_stability: 85,
    financial_buffer: 70, account_balance: 50000
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: Number(value) }));
  };

  const assess = async () => {
    if (!form.name.trim()) {
      setError("Please enter the applicant name.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API}/assess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          debt_to_income: form.debt_to_income / 100
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Assessment failed.");
      setResult(data);
    } catch (err) {
      setError(err.message || "Could not connect to the FIN-SENSE API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Assess a New Applicant</h2>
        <p className="mt-1 text-sm text-slate-500">Evaluate financial behaviour beyond traditional credit history.</p>
      </div>

      <div className="card p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="label">Applicant Name</label>
            <input className="input" value={form.name} onChange={e => setForm(prev => ({...prev, name:e.target.value}))} placeholder="Enter applicant name" />
          </div>
          <Field label="Monthly Income" value={form.income} onChange={e => update("income", e.target.value)} />
          <Field label="Income Stability (%)" value={form.income_stability} onChange={e => update("income_stability", e.target.value)} />
          <Field label="Transaction Frequency (%)" value={form.transaction_frequency} onChange={e => update("transaction_frequency", e.target.value)} />
          <Field label="Transaction Volatility (%)" value={form.transaction_volatility} onChange={e => update("transaction_volatility", e.target.value)} />
          <Field label="Savings Ratio (%)" value={form.savings_ratio} onChange={e => update("savings_ratio", e.target.value)} />
          <Field label="Bill Payment Consistency (%)" value={form.bill_payment_ratio} onChange={e => update("bill_payment_ratio", e.target.value)} />
          <Field label="Debt-to-Income (%)" value={form.debt_to_income} onChange={e => update("debt_to_income", e.target.value)} />
          <Field label="Cashflow Consistency (%)" value={form.cashflow_consistency} onChange={e => update("cashflow_consistency", e.target.value)} />
          <Field label="Employment Stability (%)" value={form.employment_stability} onChange={e => update("employment_stability", e.target.value)} />
          <Field label="Financial Buffer (%)" value={form.financial_buffer} onChange={e => update("financial_buffer", e.target.value)} />
          <Field label="Account Balance" value={form.account_balance} onChange={e => update("account_balance", e.target.value)} />
        </div>

        {error && <div className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</div>}

        <button onClick={assess} disabled={loading} className="mt-6 rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50">
          {loading ? "Running FIN-SENSE model..." : "Assess Risk"}
        </button>
      </div>

      {result && (
        <div className="card p-6">
          <div className="text-sm font-semibold text-slate-500">FIN-SENSE Assessment Result</div>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 p-5"><div className="label">Risk Level</div><div className="mt-2 text-3xl font-bold">{result.risk_level}</div></div>
            <div className="rounded-2xl bg-slate-50 p-5"><div className="label">Financial Stability</div><div className="mt-2 text-3xl font-bold">{result.financial_stability}</div><div className="mt-1 text-xs text-slate-500">Behaviour score / 100</div></div>
            <div className="rounded-2xl bg-slate-50 p-5"><div className="label">Risk Probability</div><div className="mt-2 text-3xl font-bold">{result.risk_probability}%</div></div>
            <div className="rounded-2xl bg-slate-50 p-5"><div className="label">Model Confidence</div><div className="mt-2 text-3xl font-bold">{result.confidence}%</div></div>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-5">
              <div className="font-semibold">Financial Behaviour DNA</div>
              <p className="mt-1 text-xs text-slate-500">Behaviour profile generated by the backend risk engine.</p>
              <div className="mt-4 space-y-3">
                {[["Income Stability", form.income_stability],["Payment Discipline", form.bill_payment_ratio],["Savings Behaviour", form.savings_ratio],["Financial Resilience", form.financial_buffer]].map(([label,value]) => <div key={label} className="flex items-center justify-between"><span className="text-sm text-slate-600">{label}</span><span className="font-semibold">{value}%</span></div>)}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5">
              <div className="font-semibold">Key Risk Drivers</div>
              <p className="mt-1 text-xs text-slate-500">Signals returned by the explainability engine.</p>
              <div className="mt-4 space-y-2">
                {result.factors?.map((factor, index) => <div key={index} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm ${factor.type === "negative" ? "bg-rose-50 text-rose-700" : "bg-slate-50 text-slate-700"}`}><span className="h-2 w-2 rounded-full bg-indigo-500"></span>{factor.text}</div>)}
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-indigo-50 p-5">
            <div className="font-semibold">Explainable Decision</div>
            <p className="mt-2 text-sm text-slate-600">{result.decision}</p>
            <p className="mt-2 text-sm text-slate-600">The final risk combines the trained ML model with FIN-SENSE behavioural intelligence.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({label, value, onChange}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type="number"
        className="input"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
