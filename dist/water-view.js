// Underground colors describe surface use independently of pipe coverage.
export const WATER_VIEW_COLORS=Object.freeze({blocked:'#403d35',open:'#736958',road:'#858d91',zoned:'#aa663e',developed:'#dba477',supplied:'#559bab'});
export const WATER_VIEW_LEGEND='Blue: supplied water · Gray: roads · Dark orange: empty zones · Light orange: developed zones · Brown: open ground · Bright pipes: supplied';
export function waterViewColor(tile){
 if(tile.terrain==='water'||tile.radiation)return WATER_VIEW_COLORS.blocked;
 if(tile.watered)return WATER_VIEW_COLORS.supplied;
 if(tile.type==='road'||tile.type==='highway')return WATER_VIEW_COLORS.road;
 if(['residential','commercial','industrial','airport','seaport'].includes(tile.type))return tile.level>0?WATER_VIEW_COLORS.developed:WATER_VIEW_COLORS.zoned;
 return WATER_VIEW_COLORS.open;
}
