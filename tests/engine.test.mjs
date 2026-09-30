import test from 'node:test';
import assert from 'node:assert/strict';
import {rootstocks,sources,defaultProject} from '../app/data.js';
import {assess,rankStocks,simulate,validateProject,report} from '../app/engine.js';
const stock=(species,name)=>rootstocks.find(r=>r.species===species&&r.name===name);
const filters=patch=>({...defaultProject.filters,...patch});
test('Toutes les associations ont des intervalles cohérents et une source technique traçable',()=>{
 assert.equal(rootstocks.length,25);assert.equal(new Set(rootstocks.map(r=>r.id)).size,25);
 for(const r of rootstocks){assert.ok(sources.find(s=>s.id===r.source)?.url.startsWith('https://www.grab.fr/'));for(const key of ['height','spacing','fruiting']){assert.ok(r[key][0]>0);assert.ok(r[key][1]>=r[key][0]);}}
});
test('Une donnée absente ne valide jamais la tolérance au calcaire',()=>{
 const a=assess(stock('pommier','M9'),filters({lime:'high'}));assert.equal(a.status,'uncertain');assert.equal(a.unknowns,1);
 assert.equal(assess(stock('poirier','BA29'),filters({lime:'high'})).status,'alert');
});
test('Une fourchette traversant la hauteur limite reste incertaine',()=>{
 assert.equal(assess(stock('pommier','M9'),filters({maxHeight:3})).status,'uncertain');
 assert.equal(assess(stock('pommier','M9'),filters({maxHeight:2})).status,'alert');
 assert.equal(assess(stock('pommier','M9'),filters({maxHeight:5})).status,'ok');
});
test('Même porte-greffe, espèce différente : sensibilité différente conservée',()=>{
 assert.equal(assess(stock('prunier','Myrobolan'),filters({waterlogging:'high'})).status,'ok');
 assert.equal(assess(stock('abricotier','Myrobolan'),filters({waterlogging:'high'})).status,'alert');
});
test('L’irrigation déclarée ne garantit pas la disparition du risque',()=>{
 assert.equal(assess(stock('pommier','M9'),filters({drought:'high',irrigation:'none'})).status,'alert');
 assert.equal(assess(stock('pommier','M9'),filters({drought:'high',irrigation:'regular'})).status,'uncertain');
});
test('Le tri expose les tolérances au sec avant les sensibilités',()=>{
 const ranked=rankStocks(filters({drought:'high',irrigation:'none'}));assert.equal(ranked[0].drought,0);
 assert.ok(ranked.every((r,i)=>i===0||r.assessment.alerts>=ranked[i-1].assessment.alerts));
 assert.equal(rankStocks(filters({species:'pecher'}),'GF 677').length,1);
});
test('Projection : condition initiale, croissance monotone, bornes et ralentissement',()=>{
 const a=simulate(defaultProject.simulation),b=simulate({...defaultProject.simulation,factor:.5});
 assert.equal(a.series[0].height,1.2);
 for(let i=1;i<a.series.length;i++){const p=a.series[i];assert.ok(p.height>a.series[i-1].height);assert.ok(p.height>=p.low&&p.height<=p.high);assert.ok(p.high<a.stock.height[1]);}
 assert.ok(b.series.at(-1).height<a.series.at(-1).height);
 assert.ok(Math.abs(a.density-10000/70)<1e-9);assert.equal(a.trees,142);
});
test('Production absente et première fructification ne sont pas des rendements simulés',()=>{
 assert.equal(stock('abricotier','Jaspi').yieldKg,null);assert.equal(simulate(defaultProject.simulation).series[0].yieldKg,undefined);
});
test('Import : validation stricte, nombres finis, limites et sélection',()=>{
 assert.deepEqual(validateProject(defaultProject),defaultProject);
 for(const patch of [{rate:NaN},{factor:0},{years:2.5},{initialHeight:100},{area:-1},{rowSpacing:0},{rootstock:'introuvable'}])assert.throws(()=>validateProject({...defaultProject,simulation:{...defaultProject.simulation,...patch}}));
 assert.throws(()=>validateProject({...defaultProject,selected:['pg-1','pg-1']}));
 assert.throws(()=>validateProject({...defaultProject,filters:{...defaultProject.filters,lime:'faux'}}));
 assert.throws(()=>validateProject({...defaultProject,name:''}));
 assert.throws(()=>validateProject({version:2}));
});
test('Un export est réimportable sans données privées',()=>{
 const data=report(defaultProject);assert.deepEqual(validateProject(JSON.parse(JSON.stringify(data))),defaultProject);assert.ok(data.sources.length>=9);assert.match(data.method,/non calibrée/);assert.equal(data.databaseVersion,'2026-09-27');
 assert.equal('orchardVarieties' in data,false);assert.equal('varietyNotes' in data,false);
 assert.ok(data.sources.every(source=>source.id!=='PV0'));
});
test('La comparaison accepte toutes les associations et conserve la sélection à l’export/import',()=>{
 const selected=rootstocks.map(r=>r.id);
 const project={...defaultProject,selected};
 assert.equal(validateProject(project).selected.length,25);
 assert.deepEqual(validateProject(JSON.parse(JSON.stringify(report(project)))).selected,selected);
 assert.throws(()=>validateProject({...project,selected:[...selected,'inconnue']}));
});
