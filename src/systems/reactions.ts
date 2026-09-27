import { reactions } from '../data/gameData';
import type {Element,Reaction} from '../types/game';
export function resolveReaction(first:Element,second:Element):Reaction|null{return reactions.find(r=>r.first===first&&r.second===second)??null;}
