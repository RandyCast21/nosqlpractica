"use client";

import { useEffect, useState } from "react";
import { storeConfig } from "@/config/store.config";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  fetchAllProducts,
} from "@/repos/products.repo";
import type { Product, ProductInput } from "@/repos/product.schema";
import { categoryEmoji, formatPrice } from "@/lib/ui";
import SectionShell from "./SectionShell";

// Colección de TU EQUIPO (definida en store.config.ts). Todo el CRUD
// de esta sección trabaja sobre ella.
const CRUD_COLL = storeConfig.collections.crud;

const EMPTY_FORM: ProductInput = {
  name: "",
  description: "",
  category: storeConfig.categories[0] ?? "",
  price: 0,
  stock: 0,
  ageRange: "",
  brand: "",
  imageUrl: "",
};

export default function CrudSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductInput>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setProducts(await fetchAllProducts(CRUD_COLL));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Carga inicial al montar (getDocs). El setState de loading es intencional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function startEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price,
      stock: p.stock,
      ageRange: p.ageRange ?? "",
      brand: p.brand ?? "",
      imageUrl: p.imageUrl ?? "",
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        await updateProduct(CRUD_COLL, editingId, form);
      } else {
        await createProduct(CRUD_COLL, form);
      }
      resetForm();
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Retirar este juguete de la juguetería?")) return;
    setError(null);
    try {
      await deleteProduct(CRUD_COLL, id);
      if (editingId === id) resetForm();
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-white/15 dark:bg-white/10 dark:text-zinc-100";

  return (
    <SectionShell
      badge="Sección 1 · CRUD"
      emoji="🧸"
      title="El Mostrador"
      subtitle={`Crear, leer, actualizar y eliminar juguetes · colección "${CRUD_COLL}"`}
      color="#e11d48"
    >
      <p className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
        🗂️ Estás trabajando en la colección{" "}
        <code className="rounded bg-rose-200/70 px-1.5 py-0.5 font-bold dark:bg-rose-500/30">
          {CRUD_COLL}
        </code>
        . Cámbiala por la de tu equipo en{" "}
        <code className="font-mono">src/config/store.config.ts</code>.
      </p>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,380px)_1fr]">
        {/* ---- Formulario ---- */}
        <form
          onSubmit={handleSubmit}
          className="space-y-3 rounded-2xl bg-rose-50/70 p-4 dark:bg-rose-500/10"
        >
          <p className="font-bold text-rose-700 dark:text-rose-200">
            {editingId ? "✏️ Editar juguete" : "➕ Nuevo juguete"}
          </p>

          <input
            className={inputClass}
            placeholder="Nombre del juguete *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <select
            className={inputClass}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {storeConfig.categories.map((c) => (
              <option key={c} value={c}>
                {categoryEmoji(c)} {c}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-3">
            <input
              className={inputClass}
              type="number"
              min={0}
              step="0.01"
              placeholder="Precio"
              value={form.price || ""}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
            />
            <input
              className={inputClass}
              type="number"
              min={0}
              placeholder="Stock"
              value={form.stock || ""}
              onChange={(e) =>
                setForm({ ...form, stock: Number(e.target.value) })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              className={inputClass}
              placeholder="Edad (ej. 3-6 años)"
              value={form.ageRange}
              onChange={(e) => setForm({ ...form, ageRange: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Marca"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
            />
          </div>

          <input
            className={inputClass}
            placeholder="URL de imagen (opcional)"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />

          <textarea
            className={inputClass}
            placeholder="Descripción"
            rows={2}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-rose-700 disabled:opacity-50"
            >
              {saving ? "Guardando…" : editingId ? "Guardar cambios" : "Agregar"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-white/15 dark:text-zinc-300 dark:hover:bg-white/10"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* ---- Lista ---- */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              {products.length} juguete(s) en el inventario
            </p>
            <button
              onClick={load}
              className="text-sm font-semibold text-rose-600 hover:underline dark:text-rose-300"
            >
              ↻ Recargar (getDocs)
            </button>
          </div>

          {error && (
            <p className="mb-3 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700 dark:bg-red-500/20 dark:text-red-200">
              {error}
            </p>
          )}

          {loading ? (
            <p className="py-8 text-center text-zinc-400">Cargando…</p>
          ) : products.length === 0 ? (
            <p className="py-8 text-center text-zinc-400">
              Aún no hay juguetes. ¡Agrega el primero! 🧸
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {products.map((p) => (
                <li
                  key={p.id}
                  className="flex gap-3 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/5"
                >
                  <span className="text-3xl">{categoryEmoji(p.category)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-zinc-800 dark:text-zinc-100">
                      {p.name}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {p.category} · stock {p.stock}
                    </p>
                    <p className="font-semibold text-rose-600 dark:text-rose-300">
                      {formatPrice(p.price)}
                    </p>
                    <div className="mt-1 flex gap-3 text-xs font-semibold">
                      <button
                        onClick={() => startEdit(p)}
                        className="text-blue-600 hover:underline dark:text-blue-300"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-600 hover:underline dark:text-red-300"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </SectionShell>
  );
}
