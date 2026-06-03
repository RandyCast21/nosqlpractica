/**
 * ============================================================
 *  ACTIVIDAD 1 · EL ESQUEMA (schema) DEL JUGUETE
 * ============================================================
 *
 *  En una base NoSQL como Firestore NO existen tablas ni columnas:
 *  cada juguete se guarda como un DOCUMENTO dentro de la colección
 *  Un documento es básicamente un objeto JSON.
 *
 *  El "schema" es el contrato de TypeScript que describe qué forma
 *  tiene ese documento cuando lo LEEMOS. No lo impone Firestore (la
 *  base es flexible), lo imponemos nosotros para programar seguros.
 *
 *  TU TAREA (Actividad 1):
 *  1. En tu documento de práctica escribe el modelo de un juguete con los campos,
 *  y como se vería su JSON. Usa el modelo `Product` de abajo como referencia
 *
 *  Diseño NoSQL: el documento es AUTOCONTENIDO (denormalizado). Todo
 *  lo que una "vitrina" necesita mostrar vive en un solo documento,
 *  sin joins.
 * ============================================================
 */
import { Timestamp } from "firebase/firestore";

/**
 * Modelo de un juguete tal como se guarda en la colección `products`.
 */
export interface Product {
  /** ID del documento de Firestore (NO se guarda dentro del doc). */
  id: string;
  /** Nombre del juguete, ej. "Oso de peluche gigante". */
  name: string;
  /** Descripción corta para la ficha. */
  description: string;
  /** Categoría (debe ser una de las de `store.config.ts`). */
  category: string;
  /** Precio en pesos. */
  price: number;
  /** Unidades disponibles en inventario. */
  stock: number;

  
  // ---- Campos opcionales ----
  /** URL de imagen del juguete (puede quedar vacío). */
  imageUrl?: string;
  /** Rango de edad recomendado, ej. "3-6 años". */
  ageRange?: string;
  /** Marca o fabricante. */
  brand?: string;


  // ---- Metadatos que pone el servidor (no el formulario) ----
  /** Fecha de creación (la pone Firestore con serverTimestamp). */
  createdAt?: Timestamp;
  /** Fecha de última edición. */
  updatedAt?: Timestamp;
}

/**
 * Datos que el usuario captura en el FORMULARIO.
 *
 * Es un `Product` SIN los campos que no escribe el usuario:
 *   - `id`        -> lo genera Firestore al crear el documento.
 *   - `createdAt` / `updatedAt` -> los pone el servidor.
 */
export type ProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;
