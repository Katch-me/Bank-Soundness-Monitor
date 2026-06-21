# Project Brief — Bank Soundness Early-Warning Monitor

Paste the prompt below into Antigravity once this folder is open as the project.

---

I'm building a real (not fictional) regulatory-analytics portfolio project: an
early-warning monitor that applies RBI's actual Prompt Corrective Action (PCA)
framework to Indian banks' published quarterly results.

CONTEXT FILES — read these before writing any code:
- data/banks_q3fy26.json — the only source of bank metrics. Never invent or
  estimate a number not in this file. If a field is missing, the UI must show
  "data pending," never a guessed value.
- data/SOURCES.md — citation for every figure, and the no-fabrication rule
- docs/pca_framework.md — the real RBI thresholds (CRAR/CET1 capital, Net NPA
  asset quality, Tier-1 leverage) this tool grades banks against, plus the
  required disclaimer framing
- reference/design-reference.html — visual language to carry over: dark
  "network operations center" theme, Space Grotesk + Inter + IBM Plex Mono
  type system, signal-blue/safe-green/alert-coral/amber palette

TASK:
Build a Vite + React + TypeScript + Tailwind project, deployable to Vercel,
with:
1. A bank-by-bank scorecard grading each bank against the three PCA
   parameters, showing which threshold (if any) is breached, using the real
   bps-based logic in pca_framework.md — not a simplified good/bad heuristic
2. A comparison view across all 5 banks for CRAR and Net NPA
3. A short "why this exists" panel explaining this automates the first-pass
   screening a supervisory analyst does manually against published results
   each quarter
4. A visible disclaimer (footer or banner) stating this is an independent
   tool applying RBI's public PCA methodology to public data — not RBI's
   actual supervisory assessment
5. A Python script (scripts/build_report.py) using openpyxl that reads the
   same JSON and generates a formatted Excel workbook with conditional
   formatting (color banks by risk grade) and a chart
6. A GitHub Actions workflow for deployment

HARD CONSTRAINTS:
- Every number must trace to data/banks_q3fy26.json — flag anything unclear
  rather than guessing
- Responsive, accessible, respects prefers-reduced-motion
- Write the README last, explaining what it is, the data sources, and the
  disclaimer

Show me your plan before writing code.
