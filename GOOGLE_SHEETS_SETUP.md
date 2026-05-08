# Configuracion de Google Sheets y Apps Script

## 1. Crea la hoja

1. Crea un Google Sheet nuevo.
2. Cambiale el nombre a algo como `Inscripciones Rising Raimon`.
3. Crea estas tres pestanas:
   - `Madrid`
   - `Tarragona`
   - `Barcelona`

No hace falta que pongas columnas manualmente. El script las crea solo en el primer envio.

## 2. Crea el Apps Script

1. En la hoja, abre `Extensiones > Apps Script`.
2. Borra el contenido por defecto.
3. Copia el archivo [google-apps-script/Code.gs](google-apps-script/Code.gs).
4. Sustituye `SPREADSHEET_ID` por el ID real de tu Google Sheet.
   - Es la parte larga de la URL entre `/d/` y `/edit`.
5. Guarda el proyecto.

## 3. Despliegalo como web app

1. Pulsa `Implementar > Nueva implementacion`.
2. Tipo: `Aplicacion web`.
3. Ejecutar como: `Tu cuenta`.
4. Quien tiene acceso: `Cualquiera`.
5. Implementa y copia la URL final del tipo:
   - `https://script.google.com/macros/s/.../exec`

## 4. Conecta la web

1. Abre [assets/js/config.js](assets/js/config.js).
2. Pega la URL en `formsEndpoint`.

Ejemplo:

```js
window.APP_CONFIG = {
  formsEndpoint: "https://script.google.com/macros/s/TU_URL/exec",
  contactEmail: "risingraimon@gmail.com",
  privacyUrl: "https://risingraimon.es/privacy-policy/",
  mainSiteUrl: "https://www.risingraimon.es",
  socials: {
    instagram: "https://www.instagram.com/risingraimon/",
    tiktok: "https://www.tiktok.com/@RisingRaimon",
    youtube: "https://www.youtube.com/@RisingRaimon"
  }
};
```

## 5. Verifica

1. Sube la web a GitHub Pages.
2. Haz una prueba desde `/madrid/`.
3. Haz otra desde `/cataluna/`, eligiendo una zona.
4. Comprueba:
   - que el correo llega,
   - que la fila cae en la pestana correcta,
   - y que el mensaje final aparece en la web.

## Notas importantes

- La web usa `fetch` con `mode: "no-cors"` para evitar problemas tipicos de CORS con Apps Script desde GitHub Pages.
- Si cambias los nombres de las pestanas, actualiza tambien `ALLOWED_SHEETS` en el script.
- Cuando metas las fotos finales de ropa y de grupos, no hace falta tocar la logica del formulario; solo actualizaremos el contenido visual.
