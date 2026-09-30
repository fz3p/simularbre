import {rootstocks, speciesClimate, defaultProject, databaseVersion, sources} from './data.js';
export const midpoint = r => (r[0]+r[1])/2;
export function assess(stock, filters) {
 const checks=[];
 const add=(criterion,status,reason,source=stock.source)=>checks.push({criterion,status,reason,source});
 if(filters.maxHeight!==null) add('Hauteur',stock.height[0]>filters.maxHeight?'alert':stock.height[1]>filters.maxHeight?'uncertain':'ok',`Hauteur adulte documentée : ${stock.height.join('–')} m ; objectif ≤ ${filters.maxHeight} m.`);
 if(filters.drought==='high') {
  if(filters.irrigation==='regular') add('Sécheresse','uncertain','Irrigation régulière déclarée : son efficacité et les besoins en eau ne sont pas quantifiés.');
  else if(stock.drought===null) add('Sécheresse','uncertain','Pas de tolérance absolue documentée.');
  else add('Sécheresse',stock.drought===0?'ok':'alert',stock.drought===0?'Tolérance au déficit hydrique mentionnée ; elle ne garantit pas une production sans eau.':'Sensibilité au déficit hydrique documentée ; irrigation absente, inconnue ou ponctuelle.');
 }
 if(filters.waterlogging==='high') add('Hydromorphie',stock.waterlogging===null?'uncertain':stock.waterlogging===0?'ok':'alert',stock.waterlogging===null?'Donnée absente.':stock.waterlogging===0?'Tolérance à l’asphyxie mentionnée, sans durée ni intensité précisée.':'Sensibilité à l’asphyxie racinaire mentionnée.');
 if(filters.lime==='high') add('Calcaire actif',stock.limeSensitive===true?'alert':'uncertain',stock.limeSensitive===true?'Très sensible au calcaire actif supérieur à 10 %.':'Aucun seuil de tolérance au calcaire actif vérifié dans cette fiche.');
 if(filters.shallow==='yes') add('Sol superficiel',stock.shallow===null?'uncertain':stock.shallow?'ok':'alert',stock.shallow===null?'Adaptation aux sols superficiels non renseignée.':stock.shallow?'Adaptation aux sols superficiels mentionnée.':'La fiche déconseille les sols superficiels.');
 const alerts=checks.filter(c=>c.status==='alert').length;
 const unknowns=checks.filter(c=>c.status==='uncertain').length;
 return {checks,alerts,unknowns,status:alerts?'alert':unknowns?'uncertain':checks.length?'ok':'neutral',label:alerts?'Points de vigilance':unknowns?'À documenter':checks.length?'Pas d’alerte identifiée':'À explorer'};
}
export function rankStocks(filters, query='') {
 const q=query.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 return rootstocks.filter(r=>(filters.species==='all'||r.species===filters.species)&&`${r.name} ${r.species}`.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(q)).map(r=>({...r,assessment:assess(r,filters)})).sort((a,b)=>a.assessment.alerts-b.assessment.alerts||a.assessment.unknowns-b.assessment.unknowns||a.name.localeCompare(b.name,'fr'));
}
export function simulate(p) {
 const stock=rootstocks.find(r=>r.id===p.rootstock);
 if(!stock) throw Error('Porte-greffe inconnu');
 for(const key of ['years','initialHeight','rate','factor','crownRatio','rowSpacing','treeSpacing','area']) if(typeof p[key]!=='number'||!Number.isFinite(p[key])) throw Error(`Paramètre invalide : ${key}`);
 if(p.years<1||p.years>50||!Number.isInteger(p.years)||p.initialHeight<0||p.initialHeight>stock.height[0]||p.rate<=0||p.rate>1||p.factor<=0||p.factor>1||p.crownRatio<=0||p.crownRatio>2||p.rowSpacing<1||p.rowSpacing>100||p.treeSpacing<1||p.treeSpacing>100||p.area<=0||p.area>1000) throw Error('Paramètres hors des limites du modèle. La hauteur initiale doit être inférieure ou égale à la borne adulte basse.');
 const height=(target,t)=>p.initialHeight+(target-p.initialHeight)*(1-Math.exp(-p.rate*p.factor*t));
 const density=10000/(p.rowSpacing*p.treeSpacing);
 const series=Array.from({length:p.years+1},(_,year)=>{
  const h=height(midpoint(stock.height),year), crown=h*p.crownRatio;
  return {year,height:h,low:height(stock.height[0],year),high:height(stock.height[1],year),crown,footprint:Math.PI*(crown/2)**2,overlap:crown>Math.min(p.treeSpacing,p.rowSpacing)};
 });
 return {stock,series,density,trees:Math.floor(density*p.area),spacingWarning:stock.spacing===null?null:p.treeSpacing<stock.spacing[0],sumFootprint:series.at(-1).footprint*density/10000*100};
}
export function validateProject(value) {
 if(!value||typeof value!=='object'||value.version!==1) throw Error('Format de projet non reconnu (version 1 attendue).');
 if(typeof value.name!=='string'||!value.name.trim()||value.name.length>120) throw Error('Nom de projet invalide.');
 const f=value.filters;
 if(!f||!['all',...new Set(rootstocks.map(r=>r.species))].includes(f.species)) throw Error('Espèce invalide.');
 const allowed={drought:['unknown','low','high'],irrigation:['unknown','none','occasional','regular'],waterlogging:['unknown','low','high'],lime:['unknown','low','high'],shallow:['unknown','no','yes']};
 for(const [k,values] of Object.entries(allowed)) if(!values.includes(f[k])) throw Error(`Critère invalide : ${k}`);
 if(f.maxHeight!==null&&(typeof f.maxHeight!=='number'||!Number.isFinite(f.maxHeight)||![3,5,8,12].includes(f.maxHeight))) throw Error('Hauteur invalide.');
 if(!Array.isArray(value.selected)||value.selected.length>rootstocks.length||new Set(value.selected).size!==value.selected.length||value.selected.some(id=>!rootstocks.some(r=>r.id===id))) throw Error('Comparaison invalide.');
 const s=value.simulation;
 if(!s) throw Error('Simulation absente.');
 simulate(s);
 return {version:1,name:value.name.trim(),filters:Object.fromEntries(Object.keys(defaultProject.filters).map(k=>[k,f[k]])),selected:[...value.selected],simulation:Object.fromEntries(Object.keys(defaultProject.simulation).map(k=>[k,s[k]]))};
}
export function report(project) {
 const clean=validateProject(project);
 return { ...clean, exportedAt:new Date().toISOString(),databaseVersion,method:'Projection illustrative non calibrée : H(t)=H0+(H∞−H0)×(1−exp(−k×f×t)). Les bornes reflètent seulement la fourchette adulte, pas une incertitude statistique.',results:rankStocks(clean.filters),speciesClimate,temperatureMaximum:'Non documentée pour toutes les espèces : aucun seuil comparable retenu.',projection:simulate(clean.simulation),sources};
}
