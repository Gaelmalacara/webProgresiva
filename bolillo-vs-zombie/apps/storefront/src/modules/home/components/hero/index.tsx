import { Github } from "@medusajs/icons";
import { Button, Heading } from "@modules/common/components/ui";
const Hero = () => {
  return (
    <section className="bg-[#0c0e0b] text-[#f2f1e9]">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-10 px-6 py-12 md:px-12 lg:grid-cols-2 lg:gap-16 lg:py-16">

        {/* Texto de la portada */}
        <div className="flex flex-col items-start">

          <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-[#b4bd8c]">
            ● Transmisión activa - Día 14
          </p>

          <h1 className="mb-6 max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            La ciudad ya no es segura
          </h1>

          <p className="mb-8 max-w-lg text-base leading-7 text-[#a5a69f]">
            Explora una ciudad aislada tras el brote, reúne recursos
            y toma decisiones difíciles para mantener con vida a tu grupo.
          </p>

          {/* Botones */}
          <div className="flex flex-wrap gap-3">

            <a
              href="/"
              data-analytics-event="hero_enter_shelter_click"
              className="inline-flex items-center gap-3 bg-[#a8b38a] px-5 py-3 text-sm font-semibold text-[#10120e] transition hover:bg-[#bdc8a0]"
            >
              Entrar al refugio
              <span aria-hidden="true">→</span>
            </a>

            <a
              href="/about"
              className="border border-[#34372e] px-5 py-3 text-sm font-medium transition hover:bg-[#1a1d17]"
            >
              Ver archivo
            </a>

          </div>

          {/* Información del juego */}
          <div className="mt-10 flex flex-wrap items-center gap-3 text-xs uppercase tracking-wider text-[#777a70]">
            <span>ZC / Supervivencia narrativa</span>
            <span className="text-[#41443b]">|</span>
            <span>Un jugador</span>
            <span className="text-[#41443b]">|</span>
            <span>PC</span>
          </div>

        </div>

        {/* Imagen principal */}
        <div className="relative">
          <img
            src="/images/zona-cero-hero.jpg"
            alt="Un superviviente explorando una ciudad abandonada"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>

      </div>
    </section>
  )
}

export default Hero;
