"use client";
import { useState } from "react";
import {
  Sparkles, Code, FileText, Palette, BookOpen,
  ArrowRight, Copy, Check, RotateCcw,
} from "lucide-react";

const TOOLS = [
  { id: "explain", label: "Code Explainer", icon: Code, desc: "Paste code, get plain English explanation", prompt: "Explain this code in simple terms, line by line:" },
  { id: "summarize", label: "Text Summarizer", icon: FileText, desc: "Summarize long text into key points", prompt: "Summarize the following text into 5 concise bullet points:" },
  { id: "palette", label: "Color Palette", icon: Palette, desc: "Describe a mood, get a color palette", prompt: "Generate a 5-color palette (hex codes) for this mood/theme. Return as JSON array of objects with 'hex', 'name', and 'usage' fields:" },
  { id: "flashcards", label: "Flashcard Maker", icon: BookOpen, desc: "Paste notes, get study flashcards", prompt: "Create 5 study flashcards (question and answer) from these notes. Return as JSON array with 'question' and 'answer' fields:" },
];

export default function ToolsPage() {
  const [tool, setTool] = useState(TOOLS[0]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${tool.prompt}\n\n${input}`,
          maxTokens: 1500,
          temperature: 0.7,
        }),
      });
      const data = await res.json();
      setOutput(data.text || "No response");
    } catch {
      setOutput("Error generating. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="border-b border-border bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-green-600" />
            <h1 className="text-lg font-bold">AI Mini Tools</h1>
          </div>
          <a href="/" className="text-sm text-green-600 hover:underline">Back to EcoSense</a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-2">Free AI Tools</h2>
        <p className="text-sm text-gray-500 mb-6">Powered by Google Gemini. No signup. No limits.</p>

        {/* Tool Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {TOOLS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => { setTool(t); setOutput(""); }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  tool.id === t.id
                    ? "border-green-500 bg-green-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-green-300"
                }`}
              >
                <Icon className={`h-5 w-5 mb-1 ${tool.id === t.id ? "text-green-600" : "text-gray-400"}`} />
                <div className="text-sm font-medium">{t.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{t.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Input */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Enter text for ${tool.label}...`}
          className="w-full h-36 p-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-green-400 resize-none"
        />

        {/* Generate Button */}
        <button
          onClick={generate}
          disabled={loading || !input.trim()}
          className="w-full mt-4 py-3 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {loading ? (
            <><RotateCcw className="h-4 w-4 animate-spin" /> Generating...</>
          ) : (
            <><Sparkles className="h-4 w-4" /> Generate with AI <ArrowRight className="h-4 w-4" /></>
          )}
        </button>

        {/* Output */}
        {output && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500">Result</span>
              <button onClick={handleCopy} className="text-xs text-green-600 hover:underline flex items-center gap-1">
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">{output}</div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 mt-8">
          Powered by Google Gemini 2.0 Flash • Free & Open Source
        </div>
      </main>
    </div>
  );
}
