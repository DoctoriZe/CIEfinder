# CIEfinder by DoctoriZe · v1.2.4

App web (PWA) para buscar códigos CIE-9 y CIE-10, en español e inglés,
con historial de búsquedas y favoritos. Funciona sin conexión una vez instalada.

## 1. Publicarla (necesario para instalarla en Android)

Un PWA necesita servirse por HTTPS para poder instalarse. Opciones gratuitas,
sin necesidad de saber programar:

**Opción A — GitHub Pages**
1. Crea un repositorio en GitHub y sube todo el contenido de esta carpeta.
2. Ve a Settings → Pages → Source: "main branch" → Save.
3. En 1-2 minutos tendrás una URL tipo `https://tuusuario.github.io/ciefinder/`.

**Opción B — Netlify (arrastrar y soltar)**
1. Entra a https://app.netlify.com/drop
2. Arrastra esta carpeta completa.
3. Netlify te da una URL al instante (ej. `https://ciefinder.netlify.app`).

## 2. Instalar en el celular Android

1. Abre la URL publicada en Chrome (Android).
2. Aparecerá un aviso "Agregar a pantalla de inicio" / "Instalar app"
   (o desde el menú ⋮ → "Instalar aplicación").
3. Se instala como una app normal, con el ícono de DoctoriZe, y abre a pantalla completa.


## 3. Ampliar o actualizar el catálogo de códigos

El archivo `data.js` trae **18,715 códigos integrados completamente en ESPAÑOL** (14,333 CIE-10 + 4,382 CIE-9).

**CIE-10:** 14,333 códigos - Catálogo completo (icdcode.info, descripciones en español)

**CIE-9:** 4,382 códigos  
- 3,955: CMS v32 oficial de diagnósticos ICD-9-CM (traducidos al español médico)
- 427: Códigos especiales locales (consultas V, causas externas E, procedimientos)

Desde Ajustes > Importar catálogo se puede ampliar sin tocar este archivo.
