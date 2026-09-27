export type GachaState={pity:number;guaranteed:boolean;history:string[]};
export const defaultGachaState:GachaState={pity:0,guaranteed:false,history:[]};
export function fiveStarChance(pity:number){if(pity>=89)return 1;if(pity>=70)return Math.min(.006+(pity-69)*.06,.95);return .006;}
export function pullOnce(state:GachaState,roll=Math.random()):{state:GachaState;rarity:4|5} {const hit=roll<fiveStarChance(state.pity);if(hit){const featured=state.guaranteed||Math.random()<.5;return {rarity:5,state:{pity:0,guaranteed:!featured,history:[featured?'Featured 5★':'Standard 5★',...state.history].slice(0,20)}}}return {rarity:4,state:{...state,pity:state.pity+1,history:['4★',...state.history].slice(0,20)}}}
