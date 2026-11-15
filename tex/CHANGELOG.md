# Changelog of numbers (report in `tex/`)

Records every change to a number or assumption that appears in more than one section, so that the
sections stay consistent. Dates use Asia/Ho_Chi_Minh time. Newest first.

## 2026-11-15 - LTV aligned with sales volumes (commit `d35ebe8`)

**Why.** Sections 4 and 6 computed customer lifetime value (LTV) with 3 packages per customer per
year, but the sales plan implies fewer: Section 6 sells 18,000 / 50,000 / 100,000 packages to
12,000 / 30,000 / 60,000 new customers, i.e. 1.5 / 1.67 / 1.67 packages per customer (about 1.6).
Section 5 also said all volumes matched Section 6.

**Decision.** Keep the sales volumes and revenue as they are. Use **1.6 packages per customer per
year** as the base case. Keep 3 packages per year as an **upside case**, not the plan.

| Item | Before | After (base case) | Upside case |
|---|---|---|---|
| Packages per customer per year | 3 | 1.6 | 3 |
| Customer lifetime | 2 years | 2 years | 2 years |
| Gross profit per package | VND 55,000 | VND 55,000 | VND 55,000 |
| LTV | VND 330,000 | **VND 176,000** (55,000 x 1.6 x 2) | VND 330,000 |
| LTV/CAC, Year 1 (CAC 30,000) | 11.0x | **5.9x** | 11.0x |
| LTV/CAC, Year 2 (CAC 20,000) | 16.5x | **8.8x** | 16.5x |
| LTV/CAC, Year 3 (CAC 16,667) | 19.8x | **10.6x** | 19.8x |
| Year 1 ratio if CAC stays at 30,000 (Section 5) | 11.0x | 5.9x | - |
| Year 3 ratio if CAC stays at 30,000 (Section 5) | 19.8x (stated as "rising to") | 10.6x | - |

**Where it changed.**
- Section 1: assumption list (repurchase about 1.6 packages per year; 3 is the upside).
- Section 2: introduction and closing comment (LTV 176,000). TAM and SAM are unchanged and still count
  3 packages per user per year; a sentence now says this is full-use potential, not the sales forecast.
- Section 4: business model canvas text, unit-economics table (Table 4.2), risk table, and a sentence
  on the base and upside cases.
- Section 5: CAC comparison (5.9 instead of 11.0, and 10.6 instead of 19.8), KPI row, and the internal
  reconcile note at the top of the file was removed.
- Section 6: LTV paragraph and formula, LTV/CAC table (Table 6.9, now with a base row and an upside row),
  and the comment under it.

**Not changed.** Revenue, COGS, operating expenses, EBITDA, NPV, IRR and break-even (none use LTV).
Gross margin (61.8%) and price (VND 89,000).

**Files.** `9.1 LTV.xlsx` in the course project is the lecturer's template (example "Widget" data) and
holds no Uvie figures, so it was not changed.

## 2026-11-15 - Other number changes today

- Survey results entered (Appendix B, n = 40 valid of 42; commit `73c58db`). Sections 1, 4 and 5 now
  cite them. Price: 45.0% would pay VND 89,000 or more and 47.5% were likely to buy at that price, so
  the price is described as a hypothesis to test.
- Web app size updated from "under 1,000 lines" to "about 1,500 lines" after the UV index and sample
  data were added (commit `0d04098`).
- Web app UV index card: suggested scan intervals of 45 / 60 / 90 / 120 minutes for extreme / very high
  / high / moderate UV (Table 3.3). These are the team's own design choice, not validated.
