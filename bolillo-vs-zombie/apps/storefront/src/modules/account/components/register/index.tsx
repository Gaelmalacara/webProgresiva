"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div
      className="max-w-sm flex flex-col items-center [&_button[type=button]]:!text-[#a5a69f]"
      data-testid="register-page"
    >
      <h1 className="text-large-semi uppercase mb-6">Crea tu cuenta</h1>
      <p className="text-center text-base-regular text-[#a5a69f] mb-4">
        Regístrate en Bolillo vs Zombie y mantente al tanto de tus compras.
      </p>
      {message?.state === "verification_required" && (
        <div
          className="w-full mb-4 text-center text-base-regular text-[#f2f1e9] bg-[#0c0e0b] border border-[#515743] p-4"
          data-testid="register-verification-message"
        >
          Enviamos un enlace de verificación a <strong>{message.email}</strong>.
          Revisa tu correo para verificar tu cuenta y después inicia sesión.
        </div>
      )}
      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Nombre"
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
            className="!bg-[#0c0e0b] !text-[#f2f1e9] !border-[#515743] hover:!bg-[#171a14]"
            labelClassName="!text-[#a5a69f]"
          />
          <Input
            label="Apellidos"
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
            className="!bg-[#0c0e0b] !text-[#f2f1e9] !border-[#515743] hover:!bg-[#171a14]"
            labelClassName="!text-[#a5a69f]"
          />
          <Input
            label="Correo electrónico"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
            className="!bg-[#0c0e0b] !text-[#f2f1e9] !border-[#515743] hover:!bg-[#171a14]"
            labelClassName="!text-[#a5a69f]"
          />
          <Input
            label="Teléfono"
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
            className="!bg-[#0c0e0b] !text-[#f2f1e9] !border-[#515743] hover:!bg-[#171a14]"
            labelClassName="!text-[#a5a69f]"
          />
          <Input
            label="Contraseña"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
            className="!bg-[#0c0e0b] !text-[#f2f1e9] !border-[#515743] hover:!bg-[#171a14]"
            labelClassName="!text-[#a5a69f]"
          />
        </div>
        <ErrorMessage
          error={message?.state === "error" ? message.error : null}
          data-testid="register-error"
        />
        <SubmitButton className="w-full mt-6" data-testid="register-button">
          Crear cuenta
        </SubmitButton>
      </form>
      <span className="text-center text-[#a5a69f] text-small-regular mt-6">
        ¿Ya tienes una cuenta?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline text-[#b4bd8c] hover:text-[#bdc8a0]"
        >
          Inicia sesión
        </button>
        .
      </span>
    </div>
  )
}

export default Register
