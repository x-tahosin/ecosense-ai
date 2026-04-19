"use client";
import { useState } from "react";
import {
  Leaf, TreePine, Car, Utensils, Zap, ShoppingBag,
  Droplets, Wind, ArrowRight, Sparkles, RotateCcw,
  Globe, CheckCircle, AlertTriangle, TrendingDown, Copy, Check,
} from "lucide-react";

const TRANSPORT_OPTIONS = [
  { id: "car_gas", label: "Gas Car", icon: Car, co2: "high" },
  { id: "car_electric", label: "Electric Car", icon: Car, co2: "medium" },
  { id: "public", label: "Public Transit", icon: Car, co2: "low" },
  { id: "bike_walk", label: "Bike / Walk", icon: Wind, co2: "zero" },
];

const DIET_OPTIONS = [
  { id: "heavy_meat", label: "Heavy Meat", co2: "high" },
  { id: "moderate_meat", label: "Some Meat", co2: "medium" },
  { id: "vegetarian", label: "Vegetarian", co2: "low" },
  { id: "vegan", label: "Vegan", co2: "zero" },
];

const ENERGY_OPTIONS = [
  { id: "fossil", label: "Fossil Fuels", co2: "high" },
  { id: "mixed", label: "Mixed Grid", co2: "medium" },
  { id: "mostly_renewable", label: "Mostly Renewable", co2: "low" },
  { id: "full_renewable", label: "100% Renewable", co2: "zero" },
];

const SHOPPING_OPTIONS = [
  { id: "fast_fashion", label: "Fast Fashion / Frequent", co2: "high" },
  { id: "moderate", label: "Average Consumer", co2: "medium" },
  { id: "conscious", label: "Eco-Conscious", co2: "low" },
  { id: "minimal", label: "Minimal / Second-hand", co2: "zero" },
];

const CO2_BADGE: Record<string, { color: string; label: string }> = {
  high: { color: "bg-red-100 text-red-700 border-red-200", label: "High Impact" },
  medium: { color: "bg-amber-100 text-amber-700 border-amber-200", label: "Medium" },
  low: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Low" },
  zero: { color: "bg-green-100 text-green-700 border-green-200", label: "Minimal" },
};

interface AnalysisResult {
  score: number;
  grade: string;
  summary: string;
  footprint_kg: number;
  tips: string[];
  impact_breakdown: { category: string; percentage: number; status: string }[];
  earth_pledge: string;
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [transport, setTransport] = useState("");
  const [commuteKm, setCommuteKm] = useState("20");
  const [diet, setDiet] = useState("");
  const [energy, setEnergy] = useState("");
  const [shopping, setShopping] = useState("");
  const [waterUsage, setWaterUsage] = useState("average");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);

  const canProceed = () => {
    if (step === 0) return !!transport;
    if (step === 1) return !!diet;
    if (step === 2) return !!energy;
    if (step === 3) return !!shopping;
    return true;
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    try {
      const prompt = `You are an environmental scientist AI. Analyze this person's carbon footprint based on their daily habits. Return ONLY valid JSON, no markdown.

Daily Habits:
- Transport: ${transport} (${commuteKm}km daily commute)
- Diet: ${diet}
- Home Energy: ${energy}
- Shopping: ${shopping}
- Water Usage: ${waterUsage}

Return this exact JSON structure:
{
  "score": <number 0-100, where 100 is most eco-friendly>,
  "grade": "<A+ to F letter grade>",
  "summary": "<2-3 sentence personalized analysis>",
  "footprint_kg": <estimated annual CO2 in kg>,
  "tips": ["<5 specific, actionable tips to reduce impact>"],
  "impact_breakdown": [
    {"category": "Transport", "percentage": <number>, "status": "<good/warning/critical>"},
    {"category": "Diet", "percentage": <number>, "status": "<good/warning/critical>"},
    {"category": "Energy", "percentage": <number>, "status": "<good/warning/critical>"},
    {"category": "Shopping", "percentage": <number>, "status": "<good/warning/critical>"}
  ],
  "earth_pledge": "<A short, inspiring 1-sentence Earth Day pledge personalized to their results>"
}`;

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, maxTokens: 1500, temperature: 0.7 }),
      });

      if (!res.ok) throw new Error("Analysis failed. Please try again.");

      const data = await res.json();
      const text = data?.text?.trim() || "";
      const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Could not parse analysis");

      const parsed = JSON.parse(jsonMatch[0]) as AnalysisResult;
      setResult(parsed);
      setStep(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPledge = () => {
    if (result?.earth_pledge) {
      navigator.clipboard.writeText(result.earth_pledge + " 🌍 #EarthDay2026 #EcoSenseAI");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setStep(0);
    setTransport("");
    setDiet("");
    setEnergy("");
    setShopping("");
    setResult(null);
    setError("");
  };

  const gradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-green-600";
    if (grade.startsWith("B")) return "text-emerald-600";
    if (grade.startsWith("C")) return "text-amber-600";
    if (grade.startsWith("D")) return "text-orange-600";
    return "text-red-600";
  };

  const statusIcon = (status: string) => {
    if (status === "good") return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (status === "warning") return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    return <AlertTriangle className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-4xl flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center animate-pulse-green">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg">
                Eco<span className="gradient-earth">Sense</span> AI
              </span>
              <span className="hidden sm:inline text-xs text-muted ml-2">Earth Day 2026</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Powered by Google Gemini
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Hero */}
        {step === 0 && !result && (
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium mb-4 border border-green-200">
              <Globe className="h-3 w-3" />
              Earth Day 2026
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              Know Your <span className="gradient-earth">Carbon Footprint</span>
            </h1>
            <p className="text-muted max-w-lg mx-auto">
              Answer 4 quick questions about your daily habits. Our AI analyzes your
              environmental impact and gives personalized tips to live greener.
            </p>
          </div>
        )}

        {/* Progress */}
        {step < 5 && !result && (
          <div className="flex gap-1.5 mb-8 max-w-md mx-auto">
            {[0, 1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                  s <= step ? "bg-accent" : "bg-border"
                }`}
              />
            ))}
          </div>
        )}

        {/* Step 0: Transport */}
        {step === 0 && (
          <div className="max-w-xl mx-auto">
            <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
              <Car className="h-5 w-5 text-accent" /> How do you commute?
            </h2>
            <p className="text-sm text-muted mb-5">Your daily transportation choice</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {TRANSPORT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setTransport(opt.id)}
                  className={`rounded-xl border-2 p-4 text-left transition-all ${
                    transport === opt.id
                      ? "border-accent bg-green-50 shadow-md"
                      : "border-border bg-white hover:border-accent/40"
                  }`}
                >
                  <div className="font-medium text-sm mb-1">{opt.label}</div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${CO2_BADGE[opt.co2].color}`}>
                    {CO2_BADGE[opt.co2].label}
                  </span>
                </button>
              ))}
            </div>
            <div className="mb-5">
              <label className="text-sm font-medium mb-1 block">Daily commute distance (km)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={commuteKm}
                onChange={(e) => setCommuteKm(e.target.value)}
                className="w-full accent-green-600"
              />
              <div className="text-center text-sm font-bold text-accent">{commuteKm} km</div>
            </div>
          </div>
        )}

        {/* Step 1: Diet */}
        {step === 1 && (
          <div className="max-w-xl mx-auto">
            <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
              <Utensils className="h-5 w-5 text-accent" /> What&apos;s your diet?
            </h2>
            <p className="text-sm text-muted mb-5">Your typical eating habits</p>
            <div className="grid grid-cols-2 gap-3">
              {DIET_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setDiet(opt.id)}
                  className={`rounded-xl border-2 p-4 text-left transition-all ${
                    diet === opt.id
                      ? "border-accent bg-green-50 shadow-md"
                      : "border-border bg-white hover:border-accent/40"
                  }`}
                >
                  <div className="font-medium text-sm mb-1">{opt.label}</div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${CO2_BADGE[opt.co2].color}`}>
                    {CO2_BADGE[opt.co2].label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Energy */}
        {step === 2 && (
          <div className="max-w-xl mx-auto">
            <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" /> Home energy source?
            </h2>
            <p className="text-sm text-muted mb-5">How is your home powered?</p>
            <div className="grid grid-cols-2 gap-3">
              {ENERGY_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setEnergy(opt.id)}
                  className={`rounded-xl border-2 p-4 text-left transition-all ${
                    energy === opt.id
                      ? "border-accent bg-green-50 shadow-md"
                      : "border-border bg-white hover:border-accent/40"
                  }`}
                >
                  <div className="font-medium text-sm mb-1">{opt.label}</div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${CO2_BADGE[opt.co2].color}`}>
                    {CO2_BADGE[opt.co2].label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Shopping */}
        {step === 3 && (
          <div className="max-w-xl mx-auto">
            <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-accent" /> Shopping habits?
            </h2>
            <p className="text-sm text-muted mb-5">Your consumption patterns</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {SHOPPING_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setShopping(opt.id)}
                  className={`rounded-xl border-2 p-4 text-left transition-all ${
                    shopping === opt.id
                      ? "border-accent bg-green-50 shadow-md"
                      : "border-border bg-white hover:border-accent/40"
                  }`}
                >
                  <div className="font-medium text-sm mb-1">{opt.label}</div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${CO2_BADGE[opt.co2].color}`}>
                    {CO2_BADGE[opt.co2].label}
                  </span>
                </button>
              ))}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                <Droplets className="h-3.5 w-3.5 inline mr-1" />
                Water usage
              </label>
              <select
                value={waterUsage}
                onChange={(e) => setWaterUsage(e.target.value)}
                className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm"
              >
                <option value="low">Low (short showers, mindful)</option>
                <option value="average">Average</option>
                <option value="high">High (long showers, baths, sprinklers)</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 4: Analyzing */}
        {step === 4 && loading && (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 animate-float">
              <TreePine className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2">Analyzing Your Impact...</h2>
            <p className="text-sm text-muted">Google Gemini is calculating your carbon footprint</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="max-w-md mx-auto rounded-xl bg-red-50 border border-red-200 p-4 text-center text-sm text-red-700 mb-4">
            {error}
          </div>
        )}

        {/* Results */}
        {step === 5 && result && (
          <div className="max-w-2xl mx-auto">
            {/* Score Card */}
            <div className="rounded-2xl bg-white border border-border p-6 card-glow mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Your Eco Score</h2>
                <button
                  onClick={handleReset}
                  className="text-xs text-muted hover:text-foreground flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" /> Retake
                </button>
              </div>

              <div className="flex items-center gap-6 mb-5">
                <div className="relative">
                  <svg viewBox="0 0 120 120" className="h-28 w-28">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                    <circle
                      cx="60" cy="60" r="50" fill="none"
                      stroke={result.score >= 70 ? "#16a34a" : result.score >= 40 ? "#f59e0b" : "#ef4444"}
                      strokeWidth="10"
                      strokeDasharray={`${result.score * 3.14} 314`}
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                    />
                    <text x="60" y="55" textAnchor="middle" className="text-2xl font-bold" fill="currentColor">
                      {result.score}
                    </text>
                    <text x="60" y="72" textAnchor="middle" className="text-xs" fill="#6b7280">
                      / 100
                    </text>
                  </svg>
                </div>
                <div>
                  <div className={`text-4xl font-bold ${gradeColor(result.grade)}`}>{result.grade}</div>
                  <div className="text-sm text-muted mt-1">
                    ~{result.footprint_kg.toLocaleString()} kg CO₂/year
                  </div>
                  <div className="text-xs text-muted mt-0.5 flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" />
                    Global avg: ~4,700 kg/year
                  </div>
                </div>
              </div>

              <p className="text-sm leading-relaxed mb-4">{result.summary}</p>

              {/* Impact Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {result.impact_breakdown.map((item) => (
                  <div key={item.category} className="rounded-xl bg-background border border-border p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">{item.category}</span>
                      {statusIcon(item.status)}
                    </div>
                    <div className="text-lg font-bold">{item.percentage}%</div>
                    <div className="h-1.5 rounded-full bg-gray-200 mt-1">
                      <div
                        className={`h-1.5 rounded-full ${
                          item.status === "good" ? "bg-green-500" : item.status === "warning" ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-2xl bg-white border border-border p-6 card-glow mb-6">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Leaf className="h-4 w-4 text-accent" />
                Personalized Green Tips
              </h3>
              <div className="space-y-2.5">
                {result.tips.map((tip, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="h-6 w-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-sm leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Earth Pledge */}
            <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white mb-6">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Your Earth Day Pledge
              </h3>
              <p className="text-sm leading-relaxed mb-3 opacity-95">{result.earth_pledge}</p>
              <button
                onClick={handleCopyPledge}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-medium transition-colors"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied!" : "Copy & Share Pledge"}
              </button>
            </div>

            {/* Gemini Badge */}
            <div className="text-center text-xs text-muted">
              <Sparkles className="h-3 w-3 inline mr-1" />
              Analysis powered by Google Gemini 2.0 Flash • Built for Earth Day 2026
            </div>
          </div>
        )}

        {/* Navigation */}
        {step < 4 && !result && (
          <div className="max-w-xl mx-auto flex justify-between mt-8">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="rounded-xl border border-border px-5 py-2.5 text-sm hover:bg-white transition-colors disabled:opacity-30"
            >
              Back
            </button>
            <button
              onClick={() => {
                if (step === 3) {
                  setStep(4);
                  handleAnalyze();
                } else {
                  setStep(step + 1);
                }
              }}
              disabled={!canProceed()}
              className="rounded-xl bg-accent text-white px-6 py-2.5 text-sm font-bold hover:bg-accent-dark transition-colors disabled:opacity-30 flex items-center gap-1.5"
            >
              {step === 3 ? (
                <>
                  <Sparkles className="h-3.5 w-3.5" /> Analyze My Footprint
                </>
              ) : (
                <>
                  Next <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto py-6 text-center text-xs text-muted">
        <p>
          Built with <span className="text-accent">♥</span> for Earth Day 2026 •{" "}
          Powered by{" "}
          <a href="https://ai.google.dev/gemini-api" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
            Google Gemini
          </a>
        </p>
      </footer>
    </div>
  );
}
