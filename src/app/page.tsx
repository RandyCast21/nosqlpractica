import { storeConfig } from "@/config/store.config";
import CrudSection from "@/components/CrudSection";
import CatalogSection from "@/components/CatalogSection";
import LiveSection from "@/components/LiveSection";

export default function Home() {
  const { storeName, tagline, team } = storeConfig;

  return (
    <div className="flex flex-1 flex-col bg-gradient-to-b from-amber-50 via-rose-50 to-sky-50 dark:from-[#1a1025] dark:via-[#241433] dark:to-[#10182e]">
      {/* ===== Fachada de la tienda ===== */}
      <header className="relative">
        <div className="awning h-10 w-full shadow-md" />
        <div className="mx-auto max-w-5xl px-6 pb-6 pt-10 text-center">
          <p className="mb-3 inline-block rounded-full bg-rose-100 px-4 py-1 text-sm font-semibold tracking-wide text-rose-700 dark:bg-rose-500/20 dark:text-rose-200">
            🎠 Juguetería virtual · práctica Firestore
          </p>
          <h1 className="bg-gradient-to-r from-rose-600 via-fuchsia-600 to-sky-600 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-7xl">
            {storeName}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-300">
            {tagline}
          </p>
        </div>
      </header>

      {/* ===== Las 3 vitrinas, funcionando en la misma página ===== */}
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-10 px-4 py-6 sm:px-6">
        <CrudSection />
        <CatalogSection />
        <LiveSection />
      </main>

      {/* ===== Pie: el equipo ===== */}
      <footer className="border-t border-amber-900/10 bg-white/50 px-6 py-8 backdrop-blur dark:border-white/10 dark:bg-black/20">
        <div className="mx-auto max-w-5xl text-center">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            🛠️ Equipo de {storeName}
          </h3>
          <ul className="flex flex-wrap items-center justify-center gap-3">
            {team.map((member, i) => (
              <li
                key={i}
                className="rounded-full border border-amber-900/10 bg-white px-4 py-2 text-sm shadow-sm dark:border-white/10 dark:bg-white/10"
              >
                <span className="font-semibold text-zinc-800 dark:text-zinc-100">
                  {member.name}
                </span>
                {member.role && (
                  <span className="ml-2 text-zinc-500 dark:text-zinc-400">
                    {member.role}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </div>
  );
}
