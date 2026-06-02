/** Pequeños helpers de presentación para la juguetería. */

const CATEGORY_EMOJI: Record<string, string> = {
  Peluches: "🧸",
  "Bloques y construcción": "🧱",
  "Juegos de mesa": "🎲",
  Vehículos: "🚗",
  "Figuras de acción": "🦸",
  Educativos: "📚",
  "Aire libre": "🪁",
};

/** Emoji representativo de una categoría (con fallback genérico). */
export function categoryEmoji(category: string): string {
  return CATEGORY_EMOJI[category] ?? "🎁";
}

const pesos = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

/** Formatea un número como precio en pesos mexicanos. */
export function formatPrice(value: number): string {
  return pesos.format(value || 0);
}
