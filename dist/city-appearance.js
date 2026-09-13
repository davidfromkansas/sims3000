export const LANDSCAPE_STYLES={classic:'Classic landscape',lush:'Lush grassland',arid:'Dry grassland',alpine:'Cool highlands'};
export const TREE_CHOICES={classic:'Original grove artwork',broadleaf:'Broadleaf groves',conifer:'Evergreen forest',palm:'Palm groves'};
export const freshAppearance=()=>({landscape:'classic',trees:'classic'});
export function validateAppearance(v){if(!v||typeof v!=='object'||Array.isArray(v)||!Object.hasOwn(LANDSCAPE_STYLES,v.landscape)||!Object.hasOwn(TREE_CHOICES,v.trees))throw Error('Choose a valid landscape and tree style.');return{landscape:v.landscape,trees:v.trees};}
export function applyAppearance(city,value){city.appearance=validateAppearance(value);}
const PALETTES={classic:{hue:88,saturation:24,lightness:59,bank:'#bac39a',sides:['#677c58','#7f9066'],fresh:[130,185,190],salt:[119,174,158]},lush:{hue:108,saturation:30,lightness:48,bank:'#b8ba84',sides:['#496a48','#638458'],fresh:[105,176,182],salt:[88,163,163]},arid:{hue:43,saturation:34,lightness:64,bank:'#d0c198',sides:['#978259','#b2a077'],fresh:[112,174,171],salt:[113,174,163]},alpine:{hue:96,saturation:16,lightness:53,bank:'#b6bbb0',sides:['#66736b','#87958a'],fresh:[118,177,193],salt:[111,166,182]}};
export function landscapePalette(style='classic'){return PALETTES[style]||PALETTES.classic;}
export function landscapeGround(tile,style='classic'){const p=landscapePalette(style);return `hsl(${p.hue+(tile.x+tile.y)%6}, ${p.saturation+(tile.x%3)}%, ${p.lightness+(tile.x*7+tile.y*13)%4}%)`;}
