# Pro-Metabolic Research Commons

A static, public research site that collects the main public ideas of health / biohacker
accounts in the magnesium, mineral, thyroid and Ray-Peat-style "pro-metabolic" circle. Every
idea is paraphrased, linked to its original source, and paired with a short
**"What the evidence says"** note based on PubMed-indexed research.

**Not medical advice.** The site is for education only.

## Open it
Double-click `index.html`. You don't need a build step or a server. The data loads from
`data/claims.json`, and when the page is opened straight from disk (file://) it falls back to the
mirror in `data/claims.js`.

Optional local server (so the page reads `claims.json` directly):
```
python3 -m http.server 8000   # then open http://localhost:8000
```

## Contents (updated 2026-10-12)
95 claims from 12 sources: @Grimhood, Master Metabolism (@lowmegatron), Jay Feldman, Mike Fave,
Danny Roddy, Georgi Dinkov, Ray Peat, Betel Juice (@Beteljuice), FixLowBodyTemp.com (Steve Richfield)
Moosa (@questmoosa), Aajonus Vonderplanitz (Primal Diet) and N'Golo / @NgoloTesla. The 40 newest claims (c056–c095) are marked "Not assessed" or carry only a
short evidence note. Their evidence reviews are still to do.

## Structure
```
index.html            Home: what this is, disclaimer, accounts, topics, method
claims.html           Searchable / filterable / sortable table of every claim
accounts/<id>.html    One page per account (generated shells, rendered by js/app.js)
topics/<id>.html      One page per topic, cross-referencing accounts
data/claims.json      THE DATA: meta, topics, accounts, claims
data/claims.js        Auto-generated mirror of claims.json (for file:// use)
css/style.css, js/app.js
tools/source_data.py  Python source used to write claims.json (optional to use)
tools/sync_data.py    Re-mirror claims.json -> claims.js after hand edits
tools/make_pages.py   Re-create account/topic shell pages after adding one
screenshots/          Headless-Chrome screenshots
```

## Updating the data
1. Edit `data/claims.json`:
   * **Add a claim** to `claims[]`:
     ```json
     {"id":"c056","account":"grimhood","topic":"minerals","secondary_topics":["supplements"],
      "claim":"Paraphrase in your own words.","quote":null,
      "source_url":"https://x.com/Grimhood/status/…","source_label":"X post","date":"2026-10-01",
      "evidence_note":"What reviews/trials show, including where it's weak or contradicts.",
      "evidence_strength":"Mixed",
      "evidence_refs":[{"label":"Author year, journal – finding","url":"https://pubmed.ncbi.nlm.nih.gov/<PMID>/"}]}
     ```
     * `topic` must be one of the `topics[].id` values: `minerals`, `thyroid`, `diet`, `sleep-light-stress`, `supplements`.
     * `evidence_strength` must be one of: Supported, Partly supported, Mixed, Weak / preliminary, Contradicted, Not assessed.
     * Quotes: keep them under ~25 words and only where the exact wording matters.
   * **Add an account** to `accounts[]` (id, name, handle, x_url, links, bio, circle_note, limits, and optionally verification / commercial_note).
2. Run `python3 tools/sync_data.py` (updates `claims.js`).
3. If you added an account or topic, run `python3 tools/make_pages.py`.

(If you'd rather work in Python, edit `tools/source_data.py` and run it. It rewrites both data files.
Note that it overwrites hand edits to `claims.json`, so pick one workflow.)

### When X access becomes available
Most posts were reachable only through archives (Thread Reader App, Rattibha) and X's public embed
endpoint (`cdn.syndication.twimg.com/tweet-result?id=<id>`), which returns one post when you
already know its ID. With a logged-in X session or the X API you could:
* pull each account's recent timeline and add claims with direct `x.com/<handle>/status/<id>` links;
* confirm X handles that are still unverified here (Jay Feldman has none listed; @dannyroddy is taken from his link page);
* record follower counts and cross-mentions (who quotes whom) to back up the "same circle" links.

### Rules to keep
* Summarize in your own words. Don't paste whole threads, articles or images.
* Every claim needs a `source_url`. Every evidence note should cite real, checked studies.
  Check a PubMed ID with `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=<PMID>`.
  If you can't find evidence, say so in the note and leave `evidence_refs` empty.

## Deploying
Live on GitHub Pages: https://kala00.github.io/biohacker-research/biohacker-research/ (uploaded by hand to the `biohacker-research/` subfolder of the repo).

* **Netlify Drop:** go to https://app.netlify.com/drop and drag this whole folder onto the page. You get a
  public URL in seconds. Signing up keeps the site permanently.
* **GitHub Pages:** create a public repo, push this folder to the `main` branch, then
  Settings → Pages → "Deploy from a branch" → `main` / root. The site appears at
  `https://<user>.github.io/<repo>/`.
* **Cloudflare Pages** also works: upload the folder as a "direct upload" project.

Every path is relative, so the site works from any sub-path.
