// Spatial counts use map coordinates and an inclusive circular radius in tiles.
export function validateScenarioArea(area,metric,size=48){
 if(area===undefined||area===null)return null;
 if(!metric?.spatial||!area||typeof area!=='object'||Array.isArray(area)||!Number.isInteger(area.x)||!Number.isInteger(area.y)||!Number.isInteger(area.radius)||area.x<0||area.x>=size||area.y<0||area.y>=size||area.radius<0||area.radius>Math.ceil((size-1)*Math.SQRT2))throw Error(`Local counts need map coordinates from 1 to ${size} and a radius from 0 to ${Math.ceil((size-1)*Math.SQRT2)} tiles.`);
 return{x:area.x,y:area.y,radius:area.radius};
}
export const inScenarioArea=(tile,area)=>!area||(tile.x-area.x)**2+(tile.y-area.y)**2<=area.radius**2;
export const scenarioAreaLabel=area=>area?` within ${area.radius} tiles of ${area.x+1}, ${area.y+1}`:'';
