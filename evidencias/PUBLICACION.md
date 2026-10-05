# Verificación de publicación

5 de octubre de 2026. Repositorio público creado para esta tarea: https://github.com/Stefano936/tesoro-sacre-coeur

GitHub Pages configurado con la rama `main`, raíz `/`, HTTPS obligatorio. La tarea oficial de Pages completó con éxito el despliegue del juego.

Se abrió en el navegador la URL pública https://stefano936.github.io/tesoro-sacre-coeur/ y su enlace a `marcadores.html`. Se comprobó la pantalla inicial, los textos, la página con los tres marcadores y su carga desde la subcarpeta del repositorio.

Solicitud HTTPS sin autenticación: HTTP 200 en la página inicial, marcadores.html, scripts y CSS, ambas dependencias vendorizadas, calibración de cámara, tres patrones `.patt` y tres imágenes PNG. AR.js descargado tiene el SHA-256 oficial de la release 3.4.8: `aec697f1662c8c2f2257eac149641a9f7b34c7c235fabcf7f67666a711ff917d`.

También se abrió `?detector=1` en la URL publicada: se reconocieron Hiro, Kanji y letra A, avanzando 1/3 → 2/3 → 3/3, con pantalla de victoria. No se usó autenticación del jugador ni simulación de eventos de detección. No se registraron errores de consola.

`13-publicacion-https-inicio.jpg` y `14-publicacion-https-victoria-detector.jpg` son capturas reales del sitio publicado. Las pruebas de cámara física e instalación del recorrido siguen pendientes según `PRUEBAS.md`.
