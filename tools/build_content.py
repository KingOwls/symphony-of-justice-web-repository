from pathlib import Path
from docx import Document
from docx.document import Document as _Document
from docx.table import Table, _Cell
from docx.text.paragraph import Paragraph
from docx.oxml.text.paragraph import CT_P
from docx.oxml.table import CT_Tbl
import json, re, unicodedata

ROOT = Path(__file__).resolve().parents[1]
SOURCES = ROOT / 'sources'
OUT = ROOT / 'src' / 'data' / 'project-data.js'

GROUPS = {
    'Game Design': {'key':'game','label':'Game Design','accent':'amber'},
    'World and Lore': {'key':'world','label':'World & Lore','accent':'cyan'},
    'Vertical Slice': {'key':'slice','label':'Vertical Slice','accent':'crimson'},
}

SUMMARIES = {
'Game Vision':'Defines the project identity, genre, platforms, Unreal Engine 5 direction, player fantasy, design pillars, differentiators, audience and production boundaries.',
'Core Gameplay Loop':'Maps the explore-discover-prepare-fight-earn-improve cycle across sessions, long-term progression and rewards.',
'Combat System':'Specifies the real-time third-person combat model, four-character party, swapping, actions, resources, targeting, statuses, readability and encounter logic.',
'Character Gameplay System':'Defines how element, profession, role, weapon, statistics, abilities, talents and relationships combine into a distinct playable identity.',
'Elements and Reactions':'Defines the seven standard elements, special powers, aura rules and the asymmetric reaction matrix that can alter enemies, terrain and positioning.',
'Progression System':'Organizes account, character, equipment, skill, profession, mastery and regional progression while protecting accessibility and experimentation.',
'Gacha System':'Defines acquisition purpose, rarities, banners, pity, guarantees, duplicates, free acquisition and transparency without making random pulls mandatory for core content.',
'Economy and Resources':'Maps currencies, sources, sinks, materials and economic guardrails so progression remains understandable and sustainable.',
'Exploration System':'Defines exploration fantasy, regional identity, traversal, discoveries, points of interest, rewards and how world knowledge feeds progression.',
'Missions and Activities':'Structures story missions, side content, character activities, recurring activities, objectives and rewards.',
'Dungeons and Bosses':'Defines dungeon roles, encounter structure, boss identity, readability, progression value and replayable challenge.',
'Equipment and Items':'Defines weapons, equipment, consumables, rarity, acquisition, progression and inventory rules.',
'Social and Multiplayer':'Frames cooperative and social systems, communication, boundaries and the conditions under which online features support rather than replace the RPG.',
'Endgame and Live Content':'Defines post-story goals, recurring challenges, content cadence and live-service boundaries for long-term play.',
'Rewards and Retention':'Defines reward philosophy, cadence, motivation, return loops and safeguards against manipulative retention design.',
'Difficulty and Balance':'Defines difficulty goals, encounter scaling, accessibility, telemetry, power creep controls and balance methodology.',
'World and Lore Index':'Acts as the master index for canon, disputed, proposed, secret and production-sensitive worldbuilding material.',
'World Overview':'Introduces the world premise, the four major nations, neutral powers, geopolitical relationships and the unstable peace of the current era.',
'Cosmology Origins and Deities':'Explains Will, the Master of Birds, the four Deities of Judgment and the cosmological roots behind Judgment, Forgiveness, Revenge and Wisdom.',
'Historical Timeline':'Organizes the history from origin through the current era, preserving public, disputed, secret, lost and restricted layers of knowledge.',
'Nations and Territories':'Details the identities, governments, cultures, symbols, geography, cities and contradictions of the major nations and territories.',
'Factions and Organizations':'Profiles institutions, clans and organizations by structure, ideology, relationships, narrative role and control of information.',
'Cultures Politics and Justice':'Explores daily life, legitimacy, justice systems, political currents, material culture and contradictions within each society.',
'Locations Landmarks and Dungeons':'Catalogues locations by production priority and connects visual identity, narrative purpose and gameplay relevance.',
'Creatures Ecology and Threats':'Defines creature taxonomy, origin, ecology, sapience, social relationships and the difference between fauna, peoples and enemies.',
'Vertical Slice Index':'Central index for the playable proof of concept and its production documentation.',
'Vertical Slice Vision and Scope':'Defines what the polished slice must prove and which full-product systems are intentionally out of scope.',
'Player Journey and Demo Flow':'Maps a 20–30 minute reviewer journey through nine beats, teaching mechanics through play while escalating curiosity into confrontation.',
'Feature and Content Matrix':'Controls scope by ranking every slice feature as MUST, SHOULD, COULD or CUT and tying it to pillars, dependencies and evidence.',
'Playable Content and Encounter Brief':'Defines the proposed playable cast, region, encounters, teaching roles and combat proof points for the slice.',
'Narrative Beats and Script Plan':'Structures the slice mystery around incomplete explanations, environmental clues, character perspectives and a truth shift without overexposing the wider lore.',
}


def slugify(value):
    value = unicodedata.normalize('NFKD', value).encode('ascii','ignore').decode('ascii')
    value = re.sub(r'[^a-zA-Z0-9]+','-',value).strip('-').lower()
    return value or 'item'


def iter_block_items(parent):
    if isinstance(parent, _Document):
        parent_elm = parent.element.body
    elif isinstance(parent, _Cell):
        parent_elm = parent._tc
    else:
        raise ValueError('Unsupported parent')
    for child in parent_elm.iterchildren():
        if isinstance(child, CT_P):
            yield Paragraph(child, parent)
        elif isinstance(child, CT_Tbl):
            yield Table(child, parent)


def clean_title(path):
    stem = path.stem
    stem = re.sub(r'^\d+\s*-\s*','',stem)
    return stem


def normalize_style(style):
    s=(style or '').strip().lower()
    if 'heading 1' in s or s == 'título 1': return 'h1'
    if 'heading 2' in s or s == 'título 2': return 'h2'
    if 'heading 3' in s or s == 'título 3': return 'h3'
    if 'title' == s or s == 'título': return 'title'
    if 'subtitle' in s or 'document subtitle' in s: return 'subtitle'
    if 'list bullet' in s: return 'bullet'
    if 'list number' in s: return 'number'
    if 'callout' in s: return 'callout'
    return 'p'


def parse_doc(path):
    doc=Document(path)
    blocks=[]
    tables=[]
    headings=[]
    for item in iter_block_items(doc):
        if isinstance(item, Paragraph):
            text=item.text.strip()
            if not text: continue
            typ=normalize_style(item.style.name if item.style else '')
            blocks.append({'type':typ,'text':text})
            if typ in ('h1','h2','h3'):
                headings.append({'level':int(typ[-1]),'text':text})
        else:
            rows=[]
            for row in item.rows:
                rows.append([cell.text.strip().replace('\n',' | ') for cell in row.cells])
            if rows:
                tid=len(tables)
                tables.append(rows)
                blocks.append({'type':'table','table':tid})
    meta={}
    for table in tables[:3]:
        for row in table:
            for i in range(0,len(row)-1,2):
                k=row[i].strip().lower()
                v=row[i+1].strip()
                if k in ('status','version','owner','last updated','last updated:','folder','public exposure'):
                    meta[k.replace(' ','_').replace(':','')]=v
    title=clean_title(path)
    num_match=re.match(r'^(\d+)\s*-\s*',path.stem)
    number=num_match.group(1) if num_match else ''
    group=path.parent.name
    key=GROUPS[group]['key']
    doc_id=f"{key}-{number or 'x'}-{slugify(title)}"
    return {
        'id':doc_id,
        'group':key,
        'groupLabel':GROUPS[group]['label'],
        'number':number,
        'title':title,
        'summary':SUMMARIES.get(title,'Project design dossier derived from the official working documentation.'),
        'sourceFile':str(path.relative_to(SOURCES)).replace('\\','/'),
        'meta':meta,
        'headings':headings,
        'blocks':blocks,
        'tables':tables,
    }


docs=[]
for folder in GROUPS:
    for path in sorted((SOURCES/folder).glob('*.docx')):
        docs.append(parse_doc(path))

# curated project-level data grounded in the source documents
project = {
    'title':'Symphony of Justice',
    'codename':'Symphonia Iustitiae',
    'status':'Advanced pre-production',
    'engine':'Unreal Engine 5',
    'initialPlatform':'PC',
    'genre':'Story-driven real-time Action RPG',
    'highConcept':'A story-driven Action RPG set in a fantasy world divided by competing interpretations of justice, where exploration, character identity, elemental strategy and discovery are inseparable.',
    'pillars':[
        {'name':'Characters with Gameplay Identity','short':'Characters differ through mechanics, profession, element, talent and relationships, not only rarity or statistics.'},
        {'name':'Strategy through Synergy and Adaptation','short':'Combat rewards understanding of teams, enemies, statuses, reactions, positioning and trade-offs.'},
        {'name':'Explore to Discover and Progress','short':'Every region should reward both progression and knowledge about the world.'},
        {'name':'A World of Perspectives, Not Simple Answers','short':'Nations and characters embody competing ideas of justice whose contradictions matter.'},
    ],
    'answers':[
        {'nation':'Arcane','ideal':'JUDGMENT','question':'What consequence is deserved?','tone':'Responsibility, evidence, equivalence and inherited authority.'},
        {'nation':'Archangel','ideal':'FORGIVENESS','question':'What can still be redeemed?','tone':'Mercy, intention, memory and the burden of absolution.'},
        {'nation':'Mafia','ideal':'REVENGE','question':'What must be repaid?','tone':'Debt, loyalty, retaliation and survival beneath the surface.'},
        {'nation':'Beast','ideal':'WISDOM','question':'What must be understood first?','tone':'Knowledge, ecology, observation and judgment delayed by inquiry.'},
    ],
    'coreLoop':['Explore','Discover','Prepare','Fight / Overcome','Earn','Improve','Build & Adapt','Unlock'],
    'verticalSlice':{'duration':'20–30 min','beats':['Launch','Arrival','First Steps','First Threat','Discovery','Escalation','Truth Shift','Final Confrontation','Aftermath']},
}

reactions = {
    'elements':['Water','Fire','Ice','Electro','Plant','Wind','Earth'],
    'matrix':{
        'Water':{'Fire':'Scald','Ice':'Freeze','Electro':'Electrified Zone','Plant':'Swamp','Wind':'Hurricane','Earth':'Quicksand'},
        'Fire':{'Water':'Scald','Ice':'Weakness','Electro':'Deionization','Plant':'Crimson Vines','Wind':'Withered Zone','Earth':'Magma'},
        'Ice':{'Water':'Freeze','Fire':'Melt','Electro':'Pure Resistances','Plant':'Frost','Wind':'Speed Reduction','Earth':'Barriers'},
        'Electro':{'Water':'Electrified Zone','Fire':'Deionization','Ice':'Pure Resistances','Plant':'Doton','Wind':'Thunderstorm','Earth':'Null'},
        'Plant':{'Water':'Accelerated Germination','Fire':'Burn','Ice':'Fragility','Electro':'Doton','Wind':'Alchemical Reaction','Earth':'Germination'},
        'Wind':{'Water':'Typhoon','Fire':'Wind Current','Ice':'Speed Reduction','Electro':'Thunderstorm','Plant':'Alchemical Reaction','Earth':'Visual Obstruction'},
        'Earth':{'Water':'Quicksand','Fire':'Magma','Ice':'Barriers','Electro':'Null','Plant':'Germination','Wind':'Visual Obstruction'},
    },
    'details':{
        'Scald':['Damage + short DoT','Water is heated violently, dealing immediate damage and applying a brief scalding effect.'],
        'Freeze':['Control','Temporarily immobilizes normal enemies. Against bosses it contributes to a freeze/stagger meter instead of full immobilization.'],
        'Electrified Zone':['Creation','Creates a conductive zone that deals periodic Electro pulses while active.'],
        'Swamp':['Creation + Control','Creates wet, plant-filled terrain that slows movement and favors certain Plant/Water abilities.'],
        'Hurricane':['Creation + Control','Creates a persistent vortex that pulls enemies and distributes Water.'],
        'Quicksand':['Creation + Control','Creates a zone that reduces mobility and may partially immobilize targets that remain inside too long.'],
        'Weakness':['Debuff','Thermal contrast leaves the target exposed, proposed to increase damage or stagger received.'],
        'Deionization':['Disruption','Violently discharges accumulated elemental energy, dealing damage and potentially interrupting actions.'],
        'Crimson Vines':['Control + DoT','Produces burning roots that restrain targets, deal periodic damage and may spread across vegetation.'],
        'Withered Zone':['Creation','A hot current dries the area, potentially dealing persistent damage, reducing healing and weakening Plant effects.'],
        'Magma':['Creation + Damage','Creates a magma surface that deals high persistent damage.'],
        'Melt':['Immediate Damage','Preparing Ice first and applying Fire afterward creates an explosive damage window.'],
        'Pure Resistances':['Special Utility','Destabilizes conventional elemental defenses, making the target more susceptible to Pure Powers for a short period.'],
        'Frost':['Debuff + DoT','Progressively reduces mobility and deals light periodic Ice damage.'],
        'Speed Reduction':['Control','Reduces movement speed and attack speed.'],
        'Barriers':['Defensive Creation','Ice + Earth creates a temporary physical structure that can block attacks, create cover and separate enemies.'],
        'Doton':['Persistent Damage / Propagation','Electro energy travels through roots or vegetation, producing pulses between connected enemies.'],
        'Thunderstorm':['Offensive Creation','Creates an area in which Electro discharges strike periodically.'],
        'Null':['Disabled Reaction','Earth discharges or neutralizes Electro, producing no conventional elemental reaction.'],
        'Accelerated Germination':['Creation / Utility','Plant prepared first and then hydrated grows rapidly, potentially creating roots or interaction resources.'],
        'Burn':['DoT','Persistent Fire damage.'],
        'Fragility':['Debuff','Frozen plant matter becomes brittle, potentially increasing stagger, Physical damage or defense breaking.'],
        'Alchemical Reaction':['Utility / Propagation','Plant + Wind releases spores or particles that may spread Plant Aura, increase Alchemy temporarily or prepare reactions.'],
        'Germination':['Creation','Earth provides structure for Plant growth, generating plant elements usable in combat or exploration.'],
        'Typhoon':['Explosive Control','A fast, violent displacement that may pull enemies inward and throw them outward.'],
        'Wind Current':['Propagation','Wind carries Fire in a direction, allowing flames, Burn or hot zones to spread.'],
        'Visual Obstruction':['Control / Utility','Wind + Earth creates dust or particles that may reduce accuracy, limit targeting and enable repositioning.'],
    },
    'special':[
        {'name':'Chaos','rule':'Interacts with an existing element to reduce resistance to that specific element.'},
        {'name':'Illumination','rule':'Amplifies the effectiveness or damage of the element it interacts with.'},
        {'name':'Spectrum','rule':'Captures an applied element and can later release it as area elemental damage.'},
        {'name':'Seals','rule':'Converts an applied element into persistent damage associated with elemental seals.'},
        {'name':'Time Clock','rule':'Does not trigger standard reactions and trades that system for greater mechanical freedom.'},
    ]
}

gacha = {
    'character':{'hardPity':90,'softPity':70,'featuredRate':'50%','lostGuarantee':'Next 5★ = 100% Featured','carryOver':True},
    'weapon':{'hardPity':80,'softPity':60,'featuredRate':'75%'},
    'permanentMilestone':200,
    'pullCost':'1 Ticket = 1 Pull',
    'principles':['Core content never requires a random pull','Single and ten-pull have identical probabilities','Pity and guarantee state should be visible','Character banner pity carries across banners in the same family','Duplicates expand a complete character instead of finishing an incomplete one'],
    'sliceDemo':['Pull 1 → 4★','Pull 2 → Duplicate / Legacy Fragment','Pull 3 → Featured 5★'],
}

combatDemo = {
    'partySize':4,
    'sequence':[
        {'character':'Suki iRonin','action':'PREPARE','detail':'Apply Cryo and a debuff to establish a favorable condition.'},
        {'character':'Juro Octophus','action':'RISK','detail':'Use Chaos to reduce Cryo resistance while paying HP and generating a tentacle.'},
        {'character':'Hizuka Tamayo','action':'PROTECT','detail':'Heal just enough to stabilize Juro and convert part of healing into a shield.'},
        {'character':'Serverus Lazoi','action':'SYNERGIZE','detail':'Use Illumination to amplify the prepared elemental state.'},
        {'character':'Suki iRonin','action':'EXECUTE WINDOW','detail':'Return to Suki and exploit the vulnerability with high-impact Cryo damage.'},
    ],
}

timeline = [
    {'era':'T0','name':'Origin','note':'Existence of the Master of Birds and creation of the world.'},
    {'era':'T1','name':'Era of the Four Deities','note':'The four answers to judgment emerge and develop distinct philosophies.'},
    {'era':'T2','name':'Rupture of the Deities','note':'Deaths, war, Purgatory and the collapse of the divine family reshape the world.'},
    {'era':'T3','name':'Formation of the Major Nations','note':'Arcane, Archangel, Beast and Mafia societies consolidate around inherited ideals.'},
    {'era':'T4','name':'First War of Nations','note':'A coalition defeats and seals the Mafia, displacing survivors toward Kingless Island.'},
    {'era':'T5','name':'Consolidation and Diversification','note':'National structures, minor clans and independent entities expand.'},
    {'era':'T6','name':'Era of Major Projects and Discoveries','note':'Project Limbo of Osiris, temporal suspension and mortal contact with Purgatory alter the balance.'},
    {'era':'T7','name':'Era of the Accord','note':'A new peace effort creates the Ministry and the Boarding School.'},
    {'era':'T8','name':'Crisis of Greed','note':'King Shadow, Juro, Purgatory and the collapse of the Boarding School trigger another institutional rupture.'},
    {'era':'T9','name':'Formation of Memento Mori','note':'Peace is rebuilt while leadership changes and hidden powers reorganize.'},
    {'era':'T10','name':'Current Era','note':'Contemporary peace, Niels’ visions and the search for Kanao begin Symphony of Justice.'},
]

payload={'project':project,'groups':GROUPS,'documents':docs,'reactions':reactions,'gacha':gacha,'combatDemo':combatDemo,'timeline':timeline}
OUT.write_text('export const PROJECT_DATA = ' + json.dumps(payload, ensure_ascii=False, separators=(',',':')) + ';\n', encoding='utf-8')
print(f'Wrote {OUT} with {len(docs)} documents')
