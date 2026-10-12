"""After editing data/claims.json by hand, run: python3 tools/sync_data.py
It copies the JSON into data/claims.js so the site also works when opened straight from disk."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
with open(os.path.join(ROOT, "data", "claims.json")) as f: data = json.load(f)
with open(os.path.join(ROOT, "data", "claims.js"), "w") as f:
    f.write("/* AUTO-GENERATED from claims.json by tools/sync_data.py. Do not edit by hand. */\nwindow.RESEARCH_DATA = ")
    json.dump(data, f, ensure_ascii=False); f.write(";\n")
print("synced", len(data["claims"]), "claims")
