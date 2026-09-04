import { PROJECT_DATA } from './data/project-data.js';
import { ART_DATA } from './data/art-data.js';

const app = document.querySelector('#app');
const searchPanel = document.querySelector('#searchPanel');
const globalSearch = document.querySelector('#globalSearch');
const searchResults = document.querySelector('#searchResults');
const searchToggle = document.querySelector('#searchToggle');
const searchClose = document.querySelector('#searchClose');
const spotlight = document.querySelector('#spotlight');

const groupOrder = ['game','world','slice'];
const groupNames = { game:'Game Design', world:'World & Lore', slice:'Vertical Slice' };
const groupEyebrow = { game:'SYSTEM DOSSIER', world:'WORLD ARCHIVE', slice:'SLICE PRODUCTION' };

const esc = (value='') => String(value)
  .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
  .replaceAll('"','&quot;').replaceAll("'",'&#039;');
const slug = (value='') => String(value).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
const artById = Object.fromEntries(ART_DATA.items.map(item => [item.id,item]));
const docsById = Object.fromEntries(PROJECT_DATA.documents.map(doc => [doc.id,doc]));

function navigate(hash){ location.hash = hash; }
function routeParts(){ return location.hash.replace(/^#/,'').split('/').filter(Boolean); }
function setTitle(label){ document.title = `${label} · Symphony of Justice`; }
function scrollTop(){ window.scrollTo({top:0,behavior:'auto'}); }

function findArtByName(name){
  const n = name.toLowerCase();
  return ART_DATA.items.find(x => !x.concept && x.name.toLowerCase() === n);
}
function artPath(name, fallback=''){
  const item=findArtByName(name);
  return item?.path || fallback;
}

function pills(items){ return `<div class="doc-meta">${items.filter(Boolean).map(x=>`<span class="pill">${esc(x)}</span>`).join('')}</div>`; }

function homePage(){
  setTitle('Project Archive');
  const {project}=PROJECT_DATA;
  const stats = [
    [PROJECT_DATA.documents.filter(d=>d.group==='game').length,'Game Design dossiers'],
    [PROJECT_DATA.documents.filter(d=>d.group==='world').length,'World & Lore dossiers'],
    [PROJECT_DATA.documents.filter(d=>d.group==='slice').length,'Vertical Slice dossiers'],
    [ART_DATA.counts.total,'Visual assets indexed'],
  ];
  return `
  <section class="hero fade-in">
    <div class="hero__image" aria-hidden="true"></div>
    <div class="hero__answers" aria-hidden="true"><span>JUDGMENT</span><span>FORGIVENESS</span><span>REVENGE</span><span>WISDOM</span></div>
    <div class="hero__content">
      <div class="eyebrow">${esc(project.status)} · ${esc(project.engine)}</div>
      <h1 class="display">Symphony<br><em>of</em> Justice</h1>
      <p class="hero__sub">${esc(project.highConcept)}</p>
      <div class="hero__meta">
        <span class="pill">${esc(project.genre)}</span><span class="pill">Initial platform · ${esc(project.initialPlatform)}</span><span class="pill">Codename · ${esc(project.codename)}</span>
      </div>
      <div class="button-row"><a class="button primary" href="#archive">Enter the archive</a><a class="button" href="#systems">Open systems lab</a></div>
    </div>
    <div class="scroll-cue">SCROLL TO DECLASSIFY</div>
  </section>

  <section class="page fade-in">
    <div class="stats-grid">${stats.map(([n,l])=>`<div class="stat"><b>${esc(n)}</b><span>${esc(l)}</span></div>`).join('')}</div>
    <div class="rule"></div>
    <div class="section-head"><div><div class="eyebrow">DESIGN CONSTITUTION</div><h2 class="section-title">Four pillars keep the project honest.</h2><p class="section-copy">Every mechanic, character, region and commercial system is expected to justify itself against these principles instead of growing into feature fog.</p></div><span class="kicker">Game Vision · 01</span></div>
    <div class="grid-4">${project.pillars.map((p,i)=>`<article class="card pillar-card"><span class="index">PILLAR 0${i+1}</span><div><h3>${esc(p.name)}</h3><p>${esc(p.short)}</p></div></article>`).join('')}</div>
  </section>

  <section class="page">
    <div class="section-head"><div><div class="eyebrow">THE FOUR ANSWERS</div><h2 class="section-title">Justice fractured into cultures.</h2><p class="section-copy">The setting is not built around a single moral axis. Its major powers inherit different answers to the same impossible question.</p></div><a class="button" href="#world">Open world archive</a></div>
    <div class="grid-4">${project.answers.map(a=>`<article class="card answer-card" data-ideal="${esc(a.ideal)}"><span class="ideal">${esc(a.ideal)}</span><h3>${esc(a.nation)}</h3><p>${esc(a.tone)}</p><q>${esc(a.question)}</q></article>`).join('')}</div>
  </section>

  <section class="page">
    <div class="section-head"><div><div class="eyebrow">CORE LOOP</div><h2 class="section-title">The loop always returns to curiosity.</h2><p class="section-copy">Exploration earns both resources and understanding. Progress prepares the player to enter the world again with new possibilities.</p></div><a class="button" href="#archive/game-02-core-gameplay-loop">Read dossier</a></div>
    <div class="loop-track">${project.coreLoop.map((step,i)=>`<div class="loop-step"><span>0${i+1}</span><b>${esc(step)}</b></div>`).join('')}</div>
  </section>

  <section class="page">
    <div class="feature-panel">
      <div class="feature-panel__media" style="background-image:url('${esc(artPath('Master of birds'))}')"></div>
      <div class="feature-panel__body"><div class="eyebrow">COSMOLOGY · RESTRICTED LAYER</div><h3>The world remembers the divine badly.</h3><p>Will, the Master of Birds, the Deities of Judgment and Purgatory sit beneath the political world as layered truth. The archive preserves public, disputed, secret, lost and restricted knowledge instead of flattening everything into one omniscient encyclopedia.</p><div class="button-row"><a class="button primary" href="#archive/world-02-cosmology-origins-and-deities">Read cosmology</a><a class="button" href="#archive/world-03-historical-timeline">Open timeline</a></div></div>
    </div>
  </section>

  <section class="page">
    <div class="section-head"><div><div class="eyebrow">SYSTEMS LAB</div><h2 class="section-title">Mechanics should be felt, not merely described.</h2><p class="section-copy">The archive includes executable design sketches for reaction order, pity state, guarantees and combat synergy. They are documentation tools, not final game code.</p></div><a class="button" href="#systems">Enter lab</a></div>
    <div class="grid-3">
      <a class="card" href="#systems"><span class="index">LIVE MODEL 01</span><h3>Reaction Matrix</h3><p>Apply two elements in order and inspect the resulting control, creation, damage or utility effect.</p></a>
      <a class="card" href="#systems"><span class="index">LIVE MODEL 02</span><h3>Gacha State Machine</h3><p>Walk through hard pity, soft pity, 50/50 loss, guarantee carry-over and the deterministic Vertical Slice demonstration.</p></a>
      <a class="card" href="#systems"><span class="index">LIVE MODEL 03</span><h3>Combat Synergy</h3><p>Follow the documented PREPARE → RISK → PROTECT → SYNERGIZE → EXECUTE logic for a four-character party.</p></a>
    </div>
  </section>

  <section class="page">
    <div class="section-head"><div><div class="eyebrow">VERTICAL SLICE</div><h2 class="section-title">Twenty minutes to prove the promise.</h2><p class="section-copy">The playable slice is deliberately smaller than the full vision. Its job is to teach through play, escalate a local mystery, demonstrate character synergy and end with a truth shift.</p></div><span class="kicker">TARGET · ${esc(project.verticalSlice.duration)}</span></div>
    <div class="slice-beats">${project.verticalSlice.beats.map((b,i)=>`<div class="slice-beat"><span>BEAT ${String(i+1).padStart(2,'0')}</span><b>${esc(b)}</b></div>`).join('')}</div>
    <div class="button-row"><a class="button primary" href="#slice">Explore the slice</a><a class="button" href="#archive/slice-02-player-journey-and-demo-flow">Read player journey</a></div>
  </section>

  <section class="page">
    <div class="section-head"><div><div class="eyebrow">ART ARCHIVE</div><h2 class="section-title">Official art and reference material never share the same label.</h2><p class="section-copy">${ART_DATA.counts.official} named project assets are indexed separately from ${ART_DATA.counts.concept} visual references. Reference images remain visibly marked as concept-only material.</p></div><a class="button" href="#gallery">Open gallery</a></div>
    <div class="grid-3">${['Torre del Tarot','Reino de la Mafia','Palacio Justicia Cardinal'].map(name=>{const a=findArtByName(name);return a?`<a href="#gallery" class="card" style="padding:0"><img src="${esc(a.path)}" alt="${esc(a.name)}" loading="lazy" style="aspect-ratio:16/10;object-fit:cover"><div style="padding:18px"><span class="index">OFFICIAL PROJECT ART</span><h3>${esc(a.name)}</h3></div></a>`:''}).join('')}</div>
  </section>`;
}

function archiveSidebar(active=''){
  return `<aside class="archive-nav">${groupOrder.map(group=>`<div class="archive-nav__group"><span>${groupNames[group]}</span>${PROJECT_DATA.documents.filter(d=>d.group===group).map(d=>`<a class="${d.id===active?'active':''}" href="#archive/${esc(d.id)}">${esc(d.number)} · ${esc(d.title)}</a>`).join('')}</div>`).join('')}</aside>`;
}

function archiveIndexPage(){
  setTitle('Dossiers');
  return `<section class="page"><div class="archive-shell">${archiveSidebar()}<div><div class="archive-intro"><div class="eyebrow">MASTER DOSSIER INDEX</div><h1>Every system has a paper trail.</h1><p>The site mirrors the project’s official working documentation rather than reducing it to marketing copy. Each dossier is searchable, version-aware and linked to the interactive or visual layer that helps explain it.</p>${pills([`${PROJECT_DATA.documents.length} dossiers`,'Full source text preserved','Generated from DOCX working files'])}</div>${groupOrder.map(group=>`<section style="margin-bottom:48px"><div class="section-head"><div><div class="eyebrow">${groupNames[group]}</div><h2 class="section-title" style="font-size:42px">${group==='game'?'Playable systems and product design':group==='world'?'History, cultures and layered truth':'The polished proof of the final experience'}</h2></div><span class="kicker">${PROJECT_DATA.documents.filter(d=>d.group===group).length} files</span></div><div class="doc-grid">${PROJECT_DATA.documents.filter(d=>d.group===group).map(docCard).join('')}</div></section>`).join('')}</div></div></section>`;
}

function docCard(doc){
  return `<a class="doc-card" href="#archive/${esc(doc.id)}"><div class="meta-line"><span>${esc(groupEyebrow[doc.group])} · ${esc(doc.number)}</span><span>${esc(doc.meta.version || 'WORKING')}</span></div><h3>${esc(doc.title)}</h3><p>${esc(doc.summary)}</p></a>`;
}

function renderTable(rows){
  return `<div style="overflow:auto"><table class="data-table"><tbody>${rows.map((row,ri)=>`<tr>${row.map(cell=>`<${ri===0?'th':'td'}>${esc(cell)}</${ri===0?'th':'td'}>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function renderDocBlocks(doc){
  let html=''; let listType=null; let sectionCount=0;
  const closeList=()=>{ if(listType){html += listType==='bullet'?'</ul>':'</ol>'; listType=null;} };
  for(const block of doc.blocks){
    if(block.type==='bullet' || block.type==='number'){
      const wanted=block.type;
      if(listType!==wanted){ closeList(); html += wanted==='bullet'?'<ul>':'<ol>'; listType=wanted; }
      html += `<li>${esc(block.text)}</li>`;
      continue;
    }
    closeList();
    if(block.type==='h1' || block.type==='h2' || block.type==='h3'){
      const level=Number(block.type[1]);
      const id=`sec-${sectionCount++}-${slug(block.text).slice(0,70)}`;
      html += `<h${level} id="${esc(id)}" class="doc-section">${esc(block.text)}</h${level}>`;
    } else if(block.type==='title'){
      // Repeated document title inside source; omit from body because page header already exposes it.
    } else if(block.type==='subtitle'){
      html += `<p class="kicker">${esc(block.text)}</p>`;
    } else if(block.type==='callout'){
      html += `<div class="callout">${esc(block.text)}</div>`;
    } else if(block.type==='table'){
      html += renderTable(doc.tables[block.table] || []);
    } else {
      html += `<p>${esc(block.text)}</p>`;
    }
  }
  closeList();
  return html;
}

function archiveDocPage(doc){
  setTitle(doc.title);
  const toc=doc.headings.slice(0,60).map((h,i)=>`<a href="#sec-${i}-${slug(h.text).slice(0,70)}" data-toc>${esc(h.text)}</a>`).join('');
  return `<section class="page"><div class="archive-shell">${archiveSidebar(doc.id)}<div class="doc-layout"><article class="doc-body"><header class="doc-hero"><div class="eyebrow">${groupEyebrow[doc.group]} · ${esc(doc.number)}</div><h1>${esc(doc.title)}</h1><p class="doc-summary">${esc(doc.summary)}</p>${pills([doc.meta.status && `Status · ${doc.meta.status}`,doc.meta.version && `Version · ${doc.meta.version}`,doc.meta.owner && `Owner · ${doc.meta.owner}`,doc.meta.last_updated && `Updated · ${doc.meta.last_updated}`])}<div class="button-row"><a class="button" href="#archive">Back to dossiers</a>${doc.title==='Elements and Reactions'?'<a class="button primary" href="#systems">Open reaction simulator</a>':''}${doc.title==='Gacha System'?'<a class="button primary" href="#systems">Open pity model</a>':''}</div></header><div class="doc-content">${renderDocBlocks(doc)}</div></article><aside class="doc-toc"><span>Inside this dossier</span>${toc}</aside></div></div></div></section>`;
}

function systemsPage(){
  setTitle('Systems Lab');
  const elems=PROJECT_DATA.reactions.elements;
  const options=elems.map(e=>`<option>${esc(e)}</option>`).join('');
  const matrix=PROJECT_DATA.reactions.matrix;
  return `<section class="page">
    <div class="lab-hero"><div><div class="eyebrow">EXECUTABLE DOCUMENTATION</div><h1 class="display" style="font-size:clamp(54px,7vw,104px)">Systems<br><em>Laboratory</em></h1><p class="lede">Design rules become easier to critique when they can answer back. These models expose order, state and consequences without pretending to be final gameplay implementations.</p></div><div class="lab-card"><div class="kicker">IMPORTANT</div><h2>Prototype logic, not shipped balance.</h2><p>Where the source leaves exact commercial rates or implementation values undecided, this site does not invent final numbers. The models demonstrate the documented structure and flag assumptions.</p></div></div>

    <div class="rule"></div>
    <div class="section-head"><div><div class="eyebrow">05 · ELEMENTS & REACTIONS</div><h2 class="section-title">Order changes the answer.</h2><p class="section-copy">Row means first application, column means second. The system is intentionally asymmetric: Fire → Ice is Weakness while Ice → Fire is Melt.</p></div><a class="button" href="#archive/game-05-elements-and-reactions">Read full dossier</a></div>
    <div class="grid-2">
      <div class="lab-card"><div class="selector-row"><select id="firstElement" aria-label="First element">${options}</select><span style="text-align:center;color:var(--faint)">→</span><select id="secondElement" aria-label="Second element">${options}</select></div><div id="reactionResult" class="reaction-result"></div></div>
      <div class="lab-card"><div class="kicker">SPECIAL POWERS</div><h2 style="font-size:30px">Outside the 7×7 matrix</h2>${PROJECT_DATA.reactions.special.map(s=>`<div style="padding:13px 0;border-bottom:1px solid var(--line)"><b style="font-family:var(--serif);font-size:20px">${esc(s.name)}</b><p style="margin:4px 0 0;font-size:12px">${esc(s.rule)}</p></div>`).join('')}</div>
    </div>
    <div class="matrix-wrap" style="margin-top:20px"><table class="reaction-matrix"><thead><tr><th>FIRST ↓ / SECOND →</th>${elems.map(e=>`<th>${esc(e)}</th>`).join('')}</tr></thead><tbody>${elems.map(r=>`<tr><th>${esc(r)}</th>${elems.map(c=>`<td data-matrix="${esc(r)}|${esc(c)}">${r===c?'—':esc(matrix[r]?.[c] || '—')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>

    <div class="rule"></div>
    <div class="section-head"><div><div class="eyebrow">07 · GACHA SYSTEM</div><h2 class="section-title">A state machine with a constitution.</h2><p class="section-copy">The design documents define guarantees, pity carry-over and transparency, but not final commercial pricing or a complete probability curve. This model therefore focuses on state rather than fabricated revenue math.</p></div><a class="button" href="#archive/game-07-gacha-system">Read full dossier</a></div>
    <div class="gacha-console">
      <div class="pity-gauge"><div class="kicker">CHARACTER PROMOTIONAL BANNER</div><div class="gauge-num"><span id="pityValue">0</span><small style="font:12px var(--mono);color:var(--faint)"> / 90</small></div><div class="gauge-track"><div id="pityFill" class="gauge-fill"></div></div><div id="gachaState"></div><div class="button-row"><button class="button primary" id="pullNormal">Record non-5★</button><button class="button" id="lose5050">Lose 50/50</button><button class="button" id="winFeatured">Featured 5★</button><button class="button" id="runSliceDemo">Run slice demo</button><button class="button" id="resetGacha">Reset</button></div></div>
      <div id="gachaLog" class="gacha-log"><div class="kicker">PULL HISTORY · SIMULATION</div><p style="color:#737773;font-size:12px">Use the controls to inspect pity and guarantee transitions. No final base rarity probability is assumed.</p></div>
    </div>

    <div class="rule"></div>
    <div class="section-head"><div><div class="eyebrow">03 · COMBAT SYSTEM</div><h2 class="section-title">Four identities. One deliberate strategy.</h2><p class="section-copy">This sequence is lifted from the combat dossier’s illustrative Guardian encounter. It demonstrates why team construction is supposed to matter more than repeating the strongest attack.</p></div><a class="button" href="#archive/game-03-combat-system">Read full dossier</a></div>
    <div class="combat-sequence">${PROJECT_DATA.combatDemo.sequence.map((s,i)=>`<article class="combat-step"><span class="step-action">0${i+1} · ${esc(s.action)}</span><h4>${esc(s.character)}</h4><p>${esc(s.detail)}</p></article>`).join('')}</div>
    <div class="callout" style="margin-top:12px">PREPARE → RISK → PROTECT → SYNERGIZE → EXECUTE</div>
  </section>`;
}

function bindSystems(){
  const first=document.querySelector('#firstElement'); const second=document.querySelector('#secondElement');
  if(!first || !second) return;
  second.value='Fire';
  const updateReaction=()=>{
    const a=first.value,b=second.value;
    document.querySelectorAll('[data-matrix]').forEach(el=>el.classList.toggle('active',el.dataset.matrix===`${a}|${b}`));
    const result=document.querySelector('#reactionResult');
    if(a===b){ result.innerHTML=`<div class="reaction-type">SAME ELEMENT</div><div class="reaction-name">Aura reinforced</div><p class="reaction-desc">Applying the same standard element does not trigger a reaction. It may refresh or reinforce the existing aura according to implementation rules.</p>`;return; }
    const name=PROJECT_DATA.reactions.matrix[a]?.[b] || 'No reaction';
    const [type,desc]=PROJECT_DATA.reactions.details[name] || ['Unspecified','The source document does not currently define a detailed outcome.'];
    result.innerHTML=`<div class="reaction-type">${esc(type)}</div><div class="reaction-name">${esc(name)}</div><p class="reaction-desc">${esc(desc)}</p><span class="kicker" style="margin-top:10px">${esc(a)} → ${esc(b)}</span>`;
  };
  first.addEventListener('change',updateReaction); second.addEventListener('change',updateReaction); updateReaction();

  let pity=0, guarantee=false, pullNo=0;
  const log=document.querySelector('#gachaLog');
  const state=document.querySelector('#gachaState');
  const updateGacha=()=>{
    document.querySelector('#pityValue').textContent=pity;
    document.querySelector('#pityFill').style.width=`${Math.min(100,pity/90*100)}%`;
    state.innerHTML=`<span class="state-badge">${pity>=70?'Soft pity region':'Before soft pity'}</span><span class="state-badge">${guarantee?'Featured guaranteed':'50 / 50 state'}</span><span class="state-badge">Pity carries across same banner family</span>`;
  };
  const add=(label,kind='normal',note='')=>{ pullNo++; const row=document.createElement('div');row.className='pull-entry';row.innerHTML=`<span>#${String(pullNo).padStart(3,'0')}</span><b class="${kind==='five'?'rare5':''}">${esc(label)}</b><span class="${kind==='featured'?'featured':''}">${esc(note)}</span>`;log.appendChild(row);log.scrollTop=log.scrollHeight; };
  document.querySelector('#pullNormal').addEventListener('click',()=>{ pity=Math.min(89,pity+1);add('Non-5★ result','normal',pity>=70?'SOFT PITY REGION':'');updateGacha(); });
  document.querySelector('#lose5050').addEventListener('click',()=>{ add('5★ · Permanent pool','five','50/50 LOST');pity=0;guarantee=true;updateGacha(); });
  document.querySelector('#winFeatured').addEventListener('click',()=>{ add('5★ · Featured','featured',guarantee?'GUARANTEE USED':'50/50 WON');pity=0;guarantee=false;updateGacha(); });
  document.querySelector('#runSliceDemo').addEventListener('click',()=>{
    const demo=[['4★ character','normal','DEMO PULL 1'],['Duplicate → Legacy Fragment','normal','DEMO PULL 2'],['Featured 5★','featured','DEMO PULL 3']];
    demo.forEach(([a,b,c])=>add(a,b,c)); pity=0; guarantee=false; updateGacha();
  });
  document.querySelector('#resetGacha').addEventListener('click',()=>{ pity=0;guarantee=false;pullNo=0;log.innerHTML='<div class="kicker">PULL HISTORY · SIMULATION</div><p style="color:#737773;font-size:12px">State reset.</p>';updateGacha(); });
  updateGacha();
}

function worldPage(){
  setTitle('World Archive');
  const nationArt={Arcane:'Simbolo Arcano',Archangel:'Simbolo de los Angeles',Mafia:'Simbolo del clan Mafioso',Beast:'Simbolo del clan Bestial'};
  return `<section class="page"><div class="eyebrow">WORLD & LORE</div><h1 class="display" style="font-size:clamp(58px,8vw,112px)">A world built<br><em>through Will.</em></h1><p class="lede">The setting is organized as layered knowledge. What the public believes, what institutions protect, what historians dispute and what was genuinely lost can all coexist without collapsing into one clean answer.</p>${pills(['4 major nations','Neutral territories & organizations','Public · Disputed · Secret · Lost · Restricted'])}
    <div class="rule"></div>
    <div class="section-head"><div><div class="eyebrow">GEOPOLITICAL CORE</div><h2 class="section-title">Four societies inherit four answers.</h2></div><a class="button" href="#archive/world-01-world-overview">Read overview</a></div>
    <div class="nation-grid">${PROJECT_DATA.project.answers.map(a=>{const img=findArtByName(nationArt[a.nation]);return `<article class="nation-panel">${img?`<img src="${esc(img.path)}" alt="${esc(img.name)}" loading="lazy">`:''}<div class="nation-panel__body"><div class="eyebrow">${esc(a.ideal)}</div><h3>${esc(a.nation)}</h3><q>${esc(a.question)}</q><p>${esc(a.tone)}</p><a class="button" style="margin-top:16px" href="#archive/world-04-nations-and-territories">Territory dossier</a></div></article>`}).join('')}</div>
    <div class="rule"></div>
    <div class="section-head"><div><div class="eyebrow">HISTORICAL LAYERS</div><h2 class="section-title">The chronology is a spine, not a spoiler dump.</h2><p class="section-copy">The master timeline keeps confirmed order while allowing uncertainty around distance, knowledge and interpretation.</p></div><a class="button" href="#archive/world-03-historical-timeline">Full timeline dossier</a></div>
    <div class="timeline">${PROJECT_DATA.timeline.map(t=>`<article class="timeline-item"><div class="timeline-era">${esc(t.era)}</div><div><h3>${esc(t.name)}</h3><p>${esc(t.note)}</p></div></article>`).join('')}</div>
    <div class="rule"></div>
    <div class="feature-panel"><div class="feature-panel__media" style="background-image:url('${esc(artPath('El ministerio de los susurros'))}')"></div><div class="feature-panel__body"><div class="eyebrow">NEUTRAL POWER · MORTAL CONSTRUCTION</div><h3>Ministry of Whispers</h3><p>Unlike the divine cosmology, the Ministry is explicitly framed as a mortal creation. That distinction lets institutions become as dangerous, contradictory and narratively important as gods.</p><div class="button-row"><a class="button primary" href="#archive/world-05-factions-and-organizations">Factions dossier</a><a class="button" href="#gallery">See locations</a></div></div></div>
  </section>`;
}

function slicePage(){
  setTitle('Vertical Slice');
  const beats=PROJECT_DATA.project.verticalSlice.beats;
  return `<section class="page"><div class="eyebrow">PRODUCTION PROOF</div><h1 class="display" style="font-size:clamp(58px,8vw,112px)">The Vertical<br><em>Slice.</em></h1><p class="lede">A small, polished experience that proves the final game’s identity without pretending to reproduce the full product. The reviewer should understand it without prior lore knowledge or a developer standing beside them.</p>${pills(['Target · 20–30 minutes','9 player beats','Local mystery · larger implication'])}
    <div class="rule"></div>
    <div class="section-head"><div><div class="eyebrow">PLAYER JOURNEY</div><h2 class="section-title">Curiosity → discovery → suspicion → confrontation.</h2><p class="section-copy">Mechanics are introduced through the environment and encounter sequence rather than a wall of tutorial pop-ups.</p></div><a class="button" href="#archive/slice-02-player-journey-and-demo-flow">Player Journey dossier</a></div>
    <div class="slice-beats">${beats.map((b,i)=>`<div class="slice-beat"><span>BEAT ${String(i+1).padStart(2,'0')}</span><b>${esc(b)}</b></div>`).join('')}</div>
    <div class="rule"></div>
    <div class="section-head"><div><div class="eyebrow">SCOPE CONTROL</div><h2 class="section-title">Polish wins against accumulation.</h2><p class="section-copy">Every feature must demonstrate a pillar, gameplay promise or presentation need. Otherwise it is justified, reduced, deferred or cut.</p></div><a class="button" href="#archive/slice-03-feature-and-content-matrix">Feature matrix dossier</a></div>
    <div class="scope-legend"><div class="scope-chip"><b>MUST</b><p>Required to represent the project.</p></div><div class="scope-chip"><b>SHOULD</b><p>Strongly improves the slice but can be simplified.</p></div><div class="scope-chip"><b>COULD</b><p>Only after MUST items are stable and polished.</p></div><div class="scope-chip"><b>CUT / OUT</b><p>Belongs to the full product, not this proof.</p></div></div>
    <div class="rule"></div>
    <div class="grid-2"><article class="card"><span class="index">NARRATIVE RULE</span><h3>The first version of a story rarely contains the whole truth.</h3><p>The slice begins with a plausible local explanation, then environmental evidence shows that someone was there before and deliberately altered the ruin.</p><div class="button-row"><a class="button" href="#archive/slice-05-narrative-beats-and-script-plan">Narrative plan</a></div></article><article class="card"><span class="index">OUT OF SCOPE</span><h3>No real-money infrastructure needed.</h3><p>The slice may demonstrate a simulated Gacha flow, but it does not need real payments, final prices, commercial LiveOps or a full production economy.</p><div class="button-row"><a class="button" href="#systems">See simulated Gacha</a></div></article></div>
    <div class="rule"></div>
    <div class="feature-panel"><div class="feature-panel__media" style="background-image:url('${esc(artPath('Niels DarkMoon'))}')"></div><div class="feature-panel__body"><div class="eyebrow">PROPOSED STORY USE</div><h3>A clue, a vision, a question.</h3><p>If Niels is used, the demo only needs to establish that visions related to Kanao are pulling him toward answers. Project Osiris, the deeper nature of those visions and the full cosmology remain deliberately outside the opening explanation.</p><div class="button-row"><a class="button primary" href="#archive/slice-05-narrative-beats-and-script-plan">Read script plan</a><a class="button" href="#gallery">Character archive</a></div></div></div>
  </section>`;
}

let galleryState={filter:'official',shown:48};
function galleryPage(){
  setTitle('Art Archive');
  galleryState={filter:'official',shown:48};
  return `<section class="page"><div class="eyebrow">VISUAL ARCHIVE</div><h1 class="display" style="font-size:clamp(58px,8vw,112px)">Art, evidence<br><em>& references.</em></h1><p class="lede">Named project assets and third-party concept references are intentionally separated. A reference can explain intention, but it cannot quietly become production art by losing its label.</p>${pills([`${ART_DATA.counts.official} official / named assets`,`${ART_DATA.counts.concept} concept references`,`${ART_DATA.counts.total} total indexed images`])}
  <div class="reference-note" style="margin-top:22px"><strong>Reference policy.</strong> Images identified as concept/reference material are displayed only to communicate visual direction. They are visibly stamped and should be replaced by owned or properly licensed production assets before a public commercial release.</div>
  <div class="gallery-toolbar" id="galleryToolbar"><button class="filter-button active" data-filter="official">Official / named</button><button class="filter-button" data-filter="characters">Characters</button><button class="filter-button" data-filter="enemies">Enemies</button><button class="filter-button" data-filter="locations">Locations</button><button class="filter-button" data-filter="concept">Concept references</button><button class="filter-button" data-filter="all">All</button></div><div id="galleryGrid" class="art-grid"></div><div class="load-more"><button class="button" id="loadMoreArt">Load more</button></div></section>`;
}

function filteredArt(){
  const f=galleryState.filter;
  if(f==='official') return ART_DATA.items.filter(x=>!x.concept);
  if(f==='concept') return ART_DATA.items.filter(x=>x.concept);
  if(['characters','enemies','locations'].includes(f)) return ART_DATA.items.filter(x=>x.category===f && !x.concept);
  return ART_DATA.items;
}
function renderGalleryGrid(){
  const grid=document.querySelector('#galleryGrid'); if(!grid)return;
  const items=filteredArt().slice(0,galleryState.shown);
  grid.innerHTML=items.map(item=>`<figure class="art-card">${item.concept?'<div class="reference-stamp">Concept · reference only</div>':''}<img src="${esc(item.path)}" alt="${esc(item.name)}" loading="lazy"><figcaption class="art-card__meta"><b>${esc(item.name)}</b><span>${esc(item.group)}${item.concept?' · third-party reference':''}</span></figcaption></figure>`).join('');
  const more=document.querySelector('#loadMoreArt'); if(more) more.style.display=galleryState.shown>=filteredArt().length?'none':'inline-flex';
}
function bindGallery(){
  if(!document.querySelector('#galleryGrid'))return;
  renderGalleryGrid();
  document.querySelector('#galleryToolbar').addEventListener('click',e=>{const btn=e.target.closest('[data-filter]');if(!btn)return;galleryState.filter=btn.dataset.filter;galleryState.shown=48;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===btn));renderGalleryGrid();});
  document.querySelector('#loadMoreArt').addEventListener('click',()=>{galleryState.shown+=48;renderGalleryGrid();});
}

function notFound(){ setTitle('Archive Error'); return `<section class="page narrow"><div class="eyebrow">ARCHIVE CORRUPTION</div><h1 class="display" style="font-size:72px">Record<br><em>not found.</em></h1><p class="lede">This route points to a dossier that is not indexed in the current build.</p><div class="button-row"><a class="button primary" href="#home">Return home</a><a class="button" href="#archive">Open dossier index</a></div></section>`; }

function render(){
  const [route='home',id]=routeParts();
  let html=''; let binder=()=>{};
  if(route==='home') html=homePage();
  else if(route==='archive' && !id) html=archiveIndexPage();
  else if(route==='archive' && id && docsById[id]) html=archiveDocPage(docsById[id]);
  else if(route==='systems'){html=systemsPage();binder=bindSystems;}
  else if(route==='world') html=worldPage();
  else if(route==='slice') html=slicePage();
  else if(route==='gallery'){html=galleryPage();binder=bindGallery;}
  else html=notFound();
  app.innerHTML=html; binder(); scrollTop();
}

function search(query){
  const q=query.trim().toLowerCase(); if(q.length<2){searchResults.innerHTML='';return;}
  const tokens=q.split(/\s+/).filter(Boolean);
  const scored=[];
  for(const doc of PROJECT_DATA.documents){
    const title=doc.title.toLowerCase();
    const hay=(doc.title+' '+doc.summary+' '+doc.blocks.map(b=>b.text||'').join(' ')).toLowerCase();
    if(tokens.every(t=>hay.includes(t))){
      const score=(tokens.some(t=>title.includes(t))?4:0)+(tokens.filter(t=>doc.summary.toLowerCase().includes(t)).length*2);
      const sample=doc.blocks.find(b=>b.text && tokens.some(t=>b.text.toLowerCase().includes(t)))?.text || doc.summary;
      scored.push({kind:'doc',score,title:doc.title,group:doc.groupLabel,sample,id:doc.id});
    }
  }
  for(const item of ART_DATA.items.filter(x=>!x.concept)){
    const hay=(item.name+' '+item.group+' '+item.category).toLowerCase();
    if(tokens.every(t=>hay.includes(t))) scored.push({kind:'art',score:2,title:item.name,group:item.group,sample:'Named visual asset in the art archive.',id:item.id});
  }
  scored.sort((a,b)=>b.score-a.score);
  searchResults.innerHTML=scored.slice(0,24).map(r=>`<div class="search-result" data-kind="${r.kind}" data-id="${esc(r.id)}"><small>${esc(r.group)}</small><div><b>${esc(r.title)}</b><br><span>${esc(r.sample.slice(0,170))}${r.sample.length>170?'…':''}</span></div></div>`).join('') || '<p style="color:#757874">No indexed record matched that query.</p>';
}
function openSearch(){searchPanel.hidden=false;document.body.style.overflow='hidden';setTimeout(()=>globalSearch.focus(),30)}
function closeSearch(){searchPanel.hidden=true;document.body.style.overflow='';globalSearch.value='';searchResults.innerHTML=''}
searchToggle.addEventListener('click',openSearch); searchClose.addEventListener('click',closeSearch);
globalSearch.addEventListener('input',()=>search(globalSearch.value));
searchResults.addEventListener('click',e=>{const row=e.target.closest('.search-result');if(!row)return;closeSearch();navigate(row.dataset.kind==='doc'?`archive/${row.dataset.id}`:'gallery');});
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!searchPanel.hidden)closeSearch();if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch();}});
window.addEventListener('hashchange',render);
window.addEventListener('mousemove',e=>{if(!spotlight)return;spotlight.style.left=e.clientX+'px';spotlight.style.top=e.clientY+'px';},{passive:true});

document.addEventListener('click',e=>{
  const a=e.target.closest('a[data-toc]');
  if(a){e.preventDefault();const target=document.querySelector(a.getAttribute('href'));target?.scrollIntoView({behavior:'smooth',block:'start'});}
});

if(!location.hash) location.hash='home'; else render();
