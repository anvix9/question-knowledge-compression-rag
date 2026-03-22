# Evaluation Data

This directory contains the pre-computed evaluation results used in the paper.

## Files

### Retrieval Results

| File | Rows | Description |
|------|------|-------------|
| `llama3resultqawiki.csv` | 888 | Full retrieval results (300 queries × 3 ranks) with similarity scores |
| `llama3resultqawiki_r3_50_samples.csv` | 150 | Top-3 results for 50-sample subset |
| `llama3resultqawiki_r3.csv` | 8 | Small sample of top-3 results |

**Columns:** `id`, `query`/`original_question`, `rank`, `predicted_id`, `score` (where available)

### Gold Standard

| File | Rows | Description |
|------|------|-------------|
| `llama3goldtest.csv` | 300 | Gold standard with original hash IDs (`input`, `_id`) |
| `llama3goldtest_custom_id.csv` | 50 | Gold standard with sequential custom IDs (`id`, `input`) |

### Multi-Hop Model Results

| File | Rows | Description |
|------|------|-------------|
| `model_results.csv` | 200 | Base model results (3 answer columns: `ans1`–`ans3`) |
| `model_results_sin_one_instruct.csv` | 200 | Model results with syntactic reranker applied |

**Columns:** `input` (query text), `ans1`, `ans2`, `ans3` (Boolean correctness per retrieval rank)

## Dataset Source

Multi-hop evaluation uses [LongBench QA v1](https://github.com/THUDM/LongBench) — specifically the 2WikiMultihopQA and 2WikiMultihopQA_e subsets.
