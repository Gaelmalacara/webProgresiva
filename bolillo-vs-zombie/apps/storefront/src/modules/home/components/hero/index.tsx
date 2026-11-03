import { Button, Heading } from "@modules/common/components/ui";

const Hero = () => {
  return (
    <section className="overflow-hidden bg-[#0c0e0b] text-[#f2f1e9]">
      {/* Barra superior */}
      <div className="border-b border-[#34382c]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 md:px-12">
          <p className="text-sm font-bold uppercase tracking-widest text-[#b4bd8c]">
            BOLILLO <span className="text-[#f2f1e9]">VS</span> ZOMBIE
          </p>

          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#777a70] sm:text-xs">
            Survival · Pixel Art
          </span>
        </div>
      </div>

      {/* Hero principal */}
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-10 px-6 py-12 md:px-12 md:py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">

        {/* Contenido */}
        <div className="flex flex-col items-start">
          <div className="mb-6 inline-flex items-center gap-2 border border-[#444a35] bg-[#171b13] px-3 py-2">
            <span className="h-2 w-2 animate-pulse bg-[#b4bd8c]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#b4bd8c]">
              Día 14 · La infección continúa
            </span>
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#8d9572]">
            El apocalipsis más mexicano
          </p>

          <h1 className="mb-6 max-w-2xl text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            BOLILLO
            <br />
            <span className="text-[#b4bd8c]">VS ZOMBIE</span>
          </h1>

          <p className="mb-8 max-w-lg text-base leading-7 text-[#b5b6ac] sm:text-lg">
            Sobrevive al apocalipsis a tu manera. Explora una ciudad
            infestada, consigue recursos y prepárate para lo que acecha
            cuando cae la noche. Porque hasta los zombies le temen
            al barrio.
          </p>

          {/* Botón principal */}
          <a
            href="/"
            data-analytics-event="hero_enter_shelter_click"
            className="group inline-flex items-center gap-4 bg-[#a8b38a] px-6 py-4 text-sm font-black uppercase tracking-wide text-[#10120e] transition hover:bg-[#bdc8a0]"
          >
            Entrar al refugio
            <span className="text-lg transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>

          {/* Características */}
          <div className="mt-10 grid w-full max-w-lg grid-cols-3 border-y border-[#34382c] py-5">
            <div className="pr-3">
              <span className="mb-2 block text-lg">☀</span>
              <p className="text-xs font-bold uppercase tracking-wider text-[#f2f1e9]">
                Día y noche
              </p>
              <p className="mt-1 text-xs leading-5 text-[#85877d]">
                Sobrevive al cambio
              </p>
            </div>

            <div className="border-x border-[#34382c] px-3">
              <span className="mb-2 block text-lg">▦</span>
              <p className="text-xs font-bold uppercase tracking-wider text-[#f2f1e9]">
                Pixel art
              </p>
              <p className="mt-1 text-xs leading-5 text-[#85877d]">
                Tercera persona
              </p>
            </div>

            <div className="pl-3">
              <span className="mb-2 block text-lg">☠</span>
              <p className="text-xs font-bold uppercase tracking-wider text-[#f2f1e9]">
                Humor mexicano
              </p>
              <p className="mt-1 text-xs leading-5 text-[#85877d]">
                Terror con barrio
              </p>
            </div>
          </div>
        </div>

        {/* Imagen principal */}
        <div className="relative">
          <div className="absolute -inset-3 border border-[#34382c]" />

          <div className="relative overflow-hidden border border-[#515743] bg-[#171b13]">
            <img
              src="/images/zona-cero-hero.jpg"
              alt="Escenario de Bolillo vs Zombie: una ciudad infestada de zombies"
              className="aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]"
            />

            {/* Etiqueta sobre la imagen */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0c0e0b] via-[#0c0e0b]/75 to-transparent p-5 pt-20 sm:p-7 sm:pt-24">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#b4bd8c]">
                Zona de peligro
              </p>
              <h2 className="text-xl font-black uppercase sm:text-2xl">
                Cuando anochece,
                <br />
                nadie está a salvo.
              </h2>
            </div>
          </div>

          {/* Indicador decorativo */}
          <div className="absolute -right-2 -top-2 border border-[#515743] bg-[#0c0e0b] px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#b4bd8c] sm:-right-4 sm:top-5">
            REC ● 00:14
          </div>
        </div>
      </div>

      {/* Franja inferior */}
      <div className="border-t border-[#34382c] bg-[#10120e]">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-6 py-4 md:px-12">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#777a70]">
            Sobrevive. Improvisa. No te dejes morder.
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8d9572]">
            El fin del mundo, a la mexicana.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;