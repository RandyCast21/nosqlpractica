"use client";

import { useEffect, useRef, useState } from "react";
import { storeConfig } from "@/config/store.config";
import { subscribeProducts, updateProduct } from "@/repos/products.repo";
import type { Product } from "@/repos/product.schema";
import { categoryEmoji, formatPrice } from "@/lib/ui";
import SectionShell from "./SectionShell";

// Colección compartida por toda la clase para ver los cambios en vivo.
const LIVE_COLL = storeConfig.collections.live;

export default function LiveSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<Set<string>>(new Set());

  // Para detectar qué documentos cambiaron entre snapshots y resaltarlos.
  const lastSeen = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const unsub = subscribeProducts(
      LIVE_COLL,
      (items) => {
        const changed = new Set<string>();
        const next = new Map<string, number>();
        for (const p of items) {
          const stamp = p.updatedAt?.seconds ?? 0;
          next.set(p.id, stamp);
          const prev = lastSeen.current.get(p.id);
          if (prev === undefined || prev !== stamp) changed.add(p.id);
        }
        // En el primer snapshot no resaltamos todo.
        const isFirst = lastSeen.current.size === 0;
        lastSeen.current = next;
        setProducts(items);
        setConnected(true);
        if (!isFirst && changed.size) {
          setFlash(changed);
          setTimeout(() => setFlash(new Set()), 1500);
        }
      },
      (e) => setError(e.message)
    );
    return () => unsub();
  }, []);

  async function bumpStock(p: Product, delta: number) {
    const { id, ...rest } = p;
    void id;
    await updateProduct(LIVE_COLL, p.id, {
      ...rest,
      stock: Math.max(0, p.stock + delta),
    });
    // No hace falta recargar: onSnapshot actualizará la lista solo.
  }

  return (
    <SectionShell
      badge="Sección 3 · Tiempo real"
      emoji="📡"
      title="La Vitrina en Vivo"
      subtitle={`onSnapshot — lo que cambia un equipo, todos lo ven al instante · colección "${LIVE_COLL}"`}
      color="#f59e0b"
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${
            connected
              ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-200"
              : "bg-zinc-200 text-zinc-500 dark:bg-white/10"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              connected ? "animate-pulse bg-green-500" : "bg-zinc-400"
            }`}
          />
          {connected ? "EN VIVO" : "Conectando…"}
        </span>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          💡 Abre esta página en otra pestaña o dispositivo y mueve el stock:
          se actualiza al instante en todas.
        </p>
      </div>

      {error && (
        <p className="mb-4 break-all rounded-lg bg-red-100 px-3 py-2 font-mono text-xs text-red-700 dark:bg-red-500/20 dark:text-red-200">
          {error}
        </p>
      )}

      {products.length === 0 ? (
        <p className="py-10 text-center text-zinc-400">
          Sin juguetes todavía. Agrega uno en El Mostrador y aparecerá aquí en
          vivo. ✨
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <li
              key={p.id}
              className={`flex items-center gap-3 rounded-xl border p-3 transition-colors duration-500 ${
                flash.has(p.id)
                  ? "border-amber-400 bg-amber-100 dark:bg-amber-500/20"
                  : "border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5"
              }`}
            >
              <span className="text-3xl">{categoryEmoji(p.category)}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-zinc-800 dark:text-zinc-100">
                  {p.name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {formatPrice(p.price)} · stock{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-300">
                    {p.stock}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => bumpStock(p, -1)}
                  className="h-7 w-7 rounded-full bg-zinc-200 font-bold text-zinc-700 hover:bg-zinc-300 dark:bg-white/10 dark:text-zinc-100"
                  aria-label="Restar stock"
                >
                  −
                </button>
                <button
                  onClick={() => bumpStock(p, 1)}
                  className="h-7 w-7 rounded-full bg-amber-500 font-bold text-white hover:bg-amber-600"
                  aria-label="Sumar stock"
                >
                  +
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </SectionShell>
  );
}
