"use client";

import { useEffect, useRef, useState } from "react";
import type {
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { storeConfig } from "@/config/store.config";
import { fetchProductsPage } from "@/repos/products.repo";
import type { Product } from "@/repos/product.schema";
import { categoryEmoji, formatPrice } from "@/lib/ui";
import SectionShell from "./SectionShell";

// Colección pre-cargada (solo lectura) sobre la que se practican las queries.
const CATALOG_COLL = storeConfig.collections.catalog;

const PAGE_SIZE = 6;
type Cursor = QueryDocumentSnapshot<DocumentData> | null;

export default function CatalogSection() {
  const [category, setCategory] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // cursors.current[i] = cursor para arrancar la página i (página 0 = null)
  const cursors = useRef<Cursor[]>([null]);

  async function loadPage(p: number) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchProductsPage(CATALOG_COLL, {
        category,
        sortDir,
        pageSize: PAGE_SIZE,
        cursor: cursors.current[p] ?? null,
      });
      cursors.current[p + 1] = res.lastDoc;
      setProducts(res.products);
      setHasMore(res.hasMore);
      setPage(p);
    } catch (e) {
      setError((e as Error).message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  // Al cambiar filtro u orden: reinicia la paginación desde la página 0.
  useEffect(() => {
    cursors.current = [null];
    // Re-consulta desde la página 0 al cambiar filtro/orden. setState intencional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPage(0);
    // loadPage depende de los filtros actuales; no debe ir en las deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sortDir]);

  const isIndexError = error?.toLowerCase().includes("index");

  return (
    <SectionShell
      badge="Sección 2 · Queries"
      emoji="🔍"
      title="El Catálogo"
      subtitle={`Filtra por categoría, ordena por precio y pagina · colección "${CATALOG_COLL}"`}
      color="#2563eb"
    >
      {/* Controles de consulta */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <select
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-white/10 dark:text-zinc-100"
          value={category ?? ""}
          onChange={(e) => setCategory(e.target.value || null)}
        >
          <option value="">Todas las categorías</option>
          {storeConfig.categories.map((c) => (
            <option key={c} value={c}>
              {categoryEmoji(c)} {c}
            </option>
          ))}
        </select>

        <select
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-white/10 dark:text-zinc-100"
          value={sortDir}
          onChange={(e) => setSortDir(e.target.value as "asc" | "desc")}
        >
          <option value="asc">Precio: menor a mayor ↑</option>
          <option value="desc">Precio: mayor a menor ↓</option>
        </select>

        <span className="ml-auto rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
          {PAGE_SIZE} por página
        </span>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700 dark:bg-red-500/20 dark:text-red-200">
          <p className="font-semibold">No se pudo ejecutar la consulta.</p>
          {isIndexError && (
            <p className="mt-1">
              Firestore necesita un <strong>índice compuesto</strong> para
              filtrar por categoría y ordenar por precio a la vez. Abre el
              enlace del mensaje de abajo (un clic lo crea):
            </p>
          )}
          <p className="mt-1 break-all font-mono text-xs opacity-80">{error}</p>
        </div>
      )}

      {/* Rejilla de productos */}
      {loading ? (
        <p className="py-10 text-center text-zinc-400">Consultando Firestore…</p>
      ) : products.length === 0 ? (
        <p className="py-10 text-center text-zinc-400">
          No hay juguetes para esta consulta.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <li
              key={p.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5"
            >
              <div className="flex h-28 items-center justify-center bg-gradient-to-br from-sky-100 to-blue-50 text-6xl dark:from-sky-500/20 dark:to-blue-500/10">
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  categoryEmoji(p.category)
                )}
              </div>
              <div className="flex flex-1 flex-col p-3">
                <p className="font-bold text-zinc-800 dark:text-zinc-100">
                  {p.name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {p.category}
                  {p.ageRange ? ` · ${p.ageRange}` : ""}
                </p>
                <p className="mt-auto pt-2 text-lg font-extrabold text-blue-600 dark:text-blue-300">
                  {formatPrice(p.price)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Paginación */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={() => loadPage(page - 1)}
          disabled={page === 0 || loading}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:text-zinc-200 dark:hover:bg-white/10"
        >
          ← Anterior
        </button>
        <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
          Página {page + 1}
        </span>
        <button
          onClick={() => loadPage(page + 1)}
          disabled={!hasMore || loading}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:text-zinc-200 dark:hover:bg-white/10"
        >
          Siguiente →
        </button>
      </div>
    </SectionShell>
  );
}
