# Registro de pruebas · 5 de octubre de 2026

## Entorno y método

Navegador Chromium integrado de Codex. Sitio local servido por Node.js en `localhost:4173`. Tamaños comprobados: 390 × 844 (celular) y 1280 × 900 (escritorio). Capturas JPG obtenidas directamente por la API del navegador, sin generación ni edición de imágenes.

**Detector real, fuente de imagen:** abrir `?detector=1`, comenzar y usar los botones Imagen. AR.js 3.4.8 recibe los PNG oficiales mediante `sourceType: image`; jsartoolkit analiza los píxeles y emite los eventos que usa el juego. No se emiten eventos desde los controles de este modo. Las imágenes y sus `.patt` se obtuvieron de la misma release oficial. La primera carga inicializa el contexto; al cambiar imagen se evita reinicializar el contexto para conservar los tres patrones cargados. Los tres fueron identificados correctamente, cada uno con su objeto 3D; el cofre cambió a abierto al completar el progreso.

**Demostración:** `?demo=1`, botones que emiten markerFound y markerLost sobre las entidades de la escena. Rótulo permanente y almacenamiento separado; este método prueba interfaz/lógica, no reconocimiento.

**Cámara física:** se intentó iniciar el juego normal. El sistema devolvió `NotAllowedError: Permission denied by system`. Se verificó el mensaje de permiso rechazado, progreso 0/3 y acciones de recuperación. No se reconocieron marcadores mediante cámara física.

## Resultados

| Comprobación | Método | Resultado |
|---|---|---|
| Inicio 0/3 | navegador/demo y tests Node | correcto |
| Descubrimientos Inicio/Segunda pista/Tesoro | detector real sobre imágenes y demo | 1/3, 2/3, 3/3 |
| Eventos repetidos / mismo marcador continuo | demo, detector continuo y test Node | no suma ni repite recompensa |
| Tesoro encontrado primero | demo y test Node | 1/3, orientación hacia Inicio, no victoria |
| Progreso tras recarga | navegador demo y test Node | 2/3 conservado |
| Tres fragmentos sin volver al cofre | demo y test Node | 3/3 con indicación de regresar; no victoria |
| Regreso al cofre con tres | demo y detector real | pantalla final y tapa abierta |
| Reinicio y cancelación | navegador demo y test Node | cancelar conserva 3/3; confirmar vuelve a 0/3 |
| Datos corruptos/inaccesibles en localStorage | test Node | recuperación sin excepción, memoria y aviso |
| Adaptación celular/escritorio | navegador | controles legibles, pantalla inicial y juego adaptados |
| Patrones y recursos | detector, red HTTP y sintaxis JS | tres patrones correctos y dependencias locales |
| Consola | navegador | sin errores JS relevantes; avisos informativos internos de ARToolkit y aviso de AR.js sobre markersAreaEnabled |
| Permiso rechazado | cámara normal del navegador | mensaje útil, sin pantalla vacía |

`node --test tests/*.test.js`: 2 pruebas de escenarios completos aprobadas. Comprobación de sintaxis de app.js, visuals.js y markers.js aprobada.

## Capturas

- `01-inicio-escritorio.jpg`: inicio real, escritorio.
- `02-juego-demo-0-de-3.jpg`: juego 0/3, **demostración**.
- `03-fuera-de-orden-demo.jpg`: Tesoro primero, **demostración**.
- `04-victoria-demo.jpg`: victoria, **demostración**.
- `05-detector-real-inicio.jpg`: Hiro reconocido y llave 3D, **imagen estática en detector real**.
- `06-detector-real-segunda-pista.jpg`: Kanji reconocido y cristal 3D, **imagen estática en detector real**.
- `07-victoria-detector-real.jpg`: victoria del **detector real sobre imágenes**.
- `08-cofre-abierto-detector-real.jpg`: letra A reconocida, cofre y recompensa 3D, **imagen estática en detector real**.
- `09-marcadores-imprimibles.jpg`: página con los tres marcadores reales.
- `10-inicio-celular.jpg`: inicio real a tamaño celular.
- `11-camara-no-disponible.jpg`: rechazo del permiso por el sistema.
- `12-juego-demo-escritorio.jpg`: juego y objeto 3D a tamaño escritorio, **demostración**.

## Pendiente en el edificio

Colocar las hojas en puntos accesibles autorizados, señalizar el trayecto e indicar dónde comienza Inicio. Comprobar en teléfonos reales la cámara, distancia de escaneo, luz, inclinación, reflejos y correspondencia de las ubicaciones. No se afirma que el recorrido físico esté verificado. El contexto inseguro, las dependencias faltantes y otros tipos de error de cámara se manejan en código, pero no se forzaron todos esos fallos en navegador.

La verificación HTTPS pública posterior al despliegue se registra en `PUBLICACION.md`.
