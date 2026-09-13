// Optional authoring shorthand for combining the four visible condition rows.
// AND binds more tightly than OR; parentheses make alternate groupings explicit.
export function parseConditionLogic(value,rows){
 if(typeof value!=='string'||value.length>200)throw Error('Advanced logic must contain at most 200 characters.');
 const source=value.replace(/\s+/g,'').toUpperCase();if(!source)return null;
 const tokens=source.match(/AND|OR|[1-4]|[()]/g)||[];
 if(tokens.join('')!==source)throw Error('Use condition row numbers 1–4, AND, OR and parentheses.');
 let pos=0,leaves=0;const used=new Set();
 const primary=depth=>{
  if(depth>8)throw Error('Use at most eight levels of condition groups.');
  const token=tokens[pos++];
  if(token==='('){const result=or(depth+1);if(tokens[pos++]!==')')throw Error('Close each parenthesis in advanced logic.');return result;}
  if(!/^[1-4]$/.test(token||''))throw Error('Expected a condition row number or an opening parenthesis.');
  const index=Number(token)-1;if(!rows[index])throw Error('Advanced logic refers to empty condition row '+token+'.');
  if(++leaves>16)throw Error('Use at most sixteen condition references.');used.add(index);return rows[index];
 };
 const combine=(match,parts)=>parts.length===1?parts[0]:{match,conditions:parts};
 const and=depth=>{const parts=[primary(depth)];while(tokens[pos]==='AND'){pos++;parts.push(primary(depth));}return combine('all',parts);};
 const or=depth=>{const parts=[and(depth)];while(tokens[pos]==='OR'){pos++;parts.push(and(depth));}return combine('any',parts);};
 const result=or(0);if(pos!==tokens.length)throw Error('Separate condition rows with AND or OR and check the parentheses.');
 for(let i=0;i<rows.length;i++)if(rows[i]&&!used.has(i))throw Error('Condition row '+(i+1)+' is unused. Include it in advanced logic or choose No condition.');
 return result;
}
