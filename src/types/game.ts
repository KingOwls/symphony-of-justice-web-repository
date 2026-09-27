export type Element = 'Fire'|'Water'|'Ice'|'Electro'|'Wind'|'Earth'|'Light'|'Shadow'|'Plant';
export type Role = 'Burst'|'Support'|'Control'|'Sustain'|'Frontline'|'Hybrid';
export interface Character {id:string;name:string;title:string;nation:string;role:Role;element:Element;image:string;quote:string;demo?:boolean;}
export interface Reaction {id:string;name:string;first:Element;second:Element;kind:string;summary:string;symbol:string;}
export interface Nation {id:string;name:string;ideal:string;summary:string;image:string;accent:string;}
