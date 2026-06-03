/**
 * ============================================================
 *  CONFIGURACIÓN GLOBAL DE LA JUGUETERÍA
 * ============================================================
 *  Este es el ÚNICO archivo que necesitas editar para
 *  personalizar la práctica. El frontend lee todo desde aquí,
 *  no hace falta tocar los componentes.
 *
 *  LO MÁS IMPORTANTE: en `collections.crud` pon el nombre de
 *  la colección de TU EQUIPO (equipo1, equipo2, ...). Ahí es
 *  donde tu equipo hará el CRUD sin pisar a los demás.
 * ============================================================
 */

export interface TeamMember {
  name: string;
  role?: string;
}

export interface StoreConfig {
  storeName: string;
  tagline: string;
  team: TeamMember[];
  categories: string[];
  /**
   * Nombres de las colecciones de Firestore que usa cada sección.
   * (En Firestore una "colección" es como una carpeta de documentos.)
   */
  collections: {
    crud: string;
    catalog: string;
    live: string;
  };
  theme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const storeConfig: StoreConfig = {
  // Pon aquí el nombre de tu juguetería
  storeName: "Toys",

  tagline: "Cambia el slogan de tu tienda aquí. ¡Sé creativo!",

  // Pon aquí a los integrantes del equipo
  team: [
    { name: "Integrante 1", role: "Matrícula / Rol" },
    { name: "Integrante 2", role: "Matrícula / Rol" },
    { name: "Integrante 3", role: "Matrícula / Rol" },
  ],

  // Categorías disponibles para los juguetes
  // Añade pero no quites, porque el catálogo ya tiene juguetes con estas categorías
  categories: [
    "Peluches",
    "Bloques y construcción",
    "Juegos de mesa",
    "Vehículos",
    "Figuras de acción",
    "Educativos",
    "Aire libre",
  ],

  // Colecciones de Firestore
  collections: {
    crud: "equipo", // CAMBIA esto por la colección de tu equipo (ej. "equipo1")
    catalog: "catalogo", // 20 juguetes ya cargados para las Queries
    live: "vivo", // colección compartida para el tiempo real
  },

  theme: {
    primary: "#e11d48", 
    secondary: "#2563eb", 
    accent: "#f59e0b", 
  },
};
