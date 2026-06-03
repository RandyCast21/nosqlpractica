/**
 * ============================================================
 *  SEED — Carga juguetes de ejemplo en Firestore
 * ============================================================
 *  Llena dos colecciones para que los alumnos "solo conecten":
 *    • catalogo -> 20 juguetes variados, para practicar Queries.
 *    • vivo     -> 8 juguetes, para el demo en Tiempo real.
 *
 *  Las colecciones de los equipos (equipo1, equipo2, ...) NO se tocan:
 *  esas las llenan los alumnos con su CRUD.
 *
 *  Uso:
 *     npm run seed              # borra y recarga catalogo + vivo
 *     npm run seed -- catalogo  # solo catalogo
 *     npm run seed -- vivo      # solo vivo
 *
 *  Usa el SDK Web (las claves son públicas). Requiere que las Reglas
 *  de Firestore permitan escritura (modo de prueba).
 * ============================================================
 */
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

// Mismas claves públicas que src/lib/firebase.ts
const firebaseConfig = {
  apiKey: "AIzaSyBpbR43YrPtuzpaw3USnqj9DLDphQlkWbc",
  authDomain: "nosqlpractica.firebaseapp.com",
  projectId: "nosqlpractica",
  storageBucket: "nosqlpractica.firebasestorage.app",
  messagingSenderId: "699959236015",
  appId: "1:699959236015:web:649a4d2220ebdd0f1b8b5a",
  measurementId: "G-RXQCTME6M6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/** 20 juguetes variados para practicar Queries (filtro/orden/paginación). */
const CATALOGO = [
  { name: "Oso Abrazos de peluche", category: "Peluches", price: 349, stock: 12, ageRange: "0-3 años", brand: "PeluchePro" },
  { name: "Conejo Saltarín de peluche", category: "Peluches", price: 279, stock: 8, ageRange: "0-3 años", brand: "PeluchePro" },
  { name: "Dragón Dormilón XL", category: "Peluches", price: 599, stock: 5, ageRange: "3-8 años", brand: "FantasyToys" },
  { name: "Bloques Arcoíris 100 pzas", category: "Bloques y construcción", price: 459, stock: 20, ageRange: "3-6 años", brand: "BrickWorld" },
  { name: "Set Castillo Medieval 250 pzas", category: "Bloques y construcción", price: 899, stock: 7, ageRange: "6-12 años", brand: "BrickWorld" },
  { name: "Cubos Mágicos Apilables", category: "Bloques y construcción", price: 199, stock: 25, ageRange: "1-4 años", brand: "BabyBlocks" },
  { name: "Lotería Mexicana Clásica", category: "Juegos de mesa", price: 149, stock: 30, ageRange: "6+ años", brand: "JuegaMX" },
  { name: "Serpientes y Escaleras Deluxe", category: "Juegos de mesa", price: 189, stock: 18, ageRange: "4-10 años", brand: "JuegaMX" },
  { name: "Ajedrez de Madera", category: "Juegos de mesa", price: 399, stock: 10, ageRange: "8+ años", brand: "MaderaFina" },
  { name: "Memorama de Animales", category: "Juegos de mesa", price: 129, stock: 22, ageRange: "3-8 años", brand: "JuegaMX" },
  { name: "Carrito Bólido R/C", category: "Vehículos", price: 549, stock: 9, ageRange: "6-12 años", brand: "SpeedToys" },
  { name: "Tren Expreso de Madera", category: "Vehículos", price: 429, stock: 11, ageRange: "3-8 años", brand: "MaderaFina" },
  { name: "Avión Planeador de Espuma", category: "Vehículos", price: 99, stock: 40, ageRange: "5-12 años", brand: "SkyToys" },
  { name: "Camión de Bomberos con Luces", category: "Vehículos", price: 329, stock: 14, ageRange: "3-7 años", brand: "SpeedToys" },
  { name: "Súper Robot Articulado", category: "Figuras de acción", price: 379, stock: 16, ageRange: "5-12 años", brand: "HeroLine" },
  { name: "Dino T-Rex Rugiente", category: "Figuras de acción", price: 299, stock: 13, ageRange: "4-10 años", brand: "DinoWorld" },
  { name: "Set Cocina Educativa", category: "Educativos", price: 689, stock: 6, ageRange: "3-7 años", brand: "LearnPlay" },
  { name: "Microscopio Junior", category: "Educativos", price: 749, stock: 8, ageRange: "8-14 años", brand: "SciKids" },
  { name: "Pizarrón Mágico ABC", category: "Educativos", price: 219, stock: 19, ageRange: "3-6 años", brand: "LearnPlay" },
  { name: "Cometa Dragón Gigante", category: "Aire libre", price: 179, stock: 21, ageRange: "5-12 años", brand: "SkyToys" },
];

/** 8 juguetes para el demo en Tiempo real (stock pensado para subir/bajar). */
const VIVO = [
  { name: "Globo Aerostático Musical", category: "Educativos", price: 259, stock: 5, ageRange: "3-7 años", brand: "LearnPlay" },
  { name: "Patineta Neón Junior", category: "Aire libre", price: 459, stock: 7, ageRange: "6-12 años", brand: "SkyToys" },
  { name: "Peluche Unicornio Brillante", category: "Peluches", price: 329, stock: 9, ageRange: "0-3 años", brand: "FantasyToys" },
  { name: "Robot Bailarín LED", category: "Figuras de acción", price: 549, stock: 4, ageRange: "5-12 años", brand: "HeroLine" },
  { name: "Pelota Saltarina Gigante", category: "Aire libre", price: 149, stock: 12, ageRange: "3-10 años", brand: "SkyToys" },
  { name: "Bloques Imantados 64 pzas", category: "Bloques y construcción", price: 629, stock: 6, ageRange: "3-8 años", brand: "BrickWorld" },
  { name: "Coche Clásico de Colección", category: "Vehículos", price: 389, stock: 8, ageRange: "6-12 años", brand: "SpeedToys" },
  { name: "Dominó de Colores", category: "Juegos de mesa", price: 119, stock: 15, ageRange: "4-10 años", brand: "JuegaMX" },
];

const DESCS = {
  Peluches: "Suavecito y abrazable, el mejor amigo para dormir.",
  "Bloques y construcción": "Encaja, construye y derriba: creatividad sin límites.",
  "Juegos de mesa": "Diversión en familia para tardes inolvidables.",
  Vehículos: "¡A toda velocidad! Listo para grandes aventuras.",
  "Figuras de acción": "Acción y poses heroicas para historias épicas.",
  Educativos: "Aprender jugando: ciencia y letras a tu ritmo.",
  "Aire libre": "Sal a jugar bajo el sol y quema energía.",
};

async function clearCollection(name) {
  const snap = await getDocs(collection(db, name));
  let n = 0;
  for (const d of snap.docs) {
    await deleteDoc(doc(db, name, d.id));
    n++;
  }
  if (n) console.log(`   🧹 ${name}: ${n} documento(s) anterior(es) borrado(s)`);
}

async function seedCollection(name, toys) {
  await clearCollection(name);
  for (const t of toys) {
    await addDoc(collection(db, name), {
      ...t,
      description: DESCS[t.category] ?? "Un juguete espectacular.",
      imageUrl: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  console.log(`   ✅ ${name}: ${toys.length} juguete(s) cargado(s)`);
}

async function main() {
  const which = process.argv[2]; // undefined | "catalogo" | "vivo"
  console.log(`\n🌱 Sembrando datos en el proyecto "${firebaseConfig.projectId}"...\n`);

  if (!which || which === "catalogo") {
    console.log("📚 Colección catalogo (Queries):");
    await seedCollection("catalogo", CATALOGO);
  }
  if (!which || which === "vivo") {
    console.log("📡 Colección vivo (Tiempo real):");
    await seedCollection("vivo", VIVO);
  }

  console.log("\n🎉 Listo. Abre la app con `npm run dev`.\n");
  process.exit(0);
}

main().catch((e) => {
  console.error("\n❌ Error al sembrar:", e?.message ?? e);
  console.error(
    "\nSi el error menciona 'permission-denied', revisa que las Reglas de\n" +
      "Firestore estén en modo de prueba (permitir lectura/escritura).\n"
  );
  process.exit(1);
});
