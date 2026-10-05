import { stations } from './config.js';
const grid=document.getElementById('marker-grid');
stations.forEach((s,i)=>{const card=document.createElement('article');card.className='marker-card';const title=document.createElement('h2');title.textContent=`${i+1}. ${s.name}`;const img=document.createElement('img');img.src=`./assets/marcadores/${s.marker}.png`;img.alt=`Marcador AR ${s.marker} de la estación ${s.name}`;img.width=512;img.height=512;const label=document.createElement('p');label.className='marker-code';label.textContent=`Patrón ${s.marker} · ${s.stage}`;const note=document.createElement('p');note.textContent='Apuntá al cuadrado completo con la cámara del juego.';card.append(title,img,label,note);grid.append(card);});
document.getElementById('print').onclick=()=>window.print();
