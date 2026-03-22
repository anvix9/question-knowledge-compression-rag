# Interactive Demo

This folder contains a React-based interactive demo (`demo.jsx`) that visualizes the paper's approach and evaluation results.

## What's Included

The demo has 5 interactive tabs:

1. **Pipeline** — Step-by-step walkthrough of the 6-stage retrieval pipeline
2. **Retrieval Explorer** — Browse real queries and their top-3 retrieval results with similarity scores
3. **Metrics** — Performance dashboards (Global, Technical, Conceptual, BM25 Boosted, Storage)
4. **Multi-Hop** — F1 score comparison across models and sample-level correctness table
5. **Syntactic Reranker** — Visual step-by-step demonstration of the syntactic reranking algorithm

## Running the Demo

### Option 1: Claude Artifacts (Recommended)

Copy the contents of `demo.jsx` into [Claude.ai](https://claude.ai) and ask Claude to render it as a React artifact.

### Option 2: Local React Setup

```bash
npx create-react-app demo-app
cp demo.jsx demo-app/src/App.jsx
cd demo-app
npm install recharts lucide-react
npm start
```

> **Note:** The demo uses pre-computed evaluation data embedded directly in the component. No model loading or API calls are required.
