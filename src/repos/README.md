# 📦 repos/ — Aquí se hace la práctica

Esta carpeta es la **única capa que habla con Firestore**. Los componentes
de React solo llaman a estas funciones; nunca tocan la base directamente.

> ⚠️ **No vas a crear una base de datos.** Te conectas a un Firestore que ya
> existe (proyecto `nosqlpractica`). Cada equipo trabaja en **su propia
> colección** para no pisarse.

## Las colecciones

| Sección | Colección | ¿Quién la llena? |
|---------|-----------|------------------|
| CRUD (El Mostrador) | `equipo1`, `equipo2`, … | **Tu equipo**, con tu código CRUD |
| Queries (El Catálogo) | `catalogo` | Ya cargada (20 juguetes) — solo lectura |
| Tiempo real (La Vitrina en Vivo) | `vivo` | Ya cargada (8 juguetes) — compartida por la clase |

Tu equipo elige su colección en **`src/config/store.config.ts`**:

```ts
collections: {
  crud: "equipo1",     // 👈 cámbiala por la de tu equipo
  catalog: "catalogo",
  live: "vivo",
}
```

## Actividades (en orden)

Cada función sin terminar lanza un error `⛔ ACTIVIDAD N: ...` que verás en la
pantalla hasta que la implementes. **Cada función recibe como primer parámetro
el nombre de la colección.**

| # | Archivo | Qué haces | Conceptos NoSQL |
|---|---------|-----------|-----------------|
| **0** | `../config/store.config.ts` | Pon tu equipo, nombre, integrantes y la colección `crud`. | Configuración |
| **1** | `product.schema.ts` | Define el modelo `Product` y `ProductInput`. | Documento, denormalización |
| **2** | `products.repo.ts` → *CRUD* | `createProduct`, `updateProduct`, `deleteProduct`, `fetchAllProducts`. | `addDoc` / `updateDoc` / `deleteDoc` / `getDocs` |
| **3** | `products.repo.ts` → *Queries* | `fetchProductsPage`. | `where` + `orderBy` + `limit` + `startAfter` (índice compuesto) |
| **4** | `products.repo.ts` → *Tiempo real* | `subscribeProducts`. | `onSnapshot` (el "websocket" de Firestore) |

## Cómo probar

```bash
npm install
npm run dev      # abre http://localhost:3000
```

- **Actividad 2** se prueba en **El Mostrador**: crea/edita/borra en `equipo1`.
- **Actividad 3** en **El Catálogo**: filtra, ordena y pagina los 20 juguetes.
- **Actividad 4** en **La Vitrina en Vivo**: abre la página en dos pestañas y
  cambia el stock; debe actualizarse en ambas al instante.

> 💡 La primera consulta de la Actividad 3 que filtra **y** ordena te pedirá
> crear un **índice compuesto**: Firestore te da un enlace en el error, ábrelo
> y créalo con un clic.

## (Solo el profesor) Recargar los datos de ejemplo

```bash
npm run seed              # recarga catalogo + vivo
npm run seed -- catalogo  # solo catalogo
npm run seed -- vivo      # solo vivo
```
