"use client"

import { useState } from "react"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = ({ isRegisterView }: { isRegisterView: boolean }) => {
  const [currentView, setCurrentView] = useState(
    isRegisterView ? LOGIN_VIEW.REGISTER : LOGIN_VIEW.SIGN_IN,
  )

  return (
    <div className="w-full flex justify-center px-6 py-12">
      <div className="w-full max-w-lg border border-[#34372e] bg-[#171a14] p-6 text-[#f2f1e9] sm:p-10">
        {currentView === "sign-in" ? (
          <Login setCurrentView={setCurrentView} />
        ) : (
          <Register setCurrentView={setCurrentView} />
        )}
      </div>
    </div>
  )
}

export default LoginTemplate
