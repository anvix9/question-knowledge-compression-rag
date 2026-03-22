import { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell } from "recharts";

// ─── DATA ────────────────────────────────────────────────────────────────────

const RETRIEVAL_QUERIES = [
  { id:"2wikimqa_e_1", query:"Who is Hermann Ii, Count Palatine Of Lotharingia's paternal grandfather?", results:[{rank:1,pid:"2wikimqa_e_1",score:0.9997},{rank:2,pid:"2wikimqa_e_5",score:0.968},{rank:3,pid:"2wikimqa_e_48",score:0.550}], hit:true, hitRank:1 },
  { id:"2wikimqa_e_2", query:"Where was the director of film Requiem For Dominic born?", results:[{rank:1,pid:"2wikimqa_e_17",score:0.999},{rank:2,pid:"2wikimqa_e_2",score:0.019},{rank:3,pid:"2wikimqa_e_40",score:0.0004}], hit:true, hitRank:2 },
  { id:"2wikimqa_e_3", query:"What is the place of birth of Ibrahim Ibn Muhammad's mother?", results:[{rank:1,pid:"2wikimqa_e_3",score:0.998},{rank:2,pid:"2wikimqa_e_13",score:0.00004},{rank:3,pid:"2wikimqa_e_7",score:0.00003}], hit:true, hitRank:1 },
  { id:"2wikimqa_e_4", query:"Which film has the director died earlier, Kadamba (1983 Film) or Mickey's Tent Show?", results:[{rank:1,pid:"2wikimqa_e_4",score:0.9997},{rank:2,pid:"2wikimqa_e_18",score:0.960},{rank:3,pid:"2wikimqa_e_11",score:0.735}], hit:true, hitRank:1 },
  { id:"2wikimqa_e_5", query:"Who was born first, Damien Hétu or Matan Cohen?", results:[{rank:1,pid:"2wikimqa_e_5",score:0.9995},{rank:2,pid:"2wikimqa_e_21",score:0.026},{rank:3,pid:"2wikimqa_e_10",score:0.006}], hit:true, hitRank:1 },
  { id:"2wikimqa_e_6", query:"Do director of film Happy Days (1929) and director of film Hero (1982) share the same nationality?", results:[{rank:1,pid:"2wikimqa_e_6",score:0.9998},{rank:2,pid:"2wikimqa_e_7",score:0.098},{rank:3,pid:"2wikimqa_e_30",score:0.010}], hit:true, hitRank:1 },
  { id:"2wikimqa_e_7", query:"Which film has the director who is older, A Hungarian Fairy Tale or The Hero Of My Dreams?", results:[{rank:1,pid:"2wikimqa_e_7",score:0.999},{rank:2,pid:"2wikimqa_e_6",score:0.098},{rank:3,pid:"2wikimqa_e_30",score:0.010}], hit:true, hitRank:1 },
  { id:"2wikimqa_e_8", query:"Are both Flying Fifty-Five and Approaching Midnight from the same country?", results:[{rank:1,pid:"2wikimqa_e_8",score:0.997},{rank:2,pid:"2wikimqa_e_14",score:0.03},{rank:3,pid:"2wikimqa_e_22",score:0.01}], hit:true, hitRank:1 },
  { id:"2wikimqa_e_9", query:"What is the place of birth of Anne Elizabeth Rector's husband?", results:[{rank:1,pid:"2wikimqa_e_15",score:0.88},{rank:2,pid:"2wikimqa_e_33",score:0.22},{rank:3,pid:"2wikimqa_e_9",score:0.12}], hit:true, hitRank:3 },
  { id:"2wikimqa_e_10", query:"Was Bronisław Dembowski or Carlo Delle Piane born first?", results:[{rank:1,pid:"2wikimqa_e_10",score:0.9994},{rank:2,pid:"2wikimqa_e_5",score:0.04},{rank:3,pid:"2wikimqa_e_21",score:0.02}], hit:true, hitRank:1 },
  { id:"2wikimqa_e_11", query:"Which film has the director who was born later, Alludugaru or The Laughing Woman?", results:[{rank:1,pid:"2wikimqa_e_11",score:0.998},{rank:2,pid:"2wikimqa_e_4",score:0.05},{rank:3,pid:"2wikimqa_e_18",score:0.03}], hit:true, hitRank:1 },
  { id:"2wikimqa_e_12", query:"Who is the father of the director of film Kajraare?", results:[{rank:1,pid:"2wikimqa_e_28",score:0.72},{rank:2,pid:"2wikimqa_e_35",score:0.31},{rank:3,pid:"2wikimqa_e_12",score:0.15}], hit:true, hitRank:3 },
  { id:"2wikimqa_e_13", query:"Which film has the director died earlier, The Coca-Cola Kid or Ayul Kaithi?", results:[{rank:1,pid:"2wikimqa_e_13",score:0.9996},{rank:2,pid:"2wikimqa_e_4",score:0.88},{rank:3,pid:"2wikimqa_e_30",score:0.12}], hit:true, hitRank:1 },
  { id:"2wikimqa_e_14", query:"Who lived longer, Ole Arntzen or Harry Albert Willis?", results:[{rank:1,pid:"2wikimqa_e_14",score:0.998},{rank:2,pid:"2wikimqa_e_10",score:0.04},{rank:3,pid:"2wikimqa_e_5",score:0.02}], hit:true, hitRank:1 },
  { id:"2wikimqa_e_15", query:"Which film came out earlier, Olavina Udugore or A Pearl In The Forest?", results:[{rank:1,pid:"2wikimqa_e_15",score:0.9991},{rank:2,pid:"2wikimqa_e_8",score:0.07},{rank:3,pid:"2wikimqa_e_22",score:0.03}], hit:true, hitRank:1 },
  { id:"2wikimqa_e_16", query:"Which song was released first, L'Histoire D'Une Fée, C'Est... or I Can Change?", results:[{rank:1,pid:"2wikimqa_e_16",score:0.9988},{rank:2,pid:"2wikimqa_e_25",score:0.05},{rank:3,pid:"2wikimqa_e_40",score:0.01}], hit:true, hitRank:1 },
  { id:"2wikimqa_e_17", query:"What is the place of birth of the director of film Sweepstakes?", results:[{rank:1,pid:"2wikimqa_e_2",score:0.85},{rank:2,pid:"2wikimqa_e_17",score:0.71},{rank:3,pid:"2wikimqa_e_40",score:0.15}], hit:true, hitRank:2 },
  { id:"2wikimqa_e_18", query:"Where was the director of film En Aasai Rasave born?", results:[{rank:1,pid:"2wikimqa_e_18",score:0.9972},{rank:2,pid:"2wikimqa_e_2",score:0.22},{rank:3,pid:"2wikimqa_e_11",score:0.05}], hit:true, hitRank:1 },
  { id:"2wikimqa_e_19", query:"Where did the director of film The Eagle's Eye study?", results:[{rank:1,pid:"2wikimqa_e_19",score:0.992},{rank:2,pid:"2wikimqa_e_30",score:0.09},{rank:3,pid:"2wikimqa_e_4",score:0.04}], hit:true, hitRank:1 },
  { id:"2wikimqa_e_20", query:"Which film has the director born later, Nalla Pambu or Song of the Exile?", results:[{rank:1,pid:"2wikimqa_e_20",score:0.996},{rank:2,pid:"2wikimqa_e_11",score:0.12},{rank:3,pid:"2wikimqa_e_4",score:0.05}], hit:true, hitRank:1 },
];

const MULTIHOP_QA = [
  { query:"Who is Hermann Ii, Count Palatine Of Lotharingia's paternal grandfather?", base:[true,true,true], instruct:[true,true,true] },
  { query:"Where was the director of film Requiem For Dominic born?", base:[true,true,true], instruct:[true,true,true] },
  { query:"What is the place of birth of Ibrahim Ibn Muhammad's mother?", base:[false,false,false], instruct:[false,false,false] },
  { query:"Which film has the director died earlier, Kadamba or Mickey's Tent Show?", base:[false,false,false], instruct:[false,false,false] },
  { query:"Who was born first, Damien Hétu or Matan Cohen?", base:[true,true,true], instruct:[true,true,true] },
  { query:"Do directors of Happy Days (1929) and Hero (1982) share nationality?", base:[false,false,false], instruct:[true,true,true] },
  { query:"Which film has the older director, A Hungarian Fairy Tale or Hero Of My Dreams?", base:[true,true,true], instruct:[true,true,true] },
  { query:"Are both Flying Fifty-Five and Approaching Midnight from the same country?", base:[true,false,true], instruct:[true,true,true] },
  { query:"What is the place of birth of Anne Elizabeth Rector's husband?", base:[false,false,false], instruct:[false,false,false] },
  { query:"Was Bronisław Dembowski or Carlo Delle Piane born first?", base:[true,true,true], instruct:[true,true,true] },
  { query:"Which film has the director born later, Alludugaru or The Laughing Woman?", base:[true,true,false], instruct:[false,false,true] },
  { query:"Who is the father of the director of film Kajraare?", base:[false,false,false], instruct:[false,false,false] },
  { query:"Which film has the director died earlier, The Coca-Cola Kid or Ayul Kaithi?", base:[true,true,true], instruct:[true,true,true] },
  { query:"Who lived longer, Ole Arntzen or Harry Albert Willis?", base:[true,true,true], instruct:[true,true,true] },
  { query:"Which film came out earlier, Olavina Udugore or A Pearl In The Forest?", base:[true,true,true], instruct:[true,true,true] },
];

const GLOBAL_METRICS = [
  { name: "Our Approach", accuracy: 0.844, mrr: 0.803 },
  { name: "Recursive", accuracy: 0.256, mrr: 0.217 },
  { name: "Fixed-size", accuracy: 0.231, mrr: 0.198 },
  { name: "BM25", accuracy: 0.789, mrr: 0.677 },
];

const TECH_METRICS = [
  { name: "Top-3", approach: 0.880, recursive: 0.165, fixedSize: 0.146, bm25: 0.899 },
  { name: "Top-5", approach: 0.917, recursive: 0.183, fixedSize: 0.165, bm25: 0.935 },
];

const CONCEPT_METRICS = [
  { name: "Top-3", approach: 0.770, recursive: 0.321, fixedSize: 0.293, bm25: 0.605 },
  { name: "Top-5", approach: 0.807, recursive: 0.357, fixedSize: 0.321, bm25: 0.715 },
];

const F1_COMPARISON = [
  { model: "Llama3 (ours)", f1: 0.550 },
  { model: "Llama2-7B (ours)", f1: 0.520 },
  { model: "CFIC-7B", f1: 0.412 },
  { model: "GPT-3.5-Turbo-16k", f1: 0.377 },
  { model: "Vicuna-7B (ours)", f1: 0.340 },
  { model: "Llama2-7B-chat", f1: 0.328 },
  { model: "Vicuna-7B (CFIC)", f1: 0.233 },
  { model: "PPL chunking", f1: 0.141 },
  { model: "Llama_index", f1: 0.117 },
];

const STORAGE = [
  { method: "Fixed-size (350w)", records: 44809 },
  { method: "Recursive", records: 38509 },
  { method: "Paper-cards (ours)", records: 109 },
  { method: "Research queries (ours)", records: 95 },
];

const BM25_CARD = [
  { name:"Tech @3", card:0.963, abs:0.899 },
  { name:"Tech @5", card:0.972, abs:0.935 },
  { name:"Concept @3", card:0.889, abs:0.660 },
  { name:"Concept @5", card:0.917, abs:0.715 },
];

// ─── STYLES ────────────────────────────────────────────────────────────────

const C = {
  bg: "#0a0e17",
  surface: "#111827",
  surfaceLight: "#1a2236",
  border: "#1e2d4a",
  text: "#e2e8f0",
  textMuted: "#8899b4",
  accent: "#3b82f6",
  accentGlow: "rgba(59,130,246,0.15)",
  green: "#22c55e",
  greenGlow: "rgba(34,197,94,0.15)",
  red: "#ef4444",
  redGlow: "rgba(239,68,68,0.1)",
  orange: "#f59e0b",
  purple: "#a855f7",
  cyan: "#06b6d4",
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Pill({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 20px",
      borderRadius: "8px",
      border: `1px solid ${active ? C.accent : C.border}`,
      background: active ? C.accentGlow : "transparent",
      color: active ? C.accent : C.textMuted,
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: active ? 600 : 400,
      fontFamily: "'JetBrains Mono', monospace",
      transition: "all 0.2s",
      whiteSpace: "nowrap",
    }}>
      {children}
    </button>
  );
}

function ScoreBadge({ score }) {
  const pct = Math.round(score * 100);
  const color = pct > 80 ? C.green : pct > 40 ? C.orange : C.red;
  return (
    <span style={{
      display:"inline-block",
      padding:"2px 10px",
      borderRadius:"6px",
      background:`${color}22`,
      color,
      fontFamily:"'JetBrains Mono', monospace",
      fontSize:"12px",
      fontWeight:600,
    }}>
      {score.toFixed(4)}
    </span>
  );
}

function HitBadge({ hit, rank }) {
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:"4px",
      padding:"3px 10px",
      borderRadius:"6px",
      background: hit ? C.greenGlow : C.redGlow,
      color: hit ? C.green : C.red,
      fontFamily:"'JetBrains Mono', monospace",
      fontSize:"12px", fontWeight:600,
    }}>
      {hit ? `✓ Rank ${rank}` : "✗ Miss"}
    </span>
  );
}

function MetricCard({ label, value, sub, color = C.accent }) {
  return (
    <div style={{
      background: C.surfaceLight,
      border: `1px solid ${C.border}`,
      borderRadius: "12px",
      padding: "20px",
      textAlign: "center",
      flex: 1,
      minWidth: "140px",
    }}>
      <div style={{ fontSize:"28px", fontWeight:700, color, fontFamily:"'JetBrains Mono', monospace" }}>
        {value}
      </div>
      <div style={{ fontSize:"12px", color: C.textMuted, marginTop:"4px", fontWeight:500 }}>{label}</div>
      {sub && <div style={{ fontSize:"11px", color: C.textMuted, marginTop:"2px", opacity:0.7 }}>{sub}</div>}
    </div>
  );
}

function SectionTitle({ children, icon }) {
  return (
    <h2 style={{
      fontSize: "16px",
      fontWeight: 600,
      color: C.text,
      margin: "0 0 16px 0",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      letterSpacing: "0.02em",
    }}>
      <span style={{ fontSize: "18px" }}>{icon}</span>
      {children}
    </h2>
  );
}

// ─── PIPELINE VIEW ───────────────────────────────────────────────────────────

function PipelineView() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    { title: "Document Ingestion", icon: "📄", desc: "Scientific papers are parsed and key sections extracted (Abstract, Methods, Results, Conclusions).", detail: "109 papers → key sections selected" },
    { title: "Question Generation", icon: "❓", desc: "LLM generates conceptual and technical questions from each section, along with search queries and keywords.", detail: "Generates Q&A pairs + keywords per section" },
    { title: "Paper-Card Creation", icon: "🃏", desc: "Compressed representation: research questions, methods summary, and keywords stored as lightweight Markdown cards (~5KB each).", detail: "218 embeddings vs 44K+ chunks" },
    { title: "Lexical Filtering", icon: "🔍", desc: "Keyword-based matching narrows candidate documents using cleaned, lemmatized tokens from generated queries.", detail: "Top-20 candidates by word overlap" },
    { title: "Syntactic Reranking", icon: "🧬", desc: "Recursive syntactic splitting decomposes the query at POS boundaries. Document frequency and phrase-level aggregation rerank candidates.", detail: "Parameter L controls depth (L=2 or L=3)" },
    { title: "Semantic Matching", icon: "🎯", desc: "Final embedding-based retrieval using normalized vectors in Pinecone. Returns top-k ranked results.", detail: "Cosine similarity on normalized embeddings" },
  ];

  return (
    <div>
      <SectionTitle icon="⚡">Retrieval Pipeline</SectionTitle>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
        {steps.map((s, i) => (
          <Pill key={i} active={activeStep === i} onClick={() => setActiveStep(i)}>
            {s.icon} {s.title}
          </Pill>
        ))}
      </div>
      <div style={{
        background: C.surfaceLight,
        border: `1px solid ${C.border}`,
        borderRadius: "12px",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, height: "3px",
          background: `linear-gradient(90deg, ${C.accent}, ${C.purple})`,
        }} />
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
          <span style={{ fontSize: "32px" }}>{steps[activeStep].icon}</span>
          <div>
            <div style={{ fontSize: "18px", fontWeight: 600, color: C.text }}>
              Step {activeStep + 1}: {steps[activeStep].title}
            </div>
            <div style={{
              fontSize: "11px",
              fontFamily: "'JetBrains Mono', monospace",
              color: C.accent,
              marginTop: "2px",
            }}>
              {steps[activeStep].detail}
            </div>
          </div>
        </div>
        <p style={{ color: C.textMuted, fontSize: "14px", lineHeight: 1.7, margin: 0 }}>
          {steps[activeStep].desc}
        </p>
        {/* flow arrows */}
        <div style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"20px", flexWrap:"wrap" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:"6px" }}>
              <div style={{
                width:"32px", height:"32px", borderRadius:"8px",
                display:"flex", alignItems:"center", justifyContent:"center",
                background: i <= activeStep ? C.accentGlow : "transparent",
                border: `1px solid ${i <= activeStep ? C.accent : C.border}`,
                fontSize:"14px",
                opacity: i <= activeStep ? 1 : 0.4,
                transition: "all 0.3s",
              }}>{s.icon}</div>
              {i < steps.length - 1 && (
                <div style={{
                  width:"20px", height:"2px",
                  background: i < activeStep ? C.accent : C.border,
                  transition: "all 0.3s",
                }}/>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── RETRIEVAL EXPLORER ──────────────────────────────────────────────────────

function RetrievalExplorer() {
  const [selected, setSelected] = useState(0);
  const q = RETRIEVAL_QUERIES[selected];

  return (
    <div>
      <SectionTitle icon="🔎">Single-Hop Retrieval Explorer</SectionTitle>
      <div style={{ display: "flex", gap: "16px", flexDirection: "row", flexWrap: "wrap" }}>
        {/* Query list */}
        <div style={{
          flex: "0 0 340px",
          maxHeight: "420px",
          overflowY: "auto",
          borderRadius: "12px",
          border: `1px solid ${C.border}`,
          background: C.surfaceLight,
        }}>
          {RETRIEVAL_QUERIES.map((item, i) => (
            <div key={i} onClick={() => setSelected(i)} style={{
              padding: "12px 16px",
              cursor: "pointer",
              borderBottom: `1px solid ${C.border}`,
              background: selected === i ? C.accentGlow : "transparent",
              transition: "all 0.15s",
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:"8px" }}>
                <span style={{
                  fontSize: "12px",
                  color: selected === i ? C.accent : C.textMuted,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 500,
                }}>{item.id}</span>
                <HitBadge hit={item.hit} rank={item.hitRank} />
              </div>
              <div style={{
                fontSize: "13px",
                color: C.text,
                marginTop: "4px",
                lineHeight: 1.4,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>{item.query}</div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <div style={{
            background: C.surfaceLight,
            border: `1px solid ${C.border}`,
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "12px",
          }}>
            <div style={{ fontSize:"11px", fontFamily:"'JetBrains Mono', monospace", color:C.accent, marginBottom:"6px" }}>
              QUERY → {q.id}
            </div>
            <div style={{ fontSize:"15px", color:C.text, lineHeight:1.6 }}>{q.query}</div>
          </div>

          <div style={{ fontSize:"12px", color:C.textMuted, fontWeight:600, marginBottom:"8px" }}>
            TOP-3 RETRIEVED DOCUMENTS
          </div>
          {q.results.map((r, i) => {
            const isHit = r.pid === q.id;
            return (
              <div key={i} style={{
                background: isHit ? "rgba(34,197,94,0.06)" : C.surfaceLight,
                border: `1px solid ${isHit ? "rgba(34,197,94,0.3)" : C.border}`,
                borderRadius: "10px",
                padding: "14px 18px",
                marginBottom: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                  <div style={{
                    width:"28px", height:"28px", borderRadius:"8px",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    background: isHit ? C.greenGlow : `${C.accent}22`,
                    color: isHit ? C.green : C.accent,
                    fontFamily:"'JetBrains Mono', monospace",
                    fontSize:"13px", fontWeight:700,
                  }}>#{r.rank}</div>
                  <div>
                    <div style={{
                      fontSize:"13px",
                      fontFamily:"'JetBrains Mono', monospace",
                      color: isHit ? C.green : C.text,
                      fontWeight: isHit ? 600 : 400,
                    }}>{r.pid}</div>
                    {isHit && <div style={{ fontSize:"11px", color:C.green, marginTop:"2px" }}>← Correct document</div>}
                  </div>
                </div>
                <ScoreBadge score={r.score} />
              </div>
            );
          })}
          {/* Score bar viz */}
          <div style={{ marginTop:"16px", background: C.surfaceLight, borderRadius:"10px", padding:"16px", border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:"11px", color:C.textMuted, fontWeight:600, marginBottom:"10px" }}>SCORE DISTRIBUTION</div>
            {q.results.map((r, i) => {
              const isHit = r.pid === q.id;
              const width = Math.max(r.score * 100, 2);
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"6px" }}>
                  <span style={{ fontSize:"11px", fontFamily:"'JetBrains Mono', monospace", color:C.textMuted, width:"40px" }}>R{r.rank}</span>
                  <div style={{ flex:1, height:"18px", background:`${C.border}88`, borderRadius:"4px", overflow:"hidden" }}>
                    <div style={{
                      width: `${width}%`,
                      height: "100%",
                      background: isHit ? `linear-gradient(90deg, ${C.green}, #4ade80)` : `linear-gradient(90deg, ${C.accent}, #60a5fa)`,
                      borderRadius: "4px",
                      transition: "width 0.5s ease",
                    }} />
                  </div>
                  <span style={{ fontSize:"11px", fontFamily:"'JetBrains Mono', monospace", color: isHit ? C.green : C.textMuted, width:"56px", textAlign:"right" }}>
                    {(r.score*100).toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── METRICS DASHBOARD ───────────────────────────────────────────────────────

function MetricsDashboard() {
  const [view, setView] = useState("global");
  const barColors = [C.accent, C.orange, C.textMuted, "#eab308"];

  return (
    <div>
      <SectionTitle icon="📊">Performance Metrics</SectionTitle>
      <div style={{ display:"flex", gap:"8px", marginBottom:"20px", flexWrap:"wrap" }}>
        <Pill active={view==="global"} onClick={() => setView("global")}>Global Average</Pill>
        <Pill active={view==="tech"} onClick={() => setView("tech")}>Technical Queries</Pill>
        <Pill active={view==="concept"} onClick={() => setView("concept")}>Conceptual Queries</Pill>
        <Pill active={view==="bm25"} onClick={() => setView("bm25")}>BM25 Boosted</Pill>
        <Pill active={view==="storage"} onClick={() => setView("storage")}>Storage Efficiency</Pill>
      </div>

      {view === "global" && (
        <div style={{ display:"flex", gap:"16px", flexWrap:"wrap" }}>
          <div style={{ flex:1, minWidth:"300px" }}>
            <div style={{ display:"flex", gap:"10px", marginBottom:"16px", flexWrap:"wrap" }}>
              {GLOBAL_METRICS.map((m, i) => (
                <MetricCard key={i} label={m.name} value={`${(m.accuracy*100).toFixed(1)}%`} sub={`MRR: ${m.mrr}`} color={barColors[i]} />
              ))}
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={GLOBAL_METRICS} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="name" tick={{ fill: C.textMuted, fontSize: 11 }} />
                <YAxis tick={{ fill: C.textMuted, fontSize: 11 }} domain={[0, 1]} />
                <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize:12 }} />
                <Bar dataKey="accuracy" name="Accuracy" fill={C.accent} radius={[4,4,0,0]} />
                <Bar dataKey="mrr" name="MRR" fill={C.purple} radius={[4,4,0,0]} />
                <Legend wrapperStyle={{ fontSize: 11, color: C.textMuted }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {view === "tech" && (
        <div>
          <p style={{ color: C.textMuted, fontSize:"13px", marginBottom:"16px" }}>
            Technical queries contain domain-specific terminology. BM25 slightly leads on accuracy, but our approach achieves superior MRR stability.
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={TECH_METRICS} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="name" tick={{ fill: C.textMuted, fontSize: 11 }} />
              <YAxis tick={{ fill: C.textMuted, fontSize: 11 }} domain={[0, 1]} />
              <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize:12 }} />
              <Bar dataKey="approach" name="Our Approach" fill={C.accent} radius={[4,4,0,0]} />
              <Bar dataKey="recursive" name="Recursive" fill={C.orange} radius={[4,4,0,0]} />
              <Bar dataKey="fixedSize" name="Fixed-size" fill={C.textMuted} radius={[4,4,0,0]} />
              <Bar dataKey="bm25" name="BM25" fill="#eab308" radius={[4,4,0,0]} />
              <Legend wrapperStyle={{ fontSize: 11, color: C.textMuted }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {view === "concept" && (
        <div>
          <p style={{ color: C.textMuted, fontSize:"13px", marginBottom:"16px" }}>
            Conceptual queries use everyday language. Our approach outperforms all baselines, especially BM25 whose MRR drops from 84% to 48%.
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={CONCEPT_METRICS} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="name" tick={{ fill: C.textMuted, fontSize: 11 }} />
              <YAxis tick={{ fill: C.textMuted, fontSize: 11 }} domain={[0, 1]} />
              <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize:12 }} />
              <Bar dataKey="approach" name="Our Approach" fill={C.accent} radius={[4,4,0,0]} />
              <Bar dataKey="recursive" name="Recursive" fill={C.orange} radius={[4,4,0,0]} />
              <Bar dataKey="fixedSize" name="Fixed-size" fill={C.textMuted} radius={[4,4,0,0]} />
              <Bar dataKey="bm25" name="BM25" fill="#eab308" radius={[4,4,0,0]} />
              <Legend wrapperStyle={{ fontSize: 11, color: C.textMuted }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {view === "bm25" && (
        <div>
          <p style={{ color: C.textMuted, fontSize:"13px", marginBottom:"16px" }}>
            Paper-cards consistently boost BM25 over traditional abstracts, with the largest gain on conceptual queries (+22.9% accuracy @3).
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={BM25_CARD} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="name" tick={{ fill: C.textMuted, fontSize: 11 }} />
              <YAxis tick={{ fill: C.textMuted, fontSize: 11 }} domain={[0.5, 1]} />
              <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize:12 }} />
              <Bar dataKey="card" name="BM25 + Paper-Card" fill={C.green} radius={[4,4,0,0]} />
              <Bar dataKey="abs" name="BM25 + Abstract" fill={C.orange} radius={[4,4,0,0]} />
              <Legend wrapperStyle={{ fontSize: 11, color: C.textMuted }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {view === "storage" && (
        <div>
          <p style={{ color: C.textMuted, fontSize:"13px", marginBottom:"16px" }}>
            Our approach reduces vector storage by ~80%. Paper-cards average under 5 KB each.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {STORAGE.map((s, i) => {
              const maxRec = 44809;
              const w = Math.max((s.records / maxRec) * 100, 1);
              const isOurs = s.method.includes("ours");
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                  <span style={{ fontSize:"12px", color:C.textMuted, width:"180px", fontFamily:"'JetBrains Mono', monospace", flexShrink:0 }}>
                    {s.method}
                  </span>
                  <div style={{ flex:1, height:"28px", background:`${C.border}66`, borderRadius:"6px", overflow:"hidden", position:"relative" }}>
                    <div style={{
                      width: `${w}%`,
                      height:"100%",
                      background: isOurs ? `linear-gradient(90deg, ${C.green}, #4ade80)` : `linear-gradient(90deg, ${C.accent}, #60a5fa)`,
                      borderRadius:"6px",
                      transition:"width 0.6s ease",
                      minWidth:"40px",
                      display:"flex", alignItems:"center", justifyContent:"flex-end", paddingRight:"8px",
                    }}>
                      <span style={{ fontSize:"11px", fontWeight:700, color:"#fff", fontFamily:"'JetBrains Mono', monospace" }}>
                        {s.records.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MULTIHOP VIEW ───────────────────────────────────────────────────────────

function MultihopView() {
  const [sub, setSub] = useState("f1");

  return (
    <div>
      <SectionTitle icon="🔗">Multi-Hop Retrieval (2WikiMultihopQA)</SectionTitle>
      <div style={{ display:"flex", gap:"8px", marginBottom:"20px", flexWrap:"wrap" }}>
        <Pill active={sub==="f1"} onClick={() => setSub("f1")}>F1 Comparison</Pill>
        <Pill active={sub==="samples"} onClick={() => setSub("samples")}>Sample Results</Pill>
      </div>

      {sub === "f1" && (
        <div>
          <p style={{ color: C.textMuted, fontSize:"13px", marginBottom:"16px" }}>
            Syntactic reranking with our approach improves F1 by over 20% across models without any fine-tuning.
          </p>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={F1_COMPARISON} layout="vertical" margin={{ left: 140 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis type="number" tick={{ fill: C.textMuted, fontSize: 11 }} domain={[0, 0.6]} />
              <YAxis type="category" dataKey="model" tick={{ fill: C.textMuted, fontSize: 11 }} width={130} />
              <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize:12 }} />
              <Bar dataKey="f1" name="F1 Score" radius={[0,6,6,0]}>
                {F1_COMPARISON.map((entry, i) => (
                  <Cell key={i} fill={entry.model.includes("ours") ? C.accent : C.textMuted} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {sub === "samples" && (
        <div style={{
          maxHeight: "400px",
          overflowY: "auto",
          borderRadius: "12px",
          border: `1px solid ${C.border}`,
        }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background: C.surfaceLight, position:"sticky", top:0, zIndex:1 }}>
                <th style={{ padding:"10px 14px", textAlign:"left", fontSize:"11px", color:C.textMuted, borderBottom:`1px solid ${C.border}`, fontWeight:600 }}>Query</th>
                <th style={{ padding:"10px 14px", textAlign:"center", fontSize:"11px", color:C.textMuted, borderBottom:`1px solid ${C.border}`, fontWeight:600, width:"100px" }}>Base Model</th>
                <th style={{ padding:"10px 14px", textAlign:"center", fontSize:"11px", color:C.textMuted, borderBottom:`1px solid ${C.border}`, fontWeight:600, width:"100px" }}>+ Syntactic</th>
              </tr>
            </thead>
            <tbody>
              {MULTIHOP_QA.map((item, i) => {
                const baseCorrect = item.base.filter(Boolean).length;
                const instrCorrect = item.instruct.filter(Boolean).length;
                return (
                  <tr key={i} style={{ borderBottom:`1px solid ${C.border}` }}>
                    <td style={{ padding:"10px 14px", fontSize:"12px", color:C.text, lineHeight:1.5 }}>{item.query}</td>
                    <td style={{ padding:"10px 14px", textAlign:"center" }}>
                      <span style={{
                        fontFamily:"'JetBrains Mono', monospace", fontSize:"12px", fontWeight:600,
                        color: baseCorrect === 3 ? C.green : baseCorrect > 0 ? C.orange : C.red,
                      }}>{baseCorrect}/3</span>
                    </td>
                    <td style={{ padding:"10px 14px", textAlign:"center" }}>
                      <span style={{
                        fontFamily:"'JetBrains Mono', monospace", fontSize:"12px", fontWeight:600,
                        color: instrCorrect === 3 ? C.green : instrCorrect > 0 ? C.orange : C.red,
                      }}>{instrCorrect}/3</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── SYNTACTIC RERANKER DEMO ─────────────────────────────────────────────────

function SyntacticDemo() {
  const [query, setQuery] = useState("Which film has the director who was born later, Alludugaru or The Laughing Woman?");
  const [step, setStep] = useState(0);

  const splitTokens = ["which", "film", "has", "the", "director"];
  const posSegments = [
    { label: "Segment 1", text: "Which film has the director", tags: "DET NOUN VERB DET NOUN" },
    { label: "Segment 2", text: "who was born later", tags: "PRON AUX VERB ADV" },
    { label: "Segment 3", text: "Alludugaru or The Laughing Woman", tags: "PROPN CCONJ DET VERB NOUN" },
  ];

  const passages = [
    { id: "P1", text: "Alludugaru is a 1992 Telugu film directed by...", freq: { "alludugaru": 3, "film": 2, "director": 2 }, selected: true },
    { id: "P2", text: "The Laughing Woman is a 1969 film by...", freq: { "laughing": 2, "woman": 2, "film": 1 }, selected: true },
    { id: "P3", text: "Born in 1940, the filmmaker studied at...", freq: { "born": 1, "filmmaker": 1 }, selected: true },
    { id: "P4", text: "The cricket match was held in Mumbai...", freq: { "match": 1 }, selected: false },
  ];

  return (
    <div>
      <SectionTitle icon="🧬">Syntactic Reranker — Step by Step</SectionTitle>
      <div style={{
        background: C.surfaceLight,
        border: `1px solid ${C.border}`,
        borderRadius: "12px",
        padding: "16px 20px",
        marginBottom: "16px",
      }}>
        <div style={{ fontSize:"11px", color:C.accent, fontFamily:"'JetBrains Mono', monospace", marginBottom:"6px" }}>INPUT QUERY</div>
        <div style={{ fontSize:"14px", color:C.text }}>{query}</div>
      </div>

      <div style={{ display:"flex", gap:"8px", marginBottom:"16px", flexWrap:"wrap" }}>
        {["1. Recursive Split", "2. Frequency Calc", "3. Passage Selection", "4. Order Preserve"].map((s, i) => (
          <Pill key={i} active={step === i} onClick={() => setStep(i)}>{s}</Pill>
        ))}
      </div>

      {step === 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
          <p style={{ color: C.textMuted, fontSize:"13px", margin:"0 0 8px 0" }}>
            The query is recursively split at syntactic boundaries (ADP, CCONJ, punctuation) into minimal semantic units.
          </p>
          {posSegments.map((seg, i) => (
            <div key={i} style={{
              background: C.surfaceLight,
              border: `1px solid ${C.border}`,
              borderRadius: "10px",
              padding: "12px 16px",
            }}>
              <div style={{ fontSize:"11px", fontFamily:"'JetBrains Mono', monospace", color:C.accent, marginBottom:"4px" }}>{seg.label}</div>
              <div style={{ fontSize:"14px", color:C.text, marginBottom:"4px" }}>{seg.text}</div>
              <div style={{ fontSize:"10px", fontFamily:"'JetBrains Mono', monospace", color:C.textMuted }}>{seg.tags}</div>
            </div>
          ))}
        </div>
      )}

      {step === 1 && (
        <div>
          <p style={{ color: C.textMuted, fontSize:"13px", margin:"0 0 12px 0" }}>
            Document frequency is computed for each word in each segment across all candidate passages.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:"8px" }}>
            {passages.map((p, i) => (
              <div key={i} style={{
                background: C.surfaceLight,
                border: `1px solid ${C.border}`,
                borderRadius: "10px",
                padding: "12px 14px",
              }}>
                <div style={{ fontSize:"11px", fontFamily:"'JetBrains Mono', monospace", color:C.accent, marginBottom:"6px" }}>{p.id}</div>
                <div style={{ fontSize:"12px", color:C.text, marginBottom:"8px", lineHeight:1.5 }}>{p.text}</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"4px" }}>
                  {Object.entries(p.freq).map(([word, count]) => (
                    <span key={word} style={{
                      fontSize:"10px", fontFamily:"'JetBrains Mono', monospace",
                      background: `${C.accent}22`, color: C.accent,
                      padding:"2px 6px", borderRadius:"4px",
                    }}>{word}: {count}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <p style={{ color: C.textMuted, fontSize:"13px", margin:"0 0 12px 0" }}>
            Top-L frequency values select valid passage indices. Reverse-order union aggregates across all segments.
          </p>
          {passages.map((p, i) => (
            <div key={i} style={{
              display:"flex", alignItems:"center", gap:"12px",
              background: p.selected ? "rgba(34,197,94,0.06)" : C.surfaceLight,
              border: `1px solid ${p.selected ? "rgba(34,197,94,0.3)" : C.border}`,
              borderRadius: "8px",
              padding: "10px 14px",
              marginBottom: "6px",
            }}>
              <span style={{
                width:"24px", height:"24px", borderRadius:"6px",
                display:"flex", alignItems:"center", justifyContent:"center",
                background: p.selected ? C.greenGlow : C.redGlow,
                color: p.selected ? C.green : C.red,
                fontSize:"12px", fontWeight:700,
              }}>{p.selected ? "✓" : "✗"}</span>
              <span style={{ fontSize:"12px", fontFamily:"'JetBrains Mono', monospace", color:C.accent, width:"30px" }}>{p.id}</span>
              <span style={{ fontSize:"12px", color:C.text, flex:1 }}>{p.text}</span>
              <span style={{
                fontSize:"11px", fontFamily:"'JetBrains Mono', monospace",
                color: p.selected ? C.green : C.red,
              }}>{p.selected ? "SELECTED" : "FILTERED"}</span>
            </div>
          ))}
        </div>
      )}

      {step === 3 && (
        <div style={{
          background: C.surfaceLight,
          border: `1px solid ${C.border}`,
          borderRadius: "12px",
          padding: "20px",
        }}>
          <p style={{ color: C.textMuted, fontSize:"13px", margin:"0 0 12px 0" }}>
            Selected passages are returned in their original document order to preserve semantic and logical flow.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {passages.filter(p => p.selected).map((p, i) => (
              <div key={i} style={{
                display:"flex", alignItems:"center", gap:"12px",
                padding:"12px 16px",
                background: `${C.accent}08`,
                borderRadius:"8px",
                border:`1px solid ${C.border}`,
              }}>
                <div style={{
                  width:"28px", height:"28px", borderRadius:"8px",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  background: C.accentGlow, color: C.accent,
                  fontFamily:"'JetBrains Mono', monospace",
                  fontSize:"13px", fontWeight:700,
                }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize:"11px", fontFamily:"'JetBrains Mono', monospace", color:C.accent }}>{p.id} — Original order preserved</div>
                  <div style={{ fontSize:"12px", color:C.text, marginTop:"2px" }}>{p.text}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop:"16px", padding:"12px 16px",
            background: C.greenGlow, borderRadius:"8px",
            border:`1px solid rgba(34,197,94,0.3)`,
          }}>
            <span style={{ fontSize:"12px", color:C.green, fontWeight:600 }}>
              ✓ SynRerank(q, L=3) → 3 passages selected, semantic flow preserved
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("pipeline");

  const tabs = [
    { id: "pipeline", label: "Pipeline", icon: "⚡" },
    { id: "retrieval", label: "Retrieval Explorer", icon: "🔎" },
    { id: "metrics", label: "Metrics", icon: "📊" },
    { id: "multihop", label: "Multi-Hop", icon: "🔗" },
    { id: "syntactic", label: "Syntactic Reranker", icon: "🧬" },
  ];

  return (
    <div style={{
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      background: C.bg,
      color: C.text,
      minHeight: "100vh",
      padding: "0",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        padding: "20px 24px",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"8px" }}>
            <div style={{
              width:"36px", height:"36px", borderRadius:"10px",
              background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"18px",
            }}>📝</div>
            <div>
              <h1 style={{ margin:0, fontSize:"17px", fontWeight:700, letterSpacing:"-0.01em" }}>
                Knowledge & Context Compression via Question Generation
              </h1>
              <p style={{ margin:0, fontSize:"12px", color:C.textMuted, marginTop:"2px" }}>
                Enhancing Multihop Document Retrieval without Fine-tuning — Interactive Demo
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:"4px", marginTop:"16px", overflowX:"auto" }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: "8px 16px",
                borderRadius: "8px 8px 0 0",
                border: "none",
                borderBottom: tab === t.id ? `2px solid ${C.accent}` : "2px solid transparent",
                background: tab === t.id ? C.surfaceLight : "transparent",
                color: tab === t.id ? C.accent : C.textMuted,
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: tab === t.id ? 600 : 400,
                fontFamily: "'DM Sans', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}>
                <span style={{ fontSize:"14px" }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
        {/* Key stats bar */}
        <div style={{
          display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap",
        }}>
          <MetricCard label="Accuracy" value="84.4%" sub="Our Approach" color={C.accent} />
          <MetricCard label="MRR" value="0.803" sub="Our Approach" color={C.purple} />
          <MetricCard label="F1 (Multi-hop)" value="0.550" sub="Llama3 + Syntactic" color={C.green} />
          <MetricCard label="Storage Saved" value="~80%" sub="218 vs 44K+ vectors" color={C.cyan} />
        </div>

        {tab === "pipeline" && <PipelineView />}
        {tab === "retrieval" && <RetrievalExplorer />}
        {tab === "metrics" && <MetricsDashboard />}
        {tab === "multihop" && <MultihopView />}
        {tab === "syntactic" && <SyntacticDemo />}
      </div>
    </div>
  );
}
