// Manual p.186 motivates author control of unscripted events. These rules cover
// random disaster generation and future automatic offers, not all VM commands.
export function validateBackgroundRules(v){
 if(v===undefined)return{randomDisasters:true,automaticBusiness:true};
 if(!v||typeof v!=='object'||Array.isArray(v)||typeof v.randomDisasters!=='boolean'||typeof v.automaticBusiness!=='boolean')throw Error('Choose whether random disasters and automatic business offers are allowed.');
 return{randomDisasters:v.randomDisasters,automaticBusiness:v.automaticBusiness};
}
export function scenarioAllowsBackground(c,key){const s=c.scenario;return !(s?.id==='custom'&&s.status==='playing'&&s.definition.backgroundRules?.[key]===false);}
export function backgroundRulesReport(c){
 const disasters=scenarioAllowsBackground(c,'randomDisasters'),business=scenarioAllowsBackground(c,'automaticBusiness');
 if(disasters&&business)return '';
 return `<p><strong>Author rules:</strong> ${!disasters?'Random disasters are suspended; saved random-disaster preferences resume after the challenge ends. ':''}${!business?'New automatic business offers are suspended. Existing offers, permits and business income continue. ':''}Scripted events still run. Manual disaster tools and infrastructure failures remain available.</p>`;
}
