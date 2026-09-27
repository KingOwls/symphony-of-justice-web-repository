"""Export the generated V1 JS payloads to lazy-loadable V2 JSON.

This works even when the original DOCX/concept-art source folders are not
present in a checkout. Run the original builders first when source files are
available, then run this exporter.
"""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
def read_export(path:Path,prefix:str):
    raw=path.read_text(encoding='utf-8').strip()
    if not raw.startswith(prefix): raise RuntimeError(f'Unexpected format: {path}')
    return json.loads(raw[len(prefix):].rsplit(';',1)[0])
project=read_export(ROOT/'src/data/project-data.js','export const PROJECT_DATA = ')
out=ROOT/'public/data/dossiers';out.mkdir(parents=True,exist_ok=True)
index=[]
for d in project['documents']:
    index.append({k:d.get(k) for k in ('id','group','groupLabel','number','title','summary','sourceFile','meta')})
    (out/f"{d['id']}.json").write_text(json.dumps(d,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
(out/'index.json').write_text(json.dumps(index,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
art=read_export(ROOT/'src/data/art-data.js','export const ART_DATA = ')
for item in art['items']: item['path']=item['path'].replace('./public/','')
(ROOT/'public/data').mkdir(parents=True,exist_ok=True)
(ROOT/'public/data/art-manifest.json').write_text(json.dumps(art,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print(f"Exported {len(index)} dossiers and {len(art['items'])} art records")
