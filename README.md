# Bank Soundness Early-Warning Monitor

An independent regulatory-analytics dashboard and supervisory report compiler that applies the Reserve Bank of India's (RBI) actual **Prompt Corrective Action (PCA) Framework** to public quarterly bank results (Q3 FY26).

---

## 🏛️ What This Is and Why It Exists

In scheduled commercial banking supervision, analysts manually compile public financial results to calculate a bank's buffer space against regulatory thresholds. This portfolio project automates that "first-pass" screening. 

By mapping published Capital Adequacy (CRAR/CET1) ratios, Asset Quality (Net NPA) ratios, and Leverage ratios against the basis-points (bps) rules defined in the [RBI Circular RBI/2021-22/118](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12186&Mode=0), the monitor highlights structural banking weaknesses in real-time.

> [!IMPORTANT]
> **Regulatory Disclaimer**
> This tool applies the **public, published methodology** of the RBI PCA framework to **public, disclosed bank results**. It is an independent analytical exercise for portfolio and demonstration purposes only. It does **not** represent the RBI's actual internal supervisory classification of any bank, which relies on non-public inspection reports, qualitative governance audits, and discretionary judgment.

---

## ⚙️ PCA Framework Parameters & Logic

Under the Jan 1, 2022 revised RBI PCA guidelines, banks are graded on three key risk dimensions. A breach of **Risk Threshold 3** on *any* single parameter (or **Threshold 2** on *two or more* parameters) triggers mandatory restructures, dividend restrictions, and compensation caps.

### 1. Capital Adequacy (CRAR & CET1)
Measured as basis points (bps) below the Basel III regulatory minimum, which includes the **2.50% Capital Conservation Buffer (CCB)**:
- **Total CRAR Minimum**: **11.50%** (9.00% + 2.50% CCB)
- **CET1 Minimum**: **8.00%** (5.50% + 2.50% CCB)
- **Risk Threshold 1**: Up to 250 bps below minimum (9.00% to 11.50% CRAR)
- **Risk Threshold 2**: 250 to 400 bps below minimum (7.50% to 9.00% CRAR)
- **Risk Threshold 3**: More than 400 bps below minimum (< 7.50% CRAR)

### 2. Asset Quality (Net NPA Ratio)
Monitored to assess loan book impairments (lower is better):
- **Risk Threshold 1**: ≥ 6.00% and < 9.00%
- **Risk Threshold 2**: ≥ 9.00% and < 12.00%
- **Risk Threshold 3**: ≥ 12.00%

### 3. Leverage Ratio (Tier-1 Leverage)
Monitored as non-risk-weighted backstops. Minimum requirements differ by entity classification:
- **Minimum Requirement**: **4.00%** for D-SIBs (SBI, HDFC, ICICI); **3.50%** for standard Scheduled Commercial Banks (PNB, BoB).
- **Risk Threshold 1**: Up to 50 bps below minimum (e.g., 3.50% to 4.00% for D-SIBs)
- **Risk Threshold 2**: 50 to 100 bps below minimum (e.g., 3.00% to 3.50% for D-SIBs)
- **Risk Threshold 3**: More than 100 bps below minimum (< 3.00% for D-SIBs)

*Note: Leverage ratio metrics are not published in current Q3 FY26 datasets. The system marks this metric as **"Data Pending"** to ensure zero metric fabrication, but includes the underlying calculation engine to support future disclosures.*

---

## 📁 Data Sources

All inputs are compiled from official quarterly investor presentations, press releases, or SEC Form 6-K filings for the period ended December 31, 2025 (Q3 FY26).
For the exact source citation and reference documents of each bank's metrics, refer to [data/SOURCES.md](file:///Users/anitavasava/Desktop/bank-soundness-monitor/data/SOURCES.md).

Direct links to the official Investor Relations portals are listed below:
- **State Bank of India:** [sbi.co.in Quarterly Results](https://www.sbi.co.in/web/investor-relations/quarterly-results)
- **HDFC Bank:** [hdfcbank.com Financial Results](https://www.hdfcbank.com/personal/about-us/investor-relations/financial-results)
- **ICICI Bank:** [icicibank.com Investor Relations](https://www.icicibank.com/about-us/investor-relations)
- **Punjab National Bank:** [pnbindia.in Investor Relations](https://www.pnbindia.in/investor-relations.html)
- **Bank of Baroda:** [bankofbaroda.in Shareholders Section](https://www.bankofbaroda.in/investor-relations)

---

## 🛠️ Local Setup & Commands

### 1. React Web Dashboard (Vite + TS + Tailwind CSS)
Builds a premium, accessible NOC dark-theme analytics board with a Classic Light toggle and SVG charts.

```bash
# Install dependencies
npm install

# Start the local development server
npm run dev

# Build the production bundle
npm run build
```

### 2. Python Report Builder (`openpyxl`)
Compiles the metrics into a formatted Excel sheet with color-coded risk grades and embedded comparison charts.

```bash
# Install spreadsheet engine
pip install openpyxl

# Generate the report
python scripts/build_report.py
```
Generated workbook location: `reports/bank_soundness_report_q3fy26.xlsx`

---

## 🤖 CI/CD Workflow
The repository contains a GitHub Actions workflow in [deploy.yml](file:///Users/anitavasava/Desktop/bank-soundness-monitor/.github/workflows/deploy.yml) that:
1. Runs standard code audits and compiles the TypeScript project.
2. Sets up Python, installs dependencies, and runs `scripts/build_report.py`.
3. Archives the resulting Excel spreadsheet as a downloadable workflow artifact.
