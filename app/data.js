export const databaseVersion = '2026-09-27';
const base = 'https://www.grab.fr/';
export const sources = [
 {id:'D0',title:'Deciduous — outil de référence',url:'https://deciduous.sk8.inrae.fr/',publisher:'GRAB · INRAE · RMT Agroforesteries',kind:'Outil',scope:'Parcours espèces / porte-greffes puis variétés.',why:'Référence fonctionnelle demandée, consultée directement. Elle justifie le parcours de sélection, pas les équations de croissance.',limit:'simulArbre est une réalisation indépendante : son moteur de règles ne reproduit pas le code ni la base complète de Deciduous.',location:'Accueil et onglet Choix des Espèces et Porte-Greffes'},
 ...[['PO','pommier','Pommier'],['PE','poirier','Poirier'],['CE','cerisier','Cerisier'],['PR','prunier','Prunier'],['AB','abricotier-1','Abricotier'],['PC','pecher','Pêcher']].map(([id,file,label])=>({id,title:`Fiche porte-greffes · ${label}`,publisher:'GRAB · documentation Deciduous',kind:'Tableau technique',url:base+`wp-content/uploads/2024/03/Donnees-PG-${file}.png`,page:base+'deciduous-porte-greffes/',scope:'Hauteur adulte, distance sur le rang, mise à fruits, production indicative et sensibilités.',why:'Tableau technique publié par le porteur de Deciduous, directement consacré aux associations espèce / porte-greffe. Les valeurs et intervalles ont été transcrits manuellement après lecture de l’image.',limit:'Synthèse technique, sans intervalle statistique ni protocole expérimental détaillé. Valeurs indicatives dépendant du cultivar, du sol et de la conduite. Aucune vitesse de croissance annuelle n’est fournie.',location:'Colonne du porte-greffe ; lignes Hauteur, Distance, Entrée en production et Sensibilités',date:'2024-03 (chemin du fichier ; date de révision non indiquée)'})),
 {id:'V0',title:'Compléments sur les variétés',publisher:'GRAB · documentation Deciduous',kind:'Fiche technique',url:base+'deciduous-varietes/',scope:'Pollinisation, compatibilité au greffage, floraison et récolte.',why:'Complément du même dispositif : permet de signaler les limites d’une sélection fondée uniquement sur le porte-greffe.',limit:'Les remarques générales ne prouvent pas la compatibilité de deux cultivars précis. Aucune date locale de récolte n’est déduite.',location:'Affiner votre choix de variétés et remarques sur le cognassier BA29'},
 {id:'E0',title:'Indications sur les 6 espèces fruitières',publisher:'GRAB · documentation Deciduous',kind:'Fiche technique',url:base+'deciduous-especes/',scope:'Organisation des travaux et risques sanitaires par espèce.',why:'Cadre agronomique du projet : les contraintes de travail et la surveillance sanitaire complètent les critères de sol.',limit:'Tableaux sanitaires et calendriers indicatifs ; le risque local et variétal doit être vérifié sur place.',location:'Principales périodes d’activité et Risques sanitaires pour chaque espèce'},
 {id:'I0',title:'Installation des arbres fruitiers',publisher:'GRAB · documentation Deciduous',kind:'Guide pratique',url:base+'deciduous-installation-fruitiers/',scope:'Auxiliaires, protections des jeunes arbres et suivi des premières années.',why:'Décrit les prédateurs naturels des ravageurs et les gestes de suivi à l’installation.',limit:'Les aménagements favorisent les auxiliaires sans garantir un niveau de régulation. Adapter les protections au contexte local.',location:'Autres végétaux accompagnant les fruitiers et suivi après plantation'},
 {id:'G0',title:'Gestion de l’atelier arboricole',publisher:'GRAB · documentation Deciduous',kind:'Guide pratique',url:base+'deciduous-gestion-atelier/',scope:'Enherbement, fertilisation, irrigation, protection sanitaire, taille, éclaircissage et récolte.',why:'Décrit les principaux travaux d’entretien et les points de surveillance d’un verger agroforestier.',limit:'Conseils généraux à ajuster à l’âge de l’arbre, au cultivar, au sol, au climat et au suivi sanitaire local.',location:'Gestion de l’enherbement, Protection sanitaire, Taille d’entretien et Éclaircissage'},
 {id:'M0',title:'Hypothèses du modèle simulArbre',publisher:'Projet simulArbre',kind:'Hypothèse explicite',scope:'Projection de hauteur et emprise géométrique du houppier.',why:'Une équation simple et inspectable permet d’explorer des scénarios, en l’absence de séries de croissance dans les fiches.',limit:'Modèle illustratif non calibré, non validé scientifiquement. Aucun calcul de rendement, de carbone, de mortalité ou de réponse climatique réelle.',location:'Module Simulation et docs/METHODE.md'}
].map(s=>({...s,consulted:databaseVersion}));
export const species = [
 {id:'pommier',name:'Pommier',latin:'Malus domestica',source:'PO',color:'#648349',pollination:'Pollinisation croisée généralement nécessaire ; vérifier les cultivars.'},
 {id:'poirier',name:'Poirier',latin:'Pyrus communis',source:'PE',color:'#94a144',pollination:'Pollinisation croisée généralement nécessaire ; vérifier aussi la compatibilité sur cognassier.'},
 {id:'cerisier',name:'Cerisier',latin:'Prunus avium',source:'CE',color:'#b45858',pollination:'La majorité des variétés nécessite un pollinisateur compatible.'},
 {id:'prunier',name:'Prunier',latin:'Prunus domestica',source:'PR',color:'#827299',pollination:'Certaines variétés nécessitent une pollinisation croisée.'},
 {id:'abricotier',name:'Abricotier',latin:'Prunus armeniaca',source:'AB',color:'#c89b3e',pollination:'Généralement autofertile, avec des exceptions variétales.'},
 {id:'pecher',name:'Pêcher',latin:'Prunus persica',source:'PC',color:'#d88e70',pollination:'Généralement autofertile, avec des exceptions variétales.'}
];
export const speciesCare = {
 pommier:{pests:'Carpocapse : surveiller les fruits ; la protection par filet peut être nécessaire selon la pression locale.',thinning:'Évaluer la charge en fruits après les gelées tardives et éclaircir si nécessaire.'},
 poirier:{pests:'Carpocapse possible sur poire : surveiller les fruits et ajuster la protection à la pression locale.',thinning:'Évaluer la charge en fruits après les gelées tardives et éclaircir si nécessaire.'},
 cerisier:{pests:'Mouches des cerises : surveiller la pression et envisager un filet anti-insectes adapté.',thinning:'Le cerisier ne fait pas l’objet d’un éclaircissage courant dans le guide.'},
 prunier:{pests:'Consulter le tableau sanitaire du prunier pour cibler les ravageurs et maladies à surveiller localement.',thinning:'L’éclaircissage n’est pas nécessaire chaque année ; décider selon la charge observée.'},
 abricotier:{pests:'Consulter le tableau sanitaire de l’abricotier pour cibler les ravageurs et maladies à surveiller localement.',thinning:'L’éclaircissage n’est pas nécessaire chaque année ; décider selon la charge observée.'},
 pecher:{pests:'Consulter le tableau sanitaire du pêcher pour cibler les ravageurs et maladies à surveiller localement.',thinning:'L’éclaircissage n’est pas nécessaire chaque année ; décider selon la charge observée.'}
};
// null signifie explicitement : information non établie dans la fiche retenue.
// Sécheresse / asphyxie : 0 = tolérance mentionnée, 1 = sensible, 2 = très sensible.
const rows = [
 ['pommier','M9',[2.5,3.5],[1.5,1.75],[2,3],[20,30],2,null,null,null,'Palissage permanent obligatoire.'],
 ['pommier','M116',[4,5],[2.5,3],[3,4],[50,60],1,1,null,null,'Tuteurage 6 à 8 ans.'],
 ['pommier','M7',[4,5],[2.5,3],[3,4],[50,60],1,1,null,null,'Tendance au drageonnement.'],
 ['pommier','M111',[5,6],[3.5,3.5],[4,5],[60,70],1,1,null,null,'Surveiller les broussins.'],
 ['pommier','M25',[7,8],[5.5,5.5],[6,7],[80,100],1,1,null,null,'Tuteurage indiqué : 2 ans.'],
 ['pommier','Franc',[10,10],[8,8],[8,10],[100,200],1,1,null,null,'Faible sensibilité à la concurrence herbacée.'],
 ['poirier','Farold 87',[4.5,4.5],[3.5,3.5],[7,7],[60,60],1,2,null,true,'Reprise délicate ; soigner la plantation.'],
 ['poirier','Pyriam',[4.5,4.5],[3,3],[7,7],[55,55],1,2,null,true,'Rabattage obligatoire dans la fiche.'],
 ['poirier','BA29',[4,4],[2.5,2.5],[5,5],[50,50],2,0,true,false,'Compatibilité variétale à vérifier sur cognassier.'],
 ['poirier','Kirchensaller',[12,12],[6,12],[15,15],[100,300],0,1,null,true,'Éviter les sols très argileux.'],
 ['cerisier','Maxma 14',[4,4],[5,5],[4,5],[70,70],1,1,null,false,'Risque de carence magnésienne.'],
 ['cerisier','Maxma 60',[6,6],[7,7],[5,7],[100,100],1,1,null,false,'Longévité : recul insuffisant.'],
 ['cerisier','Sainte-Lucie 64',[6,6],[7,7],[5,6],[100,100],null,2,null,true,'Plus tolérant au sec que Maxma, sans seuil absolu.'],
 ['prunier','Jaspi',[4,4],[5,5],[4,4],[50,50],1,0,null,null,'Drageonnement important.'],
 ['prunier','Julior',[5,5],[7,7],[4,5],[60,60],1,0,true,true,'Tolère les sols à texture fine.'],
 ['prunier','Myrobolan',[5,5],[7,7],[4,5],[70,70],0,0,null,true,'Nombreux types de sols.'],
 ['prunier','Mariana GF 8.1',[5,6],[7,8],[5,5],[80,80],0,0,null,true,'Tolérance possible au pourridié.'],
 ['abricotier','GF305 / Montclar',[4,4],[6,6],[3,3],[40,40],2,2,true,false,'Sol équilibré, neutre à acide.'],
 ['abricotier','Myrobolan',[5,5],[7,7],[4,4],[50,50],0,2,null,true,'Incompatibilités de greffage possibles.'],
 ['abricotier','Julior',[5,5],[7,7],[4,4],[50,50],1,1,true,false,'Productivité parfois décevante.'],
 ['abricotier','Jaspi',[4,4],[5,5],[3,3],null,1,1,null,false,'Production non chiffrée dans la fiche.'],
 ['pecher','GF305 / Montclar',[3,3],[4,4],[2,2],[40,40],2,2,true,false,'Sensible au pourridié.'],
 ['pecher','Cadaman',[4,4],[5,5],[2,3],[50,50],1,1,null,false,'Éviter les sols trop argileux.'],
 ['pecher','GF 677',[4,4],[5,5],[3,3],[50,50],0,2,null,true,'Éviter les sols trop argileux.'],
 ['pecher','Julior',[3,3],[4,4],[2,3],[40,40],1,1,true,false,'Sol à texture fine.']
];
export const rootstocks = rows.map(([sp,name,height,spacing,fruiting,yieldKg,drought,waterlogging,limeSensitive,shallow,notes],i)=>({id:`pg-${i+1}`,species:sp,name,height,spacing,fruiting,yieldKg,drought,waterlogging,limeSensitive,shallow,notes,source:species.find(s=>s.id===sp).source}));
export const defaultProject = {version:1,name:'Mon verger agroforestier',filters:{species:'all',maxHeight:null,drought:'unknown',irrigation:'unknown',waterlogging:'unknown',lime:'unknown',shallow:'unknown'},selected:['pg-4','pg-16','pg-24'],simulation:{rootstock:'pg-4',years:20,initialHeight:1.2,rate:0.12,factor:1,crownRatio:0.65,rowSpacing:10,treeSpacing:7,area:1}};
