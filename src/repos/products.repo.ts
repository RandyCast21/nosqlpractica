/**
 * ============================================================
 *  REPOSITORIO DE JUGUETES
 * ============================================================
 *
 *  Un "repositorio" es la única capa que habla con la base de datos.
 *  Los componentes de React NUNCA llaman a Firestore directo: llaman a
 *  estas funciones. Así, si mañana cambias Firestore por otra base,
 *  solo tocas este archivo.
 *
 *  NOVEDAD IMPORTANTE:
 *  Cada función recibe como PRIMER parámetro el nombre de la COLECCIÓN
 *  sobre la que trabaja, porque cada sección usa una distinta:
 *     • CRUD        -> la colección de TU EQUIPO   (ej. "equipo1")
 *     • Queries     -> la colección "catalogo"      (ya viene con 20 juguetes)
 *     • Tiempo real -> la colección "vivo"          (compartida por la clase)
 *  Esos nombres salen de `store.config.ts`; tú solo recibes el string.
 *
 *  Aquí se completan las 3 capacidades NoSQL de la práctica:
 *     ACTIVIDAD 2 · CRUD        -> create / update / delete / read (fetchAll)
 *     ACTIVIDAD 3 · Queries     -> where + orderBy + limit + startAfter
 *     ACTIVIDAD 4 · Tiempo real -> onSnapshot
 *
 *  Cada función marcada con  // ⛔ TODO  está SIN implementar. Tu tarea
 *  es reemplazar el cuerpo (la línea que lanza el Error) por el código
 *  correcto.
 *
 *  Glosario de Acciones del SDK de Firestore (modular, v9+):
 *     collection(db, nombreColeccion)       -> referencia a la colección
 *     doc(db, nombreColeccion, id)          -> referencia a 1 documento
 *     addDoc(col, data)                     -> CREATE (id automático)
 *     updateDoc(ref, data)                  -> UPDATE
 *     deleteDoc(ref)                        -> DELETE
 *     getDocs(query(...))                   -> READ puntual
 *     onSnapshot(query(...), cb)            -> READ en tiempo real
 *     query(col, where(...), orderBy(...))  -> arma la consulta
 *     serverTimestamp()                     -> fecha que pone el servidor
 * ============================================================
 */
/*
 * Mientras el repositorio está en "modo plantilla" hay imports y
 * parámetros que aún no se usan (los usarás al completar las actividades).
 * Por eso desactivamos el aviso de "variable sin usar". Cuando termines
 * todas las actividades puedes borrar la siguiente línea.
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  type CollectionReference,
  type QueryConstraint,
  type QueryDocumentSnapshot,
  type DocumentData,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product, ProductInput } from "./product.schema";

/**
 * Devuelve la referencia a una colección por su nombre.
 */
function colRef(collectionName: string): CollectionReference<DocumentData> {
  return collection(db, collectionName);
}

/**
 * Convierte un documento de Firestore en nuestro tipo `Product`.
 * El `id` vive FUERA de los datos del documento, por eso lo unimos aquí.
 */
function toProduct(d: QueryDocumentSnapshot<DocumentData>): Product {
  return { id: d.id, ...(d.data() as Omit<Product, "id">) };
}

/* ============================================================
 *  ACTIVIDAD 2 · CRUD   (sobre la colección de tu equipo)
 *  Create · Read · Update · Delete
 * ========================================================== */

/**
 * CREATE — agrega un juguete nuevo a `collectionName`.
 * Pista: usa `addDoc(colRef(collectionName), {...})` y añade
 *        `createdAt: serverTimestamp()` y `updatedAt: serverTimestamp()`.
 */
export async function createProduct(collectionName: string, input: ProductInput) {
  void collectionName;
  void input; // (evita "variable sin usar" mientras lo implementas)
  // ⛔ TODO Actividad 2 — reemplaza esta línea por el addDoc:
  throw new Error("⛔ ACTIVIDAD 2: implementa createProduct con addDoc().");
}

/**
 * UPDATE — edita el juguete `id` dentro de `collectionName`.
 * Pista: `updateDoc(doc(db, collectionName, id), {...input, updatedAt: serverTimestamp()})`.
 */
export async function updateProduct(
  collectionName: string,
  id: string,
  input: ProductInput
) {
  void collectionName;
  void id;
  void input;
  // ⛔ TODO Actividad 2 — reemplaza esta línea por el updateDoc:
  throw new Error("⛔ ACTIVIDAD 2: implementa updateProduct con updateDoc().");
}

/**
 * DELETE — elimina el juguete `id` dentro de `collectionName`.
 * Pista: `deleteDoc(doc(db, collectionName, id))`.
 */
export async function deleteProduct(collectionName: string, id: string) {
  void collectionName;
  void id;
  // ⛔ TODO Actividad 2 — reemplaza esta línea por el deleteDoc:
  throw new Error("⛔ ACTIVIDAD 2: implementa deleteProduct con deleteDoc().");
}

/**
 * READ (lectura puntual, sin tiempo real) — trae TODOS los juguetes de
 * `collectionName` ordenados del más nuevo al más viejo.
 * Pista: `getDocs(query(colRef(collectionName), orderBy("createdAt", "desc")))`
 *        y mapea con `snap.docs.map(toProduct)`.
 */
export async function fetchAllProducts(
  collectionName: string
): Promise<Product[]> {
  void collectionName;
  // ⛔ TODO Actividad 2 — reemplaza esta línea por el getDocs + map:
  throw new Error("⛔ ACTIVIDAD 2: implementa fetchAllProducts con getDocs().");
}




/* ============================================================
 *  ACTIVIDAD 3 · QUERIES   (sobre la colección "catalogo")
 *  where  +  orderBy  +  limit  +  startAfter
 * ========================================================== */

export interface PageParams {
  /** Categoría a filtrar, o `null` para todas. */
  category: string | null;
  /** Dirección de orden por precio. */
  sortDir: "asc" | "desc";
  /** Cuántos juguetes por página. */
  pageSize: number;
  /** Cursor: último documento de la página anterior. */
  cursor?: QueryDocumentSnapshot<DocumentData> | null;
}

export interface PageResult {
  products: Product[];
  /** Cursor para pedir la siguiente página (o null si no hay). */
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  /** ¿Existe una página siguiente? */
  hasMore: boolean;
}

/**
 * Trae UNA página de juguetes de `collectionName` aplicando filtro,
 * orden y paginación.
 *
 * Guía paso a paso (arma un arreglo de "constraints" y pásalo a query):
 *   1. Si hay `category`, agrega  where("category", "==", category).
 *   2. Siempre agrega           orderBy("price", sortDir).
 *   3. Si hay `cursor`, agrega   startAfter(cursor).
 *   4. Agrega                    limit(pageSize + 1).
 *      (pedimos UNO de más para saber si hay página siguiente)
 *   5. const snap = await getDocs(query(colRef(collectionName), ...constraints));
 *   6. hasMore = snap.docs.length > pageSize;
 *      pageDocs = hasMore ? snap.docs.slice(0, pageSize) : snap.docs;
 *   7. Devuelve { products, lastDoc, hasMore }.
 *
 * 💡 Filtrar por categoría Y ordenar por precio a la vez requiere un
 *    ÍNDICE COMPUESTO: la primera vez Firestore lanzará un error con un
 *    enlace; ábrelo y crea el índice con un clic.
 */
export async function fetchProductsPage(
  collectionName: string,
  params: PageParams
): Promise<PageResult> {
  void collectionName;
  void params; // params = { category, sortDir, pageSize, cursor }

  // ⛔ TODO Actividad 3 — declara `const constraints: QueryConstraint[] = []`,
  //    llénalo siguiendo la guía de arriba y ejecuta la consulta con getDocs.
  //    Por ahora lanzamos un error:
  throw new Error("⛔ ACTIVIDAD 3: implementa fetchProductsPage con where/orderBy/limit/startAfter.");
}





/* ============================================================
 *  ACTIVIDAD 4 · TIEMPO REAL   (sobre la colección "vivo")
 *  onSnapshot — el "websocket" de Firestore
 * ========================================================== */

/**
 * Se suscribe a `collectionName` EN TIEMPO REAL. Cada vez que cualquier
 * dispositivo crea/edita/borra un juguete, Firestore vuelve a llamar a
 * `onChange` con la lista actualizada. Es el equivalente a un websocket,
 * pero gratis y automático.
 *
 * Debe DEVOLVER la función para cancelar la suscripción (la que regresa
 * `onSnapshot`); el componente la llama al desmontarse.
 *
 * Pista:
 *   return onSnapshot(
 *     query(colRef(collectionName), orderBy("createdAt", "desc")),
 *     (snap) => onChange(snap.docs.map(toProduct)),
 *     (err) => onError?.(err)
 *   );
 */
export function subscribeProducts(
  collectionName: string,
  onChange: (products: Product[]) => void,
  onError?: (e: Error) => void
): Unsubscribe {
  void collectionName;
  void onChange;
  // ⛔ TODO Actividad 4 — reemplaza estas 2 líneas por el onSnapshot.
  //    (Mientras no esté hecho, avisamos del error y no rompemos la UI.)
  onError?.(new Error("⛔ ACTIVIDAD 4: implementa subscribeProducts con onSnapshot."));
  return () => {};
}
