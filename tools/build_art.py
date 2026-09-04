from pathlib import Path
from PIL import Image, ImageOps
import json, re, unicodedata, hashlib, os

ROOT=Path(__file__).resolve().parents[1]
SRC=Path('/mnt/data/jorge_site_work/source/art/Concept Art and Desing')
OUT=ROOT/'public/assets/art'
DATA=ROOT/'src/data/art-data.js'
OUT.mkdir(parents=True,exist_ok=True)

def slug(v):
    v=unicodedata.normalize('NFKD',v).encode('ascii','ignore').decode('ascii')
    v=re.sub(r'[^a-zA-Z0-9]+','-',v).strip('-').lower()
    return v or 'art'

def clean_name(stem):
    s=stem.replace('_',' ').replace('#U00f1','ñ').replace('#U00e1','á').replace('#U00e9','é').replace('#U00ed','í').replace('#U00f3','ó').replace('#U00fa','ú')
    s=re.sub(r'\s+',' ',s).strip()
    return s

def is_code(stem):
    return bool(re.fullmatch(r'[0-9a-fA-F]{24,40}(?:\s*\(\d+\))?',stem))

def classify(p):
    rel=p.relative_to(SRC)
    parts=rel.parts
    low=[x.lower() for x in parts]
    concept = any('concept' in x for x in low) or is_code(p.stem)
    if parts[0]=='Characters':
        category='characters'
        if 'Personaje 5 #U2605' in parts: group='5★ Characters'
        elif 'Personajes 4 #U2605' in parts: group='4★ Characters'
        elif 'Personajes Especiales' in parts: group='Special Characters'
        else: group='Character References' if concept else 'Characters'
    elif parts[0]=='Enemies':
        category='enemies'; group='Enemy References' if concept else 'Enemies'
    elif parts[0]=='LandScape':
        category='locations'
        if len(parts)>2 and parts[1] not in ('Concept Art',): group=parts[1]
        elif concept: group='Environment References'
        else: group='World'
    else:
        category='other'; group='Other'
    return category,group,concept

items=[]
used=set()
for p in sorted([x for x in SRC.rglob('*') if x.is_file()]):
    try:
        im=Image.open(p)
        im=ImageOps.exif_transpose(im).convert('RGB')
    except Exception as e:
        print('skip',p,e); continue
    cat,group,concept=classify(p)
    base=slug(clean_name(p.stem))
    if concept:
        code = p.stem[:8] if is_code(p.stem) else hashlib.md5(str(p).encode()).hexdigest()[:8]
        base=f'ref-{code}'
    key=f'{cat}-{base}'
    n=1
    while key in used:
        n+=1; key=f'{cat}-{base}-{n}'
    used.add(key)
    target_dir=OUT/cat/('reference' if concept else 'official')
    target_dir.mkdir(parents=True,exist_ok=True)
    out=target_dir/f'{key}.webp'
    maxdim=760 if concept else (1700 if p.name=='Symphonia Iustitiae.jpeg' else 1200)
    im.thumbnail((maxdim,maxdim),Image.Resampling.LANCZOS)
    q=62 if concept else 82
    if not out.exists():
        im.save(out,'WEBP',quality=q,method=2)
    w,h=im.size
    if concept:
        name=f'Concept reference · {p.stem[:8]}'
    else:
        name=clean_name(p.stem)
        if name=='Symphonia Iustitiae': name='World of Symphony of Justice'
    items.append({
        'id':key,'name':name,'category':cat,'group':group,'concept':concept,
        'path':'./public/assets/art/'+str(out.relative_to(OUT)).replace('\\','/'),
        'width':w,'height':h,
        'source':str(p.relative_to(SRC)).replace('\\','/'),
    })

featured=[]
for wanted in ['World of Symphony of Justice','Master of birds','Niels DarkMoon','Kanao SunShine','Arcanus','Iluminate','Kitsune','Tsuiho','Simbolo Arcano','Simbolo de los Angeles','Simbolo del clan Mafioso','Simbolo del clan Bestial','Torre del Tarot','El ministerio de los susurros','Reino de la Mafia']:
    for it in items:
        if it['name'].lower()==wanted.lower():
            featured.append(it['id']); break

payload={'items':items,'featured':featured,'counts':{
    'total':len(items),'official':sum(not x['concept'] for x in items),'concept':sum(x['concept'] for x in items)
}}
DATA.write_text('export const ART_DATA = '+json.dumps(payload,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
print(payload['counts'])
print('art bytes',sum(p.stat().st_size for p in OUT.rglob('*.webp')))
