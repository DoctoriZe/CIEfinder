# CIEfinder by DoctoriZe · v1.2

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

El archivo `data.js` trae **843 códigos integrados** (145 CIE-10 + 698 CIE-9,
incluyendo el manual de codificación CIE-9 reducido con diagnósticos, consultas,
causas externas y procedimientos). No es el listado oficial completo (que tiene
decenas de miles de entradas), pero cubre un uso clínico amplio desde el primer momento.

**Sin tocar código:** desde la pestaña **Ajustes** de la app hay un botón
"Importar catálogo (JSON/CSV)" para cargar códigos nuevos o actualizados
(por ejemplo desde la OMS, CDC/CMS para CIE-9-CM, o el ministerio de salud del país).
Si un código ya existe, se actualiza; si no, se añade. Ver el formato esperado
dentro de esa misma pantalla.

**Editando el archivo directamente**, el formato dentro del arreglo `CIE_BASE_DATA` es:

```js
{ code: "J45.9", sys: "CIE10", es: "Asma, no especificada", en: "Asthma, unspecified" },
```

- `code`: el código tal cual.
- `sys`: `"CIE10"` o `"CIE9"`.
- `es` / `en`: la descripción en cada idioma. Los códigos CIE-9 que provienen del
  manual en español y no tenían traducción oficial usan el mismo texto en `en`
  como respaldo, para no dejar el campo vacío.

Después de editar `data.js`, vuelve a publicar la carpeta (repetir el paso 1)
para que los cambios lleguen a la app instalada.

## 4. Estructura del proyecto

```
index.html            → estructura de la app
styles.css             → estilos e identidad visual
data.js                 → catálogo de códigos CIE-9/CIE10 (843 códigos integrados)
app.js                  → lógica: búsqueda, historial, favoritos, importar catálogo
manifest.json           → metadatos de instalación (nombre, ícono, colores)
service-worker.js       → caché para uso sin conexión
icon-16/32/180/192/512/maskable-512.png → íconos de la app (generados desde el logo)
```

Historial y favoritos se guardan en el propio celular (localStorage del navegador),
no se envían a ningún servidor.

## 5. Posibles mejoras futuras
- Notas clínicas personales por código.
- Modo oscuro.
