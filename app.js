import { stations, mission } from './config.js';
import { STORAGE_KEY, loadProgress, discover, saveProgress, clearProgress, canWin } from './progress.js';
import { models } from './visuals.js';
const $ = id => document.getElementById(id);
const params = new URLSearchParams(location.search);
const demo = params.get('demo') === '1';
const detectorTest = !demo && params.get('detector') === '1';
const testing = demo || detectorTest;
const ids = stations.map(s => s.id);
// Pruebas y juego real usan espacios distintos de almacenamiento.
const key = STORAGE_KEY + (demo ? '-demo' : detectorTest ? '-detector' : '');
let storage;
try { const raw = window.localStorage; storage = { getItem: () => raw.getItem(key), setItem: (_, v) => raw.setItem(key,v), removeItem: () => raw.removeItem(key) }; } catch { storage = { getItem(){throw Error();}, setItem(){throw Error();}, removeItem(){throw Error();} }; }
let { found, persistent } = loadProgress(storage, ids);
let active = null, running = false, won = false, visible = new Set(), toastTimer, cameraTimer;
$('story').textContent = mission;
if (testing) { document.body.classList.add('testing'); $('test-banner').hidden = false; $('test-banner').textContent = demo ? 'Modo demostración: detección simulada' : 'Prueba de detector: imagen estática · sin cámara'; for(const dialog of document.querySelectorAll('dialog')) {const label=document.createElement('p');label.className='test-label';label.textContent=$('test-banner').textContent;dialog.prepend(label);} }
function renderProgress() {
  $('progress').textContent = `${found.size}/3`;
  $('fragments').replaceChildren(...stations.map((s,i) => { const e=document.createElement('span'); e.textContent=['Ⅰ','Ⅱ','Ⅲ'][i]; e.className=found.has(s.id)?'found':''; e.title=s.name; return e; }));
  $('storage-warning').hidden = persistent;
  $('resume').hidden = found.size === 0;
  $('resume').textContent = `Partida guardada: ${found.size}/3 fragmentos. Podés continuar.`;
}
renderProgress();
function notify(text) { clearTimeout(toastTimer); $('toast').textContent=text; $('toast').hidden=false; toastTimer=setTimeout(()=>{$('toast').hidden=true;},2800); }
function setError(text) { clearTimeout(cameraTimer); $('error-text').textContent=text; $('error').hidden=false; $('detection').textContent='La búsqueda necesita atención'; }
function clearError() { $('error').hidden=true; }
function clueFor(station) {
  const missing = stations.filter(s=>!found.has(s.id));
  const earlier = stations.slice(0,stations.indexOf(station)).find(s=>!found.has(s.id));
  let text = station.clue;
  if (earlier) text = `Encontraste ${station.name} antes de tiempo. El fragmento queda guardado. Buscá ahora «${earlier.name}» y después regresá a Tesoro.`;
  else if (found.size===3) text = station.id==='tesoro' ? 'La llave está completa. ¡El cofre es tuyo!' : 'Tenés los tres fragmentos. Volvé a escanear la estación «Tesoro» para abrir el cofre.';
  else if (found.has('tesoro') && missing.length) text += ` Te falta «${missing[0].name}».`;
  $('clue-label').textContent=station.stage.toUpperCase(); $('clue-title').textContent=station.title; $('clue-text').textContent=text;
}
function updateChest() {
  const lid=$('chest-lid'), prize=$('chest-prize');
  if (lid) lid.setAttribute('rotation',won?'-65 0 0':'0 0 0');
  if (prize) prize.setAttribute('visible',won);
}
function onFound(station) {
  if (!running || visible.has(station.id)) return;
  visible.add(station.id); active=station.id;
  const fresh=discover(found,station.id,ids);
  if (fresh) { persistent=saveProgress(storage,found); renderProgress(); notify(`Fragmento encontrado · ${found.size}/3`); }
  $('detection').textContent=`Marcador detectado · ${station.name}`; clueFor(station);
  if (canWin(found,ids,active) && !won) { won=true; updateChest(); $('victory').showModal(); }
}
function onLost(station) {
  visible.delete(station.id);
  if (active===station.id) {
    const other=[...visible].at(-1); active=other||null;
    if(other) { const s=stations.find(s=>s.id===other); clueFor(s); $('detection').textContent=`Marcador detectado · ${s.name}`; }
    else $('detection').textContent='Buscando marcador · la pista queda disponible';
  }
}
function loadScript(src) { return new Promise((resolve,reject)=>{const script=document.createElement('script'); script.src=src; script.onload=resolve; script.onerror=()=>reject(new Error('No pudimos cargar los recursos de realidad aumentada. Revisá la conexión y reintentá.')); document.head.append(script);}); }
let libraries;
async function ensureLibraries() {
  if(!libraries) libraries=(async()=>{await loadScript('./assets/vendor/aframe-1.8.0.min.js'); if(!window.AFRAME) throw Error('A-Frame no está disponible.'); if(!demo) { await loadScript('./assets/vendor/aframe-ar-3.4.8.js'); if(!AFRAME.systems.arjs) throw Error('AR.js no está disponible.'); }})();
  try { await libraries; } catch(e) { libraries=null; throw e; }
}
function sceneMarkup() {
  const source=detectorTest?'image':'webcam';
  const height=detectorTest?640:480;
  const ar=demo?'':`arjs="sourceType: ${source}; ${detectorTest?'sourceUrl: ./assets/marcadores/hiro.png;':''} detectionMode: mono; patternRatio: 0.5; cameraParametersUrl: ./assets/camera_para.dat; debugUIEnabled: false; sourceWidth: 640; sourceHeight: ${height}; canvasWidth: 640; canvasHeight: ${height};"`;
  return `<a-scene embedded ${ar} renderer="alpha: true; antialias: true;" xr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false" loading-screen="enabled: false">${stations.map((s,i)=>demo?`<a-entity id="marker-${s.id}" visible="false" position="0 0 -3" rotation="25 0 0">${models[i]}</a-entity>`:`<a-marker id="marker-${s.id}" type="pattern" url="./assets/marcadores/${s.marker}.patt" size="1" emitevents="true"><a-entity scale=".4 .4 .4">${models[i]}</a-entity></a-marker>`).join('')}<a-entity light="type: ambient; intensity: 1.5"></a-entity><a-entity light="type: directional; intensity: 2" position="1 3 2"></a-entity><a-entity camera ${demo?'position="0 .5 0"':''}></a-entity></a-scene>`;
}
function setupTestControls() {
  if(!testing) return;
  $('test-controls').hidden=false; $('test-controls').replaceChildren();
  stations.forEach(s=>{const b=document.createElement('button'); b.textContent=`${demo?'Simular':'Imagen'}: ${s.name}`; b.onclick=()=>{
    if(demo) { stations.forEach(o=>{const m=$(`marker-${o.id}`); m.setAttribute('visible',false); m.emit('markerLost');}); const m=$(`marker-${s.id}`); m.setAttribute('visible',true); m.emit('markerFound'); }
    else { const source=document.querySelector('a-scene').systems.arjs._arSession?.arSource; if(source?.domElement) { source.domElement.onload=null; source.domElement.src=`./assets/marcadores/${s.marker}.png`; } }
  }; $('test-controls').append(b);});
  if(demo) {const b=document.createElement('button'); b.textContent='Perder marcador'; b.onclick=()=>stations.forEach(s=>{const m=$(`marker-${s.id}`);m.setAttribute('visible',false);m.emit('markerLost');}); $('test-controls').append(b);}
}
async function start() {
  $('start').disabled=true; $('welcome').hidden=true; $('game').hidden=false; document.body.classList.add('playing'); clearError();
  if(!testing && !window.isSecureContext) { setError('La cámara requiere HTTPS o localhost. Abrí la URL pública segura del juego.'); $('start').disabled=false; return; }
  if(!testing && !navigator.mediaDevices?.getUserMedia) { setError('Este navegador no ofrece acceso a la cámara. Probá la URL HTTPS en Safari o Chrome y verificá que haya una cámara conectada.'); $('start').disabled=false; return; }
  try {
    await ensureLibraries(); running=true;
    $('scene-host').innerHTML=sceneMarkup();
    stations.forEach(s=>{const m=$(`marker-${s.id}`);m.addEventListener('markerFound',()=>onFound(s));m.addEventListener('markerLost',()=>onLost(s));});
    setupTestControls(); updateChest();
    $('detection').textContent=demo?'Detección simulada · elegí una estación':detectorTest?'Cargando imagen en el detector…':'Esperando acceso a la cámara…';
    if(!testing) cameraTimer=setTimeout(()=>{if(!document.querySelector('#arjs-video')?.srcObject) setError('La cámara no comenzó. Revisá el permiso del navegador, cerrá otras aplicaciones que la usen y reintentá.');},20000);
  } catch(e) { running=false; setError(e.message || 'No pudimos iniciar la realidad aumentada. Reintentá.'); }
  $('start').disabled=false;
}
window.addEventListener('camera-error',event=>{
  const err=event.detail?.error || event.detail || {};
  const name=err.name || '';
  setError(name==='NotAllowedError'?'El permiso de cámara fue rechazado. Permití la cámara en los ajustes del sitio y reintentá.':name==='NotFoundError'?'No encontramos una cámara. Conectá una o usá otro dispositivo.':'No pudimos acceder a la cámara. Revisá sus permisos y cerrá otras aplicaciones que la estén usando.');
});
window.addEventListener('arjs-video-loaded',()=>{clearTimeout(cameraTimer);clearError();$('detection').textContent='Cámara lista · buscá un marcador';});
function reset() {
  found.clear(); persistent=clearProgress(storage); active=null;visible.clear();won=false;clearTimeout(toastTimer);$('toast').hidden=true; clearError();
  renderProgress();updateChest();$('clue-label').textContent='TU MISIÓN';$('clue-title').textContent='Buscá la estación Inicio';$('clue-text').textContent='Encuadrá el marcador completo. Cada estación guarda un fragmento.';
  if(demo) stations.forEach(s=>$(`marker-${s.id}`)?.setAttribute('visible',false));
  for(const id of ['victory','reset-dialog']) if($(id).open) $(id).close();
  $('detection').textContent=demo?'Detección simulada · elegí una estación':'Buscando marcador';
  // El detector real podrá reencontrar el mismo marcador incluso si sigue a la vista.
  if(!demo) stations.forEach(s=>{const m=$(`marker-${s.id}`);if(m?.object3D) m.object3D.visible=false;});
}
$('start').onclick=start; $('retry').onclick=()=>location.reload();
$('help').onclick=()=>$('instructions').showModal();$('close-help').onclick=()=>$('instructions').close();
$('reset').onclick=()=>$('reset-dialog').showModal();$('cancel-reset').onclick=()=>$('reset-dialog').close();$('confirm-reset').onclick=reset;
$('play-again').onclick=()=>{$('victory').close();$('reset-dialog').showModal();};$('view-chest').onclick=()=>$('victory').close();
