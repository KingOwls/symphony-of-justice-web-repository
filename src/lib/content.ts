export type DossierIndexEntry={id:string;group:string;groupLabel:string;number:string;title:string;summary:string;sourceFile:string;meta?:Record<string,string>};
export type DossierDocument=DossierIndexEntry&{blocks:{type:string;text?:string;table?:number}[];tables?:string[][][]};
export type ArtEntry={id:string;name:string;category:string;group:string;concept:boolean;path:string;width:number;height:number;source:string};
const url=(path:string)=>`${import.meta.env.BASE_URL}${path.replace(/^\//,'')}`;
async function getJson<T>(path:string):Promise<T>{const r=await fetch(url(path));if(!r.ok)throw new Error(`Unable to load ${path} (${r.status})`);return r.json() as Promise<T>}
export const loadDossierIndex=()=>getJson<DossierIndexEntry[]>('data/dossiers/index.json');
export const loadDossier=(id:string)=>getJson<DossierDocument>(`data/dossiers/${encodeURIComponent(id)}.json`);
export const loadArtManifest=()=>getJson<{items:ArtEntry[];featured:string[];counts:Record<string,number>}>('data/art-manifest.json');
