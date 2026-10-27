
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function Footer() {
  return (
    <footer className="border-t border-[#34372e] bg-[#171a14] text-[#a5a69f]">
      <div className="content-container py-10 md:py-14">

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">

          {/* Identidad */}
          <div>
            <LocalizedClientLink
              href="/"
              className="text-xl font-bold tracking-widest text-[#f2f1e9] hover:text-[#a8b38a] transition-colors"
            >
              BOLILLO VS ZOMBIE
            </LocalizedClientLink>

            <p className="mt-4 max-w-xs text-sm leading-6">
              La civilización cayó. Los recursos escasean.
              Tu historia apenas comienza.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#b4bd8c]">
              Explorar
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <LocalizedClientLink
                  href="/store"
                  className="transition-colors hover:text-[#a8b38a]"
                >
                  Refugio
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/about"
                  className="transition-colors hover:text-[#a8b38a]"
                >
                  Archivo
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* Mensaje */}
          
        {/* Sobre nosotros */}
        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#b4bd8c]">
            Sobre nosotros
          </h3>

          <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-[#777a70]">
            Desarrollado por Obsidiana Interactive
          </p>
        </div>

        </div>

        <div className="mt-10 border-t border-[#34372e] pt-6 text-xs text-[#777a70]">
          © {new Date().getFullYear()} Zona Cero. Sobrevive un día más.
        </div>

      </div>
    </footer>
  )
}
