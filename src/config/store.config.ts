/**
 * ============================================================
 *  CONFIGURACIÓN GLOBAL DE LA JUGUETERÍA
 * ============================================================
 *  Este es el ÚNICO archivo que necesitas editar para
 *  personalizar la práctica. El frontend lee todo desde aquí,
 *  no hace falta tocar los componentes.
 *
 *  - Cambia el nombre de la juguetería.
 *  - Agrega a los integrantes del equipo.
 *  - Ajusta el eslogan, las categorías y los colores.
 * ============================================================
 */

export interface TeamMember {
  /** Nombre del integrante */
  name: string;
  /** Rol o matrícula (opcional, se muestra debajo del nombre) */
  role?: string;
}

export interface StoreConfig {
  storeName: string;
  tagline: string;
  team: TeamMember[];
  /** Categorías de juguetes usadas en el CRUD y en los filtros */
  categories: string[];
  /** Colores de marca (se usan como acentos en la UI) */
  theme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const storeConfig: StoreConfig = {
  // 👇 Pon aquí el nombre de tu juguetería
  storeName: "Toys ForUs",

  tagline: "La vitrina mágica donde cada juguete cobra vida ✨",

  // 👇 Pon aquí a los integrantes del equipo
  team: [
    { name: "Integrante 1", role: "Matrícula / Rol" },
    { name: "Integrante 2", role: "Matrícula / Rol" },
    { name: "Integrante 3", role: "Matrícula / Rol" },
  ],

  // 👇 Categorías disponibles para los juguetes
  categories: [
    "Peluches",
    "Bloques y construcción",
    "Juegos de mesa",
    "Vehículos",
    "Figuras de acción",
    "Educativos",
    "Aire libre",
  ],

  theme: {
    primary: "#e11d48", // rosa/rojo carrusel
    secondary: "#2563eb", // azul confeti
    accent: "#f59e0b", // amarillo dulce
  },
};
