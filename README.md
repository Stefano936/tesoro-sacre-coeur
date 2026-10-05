# El tesoro de Sacré Coeur

Juego web estático del [laboratorio de UCU](https://github.com/ucudal/TECND_Catalogo/blob/main/laboratorios/laboratorio_ar.md). No instala apps, no usa backend, cuentas, audio ni servicios pagos.

## Cómo jugar

Abrí el sitio HTTPS en Safari o Chrome en celular, o en un navegador de notebook con cámara. Tocá **Comenzar búsqueda** y permití la cámara. Escaneá Inicio (Hiro), Segunda pista (Kanji) y Tesoro (letra A). Reuní los tres fragmentos y escaneá Tesoro para abrir el cofre. Encontrar estaciones fuera de orden conserva el fragmento; volver a escanear permite consultar la pista. Reiniciar pide confirmación. El progreso se guarda en localStorage de ese navegador; si falla, se conserva en memoria mientras la página esté abierta.

## Preparación física pendiente

Abrí `marcadores.html` e imprimí en A4 horizontal, escala 100 %, papel mate, blanco y negro. Usá los PNG provistos sin recortar, deformar ni modificar el borde o el margen blanco. Cada cuadrado se imprime a 58 mm. Los patrones están en `assets/marcadores/` y corresponden a las imágenes oficiales de AR.js 3.4.8.

**No se han confirmado ubicaciones específicas del edificio.** La organización debe elegir tres lugares accesibles y autorizados, colocar las hojas separadas con rótulos visibles y buena luz, indicar dónde está Inicio y señalizar cómo llegar a las otras estaciones. Editá `config.js` con ubicaciones y pistas confirmadas. En cada ubicación, probá con celulares reales antes de la evaluación de Bruno, Maxi y Gonzalo. No bloquear pasillos ni usar espacios restringidos.

## Ejecutar y publicar

Con Node.js instalado: `npm run serve`, luego `http://localhost:4173`. No se requieren paquetes npm. Para cámara remota se necesita HTTPS; `file://` no sirve. La cámara suele requerir abrir el enlace directamente en Safari/Chrome, fuera de navegadores integrados de mensajería.

GitHub Pages: publicar la rama `main`, directorio raíz, con `.nojekyll`. Todas las rutas son relativas, compatibles con una subcarpeta de repositorio. Para actualizar: editar, ejecutar `npm test`, comprobar en navegador y hacer commit/push a `main`. El archivo `deployment.json` documenta la URL y el repositorio cuando la publicación fue verificada.

## Dependencias y compatibilidad

Se verificaron las releases oficiales el 5 de octubre de 2026: **AR.js 3.4.8** y **A-Frame 1.8.0**. Ambas se guardaron en `assets/vendor/`, con sus licencias. No se usa `master`, `latest` ni CDN en ejecución. `assets/camera_para.dat` es la calibración oficial de AR.js 3.4.8.

Fuentes: [releases AR.js](https://github.com/AR-js-org/AR.js/releases/tag/3.4.8), [releases A-Frame](https://github.com/aframevr/aframe/releases/tag/v1.8.0), [documentación AR.js](https://ar-js-org.github.io/AR.js-Docs/), [A-Frame 1.8.0](https://aframe.io/docs/1.8.0/introduction/). La documentación AR.js todavía ejemplifica 1.6.0/3.4.7; por eso la integración actual se comprueba con el detector y renderizador reales en el navegador, y no se infiere solo del ejemplo antiguo.

## Configuración y estructura

`config.js`: nombres de estaciones, ubicaciones y textos. `progress.js`: lógica pura y almacenamiento. `app.js`: cámara, eventos markerFound/markerLost, presentación y victoria. `visuals.js`: llave animada, cristal giratorio y cofre con tapa y recompensa. Geometrías locales de A-Frame, sin modelos externos. La pérdida del marcador oculta el objeto y mantiene los fragmentos y la última pista.

## Pruebas y evidencias

`npm test` verifica progreso inicial, duplicados, orden libre, persistencia, victoria condicionada al cofre, reinicio, datos corruptos e inaccesibilidad del almacenamiento. `evidencias/PRUEBAS.md` registra comprobaciones de navegador y limitaciones; las capturas JPG son capturas reales sin edición.

`?demo=1` habilita explícitamente botones que simulan markerFound/markerLost y muestra permanentemente **Modo demostración: detección simulada**, incluso en diálogos. No pide cámara y no prueba reconocimiento. Usa almacenamiento separado de las partidas reales.

`?detector=1` es un banco de prueba separado que pasa los PNG oficiales al detector real de AR.js usando `sourceType: image`. Sus botones cambian la imagen de entrada; **no emiten eventos de detección**. También usa almacenamiento separado y rótulo permanente. Permite comprobar correspondencia patrón/entidad y objetos 3D sin cámara; no sustituye la prueba de iluminación, distancia, inclinación, permisos y cámaras en el edificio.
