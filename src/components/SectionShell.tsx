import type { ReactNode } from "react";

interface SectionShellProps {
  badge: string;
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  children: ReactNode;
}

/** Marco tipo "vitrina" (toldo de color + cristal + repisa de madera). */
export default function SectionShell({
  badge,
  emoji,
  title,
  subtitle,
  color,
  children,
}: SectionShellProps) {
  return (
    <section className="overflow-hidden rounded-3xl border-4 border-amber-900/20 bg-white/70 shadow-xl backdrop-blur dark:border-amber-200/10 dark:bg-white/5">
      {/* Toldo / encabezado de la vitrina */}
      <header
        className="flex items-center gap-4 px-6 py-4 text-white"
        style={{ backgroundColor: color }}
      >
        <span className="text-4xl drop-shadow">{emoji}</span>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">
            {badge}
          </p>
          <h2 className="text-2xl font-extrabold leading-tight">{title}</h2>
          <p className="text-sm opacity-90">{subtitle}</p>
        </div>
      </header>

      {/* Cristal / contenido */}
      <div className="bg-gradient-to-b from-white/80 to-zinc-100/50 p-6 dark:from-white/10 dark:to-white/5">
        {children}
      </div>

      {/* Repisa de madera */}
      <div className="h-3 bg-gradient-to-b from-amber-700 to-amber-900" />
    </section>
  );
}
