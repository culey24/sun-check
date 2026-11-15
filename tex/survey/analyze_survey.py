#!/usr/bin/env python3
"""Turn Google Forms survey responses (CSV) into the LaTeX tables of Appendix B.

Usage:
    python3 analyze_survey.py responses.csv     # writes results.tex from real answers
    python3 analyze_survey.py --template        # writes results.tex with empty [TBD] cells

Rules
  * Question headers in the CSV must start with "Q1.", "Q2." ... as in Table B.1 of the report.
  * Multiple-choice answers are separated by commas (Google Forms default), so answer
    options must not contain commas.
  * Respondents under 18 are excluded (the target group is 18-35 and we do not survey minors).
  * Every number comes from the file. Nothing is simulated or filled in by default.
"""
import csv, math, re, sys
from collections import Counter

OUT = "results.tex"
TBD = r"\textcolor{red}{\textbf{[TBD]}}"

AGE = ["Under 18", "18-22", "23-27", "28-35", "Over 35"]
OCC = ["University student", "Working", "Other"]
CITY = ["Ho Chi Minh City", "Hanoi", "Da Nang", "Other"]
FREQ = ["Never", "Rarely", "Sometimes", "Often", "Always"]
REASONS = ["I forget", "I do not think it is necessary", "It is inconvenient",
           "I do not have sunscreen with me", "It feels bad on my skin or makeup", "Other"]
WTP = ["Under VND 50k", "VND 50k to under 89k", "VND 89k to 120k", "Over VND 120k", "I would not buy"]


def esc(s):
    return s.replace("&", r"\&").replace("%", r"\%").replace("_", r"\_")


def wilson(k, n, z=1.96):
    if n == 0:
        return (0.0, 0.0)
    p = k / n
    d = 1 + z * z / n
    c = (p + z * z / (2 * n)) / d
    h = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d
    return (max(0, c - h), min(1, c + h))


def load(path):
    with open(path, newline="", encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))
    if not rows:
        sys.exit("No responses found.")
    cols = {}
    for h in rows[0].keys():
        m = re.match(r"\s*Q(\d+)\.", h)
        if m:
            cols[int(m.group(1))] = h
    need = range(1, 15)
    missing = [q for q in need if q not in cols]
    if missing:
        sys.exit(f"Missing question columns: {['Q%d' % q for q in missing]}")
    return rows, cols


def single(rows, col):
    return [r[col].strip() for r in rows]


def multi(rows, col):
    return [[x.strip() for x in r[col].split(",") if x.strip()] for r in rows]


def pct_cell(k, n):
    if n == 0:
        return "--", "--"
    lo, hi = wilson(k, n)
    return f"{k}/{n} ({100*k/n:.0f}\\%)", f"{100*lo:.0f}--{100*hi:.0f}\\%"


def build(rows, cols):
    rows = [r for r in rows if r[cols[1]].strip() != "Under 18"]
    N = len(rows)
    q = {i: single(rows, cols[i]) for i in (1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13)}
    m7, m8, m14 = multi(rows, cols[7]), multi(rows, cols[8]), multi(rows, cols[14])
    out = []
    out.append(f"\\noindent\\textbf{{Valid respondents (aged 18 or over): n = {N}.}}\\par\\medskip\n")

    def dist_table(caption, label, title, options, answers):
        c = Counter(answers)
        t = [f"\\begin{{table}}[ht]\\centering\\small\\caption{{{caption}}}\\label{{{label}}}",
             "\\begin{tabular}{@{}lrr@{}}\\toprule", f"\\textbf{{{title}}} & \\textbf{{Count}} & \\textbf{{Share}}\\\\\\midrule"]
        for o in options:
            t.append(f"{esc(o)} & {c.get(o, 0)} & {100*c.get(o,0)/N:.0f}\\%\\\\")
        t.append("\\bottomrule\\end{tabular}\\end{table}\n")
        return "\n".join(t)

    out.append(dist_table("Respondent profile: age group", "tab:svy-age", "Age group", AGE[1:], q[1]))
    out.append(dist_table("Respondent profile: occupation", "tab:svy-occ", "Occupation", OCC, q[2]))
    out.append(dist_table("Respondent profile: city", "tab:svy-city", "City", CITY, q[3]))

    def share(pred_list):
        k = sum(pred_list)
        return pct_cell(k, N)

    ind = []
    ind.append(("Use sunscreen often or always when outdoors", share([a in ("Often", "Always") for a in q[4]])))
    ind.append(("Know the two-hour reapplication advice", share([a == "Yes" for a in q[5]])))
    ind.append(("Reapply often or always after two hours outdoors", share([a in ("Often", "Always") for a in q[6]])))
    ind.append(("Never or rarely reapply", share([a in ("Never", "Rarely") for a in q[6]])))
    ind.append(("Own a smartphone with a camera", share([a == "Yes" for a in q[9]])))
    ind.append(("Interested in the patch (4 or 5 out of 5)", share([a in ("4", "5") for a in q[10]])))
    ind.append((f"Likely to buy at VND 89,000 (4 or 5 out of 5)", share([a in ("4", "5") for a in q[12]])))
    ind.append(("Would pay at least VND 89,000", share([a in ("VND 89k to 120k", "Over VND 120k") for a in q[11]])))
    t = ["\\begin{table}[ht]\\centering\\small\\caption{Key survey indicators (95\\% Wilson confidence intervals)}\\label{tab:svy-key}",
         "\\begin{tabular}{@{}L{7.6cm}rr@{}}\\toprule",
         "\\textbf{Indicator} & \\textbf{Respondents} & \\textbf{95\\% CI}\\\\\\midrule"]
    for name, (a, b) in ind:
        t.append(f"{name} & {a} & {b}\\\\")
    for qi, nm in ((10, "Mean interest score (1--5)"), (12, "Mean purchase-intention score (1--5)")):
        vals = [int(x) for x in q[qi] if x.isdigit()]
        t.append(f"{nm} & {sum(vals)/len(vals):.2f} & --\\\\" if vals else f"{nm} & -- & --\\\\")
    t.append("\\bottomrule\\end{tabular}\\end{table}\n")
    out.append("\n".join(t))

    def multi_table(caption, label, title, options, answers):
        c = Counter(x for a in answers for x in set(a))
        t = [f"\\begin{{table}}[ht]\\centering\\small\\caption{{{caption}}}\\label{{{label}}}",
             "\\begin{tabular}{@{}L{7.6cm}rr@{}}\\toprule", f"\\textbf{{{title}}} & \\textbf{{Respondents}} & \\textbf{{Share}}\\\\\\midrule"]
        for o in options:
            t.append(f"{esc(o)} & {c.get(o,0)} & {100*c.get(o,0)/N:.0f}\\%\\\\")
        t.append("\\bottomrule\\end{tabular}\\end{table}\n")
        return "\n".join(t)

    out.append(multi_table("Reasons for not always reapplying sunscreen (multiple answers allowed)", "tab:svy-reasons",
                           "Reason", REASONS, m7))
    out.append(dist_table("Highest price respondents would pay per package", "tab:svy-wtp", "Price", WTP, q[11]))
    return "\n".join(out)


def template():
    def blank(title, rows, extra=""):
        t = [f"\\begin{{tabular}}{{@{{}}L{{7.6cm}}rr@{{}}}}\\toprule", f"\\textbf{{{title}}} & \\textbf{{Count}} & \\textbf{{Share}}\\\\\\midrule"]
        for r in rows:
            t.append(f"{esc(r)} & {TBD} & {TBD}\\\\")
        t.append("\\bottomrule\\end{tabular}")
        return "\n".join(t)

    s = [f"\\noindent\\textbf{{Valid respondents (aged 18 or over): n = {TBD}.}}\\par\\medskip\n"]
    for cap, lab, title, rows in (
            ("Respondent profile: age group", "tab:svy-age", "Age group", AGE[1:]),
            ("Respondent profile: occupation", "tab:svy-occ", "Occupation", OCC),
            ("Respondent profile: city", "tab:svy-city", "City", CITY)):
        s.append(f"\\begin{{table}}[ht]\\centering\\small\\caption{{{cap}}}\\label{{{lab}}}\n{blank(title, rows)}\\end{{table}}\n")
    keys = ["Use sunscreen often or always when outdoors", "Know the two-hour reapplication advice",
            "Reapply often or always after two hours outdoors", "Never or rarely reapply",
            "Own a smartphone with a camera", "Interested in the patch (4 or 5 out of 5)",
            "Likely to buy at VND 89,000 (4 or 5 out of 5)", "Would pay at least VND 89,000"]
    t = ["\\begin{table}[ht]\\centering\\small\\caption{Key survey indicators (95\\% Wilson confidence intervals)}\\label{tab:svy-key}",
         "\\begin{tabular}{@{}L{7.6cm}rr@{}}\\toprule", "\\textbf{Indicator} & \\textbf{Respondents} & \\textbf{95\\% CI}\\\\\\midrule"]
    for k in keys:
        t.append(f"{k} & {TBD} & {TBD}\\\\")
    t.append(f"Mean interest score (1--5) & {TBD} & --\\\\")
    t.append(f"Mean purchase-intention score (1--5) & {TBD} & --\\\\")
    t.append("\\bottomrule\\end{tabular}\\end{table}\n")
    s.append("\n".join(t))
    for cap, lab, title, rows in (
            ("Reasons for not always reapplying sunscreen (multiple answers allowed)", "tab:svy-reasons", "Reason", REASONS),
            ("Highest price respondents would pay per package", "tab:svy-wtp", "Price", WTP)):
        s.append(f"\\begin{{table}}[ht]\\centering\\small\\caption{{{cap}}}\\label{{{lab}}}\n{blank(title, rows)}\\end{{table}}\n")
    return "\n".join(s)


if __name__ == "__main__":
    if len(sys.argv) == 2 and sys.argv[1] == "--template":
        text = template()
    elif len(sys.argv) == 2:
        rows, cols = load(sys.argv[1])
        text = build(rows, cols)
    else:
        sys.exit(__doc__)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write("% Generated by analyze_survey.py - do not edit by hand\n" + text)
    print("wrote", OUT)
