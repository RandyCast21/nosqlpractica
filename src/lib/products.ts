/**
 * Capa de acceso a datos de Firestore para la colección `products`.
 *
 * Aquí viven las 3 capacidades NoSQL que demuestra la práctica:
 *   1. CRUD          -> createProduct / updateProduct / deleteProduct / fetchAllProducts
 *   2. Queries       -> fetchProductsPage (where + orderBy + limit + startAfter)
 *   3. Tiempo real   -> subscribeProducts (onSnapshot)
 */
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
  type QueryConstraint,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Product, ProductInput } from "./types";

const productsCol = collection(db, "products");

/** Convierte un documento de Firestore en nuestro tipo Product. */
function toProduct(d: QueryDocumentSnapshot<DocumentData>): Product {
  return { id: d.id, ...(d.data() as Omit<Product, "id">) };
}

/* ============================================================
 *  1) CRUD
 * ========================================================== */

export async function createProduct(input: ProductInput) {
  return addDoc(productsCol, {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateProduct(id: string, input: ProductInput) {
  return updateDoc(doc(db, "products", id), {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id: string) {
  return deleteDoc(doc(db, "products", id));
}

/** Lectura puntual (getDocs) — sin tiempo real. */
export async function fetchAllProducts(): Promise<Product[]> {
  const snap = await getDocs(query(productsCol, orderBy("createdAt", "desc")));
  return snap.docs.map(toProduct);
}

/* ============================================================
 *  2) QUERIES: filtro + orden + paginación
 * ========================================================== */

export interface PageParams {
  /** Categoría a filtrar, o null para todas */
  category: string | null;
  /** Dirección de orden por precio */
  sortDir: "asc" | "desc";
  pageSize: number;
  /** Cursor: último documento de la página anterior */
  cursor?: QueryDocumentSnapshot<DocumentData> | null;
}

export interface PageResult {
  products: Product[];
  /** Cursor para pedir la siguiente página */
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

export async function fetchProductsPage(params: PageParams): Promise<PageResult> {
  const { category, sortDir, pageSize, cursor } = params;

  const constraints: QueryConstraint[] = [];
  if (category) constraints.push(where("category", "==", category));
  constraints.push(orderBy("price", sortDir));
  if (cursor) constraints.push(startAfter(cursor));
  // Pedimos uno de más para saber si hay página siguiente.
  constraints.push(limit(pageSize + 1));

  const snap = await getDocs(query(productsCol, ...constraints));
  const docs = snap.docs;
  const hasMore = docs.length > pageSize;
  const pageDocs = hasMore ? docs.slice(0, pageSize) : docs;

  return {
    products: pageDocs.map(toProduct),
    lastDoc: pageDocs.length ? pageDocs[pageDocs.length - 1] : null,
    hasMore,
  };
}

/* ============================================================
 *  3) TIEMPO REAL (onSnapshot)
 * ========================================================== */

/**
 * Se suscribe a la colección en tiempo real. Devuelve la función
 * para cancelar la suscripción (llamar en el cleanup del useEffect).
 */
export function subscribeProducts(
  onChange: (products: Product[]) => void,
  onError?: (e: Error) => void
) {
  return onSnapshot(
    query(productsCol, orderBy("createdAt", "desc")),
    (snap) => onChange(snap.docs.map(toProduct)),
    (err) => onError?.(err)
  );
}
