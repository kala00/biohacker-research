/* Pro-Metabolic Research Commons – renders every page from data/claims.json (or the data/claims.js mirror). */
(function(){
  const body=document.body, ROOT=body.dataset.root||'.', PAGE=body.dataset.page, ID=body.dataset.id;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const sClass=s=>'s-'+String(s).split(/[ /]/)[0];
  const pill=s=>`<span class="pill ${sClass(s)}" title="Evidence strength">${esc(s)}</span>`;
  const $=sel=>document.querySelector(sel);

  async function load(){
    try{ const r=await fetch(ROOT+'/data/claims.json',{cache:'no-store'}); if(r.ok) return await r.json(); }catch(e){}
    if(window.RESEARCH_DATA) return window.RESEARCH_DATA;   // file:// fallback
    throw new Error('Could not load data');
  }

  function chrome(D){
    const nav=[['index.html','Home','home'],['claims.html','Claims index','claims']];
    const accLinks=D.accounts.map(a=>`<a href="${ROOT}/accounts/${a.id}.html" class="${PAGE==='account'&&ID===a.id?'active':''}">${esc(a.name.split(' (')[0].split(' |')[0])}</a>`).join('');
    const topLinks=D.topics.map(t=>`<a href="${ROOT}/topics/${t.id}.html" class="${PAGE==='topic'&&ID===t.id?'active':''}">${esc(t.name)}</a>`).join('');
    $('#site-header').innerHTML=`<header class="site"><div class="wrap">
      <a class="brand" href="${ROOT}/index.html">Pro-Metabolic <span>Research Commons</span></a>
      <nav class="main">${nav.map(n=>`<a href="${ROOT}/${n[0]}" class="${PAGE===n[2]?'active':''}">${n[1]}</a>`).join('')}</nav></div>
      <div class="wrap" style="padding-top:0"><nav class="main" aria-label="Accounts">${accLinks}</nav></div>
      <div class="wrap" style="padding-top:0"><nav class="main" aria-label="Topics">${topLinks}</nav></div></header>
      <div class="disclaimer"><div class="wrap"><b>Not medical advice.</b> Educational summaries of public posts, each checked against published research. Talk to a qualified clinician before changing medication, supplements or diet.</div></div>`;
    $('#site-footer').innerHTML=`<footer><div class="wrap">Summaries are paraphrased. Quotes are kept under 25 words and attributed. All original content belongs to its authors, so follow the links to read them in full.
      Data last updated ${esc(D.meta.updated)} · <a href="${ROOT}/data/claims.json">data/claims.json</a></div></footer>`;
  }

  const acc=(D,id)=>D.accounts.find(a=>a.id===id)||{name:id};
  const top=(D,id)=>D.topics.find(t=>t.id===id)||{name:id};

  function claimCard(D,c,{showAccount=true}={}){
    const a=acc(D,c.account);
    const tags=[c.topic,...(c.secondary_topics||[])].map(t=>`<a class="tag" href="${ROOT}/topics/${t}.html">${esc(top(D,t).name)}</a>`).join('');
    const refs=(c.evidence_refs||[]).length?`<ul class="refs">${c.evidence_refs.map(r=>`<li><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.label)}</a></li>`).join('')}</ul>`:'<div class="src">No study reference attached. See the note.</div>';
    return `<div class="claim" id="${c.id}">
      <div>${pill(c.evidence_strength)} ${showAccount?`<a href="${ROOT}/accounts/${a.id}.html"><b>${esc(a.name)}</b></a> ${a.handle&&a.handle.startsWith('@')?`<span class="src">${esc(a.handle)}</span>`:''}`:''}</div>
      <p><b>Claim:</b> ${esc(c.claim)}</p>
      ${c.quote?`<p class="q">${esc(c.quote)} <span class="src">— ${esc(a.handle&&a.handle.startsWith('@')?a.handle:a.name)}</span></p>`:''}
      <p class="src">Source: <a href="${esc(c.source_url)}" target="_blank" rel="noopener">${esc(c.source_label)}</a>${c.date?' · '+esc(c.date):''}</p>
      <div class="ev"><b>What the evidence says:</b> ${esc(c.evidence_note)}${refs}</div>
      <div style="margin-top:6px">${tags}</div></div>`;
  }

  function strengthLegend(D){
    return `<div class="box"><b>Evidence-strength scale</b><br>${D.meta.strength_scale.map(pill).join(' ')}
      <p class="src" style="margin:6px 0 0"><b>Supported</b>: good human evidence agrees. <b>Partly supported</b>: the core is right but overstated, or only in some groups. <b>Mixed</b>: studies disagree. <b>Weak / preliminary</b>: mostly animal, mechanistic or small uncontrolled studies. <b>Contradicted</b>: good evidence points the other way. <b>Not assessed</b>: too broad or no source checked.</p></div>`;
  }

  function home(D){
    const n=D.claims.length;
    const byStrength=D.meta.strength_scale.map(s=>[s,D.claims.filter(c=>c.evidence_strength===s).length]);
    $('#content').innerHTML=`
      <h1>What the pro-metabolic health accounts say, and what the research says</h1>
      <p class="lede">This site collects the main public ideas of health and biohacker accounts in the magnesium, mineral, thyroid and Ray-Peat-style "pro-metabolic" circle. Each idea is summarized in plain language, linked to its original source, and checked against published research.</p>
      <div class="box warn"><b>Disclaimer: this is not medical advice.</b> Nothing here tells you to start, stop or change any treatment. Several ideas covered here (thyroid hormone dosing, stopping medication, high-dose minerals, fasting, light devices) can cause harm without supervision. The accounts summarized sell courses, supplements or coaching. Neither this site nor its authors are affiliated with any of them.</div>
      <div class="stats"><div class="stat"><b>${n}</b>claims</div><div class="stat"><b>${D.accounts.length}</b>accounts / sources</div><div class="stat"><b>${D.topics.length}</b>topics</div>
        ${byStrength.map(([s,k])=>`<div class="stat"><b>${k}</b>${pill(s)}</div>`).join('')}</div>
      <h2>Accounts</h2><div class="grid">${D.accounts.map(a=>`<div class="card"><a class="title" href="${ROOT}/accounts/${a.id}.html">${esc(a.name)}</a>
        <div class="meta">${esc(a.handle)} · ${D.claims.filter(c=>c.account===a.id).length} claims</div><p style="margin:8px 0 0;font-size:14.5px">${esc(a.bio.split('. ')[0])}.</p></div>`).join('')}</div>
      <h2>Topics</h2><div class="grid">${D.topics.map(t=>`<div class="card"><a class="title" href="${ROOT}/topics/${t.id}.html">${esc(t.name)}</a>
        <div class="meta">${D.claims.filter(c=>c.topic===t.id||(c.secondary_topics||[]).includes(t.id)).length} claims (incl. cross-listed)</div><p style="margin:8px 0 0;font-size:14.5px">${esc(t.blurb)}</p></div>`).join('')}</div>
      <h2>How this was built</h2>
      <div class="box"><ul style="margin:0;padding-left:18px">
        <li><b>Public sources only.</b> X was not logged in, so only a few posts were visible there directly. Most material comes from the accounts' own websites, Substacks, podcast pages and public thread archives (Thread Reader App, Rattibha). Individual X posts were checked through X's public embed endpoint.</li>
        <li><b>Our own words.</b> Every claim is paraphrased. Short quotes (under 25 words) are marked and attributed. Whole threads, articles and images are not republished.</li>
        <li><b>Evidence notes</b> cite PubMed-indexed studies and reviews whose IDs were checked against PubMed. Where we couldn't find a good source, the note says so.</li>
        <li><b>Limits.</b> This is a sample of each account's ideas, not a complete archive. Accounts change their views, so check the original posts.</li></ul></div>
      ${strengthLegend(D)}
      <p><a href="${ROOT}/claims.html"><b>→ Open the searchable claims index</b></a></p>`;
  }

  function account(D){
    const a=acc(D,ID), cs=D.claims.filter(c=>c.account===ID);
    document.title=a.name+' – Pro-Metabolic Research Commons';
    const byTopic=D.topics.map(t=>[t,cs.filter(c=>c.topic===t.id)]).filter(x=>x[1].length);
    $('#content').innerHTML=`<h1>${esc(a.name)}</h1>
      <p class="lede">${esc(a.person||'')} · ${a.x_url?`<a href="${esc(a.x_url)}" target="_blank" rel="noopener">${esc(a.handle)}</a>`:esc(a.handle)}${a.followers_note?' · '+esc(a.followers_note):''}</p>
      <div class="box"><h3>Who they are</h3><p style="margin:0">${esc(a.bio)}</p></div>
      ${a.verification?`<div class="box"><h3>How we identified this account</h3><p style="margin:0">${esc(a.verification)}</p></div>`:''}
      <div class="box"><h3>Why they're on this site</h3><p style="margin:0">${esc(a.circle_note||'')}</p></div>
      ${a.commercial_note?`<div class="box warn"><h3>Commercial interests</h3><p style="margin:0">${esc(a.commercial_note)}</p></div>`:''}
      <div class="box"><h3>Links</h3><ul class="links" style="margin:0;padding-left:18px">${a.links.map(l=>`<li><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a></li>`).join('')}</ul></div>
      <div class="box"><h3>What we could and couldn't see</h3><p style="margin:0">${esc(a.limits||'')}</p></div>
      <h2>Key ideas (${cs.length})</h2>
      ${byTopic.map(([t,list])=>`<h3 style="margin-top:22px"><a href="${ROOT}/topics/${t.id}.html">${esc(t.name)}</a></h3>${list.map(c=>claimCard(D,c,{showAccount:false})).join('')}`).join('')}
      ${strengthLegend(D)}`;
  }

  function topic(D){
    const t=top(D,ID), cs=D.claims.filter(c=>c.topic===ID||(c.secondary_topics||[]).includes(ID));
    document.title=t.name+' – Pro-Metabolic Research Commons';
    const accs=D.accounts.filter(a=>cs.some(c=>c.account===a.id));
    $('#content').innerHTML=`<h1>${esc(t.name)}</h1><p class="lede">${esc(t.blurb)}</p>
      <div class="box"><h3>Who talks about this</h3>${accs.map(a=>`<a class="tag" href="#acc-${a.id}">${esc(a.name)} (${cs.filter(c=>c.account===a.id).length})</a>`).join('')}
      <p class="src" style="margin:8px 0 0">Claims are grouped by account so you can compare positions. Some appear on more than one topic page.</p></div>
      ${accs.map(a=>`<h2 id="acc-${a.id}"><a href="${ROOT}/accounts/${a.id}.html">${esc(a.name)}</a> <span class="count">${esc(a.handle)}</span></h2>
        ${cs.filter(c=>c.account===a.id).map(c=>claimCard(D,c,{showAccount:false})).join('')}`).join('')}
      ${strengthLegend(D)}`;
  }

  function claims(D){
    const opts=(arr,f)=>arr.map(x=>`<option value="${esc(x[0])}">${esc(x[1])}</option>`).join('');
    $('#content').innerHTML=`<h1>Claims index</h1>
      <p class="lede">Every claim on the site in one table. Type to search, use the filters, and click a column header to sort.</p>
      <div class="controls"><input id="q" type="search" placeholder="Search claims, evidence notes, sources… (e.g. magnesium, TSH, seed oil)" aria-label="Search">
        <select id="fa" aria-label="Account"><option value="">All accounts</option>${opts(D.accounts.map(a=>[a.id,a.name]))}</select>
        <select id="ft" aria-label="Topic"><option value="">All topics</option>${opts(D.topics.map(t=>[t.id,t.name]))}</select>
        <select id="fs" aria-label="Evidence"><option value="">Any evidence strength</option>${opts(D.meta.strength_scale.map(s=>[s,s]))}</select></div>
      <div class="count" id="cnt"></div>
      <div class="table-wrap"><table><thead><tr>
        <th data-k="claim">Claim</th><th data-k="account">Account</th><th data-k="topic">Topic</th><th data-k="source">Source</th><th data-k="evidence">Evidence note</th><th data-k="strength">Strength</th></tr></thead><tbody id="tb"></tbody></table></div>
      ${strengthLegend(D)}`;
    const order=D.meta.strength_scale; let sortK=null, dir=1;
    const p=new URLSearchParams(location.search); ['q','fa','ft','fs'].forEach(k=>{if(p.get(k))$('#'+k).value=p.get(k)});
    function render(){
      const q=$('#q').value.toLowerCase().trim(), fa=$('#fa').value, ft=$('#ft').value, fs=$('#fs').value;
      let rows=D.claims.filter(c=>(!fa||c.account===fa)&&(!ft||c.topic===ft||(c.secondary_topics||[]).includes(ft))&&(!fs||c.evidence_strength===fs)
        &&(!q||[c.claim,c.quote,c.evidence_note,c.source_label,acc(D,c.account).name,acc(D,c.account).handle,top(D,c.topic).name,...(c.evidence_refs||[]).map(r=>r.label)].join(' ').toLowerCase().includes(q)));
      if(sortK){const v=c=>({claim:c.claim,account:acc(D,c.account).name,topic:top(D,c.topic).name,source:c.source_label,evidence:c.evidence_note,strength:order.indexOf(c.evidence_strength)})[sortK];
        rows=rows.slice().sort((a,b)=>{const x=v(a),y=v(b);return (x>y?1:x<y?-1:0)*dir});}
      $('#cnt').textContent=`${rows.length} of ${D.claims.length} claims`;
      $('#tb').innerHTML=rows.map(c=>{const a=acc(D,c.account);return `<tr>
        <td class="claimcell" data-label="Claim">${esc(c.claim)}${c.quote?`<div class="src"><i>${esc(c.quote)}</i></div>`:''}</td>
        <td data-label="Account"><a href="accounts/${a.id}.html">${esc(a.name)}</a><div class="src">${esc(a.handle)}</div></td>
        <td data-label="Topic"><a href="topics/${c.topic}.html">${esc(top(D,c.topic).name)}</a></td>
        <td data-label="Source"><a href="${esc(c.source_url)}" target="_blank" rel="noopener">${esc(c.source_label)}</a>${c.date?`<div class="src">${esc(c.date)}</div>`:''}</td>
        <td class="evcell" data-label="Evidence note">${esc(c.evidence_note)}${(c.evidence_refs||[]).map(r=>`<div class="src">· <a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.label)}</a></div>`).join('')}</td>
        <td data-label="Strength">${pill(c.evidence_strength)}</td></tr>`}).join('');
    }
    ['q','fa','ft','fs'].forEach(k=>$('#'+k).addEventListener('input',render));
    document.querySelectorAll('th[data-k]').forEach(th=>th.addEventListener('click',()=>{const k=th.dataset.k;dir=(sortK===k)?-dir:1;sortK=k;render();}));
    render();
  }

  load().then(D=>{chrome(D);({home,account,topic,claims}[PAGE]||home)(D);})
    .catch(e=>{document.getElementById('content').innerHTML='<p>Could not load data/claims.json: '+esc(e.message)+'</p>';});
})();
