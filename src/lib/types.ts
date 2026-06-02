import { Timestamp } from "firebase/firestore";

/**
 * Modelo de un juguete tal como se guarda en la colección
 * `products` de Firestore.
 *
 * Diseño NoSQL: documento autocontenido (denormalizado). Toda la
 * información que necesita una "vitrina" vive en un solo documento,
 * sin joins.
 */
export interface Product {
  /** ID del documento de Firestore (no se guarda dentro del doc) */
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  /** URL de imagen del juguete (puede quedar vacío) */
  imageUrl?: string;
  /** Rango de edad recomendado, ej. "3-6 años" */
  ageRange?: string;
  brand?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/** Datos que el usuario captura en el formulario (sin metadatos). */
export type ProductInput = Omit<
  Product,
  "id" | "createdAt" | "updatedAt"
>;
