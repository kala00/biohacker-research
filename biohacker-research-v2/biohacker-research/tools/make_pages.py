"""Creates the small HTML shell pages (one per account and per topic) from data/claims.json.
Run after adding an account or topic:  python3 tools/make_pages.py"""
import json, os, html
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = json.load(open(os.path.join(ROOT, "data", "claims.json")))
def page(title, pg, pid, root, desc):
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(title)} – Pro-Metabolic Research Commons</title>
<meta name="description" content="{html.escape(desc)}">
<link rel="stylesheet" href="{root}/css/style.css"></head>
<body data-page="{pg}" data-id="{pid}" data-root="{root}">
<div id="site-header"></div><main><div class="wrap" id="content"><noscript>This site needs JavaScript to render the research data. The raw data is in data/claims.json.</noscript></div></main><div id="site-footer"></div>
<script src="{root}/data/claims.js"></script><script src="{root}/js/app.js"></script></body></html>
"""
os.makedirs(os.path.join(ROOT,"accounts"),exist_ok=True); os.makedirs(os.path.join(ROOT,"topics"),exist_ok=True)
for a in D["accounts"]:
    open(os.path.join(ROOT,"accounts",a["id"]+".html"),"w").write(page(a["name"],"account",a["id"],"..",f"Public health ideas of {a['name']} ({a['handle']}) with evidence notes."))
for t in D["topics"]:
    open(os.path.join(ROOT,"topics",t["id"]+".html"),"w").write(page(t["name"],"topic",t["id"],"..",t["blurb"]))
open(os.path.join(ROOT,"index.html"),"w").write(page("Home","home","",".","Public, evidence-checked summaries of pro-metabolic / magnesium / thyroid health accounts. Not medical advice."))
open(os.path.join(ROOT,"claims.html"),"w").write(page("Claims index","claims","",".","Searchable table of every claim, source and evidence note."))
print("pages:", len(D["accounts"]), "accounts,", len(D["topics"]), "topics, + index & claims")
