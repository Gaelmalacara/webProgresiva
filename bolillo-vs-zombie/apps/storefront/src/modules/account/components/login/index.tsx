import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center [&_button[type=button]]:!text-[#a5a69f]"
      data-testid="login-page"
    >
      <h1 className="text-large-semi uppercase mb-6">¡Qué bueno verte!</h1>
      <p className="text-center text-base-regular text-[#a5a69f] mb-8">
        Inicia sesión para continuar.
      </p>
      {message?.state === "verification_required" && (
        <div
          className="w-full mb-6 text-center text-base-regular text-[#f2f1e9] bg-[#0c0e0b] border border-[#515743] p-4"
          data-testid="login-verification-message"
        >
          Enviamos un enlace de verificación a <strong>{message.email}</strong>.
          Verifica tu correo para iniciar sesión.
        </div>
      )}
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Correo electrónico"
            name="email"
            type="email"
            title="Ingresa un correo electrónico válido."
            autoComplete="email"
            required
            data-testid="email-input"
            className="!bg-[#0c0e0b] !text-[#f2f1e9] !border-[#515743] hover:!bg-[#171a14]"
            labelClassName="!text-[#a5a69f]"
          />
          <Input
            label="Contraseña"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
            className="!bg-[#0c0e0b] !text-[#f2f1e9] !border-[#515743] hover:!bg-[#171a14]"
            labelClassName="!text-[#a5a69f]"
          />
        </div>
        <ErrorMessage
          error={message?.state === "error" ? message.error : null}
          data-testid="login-error-message"
        />
        <SubmitButton data-testid="sign-in-button" className="w-full mt-6">
          Iniciar sesión
        </SubmitButton>
      </form>
      <span className="text-center text-[#a5a69f] text-small-regular mt-6">
        ¿Aún no tienes cuenta?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="underline text-[#b4bd8c] hover:text-[#bdc8a0]"
          data-testid="register-button"
        >
          Regístrate
        </button>
        .
      </span>
    </div>
  )
}

export default Login
