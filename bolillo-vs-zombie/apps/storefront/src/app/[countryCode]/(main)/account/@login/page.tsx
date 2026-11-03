import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Inicia sesión o crea tu cuenta de Bolillo vs Zombie.",
}

export default async function Login(props: {
  searchParams: Promise<{ view?: string | string[] }>
}) {
  const searchParams = await props.searchParams
  const isRegisterView = searchParams.view === "register"

  return <LoginTemplate isRegisterView={isRegisterView} />
}
