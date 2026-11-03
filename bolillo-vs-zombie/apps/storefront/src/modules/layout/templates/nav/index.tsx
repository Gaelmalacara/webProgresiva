import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [locales, currentLocale] = await Promise.all([
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b border-[#34372e] duration-200 bg-[#171a14] text-[#f2f1e9]">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu locales={locales} currentLocale={currentLocale} />
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-[#a8b38a] transition-colors duration-200"
              data-testid="nav-store-link"
              data-analytics-event="nav_home_click"
            >
              BOLILLO VS ZOMBIE
            </LocalizedClientLink>
          </div>

          <div className="flex-1 basis-0 flex justify-end">
            <LocalizedClientLink
              href="/account?view=register"
              className="inline-flex h-10 items-center border border-[#a8b38a] px-4 text-xs font-bold uppercase tracking-wider text-[#b4bd8c] transition-colors duration-200 hover:bg-[#a8b38a] hover:text-[#10120e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b4bd8c]"
              data-testid="nav-register-link"
            >
              Regístrate
            </LocalizedClientLink>
          </div>
        </nav>
      </header>
    </div>
  )
}
