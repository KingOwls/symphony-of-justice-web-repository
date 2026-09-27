import type {Character,Nation,Reaction} from '../types/game';
const BASE=((import.meta as unknown as {env?:{BASE_URL?:string}}).env?.BASE_URL ?? './');
const A=`${BASE}assets/art/`;
export const characters:Character[]=[
{id:'niels-darkmoon',name:'Niels DarkMoon',title:'The Silent Oath',nation:'Arcane Nation',role:'Burst',element:'Shadow',image:A+'characters/official/characters-niels-darkmoon.webp',quote:'A truth is still a truth, even when no one wants to hear it.'},
{id:'master-of-birds',name:'Master of Birds',title:'The First Witness',nation:'Unknown',role:'Control',element:'Wind',image:A+'characters/official/characters-master-of-birds.webp',quote:'Freedom begins where certainty ends.'},
{id:'kanao-sunshine',name:'Kanao Sunshine',title:'Distant Radiance',nation:'Archangel Nation',role:'Support',element:'Light',image:A+'characters/official/characters-kanao-sunshine.webp',quote:'Kindness is also a form of strength.'},
{id:'juro-octhopus',name:'Juro Shinigami Octhopus',title:'Chaos Bearer',nation:'Mafia Nation',role:'Hybrid',element:'Electro',image:A+'characters/official/characters-juro-shinigami-octhopus.webp',quote:'Every price reveals what you truly value.'},
{id:'serverus-lazoi',name:'Serverus Lazoi',title:'Illuminated Strategist',nation:'Beast Nation',role:'Support',element:'Light',image:A+'characters/official/characters-serverus-lazoi.webp',quote:'Understanding is the first form of mercy.'},
{id:'kathryn-matsubakku',name:'Kathryn Matsubakku',title:'Keeper of Balance',nation:'Beast Nation',role:'Frontline',element:'Earth',image:A+'characters/official/characters-kathryn-matsubakku.webp',quote:'Strength without purpose becomes noise.'},
{id:'lyna-shadow',name:'Lyna Shadow',title:'Memory in Crimson',nation:'Mafia Nation',role:'Sustain',element:'Fire',image:A+'characters/official/characters-lyna-shadow.webp',quote:'Some wounds become maps.'},
{id:'saint-white',name:'Saint White',title:'The Pale Verdict',nation:'Archangel Nation',role:'Control',element:'Ice',image:A+'characters/official/characters-saint-white.webp',quote:'Mercy without memory is another kind of blindness.'}
];
export const nations:Nation[]=[
{id:'arcane',name:'Arcane Nation',ideal:'Judgment',summary:'Reason, innovation and law shape a society that believes consequence creates order.',image:A+'locations/official/locations-simbolo-arcano.webp',accent:'#82b7ff'},
{id:'archangel',name:'Archangel Nation',ideal:'Forgiveness',summary:'Faith and redemption support a culture built around second chances.',image:A+'locations/official/locations-simbolo-de-los-angeles.webp',accent:'#f0dca7'},
{id:'mafia',name:'Mafia Nation',ideal:'Revenge',summary:'Memory, debt and loyalty define a nation that refuses to let wounds disappear.',image:A+'locations/official/locations-reino-de-la-mafia.webp',accent:'#d95568'},
{id:'beast',name:'Beast Nation',ideal:'Wisdom',summary:'Tradition, nature and long-term thinking guide a society built around balance.',image:A+'locations/official/locations-bosque-ophiuchus.webp',accent:'#9acb9a'}
];
export const reactions:Reaction[]=[
{id:'scald',name:'Scald',first:'Water',second:'Fire',kind:'Damage · DoT',summary:'Water is heated violently, dealing immediate damage and a brief burn.',symbol:'♨'},
{id:'melt',name:'Melt',first:'Ice',second:'Fire',kind:'Burst',summary:'Prepared Ice becomes an explosive damage window when Fire arrives second.',symbol:'✹'},
{id:'freeze',name:'Freeze',first:'Water',second:'Ice',kind:'Control',summary:'Temporarily immobilizes normal enemies and contributes to boss stagger.',symbol:'❄'},
{id:'hurricane',name:'Hurricane',first:'Water',second:'Wind',kind:'Creation · Control',summary:'A persistent vortex pulls enemies and distributes Water.',symbol:'🜁'},
{id:'magma',name:'Magma',first:'Earth',second:'Fire',kind:'Creation · Damage',summary:'Creates a dangerous magma surface with persistent damage.',symbol:'◈'},
{id:'thunderstorm',name:'Thunderstorm',first:'Electro',second:'Wind',kind:'Offensive Creation',summary:'Creates an area struck periodically by Electro discharges.',symbol:'ϟ'},
{id:'germination',name:'Germination',first:'Earth',second:'Plant',kind:'Creation',summary:'Earth provides structure for rapid plant growth.',symbol:'✦'},
{id:'null',name:'Null',first:'Earth',second:'Electro',kind:'Disabled Reaction',summary:'Earth discharges or neutralizes Electro and no standard reaction occurs.',symbol:'∅'}
];
export const locationImages=[
'locations-symphonia-iustitiae.webp','locations-zona-aristocrata-de-las-naciones.webp','locations-bosque-laberintico.webp','locations-laboratorios-nightmare.webp','locations-bar-del-olvido-interior.webp','locations-torre-del-tarot.webp'
].map(x=>A+'locations/official/'+x);
export const bossImages=[A+'characters/official/characters-king-shadow.webp',A+'characters/official/characters-golem-de-kathryn.webp',A+'characters/official/characters-darken-undeath.webp'];
