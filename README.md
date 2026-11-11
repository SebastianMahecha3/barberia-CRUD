# Filo Barber Studio – CRUD del negocio (Laboratorio IV)

Página web single en React que administra los datos del negocio de la barbería Filo Barber Studio: **productos, clientes, proveedores, compras y ventas**. Consume una API ficticia creada con **json-server** y usa **hooks** (`useState`, `useEffect`), un **helper de peticiones** (`helpFetch`) y **Bootstrap 5** para la presentación.

Proyecto de Programación Web · Semestre VI · 2026-II · Universidad Libre.
Integrantes: Sebastian Mahecha, Juan Monsalve, Andrey Triana, Sebastian Vidal.

## Dos puertos

| Puerto | Servicio | Comando |
|---|---|---|
| 5173 | Página React (público) | `npm run dev` |
| 5000 | API ficticia json-server con los datos de `db.json` (privado) | `npm run api` |

React llama a `/api/productos`, `/api/clientes`, etc. Vite reenvía esas peticiones al puerto 5000 (ver `vite.config.js`), así funciona igual en el computador y en GitHub Codespaces.

## Cómo ejecutar

```
npm install
npm start          # levanta la API (5000) y la página (5173) al mismo tiempo
```
O en dos terminales: `npm run api` y `npm run dev`. Abrir http://localhost:5173.

Para ver la API directamente: http://localhost:5000/productos

Para volver a los datos iniciales: copiar `db.inicial.json` sobre `db.json`.

## GitHub Codespaces

1. En el repositorio: botón **Code → Codespaces → Create codespace on main**.
2. Esperar a que termine `npm install` (lo hace solo por `.devcontainer`).
3. En la terminal: `npm start`.
4. Abrir el puerto 5173 desde la pestaña **Ports** (o la notificación que aparece).

## Estructura

```
index.html                 Maqueta base con Bootstrap y el div #root
db.json                    Datos de la API ficticia (json-server los guarda aquí)
db.inicial.json            Copia de los datos iniciales
vite.config.js             Puerto 5173 y proxy /api -> 5000
public/bootstrap/          Bootstrap 5.3 (CSS y JS) local
public/estilos.css         Colores de la barbería sobre Bootstrap
src/index.jsx              Punto de entrada: monta Negocio
src/Negocio.jsx            Página principal: resumen y pestañas por tabla
src/helpers/helpFetch.js   Helper de peticiones GET, POST, PUT, DELETE con fetch
src/config/entidades.js    Campos y validaciones de cada tabla
src/components/CrudApp.jsx       CRUD reutilizable (useState, useEffect, helpFetch)
src/components/CrudForm.jsx      Formulario de crear/editar con validaciones
src/components/CrudTable.jsx     Tabla con buscador y totales
src/components/CrudTableRow.jsx  Fila con botones Editar y Eliminar
src/components/Loader.jsx        Indicador de carga
src/components/Message.jsx       Mensaje de error
```

## Endpoints de la API ficticia

Para cada tabla (`productos`, `clientes`, `proveedores`, `compras`, `ventas`):

| Método | Ruta | Acción |
|---|---|---|
| GET | /productos | Leer todos |
| GET | /productos/1 | Leer uno |
| POST | /productos | Crear |
| PUT | /productos/1 | Actualizar |
| DELETE | /productos/1 | Eliminar |

## Relación con el proyecto final

Las mismas entidades y el mismo patrón de CRUD (formulario + tabla + helper de peticiones) se usan en el panel administrativo del proyecto final Filo Barber Studio, donde la API ficticia se reemplaza por la API real en Express.js con PostgreSQL.
